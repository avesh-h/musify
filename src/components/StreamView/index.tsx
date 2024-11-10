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

  const playNext = () => {
    const nextVideoIdx =
      queue?.findIndex((stream) => stream?._id === currentVideo?._id) + 1;
    // set current as a next video obj
    setCurrentVideo(queue?.[nextVideoIdx]);
  };

  return (
    <div className="flex w-full">
      <div className="w-3/5">
        <Queue queue={queue} />
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
