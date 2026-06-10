import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Activity, 
  DollarSign, 
  Cloud, 
  Database,
  Zap,
  TrendingUp,
  Play,
  Square,
  Plus,
  Trash2,
  RefreshCw,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { trpc } from "@/lib/trpc";

// localStorage helpers — clusters/jobs/hardware are admin-managed state
// persisted locally until a dedicated DB table is added
function loadOrDefault<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : fallback;
  } catch { return fallback; }
}
function persist<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// GPU Types and Pricing
const GPU_TYPES = {
  H100: { name: "NVIDIA H100", memory: 80, price: 2.00, color: "bg-[#00C2FF]" },
  H200: { name: "Advanced Accelerator", memory: 141, price: 2.30, color: "bg-blue-500" },
  B200: { name: "NVIDIA B200", memory: 180, price: 3.00, color: "bg-blue-600" },
  GB200: { name: "NVIDIA GB200 NVL72", memory: 288, price: 5.00, color: "bg-[#1E90FF]" },
};

const defaultClusters = [
  {
    id: "dhg-cluster-athlynx-prod",
    name: "AthlynX Production",
    provider: "Nebius",
    gpuType: "H100",
    totalGpus: 8,
    runningGpus: 6,
    region: "us-east-1",
    status: "running",
    monthlyEstimate: 11520,
    createdAt: "2026-01-01",
  },
  {
    id: "dhg-cluster-nil-training",
    name: "NIL AI Training",
    provider: "Nebius",
    gpuType: "H200",
    totalGpus: 16,
    runningGpus: 16,
    region: "eu-west-1",
    status: "running",
    monthlyEstimate: 26496,
    createdAt: "2026-01-03",
  },
  {
    id: "dhg-cluster-content-gen",
    name: "Content Generation",
    provider: "ICC-USA",
    gpuType: "B200",
    totalGpus: 4,
    runningGpus: 2,
    region: "us-central-1",
    status: "partial",
    monthlyEstimate: 8640,
    createdAt: "2026-01-05",
  },
];

const defaultJobs = [
  {
    id: "dhg-job-nil-v3",
    name: "NIL Valuation Model v3 Training",
    cluster: "NIL AI Training",
    type: "training",
    status: "running",
    gpuCount: 8,
    progress: 67,
    runtime: "4h 23m",
    estimatedCost: 73.60,
  },
  {
    id: "dhg-job-content-batch",
    name: "Social Content Generation Batch",
    cluster: "Content Generation",
    type: "inference",
    status: "running",
    gpuCount: 2,
    progress: 89,
    runtime: "1h 12m",
    estimatedCost: 7.20,
  },
  {
    id: "dhg-job-transfer-match",
    name: "Transfer Portal Matching - 10K Athletes",
    cluster: "AthlynX Production",
    type: "processing",
    status: "queued",
    gpuCount: 4,
    progress: 0,
    runtime: "0m",
    estimatedCost: 0,
  },
  {
    id: "dhg-job-video-highlights",
    name: "Highlight Video Processing",
    cluster: "AthlynX Production",
    type: "processing",
    status: "completed",
    gpuCount: 2,
    progress: 100,
    runtime: "2h 45m",
    estimatedCost: 11.00,
  },
];

const defaultHardwareOrders = [
  {
    id: "ICC-ORDER-001",
    item: "8x NVIDIA H100 Server",
    quantity: 2,
    totalPrice: 700000,
    status: "shipped",
    orderedAt: "2025-12-15",
    estimatedDelivery: "2026-01-15",
  },
  {
    id: "ICC-ORDER-002",
    item: "100TB NVMe Storage Array",
    quantity: 4,
    totalPrice: 300000,
    status: "delivered",
    orderedAt: "2025-12-01",
    estimatedDelivery: "2025-12-15",
  },
];

const defaultColocation = [
  {
    id: "ICC-COLO-001",
    plan: "Enterprise Colocation",
    rackUnits: 42,
    powerKw: 30,
    bandwidth: "100 Gbps",
    monthlyPrice: 7500,
    termMonths: 24,
    status: "active",
  },
];

