/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useCallback, useEffect, useState } from "react";

import axios from "axios";

import { connectToSocket } from "@/lib/socket";

import Queue from "./Queue";
import VideoPlayer from "./VideoPlayer";
import VideoUrlForm from "./VideoUrlForm";

type StreamObj = {
  url: string;
  upvotes: string[];
  image: string;
  title: string;
  _id: string;
};

const StreamView = ({ spaceId }: { spaceId: string }) => {
  const [queue, setQueue] = useState<StreamObj[]>([]);
  const [currentVideo, setCurrentVideo] = useState<StreamObj | null>(null);

  // Remove stream from queue
  const removeStreamFromQueue = useCallback(async () => {
    const res = await axios.put(`http://localhost:3000/api/spaces/${spaceId}`, {
      videoId: currentVideo?._id,
    });
    if (res?.data?.nextVideoId) {
      const nextVideoObj =
        queue?.find((stream) => stream?._id === res?.data?.nextVideoId) || null;

      setCurrentVideo(nextVideoObj);
    } else {
      setCurrentVideo(null);
    }
  }, [currentVideo?._id, queue, spaceId]);

  //Websocket testing
  useEffect(() => {
    const socket = connectToSocket();
    //Connect user to selected space with socket
    socket.on("connect", () => {
      socket.emit("join_space", spaceId);
    });

    //Adding song into the queue after added song from url
    socket.on("added_stream", (song) => {
      setQueue((queue) => {
        let finalArr = [];
        if (queue?.length) {
          finalArr = [...queue, song];
        } else {
          finalArr.push(song);
        }
        return finalArr;
      });

      //If this added song is the first song of the space
      setCurrentVideo((currVideo) => (!currVideo ? song : currVideo));
    });

    return () => {
      socket.disconnect();
    };
  }, [spaceId]);

  // Get stream based on the space id
  const getStream = useCallback(async () => {
    const data = await axios.get(`http://localhost:3000/api/spaces/${spaceId}`);
    if (data?.data?.status === "success") {
      setQueue(data?.data?.streams);

      //Set first video object as a current video only for first time when get stream list of current space
      if (!currentVideo && data?.data?.streams?.length) {
        setCurrentVideo(data?.data?.streams?.[0]);
      }
    }
  }, [currentVideo, spaceId]);

  useEffect(() => {
    // current queue
    getStream();
  }, [getStream]);

  //Playnext function
  const playNext = useCallback(() => {
    removeStreamFromQueue();
  }, [removeStreamFromQueue]);

  return (
    <div className="flex w-full">
      <div className="w-3/5">
        <Queue queue={queue} spaceId={spaceId} />
      </div>
      <div className="flex flex-col w-2/5">
        <VideoUrlForm spaceId={spaceId} />
        <VideoPlayer
          currentVideo={currentVideo}
          playNext={playNext}
          spaceId={spaceId}
        />
      </div>
    </div>
  );
};

export default StreamView;
