import { NextResponse } from 'next/server';
import { z } from 'zod';
import { insertSkillSchema } from '~/server/db/schema';
import { addSkill, getPlayer } from '~/server/queries';

export async function GET(
  request: Request,
  { params }: { params: { playerId: number } }
) {
  const { playerId } = params;
  const res = await getPlayer(playerId);
  return NextResponse.json(res);
}

export async function POST(
  request: Request,
  { params }: { params: { playerId: number } }
) {
  try {
    const body: unknown = await request.json();
    const playerId = Number(params.playerId);
    const requestSchema = insertSkillSchema.pick({ skill: true, value: true });
    const parsedBody = requestSchema.parse(body);
    const result = await addSkill({ ...parsedBody, playerId });

    return NextResponse.json({
      success: true,
      response: result
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(err.issues);
    }
  }
}
