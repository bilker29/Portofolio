import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music, Disc3 } from "lucide-react";

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Attempt auto-play upon first user interaction anywhere on window
    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        setHasInteracted(true);
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay blocked by browser policy until explicit click
            setIsPlaying(false);
          });
      }
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [hasInteracted]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio play error:", err));
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/music.mp3"
        loop
        preload="auto"
      />

      {/* Floating Speaker Tool (Bottom Right or Navbar Integration) */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={togglePlay}
          className={`group relative flex items-center gap-2.5 px-3.5 py-2 rounded-full border transition-all duration-300 shadow-lg active:scale-95 ${
            isPlaying
              ? "bg-white/95 border-sky-400 text-sky-700 shadow-sky-500/20"
              : "bg-white/80 border-slate-200 text-slate-600 hover:text-sky-600 shadow-slate-300/30"
          } backdrop-blur-xl`}
          title={isPlaying ? "Klik untuk mematikan musik" : "Klik untuk mendengarkan 'Blue' - Yung Kai"}
        >
          {/* Ambient Glow when playing */}
          {isPlaying && (
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-sky-400 to-teal-400 opacity-40 blur-sm animate-pulse -z-10" />
          )}

          {/* Disc / Music Icon */}
          <div className="relative flex items-center justify-center">
            {isPlaying ? (
              <Disc3 className="w-4 h-4 text-sky-600 animate-spin-slow" />
            ) : (
              <Music className="w-4 h-4 text-slate-400 group-hover:text-sky-500" />
            )}
          </div>

          {/* Song Info */}
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-extrabold tracking-tight leading-tight line-clamp-1">
              {isPlaying ? "Blue — Yung Kai" : "Play Music"}
            </span>
            <span className="text-[8.5px] font-mono text-slate-500 leading-none">
              {isPlaying ? "Now Playing" : "Yung Kai • Blue"}
            </span>
          </div>

          {/* Speaker Icon with Sound Waves */}
          <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-3.5">
                <span className="w-0.5 bg-sky-500 rounded-full animate-[soundWave_1s_ease-in-out_infinite]" style={{ height: "60%" }} />
                <span className="w-0.5 bg-teal-500 rounded-full animate-[soundWave_1s_ease-in-out_infinite_0.2s]" style={{ height: "100%" }} />
                <span className="w-0.5 bg-emerald-500 rounded-full animate-[soundWave_1s_ease-in-out_infinite_0.4s]" style={{ height: "40%" }} />
                <Volume2 className="w-3.5 h-3.5 text-sky-600 ml-0.5" />
              </div>
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500" />
            )}
          </div>
        </button>
      </div>
    </>
  );
};

export default AudioPlayer;
