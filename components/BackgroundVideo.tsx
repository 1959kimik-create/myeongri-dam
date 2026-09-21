"use client";

import { useEffect, useRef } from "react";

const VIDEO_SRC = "/bg-video.mp4";
const VOLUME = 0.05;
const MIN_CROSSFADE_SEC = 0.8;
const MAX_CROSSFADE_SEC = 1.4;
const CROSSFADE_RATIO = 0.12;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function crossfadeDuration(videoDuration: number): number {
  if (!videoDuration || Number.isNaN(videoDuration)) return MAX_CROSSFADE_SEC;
  return Math.min(
    MAX_CROSSFADE_SEC,
    Math.max(MIN_CROSSFADE_SEC, videoDuration * CROSSFADE_RATIO),
  );
}

export default function BackgroundVideo() {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const activeRef = useRef<"A" | "B">("A");
  const crossfadingRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    if (!videoA || !videoB) return;

    const videos = [videoA, videoB];

    const getActive = () => (activeRef.current === "A" ? videoA : videoB);
    const getInactive = () => (activeRef.current === "A" ? videoB : videoA);

    const setLayerOpacity = (video: HTMLVideoElement, opacity: number) => {
      video.style.opacity = String(opacity);
    };

    const prepareVideo = (video: HTMLVideoElement) => {
      video.volume = 0;
      video.muted = false;
    };

    videos.forEach(prepareVideo);
    setLayerOpacity(videoA, 1);
    setLayerOpacity(videoB, 0);
    videoA.volume = VOLUME;

    const startCrossfade = async () => {
      if (crossfadingRef.current) return;

      const outgoing = getActive();
      const incoming = getInactive();

      if (!outgoing.duration || Number.isNaN(outgoing.duration)) return;

      crossfadingRef.current = true;

      incoming.currentTime = 0;
      incoming.volume = 0;
      setLayerOpacity(incoming, 0);

      try {
        await incoming.play();
      } catch {
        crossfadingRef.current = false;
        return;
      }

      const fadeSec = crossfadeDuration(outgoing.duration);
      const startTime = performance.now();
      const durationMs = fadeSec * 1000;

      const animate = (now: number) => {
        const progress = Math.min((now - startTime) / durationMs, 1);
        const eased = easeInOutCubic(progress);

        setLayerOpacity(outgoing, 1 - eased);
        setLayerOpacity(incoming, eased);
        outgoing.volume = VOLUME * (1 - eased);
        incoming.volume = VOLUME * eased;

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
          return;
        }

        outgoing.pause();
        outgoing.currentTime = 0;
        outgoing.volume = 0;
        setLayerOpacity(outgoing, 0);

        incoming.volume = VOLUME;
        setLayerOpacity(incoming, 1);

        activeRef.current = activeRef.current === "A" ? "B" : "A";
        crossfadingRef.current = false;
      };

      rafRef.current = requestAnimationFrame(animate);
    };

    const tick = () => {
      if (!crossfadingRef.current) {
        const active = getActive();
        const duration = active.duration;

        if (duration && !Number.isNaN(duration) && active.currentTime > 0) {
          const fadeSec = crossfadeDuration(duration);
          const remaining = duration - active.currentTime;

          if (remaining <= fadeSec && remaining > 0) {
            void startCrossfade();
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const startPlayback = async () => {
      try {
        videoA.muted = false;
        await videoA.play();
      } catch {
        videos.forEach((video) => {
          video.muted = true;
        });
        await videoA.play();

        const unlockAudio = () => {
          videos.forEach((video) => {
            video.muted = false;
          });
          getActive().volume = VOLUME;
          void getActive().play();
        };

        document.addEventListener("click", unlockAudio, { once: true });
        document.addEventListener("touchstart", unlockAudio, { once: true });
        document.addEventListener("keydown", unlockAudio, { once: true });
      }
    };

    const onEnded = (event: Event) => {
      if (event.target === getActive() && !crossfadingRef.current) {
        void startCrossfade();
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) return;
      const active = getActive();
      if (active.paused) {
        void active.play();
      } else if (
        active.duration &&
        !Number.isNaN(active.duration) &&
        active.currentTime >= active.duration - 0.05 &&
        !crossfadingRef.current
      ) {
        void startCrossfade();
      }
    };

    videos.forEach((video) => video.addEventListener("ended", onEnded));
    document.addEventListener("visibilitychange", onVisibilityChange);

    void startPlayback();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      videos.forEach((video) => video.removeEventListener("ended", onEnded));
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div className="bg-video-container" aria-hidden="true">
      <video
        ref={videoARef}
        className="bg-video bg-video-layer"
        src={VIDEO_SRC}
        autoPlay
        playsInline
        preload="auto"
      />
      <video
        ref={videoBRef}
        className="bg-video bg-video-layer"
        src={VIDEO_SRC}
        playsInline
        preload="auto"
      />
      <div className="bg-video-scrim" />
    </div>
  );
}
