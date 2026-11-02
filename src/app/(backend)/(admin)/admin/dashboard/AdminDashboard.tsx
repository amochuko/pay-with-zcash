"use client";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Category } from "@/app/lib/types/category.type";
import { MerchantRecord } from "@/app/lib/types/map.types";
import { MerchantProps } from "@/app/lib/types/merchant.types";
import { POST_STATUS_ENUM } from "@/app/lib/typings";
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
import CategoriesTable from "@/app/ui/dashboard/CategoriesTable";
import MerchantsTable from "@/app/ui/dashboard/MerchantsTable";

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

const users = [
  { email: "alice@example.com", keys: 2, requests: 12847, status: "active" },
  { email: "bob@example.com", keys: 1, requests: 3421, status: "active" },
  { email: "carol@example.com", keys: 0, requests: 0, status: "suspended" },
];

type AdminDashboardProps = {
  merchants: MerchantProps;
  categories: Category[];
};

const AdminDashboard = (props: AdminDashboardProps) => {
  const [section, setSection] = useState<Section>("overview");
  const [merchants, setMerchants] = useState<MerchantRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setMerchants(props.merchants.data);
    setCategories(props.categories);
  }, [props]);

  const getMerchantsNumbersByStatue = () => {
    return merchants.filter((m) => m.postStatus === POST_STATUS_ENUM.REVIEW)
      .length;
  };

  const approvedListing = () => {
    return merchants.reduce((acc, cur) => {
      if (cur.postStatus === POST_STATUS_ENUM.PUBLISH) {
        acc++;
      }

      return acc;
    }, 0);
  };

  const adminMenu: { id: Section; label: string; icon: typeof Activity }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "developers", label: "Developers", icon: Users },
    { id: "businesses", label: "Businesses", icon: Building2 },
  ];

  const activeLabel =
    adminMenu.find((m) => m.id === section)?.label ?? "Overview";

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
                  <SidebarMenuButton>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Admin</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenu.map((item) => (
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
            <p className="text-muted-foreground text-sm"> Demo data</p>
          </div>
        </div>

        <div className="px-4 md:px-36 py-6">
          {section === "overview" && (
            <div className="flex flex-col gap-12">
              <div className="grid sm:grid-cols-4 gap-4">
                <Stat icon={Users} label="Developers" value="342" />
                <Stat icon={BarChart3} label="Requests today" value="48,912" />
                <Stat
                  icon={Building2}
                  label="Business Categories"
                  value={String(categories.length)}
                />
                <Stat
                  icon={Building2}
                  label="Listed businesses"
                  value={String(merchants.length)}
                />
                <Stat
                  icon={Building2}
                  label="Pending Approvals"
                  value={String(getMerchantsNumbersByStatue())}
                />
                <Stat
                  icon={Building2}
                  label="Approved Listing"
                  value={String(approvedListing())}
                />
                <Stat icon={AlertTriangle} label="Error rate" value="0.8%" />
              </div>

              <CategoriesTable categories={categories} />
              <MerchantsTable merchants={merchants} />
            </div>
          )}

          {section === "developers" && (
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

          {section === "businesses" && (
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">Listed businesses</CardTitle>
                <Button asChild size="sm" variant="outline">
                  <Link href="/listings">Open directory</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {merchants.map((b) => (
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
