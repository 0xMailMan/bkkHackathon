import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  isCreator: boolean("is_creator").default(false),
  walletAddress: text("wallet_address"),
  createdAt: timestamp("created_at").defaultNow()
});

export const streams = pgTable("streams", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  creatorId: integer("creator_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull(), // scheduled, live, ended
  scheduledStartTime: timestamp("scheduled_start_time"),
  actualStartTime: timestamp("actual_start_time"),
  endTime: timestamp("end_time"),
  thumbnailUrl: text("thumbnail_url"),
  viewerCount: integer("viewer_count").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

export const streamParticipants = pgTable("stream_participants", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  streamId: integer("stream_id").references(() => streams.id),
  userId: integer("user_id").references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow(),
  leftAt: timestamp("left_at"),
  nftMinted: boolean("nft_minted").default(false)
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

export const insertStreamSchema = createInsertSchema(streams);
export const selectStreamSchema = createSelectSchema(streams);
export type InsertStream = z.infer<typeof insertStreamSchema>;
export type Stream = z.infer<typeof selectStreamSchema>;

export const insertStreamParticipantSchema = createInsertSchema(streamParticipants);
export const selectStreamParticipantSchema = createSelectSchema(streamParticipants);
export type InsertStreamParticipant = z.infer<typeof insertStreamParticipantSchema>;
export type StreamParticipant = z.infer<typeof selectStreamParticipantSchema>;
