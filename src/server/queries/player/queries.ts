'server-only';

import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { players } from '~/server/db/schema';
import { type Player } from '~/server/queries';

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

export async function addPlayer(request: Player) {
  const { name, position } = request;
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

export async function updatePlayer(id: number, request: Player) {
  try {
    const updatedPlayer = await db
      .update(players)
      .set({ ...request })
      .where(eq(players.id, id))
      .returning();

    return {
      message: 'Player updated',
      player: updatedPlayer
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occured while updating the player'
    };
  }
}

export async function deletePlayer(id: number) {
  try {
    const deletedPlayer = await db
      .delete(players)
      .where(eq(players.id, id))
      .returning();

    return {
      message: 'Player deleted',
      player: deletedPlayer
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occured while deleting the player'
    };
  }
}
