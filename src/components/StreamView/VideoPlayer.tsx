/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";

import YouTubePlayer from "youtube-player";

import { YT_REGEX } from "@/lib/constants";

type Props = {
  currentVideo: any;
  playNext: () => void;
  spaceId: string;
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

    const player: any = YouTubePlayer(videoRef.current);
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

      // After every unmount clear destroy the player
    })();

    //Play Next audio from the queue
    player.on("stateChange", (event: any) => {
      if (event.data === 0) {
        playNext();
      }
    });

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
    </div>
  );
};

export default VideoPlayer;
