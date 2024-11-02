"use client";

import React from "react";

type StreamObj = {
  url: string;
  upvotes: string[];
  image: string;
  title: string;
  _id: string;
};

const Queue = ({ queue }: { queue: StreamObj[] }) => {
  return (
    <div>
      Queue Component
      <div className="h-250">
        {queue?.length ? (
          queue?.map((stream, index) => {
            return (
              <div key={`${stream?._id}-${index}`}>
                <h4>{stream?.title}</h4>
                <h5>{stream?.upvotes?.length}</h5>
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
