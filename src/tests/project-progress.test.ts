import { describe, it, expect } from 'vitest';

/**
 * Testes unitários para cálculo de progresso de projetos CBL
 * Simula a lógica de cálculo sem conexão ao banco
 */

type ProjectPhase = 'engage' | 'investigate' | 'act';

interface ProjectProgress {
  phase: ProjectPhase;
  engageComplete: boolean;
  investigateComplete: boolean;
  actComplete: boolean;
}

// Calcula a porcentagem de progresso do projeto
export const calculateProjectProgress = (project: ProjectProgress): number => {
  let completedPhases = 0;
  
  if (project.engageComplete) completedPhases++;
  if (project.investigateComplete) completedPhases++;
  if (project.actComplete) completedPhases++;
  
  return Math.round((completedPhases / 3) * 100);
};

// Determina qual a próxima fase do CBL
export const getNextPhase = (currentPhase: ProjectPhase, currentPhaseComplete: boolean): ProjectPhase | null => {
  if (!currentPhaseComplete) {
    return null; // Não pode avançar se a fase atual não está completa
  }
  
  if (currentPhase === 'engage') return 'investigate';
  if (currentPhase === 'investigate') return 'act';
  return null; // Já está na última fase
};

// Verifica se o projeto está completo (todas as 3 fases)
export const isProjectComplete = (project: ProjectProgress): boolean => {
  return project.engageComplete && 
         project.investigateComplete && 
         project.actComplete;
};

// Calcula quantas fases foram completadas
export const countCompletedPhases = (project: ProjectProgress): number => {
  let count = 0;
  if (project.engageComplete) count++;
  if (project.investigateComplete) count++;
  if (project.actComplete) count++;
  return count;
};

describe('Project Progress Calculator', () => {
  describe('calculateProjectProgress', () => {
    it('deve retornar 0% quando nenhuma fase está completa', () => {
      const project: ProjectProgress = {
        phase: 'engage',
        engageComplete: false,
        investigateComplete: false,
        actComplete: false
      };
      expect(calculateProjectProgress(project)).toBe(0);
    });

    it('deve retornar 33% quando apenas Engage está completa', () => {
      const project: ProjectProgress = {
        phase: 'investigate',
        engageComplete: true,
        investigateComplete: false,
        actComplete: false
      };
      expect(calculateProjectProgress(project)).toBe(33);
    });

    it('deve retornar 67% quando duas fases estão completas', () => {
      const project: ProjectProgress = {
        phase: 'act',
        engageComplete: true,
        investigateComplete: true,
        actComplete: false
      };
      expect(calculateProjectProgress(project)).toBe(67);
    });

    it('deve retornar 100% quando todas as fases estão completas', () => {
      const project: ProjectProgress = {
        phase: 'act',
        engageComplete: true,
        investigateComplete: true,
        actComplete: true
      };
      expect(calculateProjectProgress(project)).toBe(100);
    });
  });

  describe('getNextPhase', () => {
    it('deve retornar null se a fase atual não está completa', () => {
      expect(getNextPhase('engage', false)).toBeNull();
      expect(getNextPhase('investigate', false)).toBeNull();
    });

    it('deve retornar "investigate" após completar Engage', () => {
      expect(getNextPhase('engage', true)).toBe('investigate');
    });

    it('deve retornar "act" após completar Investigate', () => {
      expect(getNextPhase('investigate', true)).toBe('act');
    });

    it('deve retornar null após completar Act (última fase)', () => {
      expect(getNextPhase('act', true)).toBeNull();
    });
  });

  describe('isProjectComplete', () => {
    it('deve retornar false quando falta completar alguma fase', () => {
      expect(isProjectComplete({
        phase: 'engage',
        engageComplete: true,
        investigateComplete: false,
        actComplete: false
      })).toBe(false);
    });

    it('deve retornar true quando todas as fases estão completas', () => {
      expect(isProjectComplete({
        phase: 'act',
        engageComplete: true,
        investigateComplete: true,
        actComplete: true
      })).toBe(true);
    });
  });

  describe('countCompletedPhases', () => {
    it('deve contar corretamente as fases completas', () => {
      expect(countCompletedPhases({
        phase: 'engage',
        engageComplete: false,
        investigateComplete: false,
        actComplete: false
      })).toBe(0);

      expect(countCompletedPhases({
        phase: 'investigate',
        engageComplete: true,
        investigateComplete: false,
        actComplete: false
      })).toBe(1);

      expect(countCompletedPhases({
        phase: 'act',
        engageComplete: true,
        investigateComplete: true,
        actComplete: false
      })).toBe(2);

      expect(countCompletedPhases({
        phase: 'act',
        engageComplete: true,
        investigateComplete: true,
        actComplete: true
      })).toBe(3);
    });
  });
});
