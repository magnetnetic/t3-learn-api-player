import { NextResponse } from 'next/server';
import { z } from 'zod';
import { insertSkillSchema } from '~/server/db/schema';
import { zPlayer } from '~/server/queries';
import {
  deletePlayer,
  getPlayer,
  updatePlayer
} from '~/server/queries/player/queries';
import { addSkill } from '~/server/queries/skill/queries';

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

export async function PUT(
  request: Request,
  { params }: { params: { playerId: number } }
) {
  try {
    const body: unknown = await request.json();
    const playerId = Number(params.playerId);
    const parsedBody = zPlayer.omit({ id: true }).parse(body);
    const result = await updatePlayer(playerId, parsedBody);

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

export async function DELETE(
  request: Request,
  { params }: { params: { playerId: number } }
) {
  const playerId = Number(params.playerId);
  const result = await deletePlayer(playerId);

  return NextResponse.json({
    success: true,
    response: result
  });
}
