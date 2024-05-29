'server-only';

import { z } from 'zod';

export interface Skill {
  skill: 'strength' | 'defense' | 'stamina' | 'speed' | 'attack';
  value: number;
  playerId: number;
}

export const zSkill = z.object({
  skill: z.enum(['strength', 'defense', 'stamina', 'speed', 'attack']),
  value: z.number(),
  playerId: z.number()
});

export interface Player {
  name: string;
  position: 'forwarder' | 'midfielder' | 'defender';
  skills?: Skill[];
}

export const zPlayer = z.object({
  id: z.number(),
  name: z.string(),
  position: z.enum(['forwarder', 'midfielder', 'defender']),
  skills: z.optional(z.array(zSkill))
});
