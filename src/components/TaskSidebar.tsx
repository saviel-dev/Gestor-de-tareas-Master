
import { Home, CheckSquare, Calendar, Archive, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Settings as SettingsModal } from "./Settings";

interface TaskSidebarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  taskStats: {
    total: number;
    pending: number;
    completed: number;
  };
}

export function TaskSidebar({ activeFilter, onFilterChange, taskStats }: TaskSidebarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const menuItems = [
    { id: 'all', label: 'Todas las tareas', icon: Home, count: taskStats.total },
    { id: 'pending', label: 'Pendientes', icon: CheckSquare, count: taskStats.pending },
    { id: 'completed', label: 'Completadas', icon: Archive, count: taskStats.completed },
  ];

  return (
    <>
      <div className="w-80 h-screen bg-ms-gray-50 dark:bg-ms-gray-900 border-r border-ms-gray-200 dark:border-ms-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-ms-gray-200 dark:border-ms-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-ms-blue-500 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-ms-gray-900 dark:text-ms-gray-100">Task Master</h1>
          </div>
          <Button 
            className="w-full bg-ms-blue-500 hover:bg-ms-blue-600 text-white rounded-lg shadow-sm transition-all duration-200"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva tarea
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onFilterChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-left rounded-lg transition-all duration-200 ${
                  activeFilter === item.id
                    ? 'bg-ms-blue-100 text-ms-blue-700 border border-ms-blue-200 dark:bg-ms-blue-900 dark:text-ms-blue-300 dark:border-ms-blue-600'
                    : 'text-ms-gray-700 hover:bg-ms-gray-100 dark:text-ms-gray-300 dark:hover:bg-ms-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className={`text-sm px-2 py-0.5 rounded-full ${
                  activeFilter === item.id
                    ? 'bg-ms-blue-200 text-ms-blue-800 dark:bg-ms-blue-800 dark:text-ms-blue-200'
                    : 'bg-ms-gray-200 text-ms-gray-600 dark:bg-ms-gray-700 dark:text-ms-gray-400'
                }`}>
                  {item.count}
                </span>
              </button>
            ))}
          </nav>

          <Separator className="my-6 bg-ms-gray-200 dark:bg-ms-gray-700" />

          {/* Settings */}
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg text-ms-gray-700 hover:bg-ms-gray-100 dark:text-ms-gray-300 dark:hover:bg-ms-gray-800 transition-all duration-200"
          >
            <Settings className="w-4 h-4" />
            <span className="font-medium">Configuración</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-ms-gray-200 dark:border-ms-gray-700 bg-white dark:bg-ms-gray-800">
          <div className="text-xs text-ms-gray-500 dark:text-ms-gray-400 text-center">
            Task Master v1.0
          </div>
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}
