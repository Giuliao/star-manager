"use server";
import { Octokit } from "octokit";
import { auth } from "@/auth"



const wrappedKit = (() => {
  let octokit: Octokit;
  return async () => {
    if (octokit) {
      return octokit;
    }
    const session = await auth();
    octokit = new Octokit({
      auth: (session as any)?.accessToken || "" as string
    });
    return octokit;

  };
})();


export async function getUser() {
  return await (await wrappedKit()).request("GET /user");
}



export async function getStarList() {
  return await (await wrappedKit()).request("GET /user/starred");
}