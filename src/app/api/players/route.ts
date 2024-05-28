import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addPlayer, getPlayers } from '~/server/queries';

const playerSchema = z.object({
  name: z.string(),
  position: z.enum(['forwarder', 'midfielder', 'defender'])
});

export async function GET() {
  const res = await getPlayers();
  return NextResponse.json(res);
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsedBody = playerSchema.parse(body);
    const newPlayer = await addPlayer(parsedBody);

    return NextResponse.json({
      message: 'Player successfully created',
      player: newPlayer
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.issues);
      return NextResponse.json(err.issues);
    }
  }
}
