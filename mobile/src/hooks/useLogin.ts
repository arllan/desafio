import { useState } from 'react';
import { login } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function useLogin() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  async function submit() {
    const newErrors: LoginErrors = {};

    if (!email.trim()) newErrors.email = 'Informe o seu e-mail.';
    if (!password) newErrors.password = 'Informe a sua senha.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const data = await login(email, password);
      signIn(data.user);
    } catch (err) {
      const message =
        (err as any)?.response?.data?.message ??
        (err as any)?.response?.data?.errors?.[
          Object.keys((err as any)?.response?.data?.errors ?? {})[0]
        ]?.[0] ??
        'Erro ao processar requisição.';
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  }

  return { email, setEmail, password, setPassword, loading, errors, submit };
}
