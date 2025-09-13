import React, { useEffect, useRef } from "react";

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: any;
    }
}

interface YoutubePlayerProps {
    videoId: string;
    increaseCompleteness: () => void;
}

let isYTScriptAdded = false;
let ytReadyCallbacks: (() => void)[] = [];

export const YouTubePlayer: React.FC<YoutubePlayerProps> = ({ videoId, increaseCompleteness }) => {
    const playerDivId = `youtube-player-${videoId}`; 
    const playerRef = useRef<any>(null);

    useEffect(() => {
        const createPlayer = () => {
            playerRef.current = new window.YT.Player(playerDivId, {
                height: "100%",
                width: "auto",
                videoId,
                events: {
                    onStateChange: onPlayerStateChange,
                },
            });
        };

        if (window.YT && window.YT.Player) {
            createPlayer();
        } else {
            // Add to queue
            ytReadyCallbacks.push(createPlayer);

            // Only add script once
            if (!isYTScriptAdded) {
                const tag = document.createElement("script");
                tag.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(tag);
                isYTScriptAdded = true;

                window.onYouTubeIframeAPIReady = () => {
                    ytReadyCallbacks.forEach(cb => cb());
                    ytReadyCallbacks = [];
                };
            }
        }

        return () => {
            if (playerRef.current) playerRef.current.destroy();
        };
    }, [videoId]);

    const onPlayerStateChange = (event: any) => {
        if (event.data === window.YT.PlayerState.ENDED) {
            increaseCompleteness();
        }
    };

    return <div id={playerDivId}></div>;
};
