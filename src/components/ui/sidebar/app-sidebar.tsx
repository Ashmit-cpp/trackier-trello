import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  SidebarTrigger,
  SidebarGroupAction,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/context/ProjectContext";
import { Plus } from "lucide-react";

export function AppSidebar() {
  const navigate = useNavigate();
  const { projects, createProject, createTask } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [projDialogOpen, setProjDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjCover, setNewProjCover] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
    navigate(`/project/${id}`);
  };

  const handleCreateProject = () => {
    createProject(newProjTitle, newProjDesc, newProjCover);
    setNewProjTitle("");
    setNewProjDesc("");
    setNewProjCover("");
    setProjDialogOpen(false);
  };

  const handleCreateTask = () => {
    if (selectedProjectId) {
      createTask(selectedProjectId, newTaskTitle, newTaskDesc);
      setNewTaskTitle("");
      setNewTaskDesc("");
      setTaskDialogOpen(false);
    }
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader></SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel
              className="cursor-pointer"
              onClick={() => navigate(`/project`)}
            >
              Projects
            </SidebarGroupLabel>
            <SidebarGroupAction title="Add Project">
              <Plus
                className="cursor-pointer"
                onClick={() => setProjDialogOpen(true)}
              />{" "}
              <span className="sr-only">Add Project</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((proj) => (
                  <SidebarMenuItem key={proj.id}>
                    <SidebarMenuButton
                      className="cursor-pointer"
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

        <SidebarFooter>
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>

      {/* Create Project Dialog */}
      <Dialog open={projDialogOpen} onOpenChange={setProjDialogOpen}>
        <DialogContent>
          <DialogTitle>Create New Project</DialogTitle>
          <Input
            placeholder="Title"
            value={newProjTitle}
            onChange={(e) => setNewProjTitle(e.target.value)}
          />
          <Input
            placeholder="Description"
            value={newProjDesc}
            onChange={(e) => setNewProjDesc(e.target.value)}
            className="mt-2"
          />
          <Input
            placeholder="Cover Image URL"
            value={newProjCover}
            onChange={(e) => setNewProjCover(e.target.value)}
            className="mt-2"
          />
          <DialogFooter>
            <Button onClick={handleCreateProject}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent>
          <DialogTitle>Create New Task</DialogTitle>
          <Input
            placeholder="Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <Input
            placeholder="Description"
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
            className="mt-2"
          />
          <DialogFooter>
            <Button onClick={handleCreateTask} disabled={!selectedProjectId}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
