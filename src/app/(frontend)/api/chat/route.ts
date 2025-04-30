import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
 return NextResponse.json({ result: "hehe" }, { status: 200 });
  
}