import { type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByGithubId(githubId: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private usersByGithubId: Map<number, User>;
  private usersByUsername: Map<string, User>;
  private nextId: number;

  constructor() {
    this.users = new Map();
    this.usersByGithubId = new Map();
    this.usersByUsername = new Map();
    this.nextId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.usersByUsername.get(username);
  }

  async getUserByGithubId(githubId: number): Promise<User | undefined> {
    return this.usersByGithubId.get(githubId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Check if user already exists by GitHub ID
    const existingUser = await this.getUserByGithubId(insertUser.githubId);
    if (existingUser) {
      // Update existing user
      const updated = await this.updateUser(existingUser.id, insertUser);
      return updated || existingUser;
    }

    const id = this.nextId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      avatarUrl: insertUser.avatarUrl || null,
      createdAt: now,
      updatedAt: now
    };
    
    this.users.set(id, user);
    this.usersByGithubId.set(insertUser.githubId, user);
    this.usersByUsername.set(insertUser.username, user);
    
    return user;
  }

  async updateUser(id: number, userUpdate: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      return undefined;
    }

    const updatedUser: User = {
      ...existingUser,
      ...userUpdate,
      updatedAt: new Date()
    };

    this.users.set(id, updatedUser);
    
    // Update lookup maps
    if (userUpdate.githubId) {
      this.usersByGithubId.delete(existingUser.githubId);
      this.usersByGithubId.set(userUpdate.githubId, updatedUser);
    }
    
    if (userUpdate.username) {
      this.usersByUsername.delete(existingUser.username);
      this.usersByUsername.set(userUpdate.username, updatedUser);
    }

    return updatedUser;
  }
}

export const storage = new MemStorage();
