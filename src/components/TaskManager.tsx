import { useState } from "react";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";
import { TaskSidebar } from "./TaskSidebar";
import { Settings } from "./Settings";
import { ShareTasksModal } from "./ShareTasksModal";
import { ThemeProvider } from "@/hooks/use-theme";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: string;
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleFormSubmit = (task: Task) => {
    if (editingTask) {
      // Update existing task
      setTasks(
        tasks.map((t) => (t.id === editingTask.id ? task : t))
      );
      setEditingTask(null);
    } else {
      // Add new task
      handleAddTask(task);
    }
    setIsFormOpen(false);
  };

  const handleStatusChange = (taskId: string, status: Task["status"]) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: status } : task
      )
    );
  };

  return (
    <ThemeProvider defaultMode="system" defaultColor="default" storageKey="task-manager-theme">
      <div className="flex h-screen bg-background">
        <TaskSidebar 
          tasks={tasks}
          onAddTask={() => setIsFormOpen(true)}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
        />
        
        <div className="flex-1 flex flex-col">
          <TaskList 
            tasks={tasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        </div>

        {isFormOpen && (
          <TaskForm
            task={editingTask}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingTask(null);
            }}
          />
        )}

        <Settings 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <ShareTasksModal
          tasks={tasks}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
}
