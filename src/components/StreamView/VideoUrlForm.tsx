import React, { useState } from "react";

const VideoUrlForm = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");

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

    //push into the queue by api call

    console.log("videooooooooo", videoId);
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
