import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Settings,
  X,
} from "lucide-react";

interface ServiceOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceOrderForm({
  isOpen,
  onClose,
}: ServiceOrderFormProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl border border-blue-500/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-3 justify-center">
            <Settings className="w-6 h-6 text-blue-400" />
            Функция в разработке
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
            <Settings className="w-8 h-8 text-blue-400 animate-spin" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">
              Создание договоров временно недоступно
            </h3>
            <p className="text-white/70 text-sm">
              Мы работаем над у��учшением этой функции. Пожалуйста, свяжитесь с нами напрямую для оформления заказа.
            </p>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Понятно
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
