'server-only';

import { eq, and } from 'drizzle-orm';
import { db } from './db';
import { players, skills } from './db/schema';
import { NextResponse } from 'next/server';

interface Player {
  name: string;
  position: 'forwarder' | 'midfielder' | 'defender';
  skills?: Skill[];
}

interface Skill {
  skill: 'strength' | 'defense' | 'stamina' | 'speed' | 'attack';
  value: number;
  playerId: number;
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

export async function addSkill(request: Skill) {
  const { skill, value, playerId } = request;
  try {
    const existingSkill = await db.query.skills.findFirst({
      where: and(eq(skills.skill, skill), eq(skills.playerId, playerId))
    });

    if (existingSkill) {
      const updatedSkill = await updateSkill(request);
      return updatedSkill;
    } else {
      const newSkill = await db
        .insert(skills)
        .values({ skill, value, playerId })
        .returning();

      return {
        message: 'Skill added',
        skill: newSkill
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occured while adding skill'
    };
  }
}

export async function updateSkill(request: Skill) {
  try {
    const updatedSkill = await db
      .update(skills)
      .set({ value: request.value })
      .where(
        and(
          eq(skills.skill, request.skill),
          eq(skills.playerId, request.playerId)
        )
      )
      .returning();

    return {
      message: 'Skill updated',
      skill: updatedSkill
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occured while updating skill'
    };
  }
}
