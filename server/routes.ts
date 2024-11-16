import type { Express } from "express";
import type { Server as SocketIOServer } from "socket.io";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { users, streams, streamParticipants } from "../db/schema";

export function registerRoutes(app: Express, io: SocketIOServer) {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const user = await db.insert(users).values(req.body).returning();
      res.json(user[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, parseInt(req.params.id))
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  // Stream routes
  app.post("/api/streams", async (req, res) => {
    try {
      const stream = await db.insert(streams).values(req.body).returning();
      res.json(stream[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to create stream" });
    }
  });

  app.get("/api/streams", async (req, res) => {
    const allStreams = await db.query.streams.findMany({
      orderBy: (streams, { desc }) => [desc(streams.createdAt)]
    });
    res.json(allStreams);
  });

  app.get("/api/streams/:id", async (req, res) => {
    const stream = await db.query.streams.findFirst({
      where: eq(streams.id, parseInt(req.params.id))
    });
    if (stream) {
      res.json(stream);
    } else {
      res.status(404).json({ error: "Stream not found" });
    }
  });

  // Stream participant routes
  app.post("/api/streams/:streamId/participants", async (req, res) => {
    try {
      const participant = await db.insert(streamParticipants).values({
        streamId: parseInt(req.params.streamId),
        userId: req.body.userId
      }).returning();
      res.json(participant[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to join stream" });
    }
  });
}