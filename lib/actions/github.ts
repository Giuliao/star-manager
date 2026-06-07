"use server";
import { Octokit } from "octokit";
import { auth } from "@/auth"

const isE2E = process.env.E2E_TEST === "1";

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

async function getE2EStarList(page?: number) {
  if ((page || 1) <= 1) {
    return {
      data: (await import("@/tests/fixtures/github/stars-page-1.json")).default,
      headers: {
        link: ""
      }
    };
  }

  return {
    data: (await import("@/tests/fixtures/github/stars-page-2.json")).default,
    headers: {
      link: ""
    }
  };
}

export async function getUser() {
  if (isE2E) {
    return {
      data: {
        login: "e2e-user"
      }
    };
  }

  return await (await wrappedKit()).request("GET /user");
}

export async function getStarList(param: any = { per_page: 20, page: 1 }) {
  if (isE2E) {
    return await getE2EStarList(param?.page);
  }

  return await (await wrappedKit()).request("GET /user/starred", {
    ...(param || {}),
  });
}

export async function getREADME({ owner, repo, ...param }: {
  owner: string;
  repo: string;
  [prop: string]: any
}) {
  if (isE2E) {
    return {
      data: (await import("@/tests/fixtures/github/readme.json")).default,
      headers: {}
    };
  }

  return await (await wrappedKit()).request(`GET /repos/${owner}/${repo}/readme`, {
    param,
  });
}

