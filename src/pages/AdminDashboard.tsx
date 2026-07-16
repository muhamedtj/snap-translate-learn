import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { LogOut, Users, Settings, Trash2, KeyRound, Plus } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // New cohort state
  const [newCohortName, setNewCohortName] = useState('');
  const [newCohortPromo, setNewCohortPromo] = useState('');
  
  // Search state
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    const secret = localStorage.getItem('adminSecret');
    if (!secret) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, []);

  const getHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'X-Admin-Secret': localStorage.getItem('adminSecret') || ''
    };
  };

  const handleApiError = (e: any) => {
    if (e.message === '403') {
      toast.error('Неверный секретный ключ. Авторизуйтесь заново.');
      localStorage.removeItem('adminSecret');
      navigate('/admin');
    } else {
      toast.error(e.message || 'Произошла ошибка при запросе');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const usersRes = await fetch(`${API_BASE_URL}/admin/users`, { headers: getHeaders() });
      if (usersRes.status === 403) throw new Error('403');
      const usersData = await usersRes.json();
      if (usersData.status === 'success') {
        setUsers(usersData.users);
      }
      
      // Fetch cohorts
      const cohortsRes = await fetch(`${API_BASE_URL}/admin/cohorts`, { headers: getHeaders() });
      if (cohortsRes.status === 403) throw new Error('403');
      const cohortsData = await cohortsRes.json();
      if (cohortsData.status === 'success') {
        setCohorts(cohortsData.cohorts);
      }
    } catch (e: any) {
      handleApiError(e);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (userId: string) => {
    const newPassword = prompt('Введите новый пароль для этого пользователя:');
    if (!newPassword) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ new_password: newPassword })
      });
      if (res.status === 403) throw new Error('403');
      const data = await res.json();
      if (data.status === 'success') {
        toast.success('Пароль успешно изменен');
      } else {
        throw new Error(data.detail);
      }
    } catch (e: any) {
      handleApiError(e);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя? Все его данные будут удалены безвозвратно.')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.status === 403) throw new Error('403');
      const data = await res.json();
      if (data.status === 'success') {
        toast.success('Пользователь удален');
        fetchData();
      } else {
        throw new Error(data.detail);
      }
    } catch (e: any) {
      handleApiError(e);
    }
  };

  const createCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCohortName.trim() || !newCohortPromo.trim()) {
      toast.error('Заполните название и промокод');
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE_URL}/admin/cohorts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name: newCohortName, promo_code: newCohortPromo, description: '' })
      });
      if (res.status === 403) throw new Error('403');
      const data = await res.json();
      
      if (data.status === 'success') {
        toast.success('Группа создана!');
        setNewCohortName('');
        setNewCohortPromo('');
        fetchData();
      } else {
        throw new Error(data.detail);
      }
    } catch (e: any) {
      handleApiError(e);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminSecret');
    navigate('/admin');
  };

  const filteredUsers = users.filter(u => 
    (u.username || '').toLowerCase().includes(userSearch.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) || 
    (u.id || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">LingoSnap Админ Панель</h1>
          </div>
          <Button variant="outline" onClick={logout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Выйти
          </Button>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="cohorts">Группы (Когорты)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Все пользователи</h2>
              <Input 
                placeholder="Поиск по имени, email или ID..." 
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="max-w-xs"
              />
            </div>
            
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4">Имя / Email</th>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Тип</th>
                      <th className="px-6 py-4">Группа (ID)</th>
                      <th className="px-6 py-4">XP</th>
                      <th className="px-6 py-4 text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold">{user.username || 'Без имени'}</div>
                          <div className="text-gray-500">{user.email || 'Нет Email'}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">{user.id}</td>
                        <td className="px-6 py-4">
                          {user.is_guest ? (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Гость</span>
                          ) : (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Юзер</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500">{user.cohort_id || '—'}</td>
                        <td className="px-6 py-4 font-bold">{user.xp} XP</td>
                        <td className="px-6 py-4 flex justify-end gap-2">
                          {!user.is_guest && (
                            <Button size="sm" variant="outline" onClick={() => resetPassword(user.id)} title="Сбросить пароль">
                              <KeyRound className="w-4 h-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => deleteUser(user.id)} title="Удалить пользователя">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Пользователи не найдены</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cohorts" className="space-y-6 mt-6">
            <h2 className="text-xl font-bold">Управление Учебными Группами</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Создать новую группу</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createCohort} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Название (для пользователей)</label>
                      <Input 
                        placeholder="Например: Школа 2026 А класс" 
                        value={newCohortName}
                        onChange={e => setNewCohortName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Промокод</label>
                      <Input 
                        placeholder="SCHOOL2026A" 
                        value={newCohortPromo}
                        onChange={e => setNewCohortPromo(e.target.value)}
                        className="uppercase"
                      />
                    </div>
                    <Button type="submit" className="w-full gap-2">
                      <Plus className="w-4 h-4" />
                      Создать Группу
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <div className="md:col-span-2">
                <div className="bg-white rounded-xl border overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Название</th>
                        <th className="px-6 py-4">Промокод</th>
                        <th className="px-6 py-4">Дата создания</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cohorts.map((c) => (
                        <tr key={c.id} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-mono text-xs">{c.id}</td>
                          <td className="px-6 py-4 font-semibold">{c.name}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-primary/10 text-primary font-mono rounded font-bold">
                              {c.promo_code}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {new Date(c.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                      {cohorts.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Группы пока не созданы</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
