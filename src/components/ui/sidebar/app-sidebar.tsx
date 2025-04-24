// src/components/AppSidebar.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupAction,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, User2, ChevronUp } from "lucide-react";
import { useProjects } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { ModeToggle } from "@/components/mode-toggle";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  coverImage: z.string().optional(),
});

type ProjectForm = z.infer<typeof projectSchema>;

export function AppSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const displayName = user?.username || user?.email || "User";
  const { projects, createProject } = useProjects();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [projDialogOpen, setProjDialogOpen] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: { title: "", description: "", coverImage: "" },
    mode: "onChange",
  });

  const onSubmit = (data: ProjectForm) => {
    createProject(data.title, data.description, data.coverImage);
    reset();
    setProjDialogOpen(false);
  };

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
    navigate(`/project/${id}`);
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel onClick={() => navigate(`/project`)}>
              Projects
            </SidebarGroupLabel>
            <SidebarGroupAction title="Add Project">
              <Plus
                onClick={() => setProjDialogOpen(true)}
                className="cursor-pointer"
              />
              <span className="sr-only">Add Project</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((proj) => (
                  <SidebarMenuItem key={proj.id}>
                    <SidebarMenuButton
                      onClick={() => handleProjectSelect(proj.id)}
                    >
                      {proj.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="flex items-center justify-between p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 className="mr-2" />
                    {displayName}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top">
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
          <ModeToggle />
        </SidebarFooter>
      </Sidebar>

      {/* Create Project Dialog */}
      <Dialog open={projDialogOpen} onOpenChange={setProjDialogOpen}>
        <DialogContent>
          <DialogTitle>Create New Project</DialogTitle>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="proj-title">Title</Label>
              <Input
                id="proj-title"
                {...register("title")}
                placeholder="Project title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="proj-desc">Description</Label>
              <Input
                id="proj-desc"
                {...register("description")}
                placeholder="Project description"
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="proj-cover">Cover Image URL (optional)</Label>
              <Input
                id="proj-cover"
                {...register("coverImage")}
                placeholder="https://example.com/cover.jpg"
              />
              {errors.coverImage && (
                <p className="text-sm text-red-500">
                  {errors.coverImage.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
