import { useState } from "react";
import { useProjects } from "@/context/ProjectContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DashboardHome() {
  const { projects } = useProjects();
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const paginated = projects.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <h1 className="text-2xl mb-4">Projects</h1>
      <div className="grid grid-cols-3 gap-4">
        {paginated.map((p) => (
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
                <h2 className="font-bold">{p.title}</h2>
                <p>{p.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </Button>
        <Button
          disabled={page * pageSize >= projects.length}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
