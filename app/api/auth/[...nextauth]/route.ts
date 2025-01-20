import { handlers, auth } from "@/auth"; // Referring to the auth.ts we just created
import { NextRequest, NextResponse } from "next/server";
const { GET: innerGet } = handlers;

export async function GET(req: NextRequest) {
  if (await auth()) {
    return NextResponse.json({ message: "You are authenticated" });
  }
  const response = await innerGet(req);
  return response;
}
