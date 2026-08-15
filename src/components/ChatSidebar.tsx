import { useNavigate, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { MessageSquare, Plus, Search, History, Home, Scan, GraduationCap, BookOpen, User } from "lucide-react";
import { mockSnaps } from "@/lib/mock-data";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, labelKey: "nav.home" },
  { path: "/scan", icon: Scan, labelKey: "nav.scanner" },
  { path: "/study", icon: GraduationCap, labelKey: "nav.study" },
  { path: "/vocabulary", icon: BookOpen, labelKey: "nav.vocabulary" },
  { path: "/profile", icon: User, labelKey: "nav.profile" },
];

const ChatSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <Sidebar variant="sidebar" className="border-r border-border bg-sidebar">
      <SidebarHeader className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-center py-2">
          <span className="text-xl font-extrabold tracking-tight text-foreground">LingoSnap</span>
        </div>

        <button
          onClick={() => navigate("/scan")}
          className="btn-volumetric-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
        >
          <Scan size={16} />
          <span>{t("nav.scanner")}</span>
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-1">
            {t("sidebar.navigation", { defaultValue: "Home" })}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 gap-1">
              {navItems.map(({ path, icon: Icon, labelKey }) => {
                const isActive = location.pathname === path;
                return (
                  <SidebarMenuItem key={path}>
                    <SidebarMenuButton
                      onClick={() => navigate(path)}
                      isActive={isActive}
                      className={cn(
                        "relative rounded-xl py-5 px-3 transition-colors",
                        isActive
                          ? "bg-transparent text-primary font-bold after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-5 after:w-1 after:rounded-full after:bg-primary"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      )}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-semibold">{t(labelKey)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        <SidebarGroup>
          <div className="px-4 mb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <input 
                type="text" 
                placeholder={t("sidebar.search")} 
                className="w-full bg-muted/50 border border-border/50 rounded-xl py-1.5 pl-9 pr-3 text-xs outline-none focus:border-primary/50 transition-colors"
                defaultValue=""
              />
            </div>
          </div>
          
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
            {t("sidebar.recentSnaps")}
          </SidebarGroupLabel>

          
          <SidebarGroupContent>
            <SidebarMenu className="px-2 gap-1">
              {mockSnaps.map((snap) => {
                const isActive = location.pathname === `/result/${snap.id}`;
                return (
                  <SidebarMenuItem key={snap.id}>
                    <SidebarMenuButton 
                      onClick={() => navigate(`/result/${snap.id}`)}
                      isActive={isActive}
                      className={cn(
                        "h-auto py-3 px-3 rounded-2xl transition-all duration-200",
                        isActive 
                          ? "bg-primary/10 text-primary ring-1 ring-primary/20 shadow-sm" 
                          : "hover:bg-muted/50 text-foreground/70 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-border/30">
                          <img src={snap.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate leading-tight mb-0.5">
                            {snap.originalText}
                          </p>
                          <div className="flex items-center gap-1.5 font-medium opacity-60">
                            <span className="text-[9px] uppercase tracking-wider">{snap.language}</span>
                            <span className="w-0.5 h-0.5 rounded-full bg-current opacity-30" />
                            <span className="text-[9px]">{snap.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto p-4 border-t border-border/30">
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => navigate("/history")}
              className="rounded-xl py-2 px-3 hover:bg-muted"
            >
              <History size={16} />
              <span className="text-xs font-semibold">{t("sidebar.seeAllHistory")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
};

export default ChatSidebar;
