/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useState, useRef, useEffect } from "react";

import YouTubePlayer from "youtube-player";

type YouTubePlayer = /*unresolved*/ any;

const Dashboard = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoPlayer, setVideoPlayer] = useState<YouTubePlayer | null>(null);

  const videoRef = useRef<HTMLElement>(null);

  // Helper function to extract video ID from a YouTube URL
  const extractVideoId = (url: string) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  //Handle submit that add song into the queue
  const handleAddToQueue = () => {
    //Make post api to add audio to the stream
    const videoId = extractVideoId(videoUrl);
    if (videoId && videoPlayer) {
      videoPlayer.loadVideoById(videoId);
      videoPlayer.playVideo();
    }
    //clear the state
    setVideoUrl("");
  };

  //Have get call that get the current stream queue songs list

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    // 'loadVideoById' is queued until the player is ready to receive API calls.
    // eslint-disable-next-line prefer-const
    let player: any = YouTubePlayer(videoRef.current);

    //Create state so we can use the player events like play or pause event outside the effect
    setVideoPlayer(player);

    //Youtube video id need to add for play
    // player.loadVideoById("XDqEvmxnLeY");

    //Play video (autoplay)
    // player.playVideo();

    return () => {
      player.destroy();
    };
  }, []);

  return (
    <div>
      <h1>Dashboard page</h1>
      <input
        type="text"
        onChange={(e) => setVideoUrl(e.target.value)}
        value={videoUrl}
      />
      <button onClick={handleAddToQueue}>Add</button>

      <div>
        Player
        {/* @ts-ignore */}
        <div ref={videoRef} style={{ width: "100%" }} />
      </div>
    </div>
  );
};

export default Dashboard;
