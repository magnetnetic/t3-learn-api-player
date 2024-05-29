import { NextResponse } from 'next/server';
import { z } from 'zod';
import { zPlayer } from '~/server/queries';
import { addPlayer, getPlayers } from '~/server/queries/player/queries';

export async function GET() {
  const res = await getPlayers();
  return NextResponse.json(res);
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsedBody = zPlayer.omit({ id: true }).parse(body);
    const newPlayer = await addPlayer(parsedBody);

    return NextResponse.json({
      message: 'Player successfully created',
      player: newPlayer
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(err.issues);
    }
  }
}
