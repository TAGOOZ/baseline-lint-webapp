import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeCode } from "./lib/baselineLint";
import { z } from "zod";

const analyzeRequestSchema = z.object({
  code: z.string(),
  language: z.enum(['css', 'js', 'javascript']),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/analyze", async (req, res) => {
    try {
      const { code, language } = analyzeRequestSchema.parse(req.body);
      
      const result = analyzeCode(code, language);
      
      res.json(result);
    } catch (error) {
      console.error('Analysis error:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: 'Invalid request', 
          details: error.errors 
        });
        return;
      }
      
      res.status(500).json({ 
        error: 'Analysis failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
