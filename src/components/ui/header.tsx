import { SidebarTrigger } from "./sidebar";
import { ModeToggle } from "../mode-toggle";
import { Button } from "./button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AppHeader = () => {
  const { logout } = useAuth();

  return (
    <div className="bg-secondary border border-b border-secondary flex items-center justify-between p-2">
      <SidebarTrigger />
      <div className="flex items-center space-x-2">
        <ModeToggle />
        <Button
          size={"icon"}
          variant={"outline"}
          className="ml-auto"
          onClick={logout}
        >
          <LogOut />
        </Button>
      </div>
    </div>
  );
};

export default AppHeader;
