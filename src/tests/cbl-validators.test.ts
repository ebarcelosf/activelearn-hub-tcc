import { describe, it, expect } from 'vitest';

/**
 * Testes unitários para validação de dados do CBL
 * Testa lógica de validação sem dependências externas
 */

// Função que valida se uma Big Idea está completa
export const isValidBigIdea = (bigIdea: string | null | undefined): boolean => {
  if (!bigIdea) return false;
  return bigIdea.trim().length >= 10; // Mínimo 10 caracteres
};

// Função que valida se uma Essential Question está completa
export const isValidEssentialQuestion = (question: string | null | undefined): boolean => {
  if (!question) return false;
  const trimmed = question.trim();
  return trimmed.length >= 10 && trimmed.includes('?');
};

// Função que valida se um Challenge está completo
export const isValidChallenge = (challenge: string | null | undefined): boolean => {
  if (!challenge) return false;
  return challenge.trim().length >= 15;
};

// Função que valida se a fase Engage está completa
export const isEngagePhaseComplete = (
  bigIdea: string | null | undefined,
  essentialQuestion: string | null | undefined,
  challenge: string | null | undefined
): boolean => {
  return isValidBigIdea(bigIdea) && 
         isValidEssentialQuestion(essentialQuestion) && 
         isValidChallenge(challenge);
};

describe('CBL Validators', () => {
  describe('isValidBigIdea', () => {
    it('deve retornar false para big idea vazia', () => {
      expect(isValidBigIdea('')).toBe(false);
      expect(isValidBigIdea(null)).toBe(false);
      expect(isValidBigIdea(undefined)).toBe(false);
    });

    it('deve retornar false para big idea muito curta', () => {
      expect(isValidBigIdea('Curta')).toBe(false);
      expect(isValidBigIdea('12345')).toBe(false);
    });

    it('deve retornar true para big idea válida', () => {
      expect(isValidBigIdea('Esta é uma grande ideia válida')).toBe(true);
      expect(isValidBigIdea('Sustentabilidade ambiental nas escolas')).toBe(true);
    });
  });

  describe('isValidEssentialQuestion', () => {
    it('deve retornar false para pergunta vazia', () => {
      expect(isValidEssentialQuestion('')).toBe(false);
      expect(isValidEssentialQuestion(null)).toBe(false);
    });

    it('deve retornar false para pergunta sem interrogação', () => {
      expect(isValidEssentialQuestion('Esta não é uma pergunta')).toBe(false);
    });

    it('deve retornar false para pergunta muito curta', () => {
      expect(isValidEssentialQuestion('Por quê?')).toBe(false);
    });

    it('deve retornar true para pergunta válida', () => {
      expect(isValidEssentialQuestion('Como podemos reduzir o desperdício de alimentos?')).toBe(true);
      expect(isValidEssentialQuestion('Qual é o impacto da tecnologia na educação?')).toBe(true);
    });
  });

  describe('isValidChallenge', () => {
    it('deve retornar false para challenge vazio', () => {
      expect(isValidChallenge('')).toBe(false);
      expect(isValidChallenge(null)).toBe(false);
    });

    it('deve retornar false para challenge muito curto', () => {
      expect(isValidChallenge('Muito curto')).toBe(false);
    });

    it('deve retornar true para challenge válido', () => {
      expect(isValidChallenge('Criar uma solução para reduzir desperdício alimentar')).toBe(true);
    });
  });

  describe('isEngagePhaseComplete', () => {
    it('deve retornar false se algum campo estiver inválido', () => {
      expect(isEngagePhaseComplete('Big idea válida', null, 'Challenge válido aqui')).toBe(false);
      expect(isEngagePhaseComplete(null, 'Pergunta válida?', 'Challenge válido aqui')).toBe(false);
    });

    it('deve retornar true quando todos os campos são válidos', () => {
      const valid = isEngagePhaseComplete(
        'Sustentabilidade na escola',
        'Como podemos ser mais sustentáveis?',
        'Desenvolver um plano de reciclagem na escola'
      );
      expect(valid).toBe(true);
    });
  });
});
