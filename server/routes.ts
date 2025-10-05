import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeCode } from "./lib/baselineLint";
import { getUncachableGitHubClient } from "./lib/githubClient";
import { z } from "zod";

const analyzeRequestSchema = z.object({
  code: z.string(),
  language: z.enum(['css', 'js', 'javascript']),
});

const analyzeRepoRequestSchema = z.object({
  owner: z.string(),
  repo: z.string(),
});

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 1000;

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/analyze", async (req, res) => {
    try {
      const { code, language } = analyzeRequestSchema.parse(req.body);
      
      const result = await analyzeCode(code, language);
      
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

  app.post("/api/analyze-repo", async (req, res) => {
    try {
      const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
      
      if (!checkRateLimit(clientIp)) {
        res.status(429).json({ 
          message: 'Rate limit exceeded. Please try again in a minute.' 
        });
        return;
      }

      const { owner, repo } = analyzeRepoRequestSchema.parse(req.body);
      
      const octokit = await getUncachableGitHubClient();
      
      const { data: repoData } = await octokit.repos.get({ owner, repo });
      const defaultBranch = repoData.default_branch;
      
      const { data: tree } = await octokit.git.getTree({
        owner,
        repo,
        tree_sha: defaultBranch,
        recursive: 'true',
      });

      const MAX_FILES = 50;
      const MAX_FILE_SIZE = 100 * 1024;
      
      const jsAndCssFiles = tree.tree
        .filter((item: any) => {
          if (item.type !== 'blob') return false;
          const path = item.path?.toLowerCase() || '';
          return (
            (path.endsWith('.js') || path.endsWith('.jsx') || 
             path.endsWith('.ts') || path.endsWith('.tsx') ||
             path.endsWith('.css')) &&
            !path.includes('node_modules') &&
            !path.includes('dist') &&
            !path.includes('build') &&
            !path.includes('.min.')
          );
        })
        .slice(0, MAX_FILES);

      const totalFiles = jsAndCssFiles.length;
      const fileResults: any[] = [];
      let filesAnalyzed = 0;
      let totalIssues = 0;

      for (const file of jsAndCssFiles) {
        try {
          if (!file.sha) continue;

          const { data: blob } = await octokit.git.getBlob({
            owner,
            repo,
            file_sha: file.sha,
          });

          const content = Buffer.from(blob.content, 'base64').toString('utf-8');
          
          if (content.length > MAX_FILE_SIZE) {
            continue;
          }

          const filePath = file.path || '';
          const language = filePath.endsWith('.css') ? 'css' : 'js';
          
          const analysis = await analyzeCode(content, language);
          
          if (analysis.issues.length > 0) {
            fileResults.push({
              path: filePath,
              language,
              score: analysis.score,
              issueCount: analysis.issues.length,
              issues: analysis.issues,
            });
            totalIssues += analysis.issues.length;
          }
          
          filesAnalyzed++;
        } catch (error) {
          console.error(`Error analyzing file ${file.path}:`, error);
        }
      }

      res.json({
        repository: `${owner}/${repo}`,
        totalFiles,
        filesAnalyzed,
        filesWithIssues: fileResults.length,
        totalIssues,
        fileResults,
      });
    } catch (error: any) {
      console.error('Repository analysis error:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: 'Invalid request', 
          details: error.errors 
        });
        return;
      }
      
      if (error.status === 404) {
        res.status(404).json({ 
          message: 'Repository not found. Please check the owner and repo name.' 
        });
        return;
      }

      if (error.message?.includes('GitHub not connected')) {
        res.status(500).json({ 
          message: 'GitHub connection not available. Please contact the administrator.' 
        });
        return;
      }
      
      res.status(500).json({ 
        message: error.message || 'Failed to analyze repository' 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
