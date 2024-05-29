// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from 'drizzle-orm';
import {
  index,
  integer,
  pgEnum,
  pgTableCreator,
  serial,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  name => `t3-learn-api-player_${name}`
);

export const positionEnum = pgEnum('position', [
  'forwarder',
  'midfielder',
  'defender'
]);

export const skillEnum = pgEnum('skill', [
  'strength',
  'defense',
  'stamina',
  'speed',
  'attack'
]);

export const players = createTable(
  'player',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    position: positionEnum('position').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
  },
  example => ({
    nameIndex: index('name_idx').on(example.name)
  })
);

export const insertPlayerSchema = createInsertSchema(players);

export const skills = createTable('skill', {
  id: serial('id').primaryKey(),
  skill: skillEnum('skill').notNull(),
  value: integer('value').notNull(),
  playerId: integer('player_id')
    .notNull()
    .references(() => players.id, { onDelete: 'cascade' })
});

export const insertSkillSchema = createInsertSchema(skills);

export const playersRelations = relations(players, ({ many }) => ({
  skills: many(skills)
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  player: one(players, { fields: [skills.playerId], references: [players.id] })
}));
