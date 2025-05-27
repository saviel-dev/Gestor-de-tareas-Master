
import { useState } from "react";
import { X, Phone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "./TaskList";

interface ShareTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

export function ShareTasksModal({ isOpen, onClose, tasks }: ShareTasksModalProps) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleTaskToggle = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleConfirm = () => {
    if (selectedTasks.length > 0 && phoneNumber.trim()) {
      setShowConfirmation(true);
    }
  };

  const handleSendWhatsApp = () => {
    const selectedTasksList = tasks.filter(task => selectedTasks.includes(task.id));
    let message = "📋 *Tareas compartidas:*\n\n";
    
    selectedTasksList.forEach((task, index) => {
      const priorityIcon = task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢';
      const status = task.completed ? '✅' : '⏳';
      message += `${index + 1}. ${status} ${priorityIcon} *${task.title}*\n`;
      if (task.description) {
        message += `   📝 ${task.description}\n`;
      }
      if (task.dueDate) {
        message += `   📅 Fecha límite: ${new Date(task.dueDate).toLocaleDateString()}\n`;
      }
      message += '\n';
    });
    
    message += "Enviado desde Gestor de tareas JH";
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    onClose();
    setShowConfirmation(false);
    setSelectedTasks([]);
    setPhoneNumber('');
  };

  const handleClose = () => {
    onClose();
    setShowConfirmation(false);
    setSelectedTasks([]);
    setPhoneNumber('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-ms-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 animate-fade-in border border-ms-gray-200 dark:border-ms-gray-700 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ms-gray-200 dark:border-ms-gray-700">
          <h2 className="text-lg font-semibold text-ms-gray-900 dark:text-ms-gray-100">
            {showConfirmation ? 'Confirmar envío' : 'Compartir tareas'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 text-ms-gray-500 hover:text-ms-gray-700 dark:text-ms-gray-400 dark:hover:text-ms-gray-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {!showConfirmation ? (
          <div className="p-6 flex-1 overflow-auto">
            {/* Phone Input */}
            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-ms-gray-700 dark:text-ms-gray-300 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Número de WhatsApp
              </label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+58 412 270 0603"
                className="w-full border-ms-gray-300 dark:border-ms-gray-600 dark:bg-ms-gray-700 dark:text-ms-gray-100"
              />
            </div>

            {/* Tasks List */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-ms-gray-700 dark:text-ms-gray-300 mb-3">
                Seleccionar tareas para compartir
              </label>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-start space-x-3 p-3 rounded-lg border border-ms-gray-200 dark:border-ms-gray-600 hover:bg-ms-gray-50 dark:hover:bg-ms-gray-700">
                    <Checkbox
                      checked={selectedTasks.includes(task.id)}
                      onCheckedChange={() => handleTaskToggle(task.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${task.completed ? 'line-through text-ms-gray-500 dark:text-ms-gray-400' : 'text-ms-gray-900 dark:text-ms-gray-100'}`}>
                          {task.title}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-xs text-ms-gray-600 dark:text-ms-gray-400 mt-1">{task.description}</p>
                      )}
                      {task.dueDate && (
                        <p className="text-xs text-ms-gray-500 dark:text-ms-gray-500 mt-1">
                          📅 {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleConfirm}
              disabled={selectedTasks.length === 0 || !phoneNumber.trim()}
              className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              Continuar ({selectedTasks.length} tareas seleccionadas)
            </Button>
          </div>
        ) : (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-ms-gray-900 dark:text-ms-gray-100 mb-2">
                ¿Enviar tareas por WhatsApp?
              </h3>
              <p className="text-sm text-ms-gray-600 dark:text-ms-gray-400">
                Se enviarán {selectedTasks.length} tareas a {phoneNumber}
              </p>
            </div>

            <div className="space-y-2 mb-6 max-h-40 overflow-y-auto">
              {tasks.filter(task => selectedTasks.includes(task.id)).map((task) => (
                <div key={task.id} className="flex items-center gap-2 p-2 bg-ms-gray-50 dark:bg-ms-gray-700 rounded">
                  <span className="text-sm text-ms-gray-900 dark:text-ms-gray-100">{task.title}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="flex-1"
              >
                Volver
              </Button>
              <Button
                onClick={handleSendWhatsApp}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Confirmar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
