import { Droppable } from "@hello-pangea/dnd";
import { ListCard } from "./ListCard";

export interface ListGridProps {
  lists: Array<any>;
  deleteList: (projectId: string, listId: string) => void;
  setTaskDialogOpen: (open: boolean) => void;
  setTaskForListId: (listId: string) => void;
  setPopupTaskId: (taskId: string | null) => void;
  projectId: string;
}

export function ListGrid({
  lists,
  deleteList,
  setTaskDialogOpen,
  setTaskForListId,
  setPopupTaskId,
  projectId,
}: ListGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {lists.map((list) => (
        <Droppable droppableId={list.id} key={list.id}>
          {(provided) => (
            <div
            ref={provided.innerRef}
            {...provided.droppableProps}
             data-droppable-id={list.id}    
            className="space-y-4"
            data-cy="list"
            data-cy-list-id={list.id}
            data-cy-list-title={list.title}
            >
              <ListCard
                projectId={projectId}
                list={list}
                deleteList={deleteList}
                setTaskDialogOpen={setTaskDialogOpen}
                setTaskForListId={setTaskForListId}
                setPopupTaskId={setPopupTaskId}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </div>
  );
}
