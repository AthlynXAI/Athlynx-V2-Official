import { useState, useEffect } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  FileText, 
  Download, 
  Lock, 
  Building2, 
  Clock,
  CheckCircle,
  AlertCircle,
  Folder,
  ExternalLink,
} from "lucide-react";

interface Partner {
  id: number;
  name: string;
  company: string;
  accessLevel: string;
}

interface Document {
  id: number;
  title: string;
  description: string;
  file_url: string;
  category: string;
  created_at: string;
}

function PartnerPortalInner() {
  const meQuery = trpc.auth.me.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  const [, navigate] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const isLoggedIn = !!meQuery.data;
  const isAdmin = meQuery.data?.role === "admin";
  const partnerName = meQuery.data?.name || "Partner";

  const partner: Partner | null = isLoggedIn ? {
    id: meQuery.data!.id,
    name: partnerName,
    company: isAdmin ? "AthlynX Admin" : "AthlynX Partner",
    accessLevel: isAdmin ? "executive" : "standard",
  } : null;

  useEffect(() => {
    if (meQuery.isLoading) return;
    if (!meQuery.data) navigate("/signin");
  }, [meQuery.data, meQuery.isLoading, navigate]);
  const allDocuments: Document[] = [
    { id: 1, title: 'Partner Agreement', description: 'Standard partnership agreement', file_url: '#', category: 'contracts', created_at: new Date().toISOString() },
    { id: 2, title: 'Brand Guidelines', description: 'AthlynX brand assets and usage guidelines', file_url: '#', category: 'presentations', created_at: new Date().toISOString() },
    { id: 3, title: 'API Documentation', description: 'Integration guide and API reference', file_url: '#', category: 'technical', created_at: new Date().toISOString() },
    { id: 4, title: 'Pricing Proposal', description: 'Custom pricing for your organization', file_url: '#', category: 'quotes', created_at: new Date().toISOString() },
  ];
  const documents: Document[] = partner
    ? (selectedCategory ? allDocuments.filter(d => d.category === selectedCategory) : allDocuments)
    : [];
  const docsLoading = false;
  const logDownloadMutation = { mutate: (_input: unknown) => {} };


  const handleDownload = (doc: Document) => {
    if (partner) {
      logDownloadMutation.mutate({ partnerId: partner!.id, documentId: doc.id });
    }
    window.open(doc.file_url, "_blank");
  };

  const categories = [
    { id: undefined, label: "All Documents", icon: Folder },
    { id: "quotes", label: "Quotes", icon: FileText },
    { id: "proposals", label: "Proposals", icon: FileText },
    { id: "technical", label: "Technical", icon: FileText },
    { id: "presentations", label: "Presentations", icon: FileText },
    { id: "contracts", label: "Contracts", icon: FileText },
  ];

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "executive": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "premium": return "bg-blue-600/20 text-blue-500 border-blue-600/30";
      default: return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    }
  };

  if (meQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0D1E36] to-[#0A1628] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Loading Partner Portal...</p>
        </div>
      </div>
    );
  }
  // Partner Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0D1E36] to-[#0A1628]">
      {/* Header */}
      <div className="border-b border-cyan-500/20 bg-[#0A1628]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{partner!.company}</h1>
                <p className="text-gray-400 text-sm">Welcome, {partner!.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={getAccessLevelColor(partner!.accessLevel)}>
                {partner!.accessLevel.toUpperCase()} ACCESS
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={async () => { await logoutMutation.mutateAsync(); navigate("/signin"); }}
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card className="bg-[#0D1E36]/80 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      selectedCategory === cat.id
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        : "text-gray-400 hover:bg-cyan-500/10 hover:text-white"
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-[#0D1E36]/80 border-cyan-500/20 mt-6">
              <CardHeader>
                <CardTitle className="text-white text-lg">Portal Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Gated partnership review</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">Last login: Just now</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">{documents?.length || 0} documents available</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main - Documents */}
          <div className="lg:col-span-3">
            <Card className="bg-[#0D1E36]/80 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Partnership Documents
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Access approved, request-only materials after partner status is verified
                </CardDescription>
              </CardHeader>
              <CardContent>
                {docsLoading ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading documents...</p>
                  </div>
                ) : documents && documents.length > 0 ? (
                  <div className="space-y-4">
                    {documents.map((doc: Document) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-[#0A1628] border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{doc.title}</h3>
                            {doc.description && (
                              <p className="text-gray-400 text-sm mt-1">{doc.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                                {doc.category}
                              </Badge>
                              <span className="text-gray-500 text-xs">
                                {new Date(doc.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(doc.file_url, "_blank")}
                            className="text-gray-400 hover:text-white"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Folder className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">No Documents Yet</h3>
                    <p className="text-gray-400 text-sm">
                      Documents will appear here once they're shared with you.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className="bg-[#0D1E36]/80 border-cyan-500/20 mt-6">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Need Assistance?</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Contact your dedicated partnership manager for support
                    </p>
                  </div>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    <MobileBottomNav />
    </div>
  );
}

export default function PartnerPortal() {
  return <RouteErrorBoundary><PartnerPortalInner /></RouteErrorBoundary>;
}
