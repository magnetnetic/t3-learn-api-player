'server-only';

import { eq } from 'drizzle-orm';
import { db } from './db';
import { players, skills } from './db/schema';

interface Player {
  name: string;
  position: 'forwarder' | 'midfielder' | 'defender';
  skills?: Skill[];
}

interface Skill {
  skill: 'strength' | 'defense' | 'stamina' | 'speed' | 'attack';
  value: number;
}

export async function getPlayers() {
  const players = await db.query.players.findMany({
    with: {
      skills: true
    }
  });
  return players;
}

export async function getPlayer(id: number) {
  const player = await db.query.players.findFirst({
    with: {
      skills: true
    },
    where: eq(players.id, id)
  });
  return player;
}

export async function addPlayer(player: Player) {
  const { name, position } = player;
  try {
    const newPlayer = await db
      .insert(players)
      .values({ name, position })
      .returning();

    return newPlayer;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occured while adding the player'
    };
  }
}

export async function addSkill(request: Skill, playerId: number) {
  const { skill, value } = request;
  try {
    const newSkill = await db
      .insert(skills)
      .values({ skill, value, playerId })
      .returning();

    return newSkill;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occured while adding the skill'
    };
  }
}
