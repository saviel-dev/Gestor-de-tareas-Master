
import { useState } from "react";
import { Check, Trash2, Edit3, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (id: string) => void;
  onTaskDelete: (id: string) => void;
  onTaskEdit: (task: Task) => void;
  filter: string;
}

export function TaskList({ tasks, onTaskToggle, onTaskDelete, onTaskEdit, filter }: TaskListProps) {
  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-ms-gray-100 text-ms-gray-700 border-ms-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Normal';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !tasks.find(t => t.dueDate === dueDate)?.completed;
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-ms-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-ms-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-ms-gray-900 mb-2">
            {filter === 'completed' ? '¡Excelente trabajo!' : 'No hay tareas'}
          </h3>
          <p className="text-ms-gray-500">
            {filter === 'completed' 
              ? 'Has completado todas tus tareas'
              : 'Agrega una nueva tarea para comenzar'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-lg border border-ms-gray-200 p-4 hover:shadow-md transition-all duration-200 animate-fade-in ${
              task.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => onTaskToggle(task.id)}
                className="mt-1 data-[state=checked]:bg-ms-blue-500 data-[state=checked]:border-ms-blue-500"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className={`font-medium text-ms-gray-900 mb-1 ${
                      task.completed ? 'line-through text-ms-gray-500' : ''
                    }`}>
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className={`text-sm text-ms-gray-600 mb-3 ${
                        task.completed ? 'line-through' : ''
                      }`}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPriorityColor(task.priority)}`}
                      >
                        {getPriorityLabel(task.priority)}
                      </Badge>
                      
                      {task.dueDate && (
                        <div className={`flex items-center gap-1 text-xs ${
                          isOverdue(task.dueDate) 
                            ? 'text-red-600' 
                            : 'text-ms-gray-500'
                        }`}>
                          <Calendar className="w-3 h-3" />
                          {formatDate(task.dueDate)}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1 text-xs text-ms-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatDate(task.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTaskEdit(task)}
                      className="h-8 w-8 p-0 text-ms-gray-500 hover:text-ms-blue-600 hover:bg-ms-blue-50"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTaskDelete(task.id)}
                      className="h-8 w-8 p-0 text-ms-gray-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
