
import { X, Monitor, Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/hooks/use-theme";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg font-semibold">Configuración</CardTitle>
            <CardDescription>
              Personaliza la apariencia de la aplicación
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tema</Label>
            <RadioGroup 
              value={theme} 
              onValueChange={setTheme}
              className="space-y-2"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-ms-gray-50 dark:hover:bg-ms-gray-800 transition-colors">
                <RadioGroupItem value="light" id="light" />
                <Sun className="h-4 w-4 text-ms-gray-600" />
                <Label htmlFor="light" className="flex-1 cursor-pointer">
                  Claro
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-ms-gray-50 dark:hover:bg-ms-gray-800 transition-colors">
                <RadioGroupItem value="dark" id="dark" />
                <Moon className="h-4 w-4 text-ms-gray-600" />
                <Label htmlFor="dark" className="flex-1 cursor-pointer">
                  Oscuro
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-ms-gray-50 dark:hover:bg-ms-gray-800 transition-colors">
                <RadioGroupItem value="purple" id="purple" />
                <div className="h-4 w-4 bg-purple-500 rounded-full" />
                <Label htmlFor="purple" className="flex-1 cursor-pointer">
                  Morado
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-ms-gray-50 dark:hover:bg-ms-gray-800 transition-colors">
                <RadioGroupItem value="blue" id="blue" />
                <div className="h-4 w-4 bg-blue-600 rounded-full" />
                <Label htmlFor="blue" className="flex-1 cursor-pointer">
                  Azul
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-ms-gray-50 dark:hover:bg-ms-gray-800 transition-colors">
                <RadioGroupItem value="system" id="system" />
                <Monitor className="h-4 w-4 text-ms-gray-600" />
                <Label htmlFor="system" className="flex-1 cursor-pointer">
                  Sistema
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
