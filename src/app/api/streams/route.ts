import { NextRequest, NextResponse } from "next/server";

import Streams from "@/lib/models/stream-model";

// API for create stream
export const POST = async (req: NextRequest) => {
  const { spaceId } = await req.json();
  try {
    const stream = new Streams({ spaceId });
    await stream.save();

    return NextResponse.json({ stream, status: "success" }, { status: 201 });
  } catch (error) {
    console.log("error", error);
  }
};
