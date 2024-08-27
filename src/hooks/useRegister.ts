import { useState } from 'react';

export const useRegister = (
  handleCloseModal: () => void,
  switchToLogin: () => void
) => {
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!username || !email || !password || !confirmPassword) {
      setMessage('Todos os campos devem ser preenchidos');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Usuário registrado com sucesso');
        handleCloseModal();
        switchToLogin();
      } else {
        setMessage(data.error || 'Algo deu errado');
      }
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      setMessage('Falha ao registrar o usuário. Tente novamente mais tarde.');
    }
  };

  return { message, handleSubmit };
};
