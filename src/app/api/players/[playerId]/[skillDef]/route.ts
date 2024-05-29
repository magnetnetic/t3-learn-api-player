import { NextResponse } from 'next/server';
import { getSkill } from '~/server/queries/skill/queries';

export async function GET(
  request: Request,
  {
    params
  }: {
    params: {
      skillDef: 'strength' | 'defense' | 'stamina' | 'speed' | 'attack';
      playerId: number;
    };
  }
) {
  const { playerId, skillDef } = params;
  const res = await getSkill(playerId, skillDef);
  return NextResponse.json(res);
}
