import { renderHook, act } from '@testing-library/react-native';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ signIn: jest.fn() }),
}));

jest.mock('../services/auth', () => ({
  register: jest.fn(),
}));

import { useRegister } from '../hooks/useRegister';
import { register } from '../services/auth';

const mockRegister = register as jest.MockedFunction<typeof register>;

describe('useRegister – validação de campos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exibe erros em todos os campos quando formulário está vazio', async () => {
    const { result } = renderHook(() => useRegister());

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.errors.name).toBe('Informe o seu nome.');
    expect(result.current.errors.email).toBe('Informe o seu e-mail.');
    expect(result.current.errors.password).toBe('Informe uma senha.');
    expect(result.current.errors.passwordConfirmation).toBe('Confirme a sua senha.');
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('exibe erro de confirmação de senha quando senhas não coincidem', async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setName('João');
      result.current.setEmail('joao@example.com');
      result.current.setPassword('password123');
      result.current.setPasswordConfirmation('diferente');
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.errors.passwordConfirmation).toBe('As senhas não coincidem.');
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('não exibe erros quando todos os campos estão corretos', async () => {
    mockRegister.mockResolvedValueOnce({ user: { id: 1, name: 'João', email: 'joao@example.com' }, token: 'abc' } as any);

    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setName('João Silva');
      result.current.setEmail('joao@example.com');
      result.current.setPassword('password123');
      result.current.setPasswordConfirmation('password123');
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.errors.name).toBeUndefined();
    expect(result.current.errors.email).toBeUndefined();
    expect(result.current.errors.password).toBeUndefined();
    expect(result.current.errors.passwordConfirmation).toBeUndefined();
    expect(mockRegister).toHaveBeenCalledWith('João Silva', 'joao@example.com', 'password123', 'password123');
  });

  it('exibe somente erros dos campos faltantes (nome vazio)', async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setEmail('joao@example.com');
      result.current.setPassword('password123');
      result.current.setPasswordConfirmation('password123');
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.errors.name).toBe('Informe o seu nome.');
    expect(result.current.errors.email).toBeUndefined();
    expect(result.current.errors.password).toBeUndefined();
    expect(result.current.errors.passwordConfirmation).toBeUndefined();
  });

  it('exibe erro geral quando a API retorna erro de email duplicado', async () => {
    mockRegister.mockRejectedValueOnce({
      response: { data: { message: 'The email has already been taken.' } },
    });

    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setName('João');
      result.current.setEmail('joao@example.com');
      result.current.setPassword('password123');
      result.current.setPasswordConfirmation('password123');
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.errors.general).toBe('The email has already been taken.');
  });
});
