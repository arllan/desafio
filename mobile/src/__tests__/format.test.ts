import { formatBRL, formatBTC, formatDate } from '../utils/format';

describe('formatBRL', () => {
  it('formata valor inteiro em reais', () => {
    const result = formatBRL(1000);
    expect(result).toContain('1.000');
    expect(result).toContain('R$');
  });

  it('formata valor decimal em reais', () => {
    const result = formatBRL('9000.50');
    expect(result).toContain('9.000');
  });

  it('formata zero corretamente', () => {
    const result = formatBRL(0);
    expect(result).toContain('0');
    expect(result).toContain('R$');
  });

  it('aceita string numérica', () => {
    const result = formatBRL('10000.00');
    expect(result).toContain('10.000');
  });
});

describe('formatBTC', () => {
  it('formata valor com 8 casas decimais', () => {
    expect(formatBTC(0.004)).toBe('0.00400000 BTC');
  });

  it('formata zero com 8 casas decimais', () => {
    expect(formatBTC(0)).toBe('0.00000000 BTC');
  });

  it('aceita string numérica', () => {
    expect(formatBTC('0.00100000')).toBe('0.00100000 BTC');
  });

  it('inclui sufixo BTC', () => {
    const result = formatBTC(0.1);
    expect(result).toMatch(/BTC$/);
  });
});

describe('formatDate', () => {
  it('retorna string de data formatada', () => {
    const result = formatDate('2024-01-15T10:30:00.000Z');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('inclui dia e mês no resultado', () => {
    const result = formatDate('2024-06-20T08:00:00.000Z');
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});
