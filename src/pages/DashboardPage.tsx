import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-3xl mb-4">Welcome, {user?.username || user?.email}!</h1>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
