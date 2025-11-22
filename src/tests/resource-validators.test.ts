import { describe, it, expect } from 'vitest';

/**
 * Testes unitários para validação de recursos e atividades
 * Testa lógica de validação sem dependências externas
 */

type ResourceType = 'article' | 'video' | 'book' | 'website' | 'other';
type Credibility = 'high' | 'medium' | 'low';
type ActivityStatus = 'not_started' | 'in_progress' | 'completed';

interface Resource {
  title: string;
  url: string;
  type: ResourceType;
  credibility: Credibility;
}

interface Activity {
  title: string;
  description: string;
  status: ActivityStatus;
}

// Valida se uma URL é válida
export const isValidURL = (url: string): boolean => {
  if (!url || url.trim().length === 0) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Valida se um recurso está completo
export const isValidResource = (resource: Partial<Resource>): boolean => {
  if (!resource.title || resource.title.trim().length < 3) return false;
  if (!resource.url || !isValidURL(resource.url)) return false;
  if (!resource.type) return false;
  if (!resource.credibility) return false;
  
  return true;
};

// Valida se uma atividade está completa
export const isValidActivity = (activity: Partial<Activity>): boolean => {
  if (!activity.title || activity.title.trim().length < 3) return false;
  if (!activity.description || activity.description.trim().length < 10) return false;
  if (!activity.status) return false;
  
  return true;
};

// Conta recursos por nível de credibilidade
export const countResourcesByCredibility = (
  resources: Resource[],
  credibility: Credibility
): number => {
  return resources.filter(r => r.credibility === credibility).length;
};

// Conta atividades por status
export const countActivitiesByStatus = (
  activities: Activity[],
  status: ActivityStatus
): number => {
  return activities.filter(a => a.status === status).length;
};

// Calcula porcentagem de atividades completas
export const calculateCompletionRate = (activities: Activity[]): number => {
  if (activities.length === 0) return 0;
  
  const completed = countActivitiesByStatus(activities, 'completed');
  return Math.round((completed / activities.length) * 100);
};

// Verifica se há recursos de alta credibilidade
export const hasHighCredibilityResources = (resources: Resource[]): boolean => {
  return resources.some(r => r.credibility === 'high');
};

describe('Resource Validators', () => {
  describe('isValidURL', () => {
    it('deve retornar false para URLs inválidas', () => {
      expect(isValidURL('')).toBe(false);
      expect(isValidURL('not a url')).toBe(false);
      expect(isValidURL('www.example')).toBe(false);
    });

    it('deve retornar true para URLs válidas', () => {
      expect(isValidURL('https://www.example.com')).toBe(true);
      expect(isValidURL('http://example.com/path')).toBe(true);
      expect(isValidURL('https://scholar.google.com/article')).toBe(true);
    });
  });

  describe('isValidResource', () => {
    it('deve retornar false para recurso incompleto', () => {
      expect(isValidResource({ title: 'AB' })).toBe(false); // título curto
      expect(isValidResource({ 
        title: 'Título válido',
        url: 'invalid url'
      })).toBe(false); // URL inválida
    });

    it('deve retornar true para recurso válido', () => {
      const resource: Resource = {
        title: 'Artigo sobre Sustentabilidade',
        url: 'https://example.com/article',
        type: 'article',
        credibility: 'high'
      };
      expect(isValidResource(resource)).toBe(true);
    });

    it('deve validar todos os campos obrigatórios', () => {
      expect(isValidResource({
        title: 'Título',
        url: 'https://example.com',
        type: 'article'
        // falta credibility
      })).toBe(false);
    });
  });

  describe('isValidActivity', () => {
    it('deve retornar false para atividade incompleta', () => {
      expect(isValidActivity({ title: 'AB' })).toBe(false);
      expect(isValidActivity({ 
        title: 'Título válido',
        description: 'Curta'
      })).toBe(false);
    });

    it('deve retornar true para atividade válida', () => {
      const activity: Activity = {
        title: 'Pesquisa de campo',
        description: 'Realizar entrevistas com alunos sobre desperdício alimentar',
        status: 'not_started'
      };
      expect(isValidActivity(activity)).toBe(true);
    });
  });

  describe('countResourcesByCredibility', () => {
    const resources: Resource[] = [
      { title: 'R1', url: 'https://a.com', type: 'article', credibility: 'high' },
      { title: 'R2', url: 'https://b.com', type: 'video', credibility: 'high' },
      { title: 'R3', url: 'https://c.com', type: 'book', credibility: 'medium' },
      { title: 'R4', url: 'https://d.com', type: 'website', credibility: 'low' }
    ];

    it('deve contar recursos de alta credibilidade', () => {
      expect(countResourcesByCredibility(resources, 'high')).toBe(2);
    });

    it('deve contar recursos de média credibilidade', () => {
      expect(countResourcesByCredibility(resources, 'medium')).toBe(1);
    });

    it('deve retornar 0 para credibilidade não presente', () => {
      const singleResource: Resource[] = [
        { title: 'R1', url: 'https://a.com', type: 'article', credibility: 'high' }
      ];
      expect(countResourcesByCredibility(singleResource, 'low')).toBe(0);
    });
  });

  describe('countActivitiesByStatus', () => {
    const activities: Activity[] = [
      { title: 'A1', description: 'Descrição 1', status: 'completed' },
      { title: 'A2', description: 'Descrição 2', status: 'in_progress' },
      { title: 'A3', description: 'Descrição 3', status: 'completed' },
      { title: 'A4', description: 'Descrição 4', status: 'not_started' }
    ];

    it('deve contar atividades completas', () => {
      expect(countActivitiesByStatus(activities, 'completed')).toBe(2);
    });

    it('deve contar atividades em progresso', () => {
      expect(countActivitiesByStatus(activities, 'in_progress')).toBe(1);
    });

    it('deve contar atividades não iniciadas', () => {
      expect(countActivitiesByStatus(activities, 'not_started')).toBe(1);
    });
  });

  describe('calculateCompletionRate', () => {
    it('deve retornar 0 para lista vazia', () => {
      expect(calculateCompletionRate([])).toBe(0);
    });

    it('deve calcular taxa de conclusão corretamente', () => {
      const activities: Activity[] = [
        { title: 'A1', description: 'D1', status: 'completed' },
        { title: 'A2', description: 'D2', status: 'completed' },
        { title: 'A3', description: 'D3', status: 'in_progress' },
        { title: 'A4', description: 'D4', status: 'not_started' }
      ];
      expect(calculateCompletionRate(activities)).toBe(50); // 2 de 4 = 50%
    });

    it('deve retornar 100 quando todas estão completas', () => {
      const activities: Activity[] = [
        { title: 'A1', description: 'D1', status: 'completed' },
        { title: 'A2', description: 'D2', status: 'completed' }
      ];
      expect(calculateCompletionRate(activities)).toBe(100);
    });
  });

  describe('hasHighCredibilityResources', () => {
    it('deve retornar false quando não há recursos de alta credibilidade', () => {
      const resources: Resource[] = [
        { title: 'R1', url: 'https://a.com', type: 'website', credibility: 'medium' },
        { title: 'R2', url: 'https://b.com', type: 'website', credibility: 'low' }
      ];
      expect(hasHighCredibilityResources(resources)).toBe(false);
    });

    it('deve retornar true quando há pelo menos um recurso de alta credibilidade', () => {
      const resources: Resource[] = [
        { title: 'R1', url: 'https://a.com', type: 'article', credibility: 'high' },
        { title: 'R2', url: 'https://b.com', type: 'website', credibility: 'low' }
      ];
      expect(hasHighCredibilityResources(resources)).toBe(true);
    });
  });
});
