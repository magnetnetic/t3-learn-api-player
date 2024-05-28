'server-only';

import { db } from './db';
import { players } from './db/schema';

interface Player {
  name: string;
  position: 'forwarder' | 'midfielder' | 'defender';
}

export async function getPlayers() {
  const players = await db.query.players.findMany({
    with: {
      skills: true
    }
  });
  return players;
}

export async function addPlayer(player: Player) {
  try {
    const newPlayer = await db.insert(players).values(player).returning();
    return newPlayer;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occured while adding the player'
    };
  }
}
