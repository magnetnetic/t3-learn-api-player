'server-only';

import { and, eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { skills } from '~/server/db/schema';
import { type Skill } from '~/server/queries';

export async function getSkill(
  playerId: number,
  skillDef: 'strength' | 'defense' | 'stamina' | 'speed' | 'attack'
) {
  const skill = await db.query.skills.findFirst({
    where: and(eq(skills.skill, skillDef))
  });

  return skill;
}

export async function addSkill(request: Skill) {
  try {
    const existingSkill = await db.query.skills.findFirst({
      where: and(
        eq(skills.skill, request.skill),
        eq(skills.playerId, request.playerId)
      )
    });

    if (existingSkill) {
      const updatedSkill = await updateSkill(request);
      return updatedSkill;
    } else {
      const newSkill = await db
        .insert(skills)
        .values({
          skill: request.skill,
          value: request.value,
          playerId: request.playerId
        })
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

export async function deleteSkill() {
  // Implement delete skill
}
