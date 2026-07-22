import { renderHook, act } from '@testing-library/react-native';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ signIn: jest.fn() }),
}));

jest.mock('../services/auth', () => ({
  login: jest.fn(),
}));

import { useLogin } from '../hooks/useLogin';
import { login } from '../services/auth';

const mockLogin = login as jest.MockedFunction<typeof login>;

describe('useLogin – validação de campos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exibe erro quando e-mail e senha estão vazios', async () => {
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.errors.email).toBe('Informe o seu e-mail.');
    expect(result.current.errors.password).toBe('Informe a sua senha.');
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('exibe erro apenas para e-mail quando senha está preenchida', async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setPassword('minhasenha');
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.errors.email).toBe('Informe o seu e-mail.');
    expect(result.current.errors.password).toBeUndefined();
  });

  it('exibe erro apenas para senha quando e-mail está preenchido', async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setEmail('joao@example.com');
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.errors.email).toBeUndefined();
    expect(result.current.errors.password).toBe('Informe a sua senha.');
  });

  it('não exibe erros de validação quando campos estão preenchidos', async () => {
    mockLogin.mockResolvedValueOnce({ user: { id: 1, name: 'João', email: 'joao@example.com' }, token: 'abc' } as any);

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setEmail('joao@example.com');
      result.current.setPassword('password123');
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.errors.email).toBeUndefined();
    expect(result.current.errors.password).toBeUndefined();
    expect(mockLogin).toHaveBeenCalledWith('joao@example.com', 'password123');
  });

  it('exibe erro geral quando a API retorna 401', async () => {
    mockLogin.mockRejectedValueOnce({
      response: { data: { message: 'Credenciais inválidas.' } },
    });

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setEmail('joao@example.com');
      result.current.setPassword('senha-errada');
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.errors.general).toBe('Credenciais inválidas.');
  });

  it('loading é false após a requisição', async () => {
    let resolveLogin!: (value: any) => void;
    mockLogin.mockImplementationOnce(
      () => new Promise((res) => { resolveLogin = res; })
    );

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setEmail('joao@example.com');
      result.current.setPassword('password123');
    });

    const submitPromise = act(async () => {
      result.current.submit();
    });

    resolveLogin({ user: { id: 1, name: 'João', email: 'joao@example.com' }, token: 'abc' });
    await submitPromise;

    expect(result.current.loading).toBe(false);
  });
});
