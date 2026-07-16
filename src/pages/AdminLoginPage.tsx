import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LockKeyhole } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [secret, setSecret] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret.trim()) {
      toast.error('Введите секретный ключ');
      return;
    }
    
    // Save to local storage and redirect
    localStorage.setItem('adminSecret', secret.trim());
    toast.success('Авторизация успешна');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <LockKeyhole className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Панель Администратора</CardTitle>
          <CardDescription>
            Введите секретный ключ администратора (Admin Secret) для доступа к управлению системой.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input 
                type="password"
                placeholder="Секретный ключ..."
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full">
              Войти в Панель
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
