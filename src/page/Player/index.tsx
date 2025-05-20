import React, { useState, useRef } from "react";
import styles from "./Player.module.css";

const Player = () => {
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [mediaType, setMediaType] = useState<"audio" | "video" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      setMediaType(file.type.startsWith("audio/") ? "audio" : "video");
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.playerContainer}>
      <div className={styles.playerWrapper}>
        {!mediaUrl ? (
          <div className={styles.uploadPrompt} onClick={handleClick}>
            <p>Click to upload MP3 or MP4 file</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.mp4"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        ) : (
          <div className={styles.mediaContainer}>
            {mediaType === "audio" ? (
              <audio controls src={mediaUrl} className={styles.mediaPlayer} />
            ) : (
              <video controls src={mediaUrl} className={styles.mediaPlayer} />
            )}
            <button className={styles.changeFileButton} onClick={handleClick}>
              Change File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Player;
