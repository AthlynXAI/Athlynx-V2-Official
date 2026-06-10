import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from '@/components/MobileBottomNav'
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import PlatformLayout from "@/components/PlatformLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Shield, CreditCard, LogOut } from "lucide-react";
import { Link } from "wouter";

function SettingsInner() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);

  const creditsQuery = trpc.stripe.getPlans.useQuery(undefined, { enabled: !!user });

  return (
    <PlatformLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-blue-300 text-sm mt-1">Manage your account, notifications, and preferences</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-[#0d1b3e] border border-blue-900 w-full justify-start">
            <TabsTrigger value="account" className="data-[state=active]:bg-blue-700">
              <User className="w-4 h-4 mr-2" />Account
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-700">
              <Bell className="w-4 h-4 mr-2" />Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-blue-700">
              <Shield className="w-4 h-4 mr-2" />Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-blue-700">
              <CreditCard className="w-4 h-4 mr-2" />Billing
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card className="bg-[#0d1b3e] border-blue-900">
              <CardHeader>
                <CardTitle className="text-white">Account Information</CardTitle>
                <CardDescription className="text-blue-300">Your profile details and account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center text-2xl font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">{user?.name ?? "Athlete"}</p>
                    <p className="text-blue-300 text-sm">{user?.email ?? ""}</p>
                    <Badge className="mt-1 bg-blue-600 text-white capitalize">{user?.role ?? "user"}</Badge>
                  </div>
                </div>
                <Separator className="bg-blue-900" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-blue-200">Display Name</Label>
                    <Input
                      defaultValue={user?.name ?? ""}
                      className="mt-1 bg-[#0a1628] border-blue-800 text-white"
                      placeholder="Your name"
                      disabled
                    />
                  </div>
                  <div>
                    <Label className="text-blue-200">Email</Label>
                    <Input
                      defaultValue={user?.email ?? ""}
                      className="mt-1 bg-[#0a1628] border-blue-800 text-white"
                      placeholder="your@email.com"
                      disabled
                    />
                  </div>
                </div>
                <p className="text-xs text-blue-400">To update your name or email, contact contact@athlynx.ai.</p>
                <Separator className="bg-blue-900" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">AI Credits</p>
                    <p className="text-blue-300 text-sm">Available credits for AI features</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#00c2ff]">{user?.credits ?? 0}</p>
                    <Link href="/billing">
                      <Button size="sm" variant="outline" className="mt-1 border-blue-700 text-blue-300 hover:bg-blue-900 text-xs">
                        Buy Credits
                      </Button>
                    </Link>
                  </div>
                </div>
                <Separator className="bg-blue-900" />
                <div>
                  <Button
                    variant="destructive"
                    className="w-full sm:w-auto"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-[#0d1b3e] border-blue-900">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
                <CardDescription className="text-blue-300">Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Email Notifications</p>
                    <p className="text-blue-300 text-sm">Receive updates and alerts via email</p>
                  </div>
                  <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                </div>
                <Separator className="bg-blue-900" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">SMS Notifications</p>
                    <p className="text-blue-300 text-sm">Get text alerts for important events</p>
                  </div>
                  <Switch checked={smsNotifs} onCheckedChange={setSmsNotifs} />
                </div>
                <Separator className="bg-blue-900" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Push Notifications</p>
                    <p className="text-blue-300 text-sm">Browser and app push notifications</p>
                  </div>
                  <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
                </div>
                <Separator className="bg-blue-900" />
                <Button
                  className="bg-blue-600 hover:bg-blue-500 text-white"
                  onClick={() => toast({ title: "Preferences saved", description: "Your notification settings have been updated." })}
                >
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="bg-[#0d1b3e] border-blue-900">
              <CardHeader>
                <CardTitle className="text-white">Security</CardTitle>
                <CardDescription className="text-blue-300">Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-blue-950 border border-blue-800 p-4">
                  <p className="text-white font-medium mb-1">Authentication Provider</p>
                  <p className="text-blue-300 text-sm">Your account is secured through Supabase Authentication. Manage your password and security below.</p>
                  <Badge className="mt-2 bg-[#00C2FF] text-white">Secured</Badge>
                </div>
                <Separator className="bg-blue-900" />
                <div>
                  <p className="text-white font-medium mb-1">Login Method</p>
                  <p className="text-blue-300 text-sm capitalize">{user?.loginMethod ?? "email"}</p>
                </div>
                <Separator className="bg-blue-900" />
                <div>
                  <p className="text-white font-medium mb-2">Danger Zone</p>
                  <Button variant="destructive" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out of All Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card className="bg-[#0d1b3e] border-blue-900">
              <CardHeader>
                <CardTitle className="text-white">Billing & Subscription</CardTitle>
                <CardDescription className="text-blue-300">Manage your plan and payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-blue-950 border border-blue-800 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Current Plan</p>
                    <p className="text-blue-300 text-sm capitalize">{user?.stripePlanId ?? "Athlete Free"}</p>
                  </div>
                  <Link href="/billing">
                    <Button className="bg-[#00c2ff] text-[#0a0f1e] font-bold hover:bg-white">
                      Manage Plan
                    </Button>
                  </Link>
                </div>
                <div className="rounded-lg bg-blue-950 border border-blue-800 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">AI Credits</p>
                    <p className="text-blue-300 text-sm">{user?.credits ?? 0} credits remaining</p>
                  </div>
                  <Link href="/billing">
                    <Button variant="outline" className="border-blue-700 text-blue-300 hover:bg-blue-900">
                      Buy Credits
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-blue-400">
                  For billing support or to cancel your subscription, visit the{" "}
                  <Link href="/billing" className="text-[#00c2ff] underline">Billing page</Link>.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      <MobileBottomNav />
    </div>
    </PlatformLayout>
  );
}

export default function Settings() {
  return <RouteErrorBoundary><SettingsInner /></RouteErrorBoundary>;
}
