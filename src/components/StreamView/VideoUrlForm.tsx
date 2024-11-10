import React, { useState } from "react";

import { YT_REGEX } from "@/lib/constants";
import { socket } from "@/lib/socket";

const VideoUrlForm = ({ spaceId }: { spaceId: string }) => {
  const [videoUrl, setVideoUrl] = useState<string>("");

  // Helper function to extract video ID from a YouTube URL
  const extractVideoId = (url: string) => {
    const match = url.match(YT_REGEX);
    return match ? match[1] : null;
  };

  //Handle submit that add song into the queue
  const handleAddToQueue = async () => {
    //Add validation for check valid url of the youtube
    try {
      //Make post api to add audio to the stream
      const videoId = extractVideoId(videoUrl);

      const payload = {
        url: videoUrl,
        videoId,
        spaceId,
      };

      if (socket) {
        socket.emit("add_stream", payload);
      }
    } catch (error) {
      console.log("Error", error);
    }
    //clear the state
    setVideoUrl("");
  };

  return (
    <div>
      Form
      <input
        type="text"
        onChange={(e) => setVideoUrl(e.target.value)}
        value={videoUrl}
      />
      <button onClick={handleAddToQueue}>Add</button>
    </div>
  );
};

export default VideoUrlForm;
