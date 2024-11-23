"use client";
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useRef, useState } from "react";

// import ReactPlayer from "react-player";
import Image from "next/image";
import YouTubePlayer from "youtube-player";

import { YT_REGEX } from "@/lib/constants";

// This method of next js is preventing this react-player render to the server.
// const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type Props = {
  currentVideo: any;
  playNext: () => void;
  spaceId: string;
  socket: any;
};

type YouTubePlayerType = /*unresolved*/ any;

const VideoPlayer = ({ currentVideo, playNext }: Props) => {
  const [videoPlayer, setVideoPlayer] = useState<YouTubePlayerType | null>(
    null
  );

  const videoRef = useRef<HTMLElement>(null);

  // Helper function to extract video ID from a YouTube URL
  const extractVideoId = (url: string) => {
    const match = url.match(YT_REGEX);
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (!videoRef.current || !currentVideo) {
      return;
    }

    const player: any = YouTubePlayer(videoRef.current, {
      playerVars: {
        autoplay: 0, // Auto-start the video
        controls: 1, // Hide player controls
        modestbranding: 1, // Hide YouTube logo
        rel: 0, // Do not show related videos at the end
      },
    });
    (async () => {
      //Create state so we can use the player events like play or pause event outside the effect
      //Youtube video id need to add for play
      setVideoPlayer(player);

      // 'loadVideoById' is queued until the player is ready to receive API calls.
      const load = await player.loadVideoById(
        extractVideoId(currentVideo?.url)
      );

      if (load.id) {
        //Play video (autoplay)
        await player.playVideo();
      }
    })();

    player.on("stateChange", (event: any) => {
      if (event.data === 0) {
        playNext();
      }
    });

    // After every unmount clear destroy the player
    return () => {
      player.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideo]);

  const playHandler = useCallback(() => {
    if (videoPlayer) {
      videoPlayer.playVideo();
    }
  }, [videoPlayer]);

  const pauseHandler = useCallback(() => {
    if (videoPlayer) {
      videoPlayer.pauseVideo();
    }
  }, [videoPlayer]);

  return (
    <div>
      <div>
        Player
        {/* @ts-ignore */}
        <div ref={videoRef} className="w-full" />
        {/* For normal users */}
        {currentVideo ? (
          <>
            <Image
              height={288}
              width={288}
              alt={currentVideo?.title}
              src={currentVideo?.thumbnails?.[3]?.url}
              className="h-72 w-full rounded object-cover"
            />
            <p className="mt-2 text-center font-semibold">
              {currentVideo?.title}
            </p>
          </>
        ) : null}
        <button
          onClick={() => {
            if (videoPlayer) {
              playNext();
            }
          }}
        >
          Play Next
        </button>
      </div>

      <button onClick={playHandler}>Start Stream</button>
      <button onClick={pauseHandler}>Pause Stream</button>
    </div>
  );
};

export default VideoPlayer;
