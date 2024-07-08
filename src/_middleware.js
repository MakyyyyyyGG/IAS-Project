// pages/_middleware.js
import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

export async function middleware(req, ev) {
  const session = await getSession({ req });

  if (!session) {
    return NextResponse.redirect("/api/auth/signin");
  }

  return NextResponse.next();
}
