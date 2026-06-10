import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  MessageSquare, 
  Package, 
  Users, 
  Handshake,
  FileText,
  Activity,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

function AdminDashboardInner() {
  const meQuery = trpc.auth.me.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  const statsQuery = trpc.admin.getStats.useQuery(undefined, { retry: false });
  const usersQuery = trpc.admin.getUsers.useQuery({ page: 1, limit: 100 } as any, { retry: false });
  const setUserRole = trpc.admin.setUserRole.useMutation({ onSuccess: () => usersQuery.refetch() });
  // Stub data for features not yet implemented in backend
  const inquiries: any[] = [];
  const orders: any[] = [];
  const products: any[] = [];
  const partners: any[] = [];
  const accessLogs: any[] = [];
  const updateInquiryStatus = { mutate: (_args: any) => {} };
  const updateOrderStatus = { mutate: (_args: any) => {} };
  const updatePartnerStatus = { mutate: (_args: any) => {} };
  const updateUserRole = { mutate: (_args: any) => {} };
  const stats = statsQuery.data ?? { totalUsers: 0, newThisWeek: 0, newThisMonth: 0, withSubscription: 0, onTrial: 0 };
  const statsLoading = statsQuery.isLoading;
  const usersData = usersQuery.data;
  const users = Array.isArray(usersData) ? usersData : (usersData as any)?.users ?? [];

  if (meQuery.isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!meQuery.data) { navigate("/signin"); return null; }

  if (meQuery.data?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <Card className="bg-[#0d2847] border-red-500/30 max-w-md">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <XCircle className="h-6 w-6" />
              Access Denied
            </CardTitle>
            <CardDescription className="text-gray-400">
              You don't have permission to access the Admin Dashboard. 
              Contact an administrator if you believe this is an error.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-red-500/20 text-red-400 border-red-500/30",
      contacted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      closed: "bg-green-500/20 text-green-400 border-green-500/30",
      processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      shipped: "bg-blue-600/20 text-blue-500 border-blue-600/30",
      delivered: "bg-green-500/20 text-green-400 border-green-500/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  return (
    <div
      className="min-h-[100dvh] bg-[#0a1628] overflow-x-hidden"
      style={{ paddingTop: "max(16px, env(safe-area-inset-top, 0px))" }}
    >
      <div className="container mx-auto px-4 pt-4 pb-[calc(112px+env(safe-area-inset-bottom,0px))] sm:pt-8 lg:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-cyan-400" />
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your platform, view analytics, and handle operations
          </p>
          <div className="mt-4 flex gap-3 flex-wrap">
            <Link href="/admin/crm">
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl text-sm hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center gap-2">
                <Users className="w-4 h-4" /> Open CRM Dashboard
              </button>
            </Link>
            <Link href="/admin/users">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-bold rounded-xl text-sm hover:from-blue-600 hover:to-indigo-500 transition-all flex items-center gap-2">
                <Users className="w-4 h-4" /> User Tracker
              </button>
            </Link>
            <Link href="/feed">
              <button className="px-4 py-2 bg-white/10 border border-white/10 text-white font-bold rounded-xl text-sm hover:bg-white/20 transition-colors">
                ← Back to Platform
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-[#0d2847] border-cyan-500/20 animate-pulse">
                <CardContent className="p-4">
                  <div className="h-16"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="bg-[#0d2847] border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Orders</p>
                    <p className="text-2xl font-bold text-white">{(stats as any)?.totalOrders || 0}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0d2847] border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Revenue</p>
                    <p className="text-2xl font-bold text-green-400">${((stats as any)?.totalRevenue || 0).toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0d2847] border-red-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Inquiries</p>
                    <p className="text-2xl font-bold text-red-400">{(stats as any)?.totalInquiries || 0}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0d2847] border-blue-600/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Products</p>
                    <p className="text-2xl font-bold text-blue-500">{(stats as any)?.totalProducts || 0}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0d2847] border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Partners</p>
                    <p className="text-2xl font-bold text-blue-400">{(stats as any)?.totalPartners || 0}</p>
                  </div>
                  <Handshake className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0d2847] border-red-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Users</p>
                    <p className="text-2xl font-bold text-red-400">{stats?.totalUsers || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <TabsList className="w-max min-w-full justify-start bg-[#0d2847] border border-cyan-500/20 p-1 snap-x snap-mandatory">
                <TabsTrigger value="overview" className="snap-start shrink-0 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
                <TabsTrigger value="inquiries" className="snap-start shrink-0 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <MessageSquare className="h-4 w-4 mr-2" />
              Inquiries
            </TabsTrigger>
                <TabsTrigger value="orders" className="snap-start shrink-0 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
                <TabsTrigger value="products" className="snap-start shrink-0 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
                <TabsTrigger value="partners" className="snap-start shrink-0 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Handshake className="h-4 w-4 mr-2" />
              Partners
            </TabsTrigger>
                <TabsTrigger value="users" className="snap-start shrink-0 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
                <TabsTrigger value="logs" className="snap-start shrink-0 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Activity className="h-4 w-4 mr-2" />
              Logs
            </TabsTrigger>
                <TabsTrigger value="payroll" className="snap-start shrink-0 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
              <DollarSign className="h-4 w-4 mr-2" />
              Payroll
            </TabsTrigger>
                <TabsTrigger value="expiry" className="snap-start shrink-0 data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
              <AlertCircle className="h-4 w-4 mr-2" />
                  Expiry Warnings
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0a1628] to-transparent sm:hidden" aria-hidden="true" />
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#0d2847] border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-cyan-400" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Platform is running smoothly. Check individual tabs for detailed management.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-[#0d2847] border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    onClick={() => setActiveTab("inquiries")}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Sales Inquiries
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    onClick={() => setActiveTab("orders")}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Manage Orders
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    onClick={() => setActiveTab("partners")}
                  >
                    <Handshake className="h-4 w-4 mr-2" />
                    Partner Management
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries">
            <Card className="bg-[#0d2847] border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Sales Inquiries</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage incoming sales inquiries and contact requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-cyan-500/20">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Company</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Product</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {([] as any[]).map((inquiry: any) => (
                        <tr key={inquiry.id} className="border-b border-cyan-500/10 hover:bg-cyan-500/5">
                          <td className="py-3 px-4 text-white">{inquiry.name}</td>
                          <td className="py-3 px-4 text-gray-300">{inquiry.email}</td>
                          <td className="py-3 px-4 text-gray-300">{inquiry.company || "-"}</td>
                          <td className="py-3 px-4 text-gray-300">{inquiry.product_name}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusBadge(inquiry.status)}>
                              {inquiry.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              className="bg-[#0a1628] border border-cyan-500/30 rounded px-2 py-1 text-white text-sm"
                              value={inquiry.status}
                              onChange={(e) => updateInquiryStatus.mutate({ 
                                id: inquiry.id, 
                                status: e.target.value as "pending" | "contacted" | "closed"
                              })}
                            >
                              <option value="pending">Pending</option>
                              <option value="contacted">Contacted</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {(!inquiries || inquiries.length === 0) && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-400">
                            No sales inquiries yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-[#0d2847] border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Orders</CardTitle>
                <CardDescription className="text-gray-400">
                  View and manage customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-cyan-500/20">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Order ID</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {([] as any[]).map((order: any) => (
                        <tr key={order.id} className="border-b border-cyan-500/10 hover:bg-cyan-500/5">
                          <td className="py-3 px-4 text-white font-mono">#{order.id}</td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-white">{order.user_name || "Guest"}</p>
                              <p className="text-gray-400 text-sm">{order.user_email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-green-400 font-semibold">
                            ${Number(order.total_amount).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusBadge(order.status)}>
                              {order.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              className="bg-[#0a1628] border border-cyan-500/30 rounded px-2 py-1 text-white text-sm"
                              value={order.status}
                              onChange={(e) => updateOrderStatus.mutate({ 
                                id: order.id, 
                                status: e.target.value as "pending" | "processing" | "shipped" | "delivered" | "cancelled"
                              })}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {(!orders || orders.length === 0) && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-400">
                            No orders yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="bg-[#0d2847] border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Products</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your product catalog
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-cyan-500/20">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Price</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">In Stock</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Quote</th>
                      </tr>
                    </thead>
                    <tbody>
                      {([] as any[]).map((product: any) => (
                        <tr key={product.id} className="border-b border-cyan-500/10 hover:bg-cyan-500/5">
                          <td className="py-3 px-4 text-white">{product.name}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                              {product.category}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-green-400">
                            {Number(product.price) > 0 ? `$${Number(product.price).toLocaleString()}` : "Quote"}
                          </td>
                          <td className="py-3 px-4">
                            {product.in_stock === "yes" ? (
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-400" />
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {product.requires_quote === "yes" ? (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                                Required
                              </Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {(!products || products.length === 0) && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-400">
                            No products yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners">
            <Card className="bg-[#0d2847] border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Partners</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage strategic partners and their portal access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-cyan-500/20">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Company</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Contact</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Access Code</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {([] as any[]).map((partner: any) => (
                        <tr key={partner.id} className="border-b border-cyan-500/10 hover:bg-cyan-500/5">
                          <td className="py-3 px-4 text-white font-semibold">{partner.company}</td>
                          <td className="py-3 px-4 text-gray-300">{partner.name}</td>
                          <td className="py-3 px-4 text-gray-300">{partner.email}</td>
                          <td className="py-3 px-4">
                            <code className="bg-[#0a1628] px-2 py-1 rounded text-cyan-400 text-sm">
                              {partner.access_code}
                            </code>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusBadge(partner.status)}>
                              {partner.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              className="bg-[#0a1628] border border-cyan-500/30 rounded px-2 py-1 text-white text-sm"
                              value={partner.status}
                              onChange={(e) => updatePartnerStatus.mutate({ 
                                id: partner.id, 
                                status: e.target.value as "active" | "inactive"
                              })}
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {(!partners || partners.length === 0) && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-400">
                            No partners yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-[#0d2847] border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Users</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage user accounts and roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-cyan-500/20">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">User</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Joined</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.map((u: any) => (
                        <tr key={u.id} className="border-b border-cyan-500/10 hover:bg-cyan-500/5">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {u.avatar ? (
                                <img src={u.avatar} alt="" className="w-8 h-8 rounded-full" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                  <Users className="h-4 w-4 text-cyan-400" />
                                </div>
                              )}
                              <span className="text-white">{u.name || "Unknown"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-300">{u.email}</td>
                          <td className="py-3 px-4">
                            <Badge className={u.role === "admin" ? "bg-blue-600/20 text-blue-500 border-blue-600/30" : "bg-gray-500/20 text-gray-400 border-gray-500/30"}>
                              {u.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              className="bg-[#0a1628] border border-cyan-500/30 rounded px-2 py-1 text-white text-sm"
                              value={u.role}
                              onChange={(e) => updateUserRole.mutate({ 
                                id: u.id, 
                                role: e.target.value as "user" | "admin"
                              })}
                              disabled={u.id === (meQuery.data as any)?.id}
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {(!users || users.length === 0) && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-400">
                            No users yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Logs Tab */}
          <TabsContent value="logs">
            <Card className="bg-[#0d2847] border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Partner Access Logs</CardTitle>
                <CardDescription className="text-gray-400">
                  Track partner portal access and document downloads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-cyan-500/20">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Partner</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Action</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">IP Address</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {([] as any[]).map((log: any) => (
                        <tr key={log.id} className="border-b border-cyan-500/10 hover:bg-cyan-500/5">
                          <td className="py-3 px-4 text-white">{log.partner_company || "Unknown"}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                              {log.action}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-300 font-mono text-sm">{log.ip_address}</td>
                          <td className="py-3 px-4 text-gray-300">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      {(!accessLogs || accessLogs.length === 0) && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-gray-400">
                            No access logs yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payroll Tab */}
          <TabsContent value="payroll">
            <PayrollPanel />
          </TabsContent>

          {/* Expiry Warnings Tab */}
          <TabsContent value="expiry">
            <ExpiryWarningsPanel />
          </TabsContent>
        </Tabs>
      </div>
      <MobileBottomNav />
    </div>
  );
}

// ─── Payroll Panel Component ──────────────────────────────────────────────────
function PayrollPanel() {
  const [netRevenue, setNetRevenue] = useState("");
  const [payrollResult, setPayrollResult] = useState<any>(null);
  const [onboardingEmail, setOnboardingEmail] = useState("");
  const [onboardingLink, setOnboardingLink] = useState("");

  const payrollConfig = trpc.stripe.getPayrollConfig.useQuery(undefined, { retry: false });
  const processPayroll = trpc.stripe.processPayroll.useMutation({
    onSuccess: (data) => { setPayrollResult(data); payrollConfig.refetch(); },
  });
  const createOnboarding = trpc.stripe.createConnectOnboardingLink.useMutation({
    onSuccess: (data) => { setOnboardingLink(data.url); },
  });

  const team = payrollConfig.data ?? [];
  const connectedCount = team.filter((m: any) => m.connected).length;
  const totalPct = team.reduce((sum: number, m: any) => sum + m.percentageOfRevenue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-950/40 to-slate-900/60 border border-green-800/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-black text-white">Team Payroll — Stripe Connect</h2>
        </div>
        <p className="text-slate-400 text-sm">Automated revenue distribution to your team. Each member connects their bank account once via Stripe Express — then you run payroll in one click.</p>
        <div className="flex gap-6 mt-4">
          <div className="text-center">
            <div className="text-2xl font-black text-green-400">{connectedCount}/{team.length}</div>
            <div className="text-slate-500 text-xs">Connected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-blue-400">{totalPct}%</div>
            <div className="text-slate-500 text-xs">Total Distributed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-slate-400">{100 - totalPct}%</div>
            <div className="text-slate-500 text-xs">Chad Retains</div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="space-y-3">
        <h3 className="text-white font-black text-lg">Team Members</h3>
        {payrollConfig.isLoading ? (
          <div className="text-slate-500 text-sm">Loading...</div>
        ) : (
          team.map((member: any) => (
            <div key={member.email} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                {member.name.split(" ").map((n: string) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-black">{member.name}</div>
                <div className="text-slate-500 text-sm">{member.role} · {member.email}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    member.connected
                      ? "bg-green-900/40 text-green-400 border border-green-800/40"
                      : "bg-blue-900/40 text-sky-400 border border-blue-800/40"
                  }`}>
                    {member.connected ? "✅ Connected" : "⏳ Not Connected"}
                  </span>
                  <span className="text-blue-400 text-xs font-bold">{member.percentageOfRevenue}% of net revenue</span>
                </div>
              </div>
              {!member.connected && (
                <button
                  onClick={() => {
                    setOnboardingEmail(member.email);
                    createOnboarding.mutate({ email: member.email, origin: window.location.origin });
                  }}
                  disabled={createOnboarding.isPending}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-black px-4 py-2 rounded-full transition-colors flex-shrink-0"
                >
                  {createOnboarding.isPending && onboardingEmail === member.email ? "Generating..." : "Send Onboarding Link"}
                </button>
              )}
              {member.connected && (
                <span className="text-green-400 text-xs font-bold flex-shrink-0">Bank Connected ✓</span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Onboarding Link Result */}
      {onboardingLink && (
        <div className="bg-blue-950/40 border border-blue-800/30 rounded-2xl p-5">
          <div className="text-white font-black mb-2">✅ Onboarding Link Generated</div>
          <p className="text-slate-400 text-sm mb-3">Send this link to your team member. They click it, connect their bank account via Stripe, and they're set up for payroll.</p>
          <div className="flex gap-2">
            <input
              value={onboardingLink}
              readOnly
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-blue-300 text-xs font-mono"
            />
            <button
              onClick={() => { navigator.clipboard.writeText(onboardingLink); }}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-4 py-2 rounded-lg transition-colors"
            >
              Copy
            </button>
          </div>
          <p className="text-slate-600 text-xs mt-2">Link expires in 24 hours. Generate a new one if needed.</p>
        </div>
      )}

      {/* Run Payroll */}
      <div className="bg-gradient-to-r from-green-950/40 to-slate-900/60 border border-green-800/30 rounded-2xl p-6">
        <h3 className="text-white font-black text-lg mb-2">Run Payroll</h3>
        <p className="text-slate-400 text-sm mb-4">Enter the net revenue for this billing cycle. AthlynXAI will automatically distribute the correct percentage to each connected team member via Stripe.</p>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Net Revenue ($)</label>
            <input
              type="number"
              value={netRevenue}
              onChange={e => setNetRevenue(e.target.value)}
              placeholder="e.g. 10000"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg font-bold outline-none focus:border-green-500"
            />
          </div>
          <button
            onClick={() => {
              if (!netRevenue || isNaN(Number(netRevenue))) return;
              processPayroll.mutate({ netRevenue: Number(netRevenue) });
            }}
            disabled={processPayroll.isPending || !netRevenue || connectedCount === 0}
            className="bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black px-8 py-3 rounded-xl transition-colors flex items-center gap-2"
          >
            <DollarSign className="w-5 h-5" />
            {processPayroll.isPending ? "Processing..." : "Run Payroll"}
          </button>
        </div>
        {connectedCount === 0 && (
          <p className="text-sky-400 text-xs mt-2">⚠️ No team members connected yet. Send onboarding links above first.</p>
        )}

        {/* Payroll Preview */}
        {netRevenue && Number(netRevenue) > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Payroll Preview</div>
            {team.map((member: any) => (
              <div key={member.email} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{member.name} ({member.percentageOfRevenue}%)</span>
                <span className="text-green-400 font-black">${((Number(netRevenue) * member.percentageOfRevenue) / 100).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-slate-700 pt-2 flex items-center justify-between text-sm font-black">
              <span className="text-white">Chad Retains ({100 - totalPct}%)</span>
              <span className="text-blue-400">${((Number(netRevenue) * (100 - totalPct)) / 100).toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Payroll Results */}
      {payrollResult && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="text-white font-black mb-3">✅ Payroll Processed</div>
          <div className="space-y-2">
            {payrollResult.results?.map((r: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{r.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-bold">${(r.amount / 100).toFixed(2)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    r.status === "paid" ? "bg-green-900/40 text-green-400" :
                    r.status === "not_connected" ? "bg-blue-900/40 text-sky-400" :
                    "bg-red-900/40 text-red-400"
                  }`}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-700 mt-3 pt-3 text-sm">
            <span className="text-slate-400">Total distributed: </span>
            <span className="text-green-400 font-black">${((payrollResult.totalDistributed ?? 0) / 100).toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-white font-black mb-3">How to Set Up Your Guys</h3>
        <div className="space-y-3">
          {[
            { step: "1", title: "Send Onboarding Link", desc: "Click 'Send Onboarding Link' next to each team member. Copy the link and send it to them via email or text." },
            { step: "2", title: "They Connect Their Bank", desc: "Glenn, Lee, and Tony each click the link, enter their info, and connect their bank account via Stripe Express. Takes 5 minutes." },
            { step: "3", title: "Run Payroll", desc: "After each billing cycle, enter the net revenue and click 'Run Payroll'. Stripe automatically sends the correct amount to each person's bank." },
            { step: "4", title: "Automatic From Here", desc: "Once connected, payroll is one click. Stripe handles the transfers, tax forms (1099), and compliance." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0">{item.step}</div>
              <div>
                <div className="text-white font-bold text-sm">{item.title}</div>
                <div className="text-slate-400 text-xs leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return <RouteErrorBoundary><AdminDashboardInner /></RouteErrorBoundary>;
}

// ─── Expiry Warnings Panel ────────────────────────────────────────────────────
function ExpiryWarningsPanel() {
  const warnings = trpc.expiration.getWarnings.useQuery(undefined, { retry: false });
  const overdue = trpc.expiration.getOverdue.useQuery(undefined, { retry: false });

  const warningUsers = warnings.data ?? [];
  const overdueUsers = overdue.data ?? [];

  function daysColor(days: number) {
    if (days <= 0) return "text-red-400";
    if (days <= 2) return "text-red-300";
    if (days <= 4) return "text-sky-400";
    return "text-green-400";
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#0d2847] border-red-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            Expiring Soon — Warning Emails Active
          </CardTitle>
          <CardDescription className="text-slate-400">
            Users whose trial ends within 7 days. Warning emails sent automatically at 7, 5, 4, 3, 2, 1 days and on expiry.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {warnings.isLoading ? (
            <div className="text-slate-400 text-sm">Loading...</div>
          ) : warningUsers.length === 0 ? (
            <div className="text-green-400 text-sm font-bold">✓ No users expiring in the next 7 days</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="text-left py-2 pr-4">User</th>
                    <th className="text-left py-2 pr-4">Email</th>
                    <th className="text-left py-2 pr-4">Days Left</th>
                    <th className="text-left py-2 pr-4">Trial Ends</th>
                    <th className="text-left py-2">Last Email Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {(warningUsers as any[]).map((u: any) => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-2 pr-4 text-white font-semibold">{u.name || "—"}</td>
                      <td className="py-2 pr-4 text-slate-300">{u.email}</td>
                      <td className={`py-2 pr-4 font-black ${daysColor(u.daysLeft)}`}>
                        {u.daysLeft <= 0 ? "EXPIRED" : `${u.daysLeft}d`}
                      </td>
                      <td className="py-2 pr-4 text-slate-400 text-xs">
                        {u.trialEndsAt ? new Date(u.trialEndsAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-2 text-slate-400 text-xs">
                        {u.emailLog?.[0]
                          ? `${u.emailLog[0].emailType} — ${new Date(u.emailLog[0].emailSentAt).toLocaleString()}`
                          : "None sent yet"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-[#0d2847] border-red-700/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            Overdue — Expired Trial, No Subscription
          </CardTitle>
          <CardDescription className="text-slate-400">
            Users whose trial has expired and have not converted to a paid plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {overdue.isLoading ? (
            <div className="text-slate-400 text-sm">Loading...</div>
          ) : overdueUsers.length === 0 ? (
            <div className="text-green-400 text-sm font-bold">✓ No overdue accounts</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="text-left py-2 pr-4">User</th>
                    <th className="text-left py-2 pr-4">Email</th>
                    <th className="text-left py-2 pr-4">Expired</th>
                    <th className="text-left py-2">Days Overdue</th>
                  </tr>
                </thead>
                <tbody>
                  {(overdueUsers as any[]).map((u: any) => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-2 pr-4 text-white font-semibold">{u.name || "—"}</td>
                      <td className="py-2 pr-4 text-slate-300">{u.email}</td>
                      <td className="py-2 pr-4 text-slate-400 text-xs">
                        {u.trialEndsAt ? new Date(u.trialEndsAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-2 text-red-400 font-black">{u.expiredDaysAgo}d ago</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
