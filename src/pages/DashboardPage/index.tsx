import { useProjects } from "@/context/ProjectContext";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function DashboardHome() {
  const { projects } = useProjects();

  return (
    <div className="p-4">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4 text-primary">
        My Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <Link key={p.id} to={`/project/${p.id}`}>
            <Card>
              <CardContent>
                {p.coverImage && (
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="mb-2 w-full h-32 object-cover rounded"
                  />
                )}
                <h2 className="font-bold text-primary">{p.title}</h2>
                <p>{p.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
