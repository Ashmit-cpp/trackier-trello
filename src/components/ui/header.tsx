import { SidebarTrigger } from "./sidebar";
import { ModeToggle } from "../mode-toggle";
import { Button } from "./button";
import { LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
}

const AppHeader = ({ breadcrumbs }: AppHeaderProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Generate default breadcrumbs based on current route
  const generateDefaultBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    if (pathSegments.length === 0) {
      return [{ label: "Dashboard" }];
    }
    
    if (pathSegments[0] === "project" && pathSegments[1]) {
      return [
        { 
          label: "Projects", 
          onClick: () => navigate("/") 
        },
        { label: "Project" }
      ];
    }
    
    return [{ label: "Dashboard" }];
  };

  const currentBreadcrumbs = breadcrumbs || generateDefaultBreadcrumbs();

  return (
    <div className="bg-background border-b flex flex-col">
      {/* Main Header */}
      <div className="flex items-center justify-between p-2">
      <div className="flex items-center space-x-2">
      <SidebarTrigger />
        {currentBreadcrumbs.length > 0 && (
        <div className="px-1 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {currentBreadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                {item.onClick || item.href ? (
                  <button
                    onClick={item.onClick || (() => item.href && navigate(item.href))}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    {index === 0 && currentBreadcrumbs.length > 1 && (
                      <ArrowLeft className="w-4 h-4" />
                    )}
                    {item.label}
                  </button>
                ) : (
                  <span className={index === currentBreadcrumbs.length - 1 ? "text-foreground font-medium" : ""}>
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <Button
            data-cy="logout"
            size={"icon"}
            variant={"secondary"}
            className="ml-auto"
            onClick={logout}
          >
            <LogOut />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
