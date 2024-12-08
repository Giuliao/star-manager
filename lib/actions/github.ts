"use server";
import { cookies } from "next/headers";
import { Octokit } from "octokit";

const cookieConfig = async () => {
  let cookieStore: unknown = null;
};

export async function getUser() {
  const cookieStore = await cookies();
  const octokit = new Octokit({
    token: cookieStore.get("token")?.value
  });

  return await octokit.request("GET /user");
}
