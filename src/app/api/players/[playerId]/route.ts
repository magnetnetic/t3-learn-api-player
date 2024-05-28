import { NextResponse } from 'next/server';
import { getPlayer } from '~/server/queries';

export async function GET(
  request: Request,
  { params }: { params: { playerId: number } }
) {
  const { playerId } = params;
  const res = await getPlayer(playerId);
  return NextResponse.json(res);
}
