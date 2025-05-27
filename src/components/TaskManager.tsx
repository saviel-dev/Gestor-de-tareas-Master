
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TaskSidebar } from "./TaskSidebar";
import { TaskList, Task } from "./TaskList";
import { TaskForm } from "./TaskForm";
import { toast } from "@/hooks/use-toast";
import { ThemeProvider } from "@/hooks/use-theme";

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Add some demo tasks
      const demoTasks: Task[] = [
        {
          id: '1',
          title: 'Revisar emails importantes',
          description: 'Responder a los emails pendientes del equipo de desarrollo',
          completed: false,
          priority: 'high',
          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Preparar presentación trimestral',
          description: 'Crear las diapositivas para la reunión del próximo viernes',
          completed: false,
          priority: 'medium',
          dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], // 3 days
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          title: 'Actualizar documentación del proyecto',
          completed: true,
          priority: 'low',
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
        }
      ];
      setTasks(demoTasks);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Tarea creada",
      description: "La tarea se ha agregado exitosamente.",
    });
  };

  const handleEditTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!editingTask) return;
    
    setTasks(prev => prev.map(task => 
      task.id === editingTask.id 
        ? { ...task, ...taskData }
        : task
    ));
    
    setEditingTask(null);
    toast({
      title: "Tarea actualizada",
      description: "Los cambios se han guardado exitosamente.",
    });
  };

  const handleTaskToggle = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: task.completed ? "Tarea marcada como pendiente" : "¡Tarea completada!",
        description: task.completed ? "La tarea ha sido marcada como pendiente." : "¡Excelente trabajo!",
      });
    }
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Tarea eliminada",
      description: "La tarea ha sido eliminada permanentemente.",
      variant: "destructive"
    });
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="task-manager-theme">
      <div className="flex h-screen bg-ms-gray-50 dark:bg-ms-gray-900">
        <TaskSidebar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          taskStats={taskStats}
        />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white dark:bg-ms-gray-800 border-b border-ms-gray-200 dark:border-ms-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-ms-gray-900 dark:text-ms-gray-100">
                  {activeFilter === 'all' && 'Todas las tareas'}
                  {activeFilter === 'pending' && 'Tareas pendientes'}
                  {activeFilter === 'completed' && 'Tareas completadas'}
                </h1>
                <p className="text-ms-gray-600 dark:text-ms-gray-400 mt-1">
                  {taskStats.pending} pendientes, {taskStats.completed} completadas
                </p>
              </div>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-ms-blue-500 hover:bg-ms-blue-600 text-white shadow-sm"
              >
                Nueva tarea
              </Button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ms-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar tareas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-ms-gray-300 focus:border-ms-blue-500 focus:ring-ms-blue-500 dark:border-ms-gray-600 dark:bg-ms-gray-700 dark:text-ms-gray-100"
              />
            </div>
          </div>

          {/* Task List */}
          <TaskList
            tasks={filteredTasks}
            onTaskToggle={handleTaskToggle}
            onTaskDelete={handleTaskDelete}
            onTaskEdit={handleEditClick}
            filter={activeFilter}
          />
        </div>

        {/* Task Form Modal */}
        <TaskForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          editingTask={editingTask}
        />
      </div>
    </ThemeProvider>
  );
}
