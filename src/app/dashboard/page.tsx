"use client";

import React, { useState } from "react";

const Dashboard = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");

  //Handle submit that add song into the queue
  const handleAddToQueue = () => {
    console.log("inpttttttttttt", videoUrl);
    setVideoUrl("");
  };

  //Have get call that get the current stream queue songs list

  //Make embed url for the playing youtube video
  const getEmbedUrl = (url: string) => {
    // Extract the video ID from the YouTube link
    const videoIdMatch = url.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?]+)/
    );
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : "";
  };

  return (
    <div>
      <h1>Dashboard page</h1>
      <input type="text" onChange={(e) => setVideoUrl(e.target.value)} />
      <button onClick={handleAddToQueue}>Add</button>

      <div>
        {videoUrl && (
          <iframe
            width="560"
            height="315"
            src={getEmbedUrl(videoUrl)}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
