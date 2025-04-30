import { NextRequest, NextResponse } from "next/server";
import { runRAG } from "@/lib/rag";
import type { ChatRequest } from "@/types/chat";

export async function POST(req: NextRequest) {
  const body: ChatRequest = await req.json();
  try {
    const response = await runRAG(body);
    return NextResponse.json({ result: response }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}