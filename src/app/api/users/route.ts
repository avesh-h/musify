import { NextRequest, NextResponse } from "next/server";

import connectToDB from "@/lib/config/dbConfig";
import Users from "@/lib/models/user-model";

export const POST = async (req: NextRequest) => {
  const { userName, password, email } = await req.json();
  try {
    await connectToDB();
    const userObj = {
      userName,
      password,
      email,
      spaces: [],
    };
    //Save user in db
    const creator = new Users(userObj);
    await creator.save();
    return NextResponse.json({ creator, status: "success" }, { status: 201 });
  } catch (error) {
    console.log("errrrrrrrrr", error);
  }
};
