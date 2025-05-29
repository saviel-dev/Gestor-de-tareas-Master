
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
  completed: boolean;
  createdAt: string;
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleFormSubmit = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      // Update existing task
      setTasks(
        tasks.map((t) => (t.id === editingTask.id ? { ...taskData, id: editingTask.id, createdAt: editingTask.createdAt } : t))
      );
      setEditingTask(null);
    } else {
      // Add new task
      handleAddTask(taskData);
    }
    setIsFormOpen(false);
  };

  const handleTaskToggle = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    return { total, completed, pending };
  };

  return (
    <ThemeProvider defaultMode="system" defaultColor="default" storageKey="task-manager-theme">
      <div className="flex h-screen bg-background">
        <TaskSidebar 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          taskStats={getTaskStats()}
          tasks={tasks}
          onAddTask={() => setIsFormOpen(true)}
        />
        
        <div className="flex-1 flex flex-col">
          <TaskList 
            tasks={tasks}
            onTaskEdit={handleEditTask}
            onTaskDelete={handleDeleteTask}
            onTaskToggle={handleTaskToggle}
            filter={activeFilter}
          />
        </div>

        {isFormOpen && (
          <TaskForm
            isOpen={isFormOpen}
            task={editingTask}
            onSubmit={handleFormSubmit}
            onClose={() => {
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
