import { NextRequest, NextResponse } from "next/server";

import connectToDB from "@/lib/config/dbConfig";
import Spaces from "@/lib/models/space-model";

export const POST = async (req: NextRequest) => {
  const { spaceName, creator } = await req.json();
  try {
    await connectToDB();
    const space = new Spaces({ spaceName, creator });
    await space.save();
    return NextResponse.json({ space, status: "success" }, { status: 201 });
  } catch (error) {
    console.log(error);
  }
};
