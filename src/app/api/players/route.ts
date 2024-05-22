import { db } from '~/server/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await db.query.players.findMany({
    with: {
      skills: true
    }
  });
  return NextResponse.json(res);
}
