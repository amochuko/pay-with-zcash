"use client";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  Key,
  LayoutDashboard,
  ListChecks,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/app/ui/badge";
import { Button } from "@/app/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "../../../../ui/sidebar";
// import { businesses } from "@/lib/listings-data";

const businesses: any[] = [];

type Role = "client" | "admin";
type Section = "overview" | "requests" | "keys" | "developers" | "businesses";

const Stat = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
}) => (
  <Card className="bg-card/50 border-border/50">
    <CardContent className="p-4">
      <Icon className="h-5 w-5 text-primary mb-2" />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </CardContent>
  </Card>
);

const recent = [
  { path: "/v1/block/2847392", status: 200, time: "2 min ago" },
  { path: "/v1/network/mempool", status: 200, time: "5 min ago" },
  { path: "/v1/transaction/abc123", status: 404, time: "11 min ago" },
  { path: "/v1/blockchain/info", status: 200, time: "20 min ago" },
];

const users = [
  { email: "alice@example.com", keys: 2, requests: 12847, status: "active" },
  { email: "bob@example.com", keys: 1, requests: 3421, status: "active" },
  { email: "carol@example.com", keys: 0, requests: 0, status: "suspended" },
];

const keys = [
  {
    name: "Production",
    prefix: "zca_live_9f2…",
    created: "Jan 12, 2026",
    lastUsed: "2 min ago",
  },
  {
    name: "Development",
    prefix: "zca_test_4b8…",
    created: "Mar 03, 2026",
    lastUsed: "3 days ago",
  },
];

const AdminDashboard = () => {
  const [role, setRole] = useState<Role>("client");
  const [section, setSection] = useState<Section>("overview");

  const selectRole = (r: Role) => {
    setRole(r);
    setSection("overview");
  };

  const clientMenu: { id: Section; label: string; icon: typeof Activity }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "requests", label: "Requests", icon: ListChecks },
    { id: "keys", label: "API Keys", icon: Key },
  ];

  const adminMenu: { id: Section; label: string; icon: typeof Activity }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "developers", label: "Developers", icon: Users },
    { id: "businesses", label: "Businesses", icon: Building2 },
  ];

  const menu = role === "client" ? clientMenu : adminMenu;
  const activeLabel = menu.find((m) => m.id === section)?.label ?? "Overview";

  return (
    <div className="flex w-full min-h-[calc(100vh-4rem)]">
      {/* Left column: menu */}
      <Sidebar
        collapsible="offcanvas"
        className="border-r border-border/50 pt-16 md:pt-16"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Role</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={role === "client"}
                    onClick={() => selectRole("client")}
                  >
                    <UserRound className="h-4 w-4" />
                    <span>Client</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={role === "admin"}
                    onClick={() => selectRole("admin")}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Admin</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>
              {role === "client" ? "Client" : "Admin"} menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menu.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={section === item.id}
                      onClick={() => setSection(item.id)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Right column: detail pane */}
      <SidebarInset className="flex-1 min-w-0">
        <div className="flex items-center gap-3 px-4 md:px-36 pt-6">
          <SidebarTrigger className="md:hidden" />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold truncate">{activeLabel}</h1>
            <p className="text-muted-foreground text-sm">
              {role === "client" ? "Client" : "Admin"} · Demo data
            </p>
          </div>
        </div>

        <div className="px-4 md:px-36 py-6">
          {role === "client" && section === "overview" && (
            <>
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <Stat
                  icon={BarChart3}
                  label="Requests this month"
                  value="16,268"
                />
                <Stat icon={Key} label="Active API keys" value="2" />
                <Stat icon={Activity} label="Success rate" value="99.2%" />
              </div>
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-base">Recent requests</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSection("requests")}
                  >
                    View all
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recent.slice(0, 3).map((r) => (
                    <div
                      key={r.path}
                      className="flex items-center justify-between text-sm p-2 rounded bg-secondary/30"
                    >
                      <code className="font-mono text-xs truncate">
                        {r.path}
                      </code>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge
                          variant={
                            r.status === 200 ? "secondary" : "destructive"
                          }
                        >
                          {r.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {r.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
          {role === "client" && section === "requests" && (
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Recent requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recent.map((r) => (
                  <div
                    key={r.path}
                    className="flex items-center justify-between text-sm p-2 rounded bg-secondary/30"
                  >
                    <code className="font-mono text-xs truncate">{r.path}</code>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge
                        variant={r.status === 200 ? "secondary" : "destructive"}
                      >
                        {r.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {r.time}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {role === "client" && section === "keys" && (
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">API keys</CardTitle>
                <Button asChild size="sm" variant="outline">
                  <Link href="/keys">Manage keys</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {keys.map((k) => (
                  <div
                    key={k.prefix}
                    className="flex flex-wrap items-center justify-between gap-2 text-sm p-2 rounded bg-secondary/30"
                  >
                    <div>
                      <div className="font-medium">{k.name}</div>
                      <code className="font-mono text-xs text-muted-foreground">
                        {k.prefix}
                      </code>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Created {k.created}</span>
                      <span>Last used {k.lastUsed}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {role === "admin" && section === "overview" && (
            <div className="grid sm:grid-cols-4 gap-4">
              <Stat icon={Users} label="Developers" value="342" />
              <Stat icon={BarChart3} label="Requests today" value="48,912" />
              <Stat
                icon={Building2}
                label="Listed businesses"
                value={String(businesses.length)}
              />
              <Stat icon={AlertTriangle} label="Error rate" value="0.8%" />
            </div>
          )}
          {role === "admin" && section === "developers" && (
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Developers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {users.map((u) => (
                  <div
                    key={u.email}
                    className="flex flex-wrap items-center justify-between gap-2 text-sm p-2 rounded bg-secondary/30"
                  >
                    <span className="truncate">{u.email}</span>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{u.keys} keys</span>
                      <span>{u.requests.toLocaleString()} req</span>
                      <Badge
                        variant={
                          u.status === "active" ? "secondary" : "destructive"
                        }
                      >
                        {u.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {role === "admin" && section === "businesses" && (
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">Listed businesses</CardTitle>
                <Button asChild size="sm" variant="outline">
                  <Link href="/listings">Open directory</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {businesses.map((b) => (
                  <div
                    key={b.id}
                    className="flex flex-wrap items-center justify-between gap-2 text-sm p-2 rounded bg-secondary/30"
                  >
                    <span className="truncate">{b.name}</span>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {b.state}, {b.country}
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        {b.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </div>
  );
};

export default AdminDashboard;
