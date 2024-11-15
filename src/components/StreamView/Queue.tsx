"use client";

import React from "react";

import { ThumbsUp } from "lucide-react";

import { socket } from "@/lib/socket";

type StreamObj = {
  url: string;
  upvotes: string[];
  image: string;
  title: string;
  _id: string;
};

const Queue = ({ queue, spaceId }: { queue: StreamObj[]; spaceId: string }) => {
  const upvoteHandler = (streamId: string) => {
    const payload = { spaceId, streamId };
    //Send stream id and space id in socket event payload
    if (socket) {
      socket.emit("upvote_stream", payload);
    }
  };
  return (
    <div>
      Queue Component
      <div className="h-250 mt-2">
        {queue?.length ? (
          queue?.map((stream, index) => {
            return (
              <div
                key={`${stream?._id}-${index}`}
                className="flex flex-col mt-2"
              >
                <h4>{stream?.title}</h4>
                <button
                  className="border-solid flex gap-2 border w-fit"
                  onClick={() => upvoteHandler(stream?._id)}
                >
                  <ThumbsUp />
                  <h5>{stream?.upvotes?.length}</h5>
                </button>
              </div>
            );
          })
        ) : (
          <h2>Stream queue is empty!</h2>
        )}
      </div>
    </div>
  );
};

export default Queue;
