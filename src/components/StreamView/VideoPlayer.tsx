/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useRef, useEffect, useState } from "react";

import axios from "axios";
import YouTubePlayer from "youtube-player";

type Props = {
  currentVideo: any;
  playNext: () => void;
  spaceId: string;
};

type YouTubePlayerType = /*unresolved*/ any;

const VideoPlayer = ({ currentVideo, playNext, spaceId }: Props) => {
  const [videoPlayer, setVideoPlayer] = useState<YouTubePlayerType | null>(
    null
  );

  const videoRef = useRef<HTMLElement>(null);

  // Helper function to extract video ID from a YouTube URL
  const extractVideoId = (url: string) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  // Remove stream from queue
  const removeStreamFromQueue = async (videoId: string) => {
    const res = await axios.put(`http://localhost:3000/api/spaces/${spaceId}`, {
      videoId,
    });
    return res;
  };

  useEffect(() => {
    if (!videoRef.current || !currentVideo) {
      return;
    }

    // 'loadVideoById' is queued until the player is ready to receive API calls.
    const player: any = YouTubePlayer(videoRef.current);

    //Create state so we can use the player events like play or pause event outside the effect
    // setVideoPlayer(player);

    //Youtube video id need to add for play
    player.loadVideoById(extractVideoId(currentVideo?.url));

    //Play video (autoplay)
    player.playVideo();

    //Play Next audio from the queue
    player.on("stateChange", (event: any) => {
      if (event.data === 0) {
        playNext();
        //Delete the current video from the db via api call
        removeStreamFromQueue(currentVideo?._id);
      }
    });

    // After every unmount clear destroy the player
    return () => {
      player.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideo]);

  return (
    <div>
      <div>
        Player
        {/* @ts-ignore */}
        <div ref={videoRef} className="w-full" />
      </div>
    </div>
  );
};

export default VideoPlayer;
