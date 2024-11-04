/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

import connectToDB from "@/lib/config/dbConfig";
import Spaces from "@/lib/models/space-model";
import Streams from "@/lib/models/stream-model";

export const GET = async (req: NextRequest, { params }: { params: any }) => {
  const { id: spaceId } = await params;
  try {
    await connectToDB();
    const space = await Spaces.find({ _id: spaceId }).populate("streams");

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

    // Create stream
    // TODO: call youtube search api get the thumnails and images from it and update the stream object.
    const createdStream = new Streams(streamObj);
    await createdStream.save();

    // Add new stream in streams of space
    await Spaces.findByIdAndUpdate(
      spaceId,
      { $push: { streams: createdStream?._id } },
      { new: true }
    );

    return NextResponse.json(
      { message: "Successfully added into the queue!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("errror", error);
  }
};

export const PUT = async (req: NextRequest, { params }: { params: any }) => {
  const { id: spaceId } = await params;
  const { videoId } = await req.json();
  try {
    await connectToDB();
    // check first that video is exist in both space and streams
    //Remove song from the streams collection
    await Streams.findByIdAndDelete(videoId);
    //Remove song from the space
    await Spaces.findByIdAndUpdate(
      spaceId,
      {
        $pull: { streams: videoId },
      },
      { new: true }
    );
    return NextResponse.json(
      { message: "Successfully removed!", status: "success" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error", error);
  }
};
