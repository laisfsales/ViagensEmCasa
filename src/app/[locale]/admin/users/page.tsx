'use client';

import React, { useEffect, useState } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  phone: string | null;
  birthDate: string | null;
  gender: string | null;
  accountStatus: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Verifica se o usuário está autenticado e se é administrador
    const checkAdminRole = async () => {
      const session = await getSession();
      if (!session) {
        router.push('/'); // Redireciona para a página inicial se o usuário não for administrador
      }
    };

    checkAdminRole();
  }, [router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/admin/users')
        .then((res) => {
          if (!res.ok) throw new Error('Erro ao buscar usuários');
          return res.json();
        })
        .then((data) => setUsers(data.users))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [status]);

  const handleToggleUserStatus = async (userId: string) => {
    if (!window.confirm('Tem certeza que deseja alterar o status da conta deste usuário?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Erro ao alterar status do usuário com ID ${userId}`);
      }

      const data = await response.json();
      const newStatus = data.newStatus;

      // Atualiza o estado dos usuários no frontend
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, accountStatus: newStatus } : user
        )
      );
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      setError('Ocorreu um erro ao alterar o status do usuário.');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  if (error) return <div className="flex items-center justify-center min-h-screen"><div className="alert alert-error"><span>{error}</span></div></div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8">Gestão de Usuários</h1>
      <div className="w-full max-w-4xl bg-base-100 shadow-xl rounded-lg">
        <table className="table w-full bg-base-100 shadow-xl rounded-lg">
          <thead>
            <tr>
              <th>Nome de Usuário</th>
              <th>Email</th>
              <th>Role</th>
              <th>Telefone</th>
              <th>Data de Nascimento</th>
              <th>Gênero</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username || 'N/A'}</td>
                <td>{user.email || 'N/A'}</td>
                <td>{user.role || 'N/A'}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>{user.birthDate || 'N/A'}</td>
                <td>{user.gender || 'N/A'}</td>
                <td>{user.accountStatus === 'healthy' ? 'Ativo' : 'Desabilitado'}</td>
                <td>
                  <button
                    onClick={() => handleToggleUserStatus(user.id)}
                    className={`btn btn-sm ${user.accountStatus === 'healthy' ? 'btn-error' : 'btn-primary'}`}
                  >
                    {user.accountStatus === 'healthy' ? 'Desabilitar' : 'Habilitar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
