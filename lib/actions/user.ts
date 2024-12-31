"use server";
import { eq } from "drizzle-orm";
import { db } from "@/db"
import { CreateUserType, users } from "@/db/schema";


export async function createUser(data: CreateUserType, dbParam = db) {
  return dbParam.insert(users).values(data);
}

export async function getUserById(id: string, dbParam = db) {
  return dbParam.query.users.findFirst({ where: eq(users.id, id) });
}

