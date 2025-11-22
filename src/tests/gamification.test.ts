import { describe, it, expect } from 'vitest';

/**
 * Testes unitários para sistema de gamificação
 * Testa cálculos de XP, níveis e badges sem banco de dados
 */

interface Badge {
  id: string;
  name: string;
  xp: number;
}

// XP necessário para cada nível (baseado na documentação do projeto)
const XP_PER_LEVEL = [
  0,    // Nível 1
  100,  // Nível 2
  250,  // Nível 3
  500,  // Nível 4
  1000  // Nível 5
];

// Calcula o nível do usuário baseado no XP total
export const calculateUserLevel = (totalXP: number): number => {
  for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
    if (totalXP >= XP_PER_LEVEL[i]) {
      return i + 1;
    }
  }
  return 1; // Nível mínimo
};

// Calcula XP necessário para o próximo nível
export const xpToNextLevel = (totalXP: number): number => {
  const currentLevel = calculateUserLevel(totalXP);
  
  if (currentLevel >= 5) {
    return 0; // Já está no nível máximo
  }
  
  const nextLevelXP = XP_PER_LEVEL[currentLevel];
  return nextLevelXP - totalXP;
};

// Calcula progresso percentual para o próximo nível
export const levelProgressPercentage = (totalXP: number): number => {
  const currentLevel = calculateUserLevel(totalXP);
  
  if (currentLevel >= 5) {
    return 100; // Nível máximo alcançado
  }
  
  const currentLevelXP = XP_PER_LEVEL[currentLevel - 1];
  const nextLevelXP = XP_PER_LEVEL[currentLevel];
  const xpInCurrentLevel = totalXP - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  
  return Math.round((xpInCurrentLevel / xpNeededForLevel) * 100);
};

// Calcula XP total de uma lista de badges
export const calculateTotalXP = (badges: Badge[]): number => {
  return badges.reduce((total, badge) => total + badge.xp, 0);
};

// Verifica se usuário desbloqueou badge de "Mestre CBL"
export const hasCompletedAllPhases = (
  engageComplete: boolean,
  investigateComplete: boolean,
  actComplete: boolean
): boolean => {
  return engageComplete && investigateComplete && actComplete;
};

describe('Gamification System', () => {
  describe('calculateUserLevel', () => {
    it('deve retornar nível 1 para 0 XP', () => {
      expect(calculateUserLevel(0)).toBe(1);
    });

    it('deve retornar nível 1 para XP menor que 100', () => {
      expect(calculateUserLevel(50)).toBe(1);
      expect(calculateUserLevel(99)).toBe(1);
    });

    it('deve retornar nível 2 para XP entre 100 e 249', () => {
      expect(calculateUserLevel(100)).toBe(2);
      expect(calculateUserLevel(200)).toBe(2);
      expect(calculateUserLevel(249)).toBe(2);
    });

    it('deve retornar nível 3 para XP entre 250 e 499', () => {
      expect(calculateUserLevel(250)).toBe(3);
      expect(calculateUserLevel(400)).toBe(3);
    });

    it('deve retornar nível 4 para XP entre 500 e 999', () => {
      expect(calculateUserLevel(500)).toBe(4);
      expect(calculateUserLevel(750)).toBe(4);
    });

    it('deve retornar nível 5 para XP >= 1000', () => {
      expect(calculateUserLevel(1000)).toBe(5);
      expect(calculateUserLevel(2000)).toBe(5);
    });
  });

  describe('xpToNextLevel', () => {
    it('deve calcular XP faltante corretamente', () => {
      expect(xpToNextLevel(0)).toBe(100);    // Faltam 100 para nível 2
      expect(xpToNextLevel(50)).toBe(50);     // Faltam 50 para nível 2
      expect(xpToNextLevel(100)).toBe(150);   // Faltam 150 para nível 3
      expect(xpToNextLevel(250)).toBe(250);   // Faltam 250 para nível 4
    });

    it('deve retornar 0 quando está no nível máximo', () => {
      expect(xpToNextLevel(1000)).toBe(0);
      expect(xpToNextLevel(2000)).toBe(0);
    });
  });

  describe('levelProgressPercentage', () => {
    it('deve calcular progresso 0% no início do nível', () => {
      expect(levelProgressPercentage(0)).toBe(0);
      expect(levelProgressPercentage(100)).toBe(0);
      expect(levelProgressPercentage(250)).toBe(0);
    });

    it('deve calcular progresso 50% na metade do nível', () => {
      expect(levelProgressPercentage(50)).toBe(50);   // 50/100 = 50%
      expect(levelProgressPercentage(175)).toBe(50);  // 75/150 = 50%
    });

    it('deve calcular progresso 100% no nível máximo', () => {
      expect(levelProgressPercentage(1000)).toBe(100);
      expect(levelProgressPercentage(5000)).toBe(100);
    });
  });

  describe('calculateTotalXP', () => {
    it('deve retornar 0 para lista vazia de badges', () => {
      expect(calculateTotalXP([])).toBe(0);
    });

    it('deve calcular XP total corretamente', () => {
      const badges: Badge[] = [
        { id: '1', name: 'Explorador', xp: 50 },
        { id: '2', name: 'Pesquisador', xp: 100 },
        { id: '3', name: 'Inovador', xp: 150 }
      ];
      expect(calculateTotalXP(badges)).toBe(300);
    });

    it('deve funcionar com um único badge', () => {
      const badges: Badge[] = [
        { id: '1', name: 'Primeiro Passo', xp: 25 }
      ];
      expect(calculateTotalXP(badges)).toBe(25);
    });
  });

  describe('hasCompletedAllPhases', () => {
    it('deve retornar false se alguma fase não está completa', () => {
      expect(hasCompletedAllPhases(true, false, false)).toBe(false);
      expect(hasCompletedAllPhases(true, true, false)).toBe(false);
      expect(hasCompletedAllPhases(false, false, false)).toBe(false);
    });

    it('deve retornar true quando todas as fases estão completas', () => {
      expect(hasCompletedAllPhases(true, true, true)).toBe(true);
    });
  });
});
