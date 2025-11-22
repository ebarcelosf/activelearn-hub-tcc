import { describe, it, expect } from 'vitest';

/**
 * Testes unitários para sistema de nudges contextuais
 * Testa geração de dicas sem conexão ao banco
 */

type CBLPhase = 'engage' | 'investigate' | 'act';
type NudgeCategory = 'big_idea' | 'essential_question' | 'challenge' | 'guiding_questions' | 'resources' | 'solution' | 'implementation';

interface NudgeRequest {
  phase: CBLPhase;
  category: NudgeCategory;
}

// Banco de nudges por categoria
const NUDGES_DATABASE: Record<string, string[]> = {
  'big_idea': [
    'Pense em um tema amplo que conecta diferentes áreas do conhecimento',
    'Qual conceito fundamental você quer explorar?',
    'Considere questões relevantes para sua comunidade'
  ],
  'essential_question': [
    'Formule uma pergunta aberta que não tem resposta única',
    'A pergunta deve provocar pensamento crítico',
    'Evite perguntas que possam ser respondidas com sim ou não'
  ],
  'challenge': [
    'Descreva uma ação concreta que os alunos devem realizar',
    'O desafio deve ser específico e mensurável',
    'Conecte o desafio com situações reais'
  ],
  'guiding_questions': [
    'Decomponha o problema em perguntas menores',
    'Cada pergunta deve levar a uma investigação específica',
    'Garanta que as perguntas sejam pesquisáveis'
  ],
  'resources': [
    'Busque fontes acadêmicas e confiáveis',
    'Diversifique os tipos de recursos (artigos, vídeos, livros)',
    'Avalie criticamente a credibilidade de cada fonte'
  ],
  'solution': [
    'Descreva uma solução viável e criativa',
    'Considere recursos disponíveis e restrições',
    'Pense em como a solução impacta os stakeholders'
  ],
  'implementation': [
    'Divida a implementação em etapas claras',
    'Defina responsáveis e prazos realistas',
    'Considere riscos e planos de contingência'
  ]
};

// Obtém um nudge aleatório para uma categoria
export const getRandomNudge = (category: NudgeCategory): string | null => {
  const nudges = NUDGES_DATABASE[category];
  if (!nudges || nudges.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * nudges.length);
  return nudges[randomIndex];
};

// Obtém todos os nudges de uma categoria
export const getNudgesForCategory = (category: NudgeCategory): string[] => {
  return NUDGES_DATABASE[category] || [];
};

// Valida se uma categoria é válida para uma fase
export const isCategoryValidForPhase = (phase: CBLPhase, category: NudgeCategory): boolean => {
  const phaseCategories: Record<CBLPhase, NudgeCategory[]> = {
    'engage': ['big_idea', 'essential_question', 'challenge'],
    'investigate': ['guiding_questions', 'resources'],
    'act': ['solution', 'implementation']
  };
  
  return phaseCategories[phase].includes(category);
};

// Conta quantos nudges existem para uma categoria
export const countNudgesForCategory = (category: NudgeCategory): number => {
  return NUDGES_DATABASE[category]?.length || 0;
};

// Obtém categorias disponíveis para uma fase
export const getAvailableCategories = (phase: CBLPhase): NudgeCategory[] => {
  const phaseCategories: Record<CBLPhase, NudgeCategory[]> = {
    'engage': ['big_idea', 'essential_question', 'challenge'],
    'investigate': ['guiding_questions', 'resources'],
    'act': ['solution', 'implementation']
  };
  
  return phaseCategories[phase];
};

describe('Nudge System', () => {
  describe('getRandomNudge', () => {
    it('deve retornar um nudge válido para categoria existente', () => {
      const nudge = getRandomNudge('big_idea');
      expect(nudge).toBeTruthy();
      expect(typeof nudge).toBe('string');
    });

    it('deve retornar null para categoria inexistente', () => {
      const nudge = getRandomNudge('invalid_category' as NudgeCategory);
      expect(nudge).toBeNull();
    });

    it('deve retornar diferentes nudges em chamadas múltiplas (eventualmente)', () => {
      // Este teste pode falhar ocasionalmente devido à aleatoriedade
      // mas com múltiplas tentativas deve passar
      const nudges = new Set<string>();
      for (let i = 0; i < 20; i++) {
        const nudge = getRandomNudge('big_idea');
        if (nudge) nudges.add(nudge);
      }
      // Com 3 nudges disponíveis e 20 tentativas, deve pegar pelo menos 2 diferentes
      expect(nudges.size).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getNudgesForCategory', () => {
    it('deve retornar todos os nudges de uma categoria', () => {
      const nudges = getNudgesForCategory('big_idea');
      expect(nudges).toHaveLength(3);
      expect(nudges).toContain('Pense em um tema amplo que conecta diferentes áreas do conhecimento');
    });

    it('deve retornar array vazio para categoria inexistente', () => {
      const nudges = getNudgesForCategory('invalid' as NudgeCategory);
      expect(nudges).toEqual([]);
    });
  });

  describe('isCategoryValidForPhase', () => {
    it('deve validar categorias corretas para fase Engage', () => {
      expect(isCategoryValidForPhase('engage', 'big_idea')).toBe(true);
      expect(isCategoryValidForPhase('engage', 'essential_question')).toBe(true);
      expect(isCategoryValidForPhase('engage', 'challenge')).toBe(true);
    });

    it('deve invalidar categorias incorretas para fase Engage', () => {
      expect(isCategoryValidForPhase('engage', 'resources')).toBe(false);
      expect(isCategoryValidForPhase('engage', 'solution')).toBe(false);
    });

    it('deve validar categorias corretas para fase Investigate', () => {
      expect(isCategoryValidForPhase('investigate', 'guiding_questions')).toBe(true);
      expect(isCategoryValidForPhase('investigate', 'resources')).toBe(true);
    });

    it('deve validar categorias corretas para fase Act', () => {
      expect(isCategoryValidForPhase('act', 'solution')).toBe(true);
      expect(isCategoryValidForPhase('act', 'implementation')).toBe(true);
    });
  });

  describe('countNudgesForCategory', () => {
    it('deve contar nudges corretamente', () => {
      expect(countNudgesForCategory('big_idea')).toBe(3);
      expect(countNudgesForCategory('essential_question')).toBe(3);
      expect(countNudgesForCategory('resources')).toBe(3);
    });

    it('deve retornar 0 para categoria inexistente', () => {
      expect(countNudgesForCategory('invalid' as NudgeCategory)).toBe(0);
    });
  });

  describe('getAvailableCategories', () => {
    it('deve retornar categorias corretas para Engage', () => {
      const categories = getAvailableCategories('engage');
      expect(categories).toEqual(['big_idea', 'essential_question', 'challenge']);
    });

    it('deve retornar categorias corretas para Investigate', () => {
      const categories = getAvailableCategories('investigate');
      expect(categories).toEqual(['guiding_questions', 'resources']);
    });

    it('deve retornar categorias corretas para Act', () => {
      const categories = getAvailableCategories('act');
      expect(categories).toEqual(['solution', 'implementation']);
    });
  });
});
