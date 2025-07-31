// src/components/AppSidebar.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  ChevronUp, 
  FolderKanban, 
  Settings, 
  LogOut,
  Home,
  Briefcase
} from "lucide-react";
import { useProjects } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(50, "Title must be less than 50 characters"),
  description: z.string().min(1, "Description is required").max(200, "Description must be less than 200 characters"),
  coverImage: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type ProjectForm = z.infer<typeof projectSchema>;

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const displayName = user?.username || user?.email || "User";
  const userInitials = displayName
    .split(" ")
    .map(name => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  
  const { projects, createProject } = useProjects();
  const [projDialogOpen, setProjDialogOpen] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      coverImage: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ProjectForm) => {
    try {
      const coverImageUrl = data.coverImage || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop";
      await createProject(data.title, data.description, coverImageUrl);
      reset();
      setProjDialogOpen(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const handleSelect = (id: string) => {
    navigate(`/project/${id}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const isHomePage = location.pathname === "/";

  return (
    <>
      <Sidebar className="border-r">
        <SidebarHeader className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wider text-primary">TaskOrbit</h2>
              <p className="text-xs text-muted-foreground tracking-wide">Project Manager</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* Navigation */}
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/")}
                  className={`mb-2 h-11 ${isHomePage ? "bg-accent text-accent-foreground" : "cursor-pointer"}`}
                >
                  <Home className="w-4 h-4 mr-3" />
                  <span className="font-medium">Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* Projects Section */}
          <SidebarGroup>
            <div className="flex items-center justify-between mb-2 -mt-4">
              <SidebarGroupLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Projects
                <Badge variant="secondary" className="ml-2 text-xs">
                  {projects.length}
                </Badge>
              </SidebarGroupLabel>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setProjDialogOpen(true)}
                className="h-7 w-7 p-0 hover:bg-accent hover:text-accent-foreground transition-colors"
                data-cy="add-project"
              >
                <Plus className="w-4 h-4" />
                <span className="sr-only">Add Project</span>
              </Button>
            </div>
            
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {projects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No projects yet</p>
                    <p className="text-xs">Create your first project to get started</p>
                  </div>
                ) : (
                  projects.map((proj) => {
                    return (
                      <SidebarMenuItem key={proj.id}>
                        <SidebarMenuButton
                          data-cy="sidebar-project"
                          onClick={() => handleSelect(proj.id)}
                          className={`h-11 group transition-all duration-200`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-secondary-foreground text-xs font-bold">
                              {proj.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{proj.title}</p>
                            <p className="text-xs opacity-70 truncate">{proj.description}</p>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="h-12 hover:bg-muted transition-colors">
                    <div className="w-8 h-8 mr-3 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-semibold">
                        {userInitials}
                      </span>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium truncate">{displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                    <ChevronUp className="w-4 h-4 ml-auto opacity-60" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mb-2">
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Create Project Dialog */}
      <Dialog open={projDialogOpen} onOpenChange={setProjDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create New Project</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Start organizing your work with a new project
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="proj-title" className="text-sm font-medium">
                Project Title *
              </Label>
              <Input
                id="proj-title"
                {...register("title")}
                placeholder="Enter project title"
                className="h-11 bg-card"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="proj-desc" className="text-sm font-medium">
                Description *
              </Label>
              <Input
                id="proj-desc"
                {...register("description")}
                placeholder="Brief description of your project"
                className="h-11"
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="proj-cover" className="text-sm font-medium">
                Cover Image URL
                <span className="text-muted-foreground font-normal"> (optional)</span>
              </Label>
              <Input
                id="proj-cover"
                {...register("coverImage")}
                placeholder="https://example.com/image.jpg"
                className="h-11"
                disabled={isSubmitting}
              />
              {errors.coverImage && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  {errors.coverImage.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Leave empty to use a default cover image
              </p>
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => setProjDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