function InfrastructureManagerInner() {
  const [activeTab, setActiveTab] = useState("overview");
  const [clusters, setClusters] = useState(() => loadOrDefault("athlynx_clusters", defaultClusters));
  const [jobs, setJobs] = useState(() => loadOrDefault("athlynx_jobs", defaultJobs));
  const [isCreatingCluster, setIsCreatingCluster] = useState(false);
  const [newCluster, setNewCluster] = useState({
    name: "",
    gpuType: "H100",
    gpuCount: 8,
    region: "us-east-1",
    provider: "nebius",
  });
  const { toast } = useToast();

  //  Real tRPC data 
  const { data: platformStats } = trpc.data.getPlatformStats.useQuery();
  const { data: dataSources } = trpc.data.getSources.useQuery();

  // Persisted admin-managed lists
  const [colocation] = useState(() => loadOrDefault("athlynx_colo", defaultColocation));
  const [hardwareOrders] = useState(() => loadOrDefault("athlynx_hardware", defaultHardwareOrders));

  const setClustersAndPersist = (updated: typeof clusters) => {
    setClusters(updated);
    persist("athlynx_clusters", updated);
  };
  const setJobsAndPersist = (updated: typeof jobs) => {
    setJobs(updated);
    persist("athlynx_jobs", updated);
  };

  // Calculate totals
  const totalGpus = clusters.reduce((sum: number, c: any) => sum + c.totalGpus, 0);
  const runningGpus = clusters.reduce((sum: number, c: any) => sum + c.runningGpus, 0);
  const monthlyCloudCost = clusters.reduce((sum: number, c: any) => sum + c.monthlyEstimate, 0);
  const monthlyColoCost = colocation.reduce((sum: number, c: any) => sum + c.monthlyPrice, 0);
  const hardwareCapex = hardwareOrders.reduce((sum: number, o: any) => sum + o.totalPrice, 0);

  const handleCreateCluster = () => {
    const gpuInfo = GPU_TYPES[newCluster.gpuType as keyof typeof GPU_TYPES];
    const monthlyEstimate = newCluster.gpuCount * gpuInfo.price * 24 * 30;
    
    const cluster = {
      id: `dhg-cluster-${Date.now()}`,
      name: newCluster.name,
      provider: newCluster.provider === "nebius" ? "Nebius" : "ICC-USA",
      gpuType: newCluster.gpuType,
      totalGpus: newCluster.gpuCount,
      runningGpus: 0,
      region: newCluster.region,
      status: "creating",
      monthlyEstimate,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setClustersAndPersist([...clusters, cluster]);
    setIsCreatingCluster(false);
    setNewCluster({ name: "", gpuType: "H100", gpuCount: 8, region: "us-east-1", provider: "nebius" });
    
    toast({
      title: " Cluster Created",
      description: `${cluster.name} is being provisioned with ${cluster.totalGpus} ${gpuInfo.name} GPUs`,
    });
  };

  const handleStartCluster = (clusterId: string) => {
    setClustersAndPersist(clusters.map((c: any) => 
      c.id === clusterId ? { ...c, runningGpus: c.totalGpus, status: "running" } : c
    ));
    toast({
      title: " Cluster Started",
      description: "All GPUs are now running",
    });
  };

  const handleStopCluster = (clusterId: string) => {
    setClustersAndPersist(clusters.map((c: any) => 
      c.id === clusterId ? { ...c, runningGpus: 0, status: "stopped" } : c
    ));
    toast({
      title: " Cluster Stopped",
      description: "All GPUs have been stopped",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-[#00C2FF]">Running</Badge>;
      case "stopped":
        return <Badge variant="secondary">Stopped</Badge>;
      case "creating":
        return <Badge className="bg-blue-500">Creating</Badge>;
      case "partial":
        return <Badge className="bg-[#1E90FF]">Partial</Badge>;
      case "queued":
        return <Badge variant="outline">Queued</Badge>;
      case "completed":
        return <Badge className="bg-[#00C2FF]">Completed</Badge>;
      case "shipped":
        return <Badge className="bg-blue-500">Shipped</Badge>;
      case "delivered":
        return <Badge className="bg-[#00C2FF]">Delivered</Badge>;
      case "active":
        return <Badge className="bg-[#00C2FF]">Active</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#1E90FF] to-blue-600 rounded-lg">
                <Server className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Infrastructure Manager</h1>
                <p className="text-slate-400 text-sm">Private AI Infrastructure</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-slate-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync
              </Button>
              <Dialog open={isCreatingCluster} onOpenChange={setIsCreatingCluster}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-[#1E90FF] to-blue-600">
                    <Plus className="h-4 w-4 mr-2" />
                    New Cluster
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700">
                  <DialogHeader>
                    <DialogTitle>Create GPU Cluster</DialogTitle>
                    <DialogDescription>
                      Provision a new GPU cluster on Nebius or ICC-USA
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Cluster Name</Label>
                      <Input 
                        placeholder="e.g., AthlynX-AI-Training"
                        value={newCluster.name}
                        onChange={(e) => setNewCluster({ ...newCluster, name: e.target.value })}
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Provider</Label>
                        <Select 
                          value={newCluster.provider}
                          onValueChange={(v) => setNewCluster({ ...newCluster, provider: v })}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="private-ai-cloud">Private AI Cloud</SelectItem>
                            <SelectItem value="icc">ICC-USA</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Region</Label>
                        <Select 
                          value={newCluster.region}
                          onValueChange={(v) => setNewCluster({ ...newCluster, region: v })}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us-east-1">US East</SelectItem>
                            <SelectItem value="us-west-1">US West</SelectItem>
                            <SelectItem value="eu-west-1">EU West</SelectItem>
                            <SelectItem value="us-central-1">US Central</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>GPU Type</Label>
                        <Select 
                          value={newCluster.gpuType}
                          onValueChange={(v) => setNewCluster({ ...newCluster, gpuType: v })}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(GPU_TYPES).map(([key, gpu]) => (
                              <SelectItem key={key} value={key}>
                                {gpu.name} (${gpu.price}/hr)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>GPU Count</Label>
                        <Select 
                          value={newCluster.gpuCount.toString()}
                          onValueChange={(v) => setNewCluster({ ...newCluster, gpuCount: parseInt(v) })}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 4, 8, 16, 32, 64].map((n) => (
                              <SelectItem key={n} value={n.toString()}>{n} GPUs</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Estimated Monthly Cost:</span>
                        <span className="font-bold text-[#00C2FF]">
                          ${(newCluster.gpuCount * GPU_TYPES[newCluster.gpuType as keyof typeof GPU_TYPES].price * 24 * 30).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatingCluster(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateCluster}
                      disabled={!newCluster.name}
                      className="bg-gradient-to-r from-[#1E90FF] to-blue-600"
                    >
                      Create Cluster
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Eagle / AI Power Video */}
      <div className="relative bg-black">
        <video
          className="w-full max-h-[50vh] object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/RBdDZfrubjWqomzn.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <div className="text-[#00C2FF] text-xs uppercase tracking-widest font-bold">AI-Powered Infrastructure</div>
          <div className="text-white font-black text-2xl mt-1">BUILT FOR THE FUTURE</div>
        </div>
      </div>

      <div className="container py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1E90FF]/20 rounded-lg">
                  <Cpu className="h-5 w-5 text-[#00C2FF]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalGpus}</p>
                  <p className="text-xs text-slate-400">Total GPUs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#00C2FF]/20 rounded-lg">
                  <Activity className="h-5 w-5 text-[#00C2FF]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{runningGpus}</p>
                  <p className="text-xs text-slate-400">Running</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{Math.round(runningGpus / totalGpus * 100)}%</p>
                  <p className="text-xs text-slate-400">Utilization</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1E90FF]/20 rounded-lg">
                  <Server className="h-5 w-5 text-[#1E90FF]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{clusters.length}</p>
                  <p className="text-xs text-slate-400">Clusters</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{jobs.filter(j => j.status === "running").length}</p>
                  <p className="text-xs text-slate-400">Active Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1E90FF]/20 rounded-lg">
                  <DollarSign className="h-5 w-5 text-[#00C2FF]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${Math.round(monthlyCloudCost / 1000)}K</p>
                  <p className="text-xs text-slate-400">Monthly Est.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-800/50 border border-slate-700 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#1E90FF]/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="clusters" className="data-[state=active]:bg-[#1E90FF]/20">
              <Cloud className="h-4 w-4 mr-2" />
              Clusters
            </TabsTrigger>
            <TabsTrigger value="jobs" className="data-[state=active]:bg-[#1E90FF]/20">
              <Zap className="h-4 w-4 mr-2" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="hardware" className="data-[state=active]:bg-[#1E90FF]/20">
              <HardDrive className="h-4 w-4 mr-2" />
              Hardware
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-[#1E90FF]/20">
              <DollarSign className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Cloud Resources */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-[#00C2FF]" />
                    Cloud Resources
                  </CardTitle>
                  <CardDescription>Private AI Infrastructure</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clusters.map((cluster) => (
                      <div key={cluster.id} className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${cluster.status === "running" ? "bg-[#00C2FF]" : "bg-slate-500"}`} />
                            <span className="font-medium">{cluster.name}</span>
                          </div>
                          <Badge variant="outline">{cluster.provider}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-400">
                          <span>{cluster.runningGpus}/{cluster.totalGpus} {GPU_TYPES[cluster.gpuType as keyof typeof GPU_TYPES]?.name || cluster.gpuType}</span>
                          <span>${cluster.monthlyEstimate.toLocaleString()}/mo</span>
                        </div>
                        <Progress 
                          value={(cluster.runningGpus / cluster.totalGpus) * 100} 
                          className="h-2 mt-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Active Jobs */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[#1E90FF]" />
                    Active Jobs
                  </CardTitle>
                  <CardDescription>Currently running workloads</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobs.filter(j => j.status === "running" || j.status === "queued").map((job) => (
                      <div key={job.id} className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{job.name}</span>
                          {getStatusBadge(job.status)}
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                          <span>{job.gpuCount} GPUs • {job.cluster}</span>
                          <span>{job.runtime}</span>
                        </div>
                        {job.status === "running" && (
                          <div className="flex items-center gap-2">
                            <Progress value={job.progress} className="h-2 flex-1" />
                            <span className="text-xs text-slate-400">{job.progress}%</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cost Summary */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[#00C2FF]" />
                    Cost Summary
                  </CardTitle>
                  <CardDescription>Monthly infrastructure costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Cloud Computing (Nebius)</span>
                      <span className="font-bold">${monthlyCloudCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Colocation (ICC-USA)</span>
                      <span className="font-bold">${monthlyColoCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Hardware CapEx (One-time)</span>
                      <span className="font-bold">${hardwareCapex.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-slate-700 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">Total Monthly</span>
                        <span className="text-2xl font-bold text-[#00C2FF]">
                          ${(monthlyCloudCost + monthlyColoCost).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Platform Stats from DB */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-[#1E90FF]" />
                    Live Platform Stats
                  </CardTitle>
                  <CardDescription>Real-time data from the AthlynX database</CardDescription>
                </CardHeader>
                <CardContent>
                  {platformStats ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-[#1E90FF]">{platformStats.totalEvents.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">Total Events</p>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-[#00C2FF]">{platformStats.aiEvents.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">AI Bot Events</p>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-[#00C2FF]">{platformStats.robotEvents.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">Robot Events</p>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-400">{platformStats.wearableEvents.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">Wearable Events</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-24 bg-slate-800/50 rounded-lg animate-pulse" />
                  )}
                  {dataSources && dataSources.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Registered Data Sources</p>
                      <div className="space-y-2">
                        {dataSources.slice(0, 4).map((src: any) => (
                          <div key={src.id} className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">{src.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500 text-xs">{src.sourceType}</span>
                              <div className={`w-2 h-2 rounded-full ${src.isActive ? "bg-[#00C2FF]" : "bg-slate-600"}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-500" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common infrastructure tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-auto py-4 flex-col border-slate-700 hover:bg-slate-800">
                      <Cpu className="h-6 w-6 mb-2 text-[#00C2FF]" />
                      <span>Scale Cluster</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col border-slate-700 hover:bg-slate-800">
                      <Zap className="h-6 w-6 mb-2 text-[#1E90FF]" />
                      <span>Submit Job</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col border-slate-700 hover:bg-slate-800">
                      <Database className="h-6 w-6 mb-2 text-[#00C2FF]" />
                      <span>Add Storage</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col border-slate-700 hover:bg-slate-800">
                      <HardDrive className="h-6 w-6 mb-2 text-blue-500" />
                      <span>Order Hardware</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Clusters Tab */}
          <TabsContent value="clusters">
            <div className="grid gap-4">
              {clusters.map((cluster) => (
                <Card key={cluster.id} className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${GPU_TYPES[cluster.gpuType as keyof typeof GPU_TYPES]?.color || "bg-slate-600"}/20`}>
                          <Server className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{cluster.name}</h3>
                          <p className="text-slate-400">{cluster.id}</p>
                          <div className="flex items-center gap-4 mt-2">
                            {getStatusBadge(cluster.status)}
                            <Badge variant="outline">{cluster.provider}</Badge>
                            <Badge variant="outline">{cluster.region}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {cluster.status === "stopped" ? (
                          <Button 
                            size="sm" 
                            onClick={() => handleStartCluster(cluster.id)}
                            className="bg-[#00C2FF] hover:bg-[#00C2FF]"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStopCluster(cluster.id)}
                            className="border-slate-700"
                          >
                            <Square className="h-4 w-4 mr-1" />
                            Stop
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="border-slate-700">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mt-6">
                      <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                        <p className="text-3xl font-bold">{cluster.totalGpus}</p>
                        <p className="text-sm text-slate-400">Total GPUs</p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                        <p className="text-3xl font-bold text-[#00C2FF]">{cluster.runningGpus}</p>
                        <p className="text-sm text-slate-400">Running</p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                        <p className="text-3xl font-bold">{GPU_TYPES[cluster.gpuType as keyof typeof GPU_TYPES]?.memory || 0}GB</p>
                        <p className="text-sm text-slate-400">Memory/GPU</p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                        <p className="text-3xl font-bold text-[#00C2FF]">${Math.round(cluster.monthlyEstimate / 1000)}K</p>
                        <p className="text-sm text-slate-400">Monthly Est.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          job.status === "running" ? "bg-[#00C2FF]/20" :
                          job.status === "completed" ? "bg-[#1E90FF]/20" :
                          job.status === "queued" ? "bg-[#1E90FF]/20" : "bg-slate-700"
                        }`}>
                          {job.status === "running" ? <Loader2 className="h-6 w-6 animate-spin" /> :
                           job.status === "completed" ? <CheckCircle className="h-6 w-6 text-[#00C2FF]" /> :
                           job.status === "queued" ? <Clock className="h-6 w-6 text-[#1E90FF]" /> :
                           <AlertCircle className="h-6 w-6" />}
                        </div>
                        <div>
                          <h3 className="font-bold">{job.name}</h3>
                          <p className="text-sm text-slate-400">{job.cluster} • {job.gpuCount} GPUs • {job.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(job.status)}
                        <div className="text-right">
                          <p className="font-bold">{job.runtime}</p>
                          <p className="text-sm text-slate-400">${job.estimatedCost.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    {job.status === "running" && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-400">Progress</span>
                          <span>{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Hardware Tab */}
          <TabsContent value="hardware">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Hardware Orders */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle>Hardware Orders</CardTitle>
                  <CardDescription>ICC-USA equipment orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {hardwareOrders.map((order) => (
                      <div key={order.id} className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{order.item}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-400">
                          <span>Qty: {order.quantity}</span>
                          <span className="font-bold text-white">${order.totalPrice.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          Delivery: {order.estimatedDelivery}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Order Hardware
                  </Button>
                </CardContent>
              </Card>

              {/* Colocation */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle>Colocation Contracts</CardTitle>
                  <CardDescription>Data center space and power</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {colocation.map((contract) => (
                      <div key={contract.id} className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{contract.plan}</span>
                          {getStatusBadge(contract.status)}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-slate-400 mt-3">
                          <div>Rack Units: {contract.rackUnits}U</div>
                          <div>Power: {contract.powerKw} kW</div>
                          <div>Bandwidth: {contract.bandwidth}</div>
                          <div>Term: {contract.termMonths} months</div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
                          <span className="text-slate-400">Monthly</span>
                          <span className="font-bold text-[#00C2FF]">${contract.monthlyPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Colocation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-[#00C2FF]">Cloud Computing</CardTitle>
                  <CardDescription>Private infrastructure costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">${monthlyCloudCost.toLocaleString()}</p>
                  <p className="text-slate-400">per month</p>
                  <div className="mt-4 space-y-2">
                    {clusters.map((c) => (
                      <div key={c.id} className="flex justify-between text-sm">
                        <span className="text-slate-400">{c.name}</span>
                        <span>${c.monthlyEstimate.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-blue-500">Colocation</CardTitle>
                  <CardDescription>ICC-USA data center</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">${monthlyColoCost.toLocaleString()}</p>
                  <p className="text-slate-400">per month</p>
                  <div className="mt-4 space-y-2">
                    {colocation.map((c) => (
                      <div key={c.id} className="flex justify-between text-sm">
                        <span className="text-slate-400">{c.plan}</span>
                        <span>${c.monthlyPrice.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-[#1E90FF]">Hardware CapEx</CardTitle>
                  <CardDescription>One-time purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">${hardwareCapex.toLocaleString()}</p>
                  <p className="text-slate-400">total invested</p>
                  <div className="mt-4 space-y-2">
                    {hardwareOrders.map((o) => (
                      <div key={o.id} className="flex justify-between text-sm">
                        <span className="text-slate-400">{o.item}</span>
                        <span>${o.totalPrice.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    <MobileBottomNav />
    </div>
  );
}

export default function InfrastructureManager() {
  return <RouteErrorBoundary><InfrastructureManagerInner /></RouteErrorBoundary>;
}
