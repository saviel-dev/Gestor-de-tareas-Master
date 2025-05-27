
import { useState, useEffect } from "react";
import { X, Calendar, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from "./TaskList";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  editingTask?: Task | null;
}

export function TaskForm({ isOpen, onClose, onSubmit, editingTask }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    completed: false
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || '',
        priority: editingTask.priority,
        dueDate: editingTask.dueDate || '',
        completed: editingTask.completed
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        completed: false
      });
    }
  }, [editingTask, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      dueDate: formData.dueDate || undefined,
      completed: formData.completed
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-ms-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 animate-fade-in border border-ms-gray-200 dark:border-ms-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ms-gray-200 dark:border-ms-gray-700">
          <h2 className="text-lg font-semibold text-ms-gray-900 dark:text-ms-gray-100">
            {editingTask ? 'Editar tarea' : 'Nueva tarea'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-ms-gray-500 hover:text-ms-gray-700 dark:text-ms-gray-400 dark:hover:text-ms-gray-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-ms-gray-700 dark:text-ms-gray-300 mb-2">
              Título *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="¿Qué necesitas hacer?"
              className="w-full border-ms-gray-300 dark:border-ms-gray-600 dark:bg-ms-gray-700 dark:text-ms-gray-100 focus:border-ms-blue-500 focus:ring-ms-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-ms-gray-700 dark:text-ms-gray-300 mb-2">
              Descripción
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Agrega más detalles..."
              rows={3}
              className="w-full border-ms-gray-300 dark:border-ms-gray-600 dark:bg-ms-gray-700 dark:text-ms-gray-100 focus:border-ms-blue-500 focus:ring-ms-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-ms-gray-700 dark:text-ms-gray-300 mb-2">
                <Flag className="w-4 h-4 inline mr-1" />
                Prioridad
              </label>
              <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData({ ...formData, priority: value })}>
                <SelectTrigger className="w-full border-ms-gray-300 dark:border-ms-gray-600 dark:bg-ms-gray-700 dark:text-ms-gray-100 focus:border-ms-blue-500 focus:ring-ms-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-ms-gray-700 dark:border-ms-gray-600">
                  <SelectItem value="low" className="dark:text-ms-gray-100 dark:focus:bg-ms-gray-600">Baja</SelectItem>
                  <SelectItem value="medium" className="dark:text-ms-gray-100 dark:focus:bg-ms-gray-600">Media</SelectItem>
                  <SelectItem value="high" className="dark:text-ms-gray-100 dark:focus:bg-ms-gray-600">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-ms-gray-700 dark:text-ms-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha límite
              </label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full border-ms-gray-300 dark:border-ms-gray-600 dark:bg-ms-gray-700 dark:text-ms-gray-100 focus:border-ms-blue-500 focus:ring-ms-blue-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-ms-gray-300 text-ms-gray-700 hover:bg-ms-gray-50 dark:border-ms-gray-600 dark:text-ms-gray-300 dark:hover:bg-ms-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-ms-blue-500 hover:bg-ms-blue-600 text-white"
            >
              {editingTask ? 'Actualizar' : 'Crear tarea'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
