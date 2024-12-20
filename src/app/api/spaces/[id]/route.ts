/* eslint-disable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line import/order
import { NextRequest, NextResponse } from "next/server";

//@ts-ignore
import youtubesearchapi from "youtube-search-api";

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

    const videoDetails = await youtubesearchapi?.GetVideoDetails(
      streamObj?.videoId
    );

    // Getting thumbnails
    // const thumbnails = videoDetails?.thumbnail?.thumbnails?.sort(
    //   (a: { width: number }, b: { width: number }) =>
    //     a?.width > b?.width ? -1 : 1
    // );

    if (videoDetails) {
      streamObj.title = videoDetails?.title;
      streamObj.thumbnails = videoDetails?.thumbnail?.thumbnails;
      // streamObj.smallImg =
      //   thumbnails?.length > 1
      //     ? thumbnails[thumbnails?.length - 2]?.url
      //     : thumbnails[thumbnails?.length - 1]?.url ?? "";
      // streamObj.bigImg = thumbnails[thumbnails?.length - 1]?.url ?? "";
    }

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
    //Remove song from the space
    // Remove the song from the space's streams array
    const updatedSpace = await Spaces.findByIdAndUpdate(
      spaceId,
      { $pull: { streams: videoId } },
      { new: true } // Return the updated document
    );

    const nextVideoIdx =
      updatedSpace?.streams?.findIndex(
        (vidId: string) => vidId === updatedSpace?.currentVideo
      ) + 1;

    // Determine the next video for currentVideo
    const currentVideoId = updatedSpace.streams[nextVideoIdx] || null; // Use the next available stream, or null if empty

    // Update the currentVideo in the space document
    await Spaces.findByIdAndUpdate(spaceId, { currentVideo: currentVideoId });
    //Remove song from the streams collection
    await Streams.findByIdAndDelete(videoId);

    //update next video as currentVideo

    return NextResponse.json(
      { nextVideoId: updatedSpace.streams[nextVideoIdx], status: "success" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error", error);
  }
};
