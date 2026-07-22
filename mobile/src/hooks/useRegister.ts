import { useState } from 'react';
import { register } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
  general?: string;
}

export function useRegister() {
  const { signIn } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});

  async function submit() {
    const newErrors: RegisterErrors = {};

    if (!name.trim()) newErrors.name = 'Informe o seu nome.';
    if (!email.trim()) newErrors.email = 'Informe o seu e-mail.';
    if (!password) newErrors.password = 'Informe uma senha.';
    if (!passwordConfirmation) {
      newErrors.passwordConfirmation = 'Confirme a sua senha.';
    } else if (password && password !== passwordConfirmation) {
      newErrors.passwordConfirmation = 'As senhas não coincidem.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const data = await register(name, email, password, passwordConfirmation);
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

  return {
    name, setName,
    email, setEmail,
    password, setPassword,
    passwordConfirmation, setPasswordConfirmation,
    loading, errors, submit,
  };
}
