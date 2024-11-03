/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

import connectToDB from "@/lib/config/dbConfig";
import Streams from "@/lib/models/stream-model";

export const GET = async (req: NextRequest, { params }: { params: any }) => {
  const { id: spaceId } = await params;
  try {
    await connectToDB();
    const space = await Streams.find({ spaceId });
    if (!space) {
      return NextResponse.json(
        { error: "Not found!", status: "failed" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { streams: space?.[0]?.streams, status: "success" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error", error);
  }
};

export const POST = async (req: NextRequest, { params }: { params: any }) => {
  //Get the video details based on the url and then fetch the thumbnails and title into updated object.
  const { id: spaceId } = await params;
  const streamObj = await req.json();
  try {
    await connectToDB();
    const stream = await Streams.find({ spaceId });
    if (!stream) {
      return NextResponse.json(
        { error: "Not found!", status: "failed" },
        { status: 404 }
      );
    }
    //add object in stream
    await Streams.updateOne({ spaceId }, { $push: { streams: streamObj } });

    return NextResponse.json(
      { message: "Successfully added into the queue!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("errror", error);
  }
};
