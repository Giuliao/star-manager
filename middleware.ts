import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith("/console")) {
    const newUrl = new URL("/", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})
