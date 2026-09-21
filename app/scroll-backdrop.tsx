'use client';

import {useEffect, useRef} from 'react';

/** Decorative, silent footage. Native scrolling is never intercepted. */
export function ScrollBackdrop() {
  const ref = useRef<HTMLVideoElement>(null);
  const filmRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & {connection?: {saveData?: boolean}}).connection;
    let frame = 0, active = true, target = 0, disposed = false;
    const seek = () => {
      if (!active || reduced.matches || video.seeking || video.readyState < 1 || !Number.isFinite(video.duration)) return;
      const time = target * Math.max(0, video.duration - .08);
      if (Math.abs(video.currentTime - time) > .055) video.currentTime = time;
    };
    const update = () => {
      frame = 0;
      if (!active || document.hidden) return;
      const root = document.documentElement;
      target = Math.max(0, Math.min(1, scrollY / Math.max(1, root.scrollHeight - root.clientHeight)));
      seek();
    };
    const schedule = () => { if (!frame && active) frame = requestAnimationFrame(update); };
    const ready = () => { video.classList.add('is-ready'); schedule(); };
    const load = () => {
      if (!video.getAttribute('src') && !reduced.matches && !connection?.saveData) {
        video.src = '/assets/motion/space220-scroll.mp4';
        video.load();
      }
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    load(); schedule();
    let primed = false;
    // A first touch also primes inline decoding on iOS without playing audio.
    const prime = () => {
      if (primed || reduced.matches || connection?.saveData || !video.getAttribute('src')) return;
      primed = true;
      void video.play().then(() => { video.pause(); if (!disposed) schedule(); }).catch(() => { primed = false; });
    };
    const preference = () => {
      video.pause();
      if (reduced.matches) {
        video.removeAttribute('src'); video.load(); video.classList.remove('is-ready');
      } else if (active) { load(); schedule(); }
    };
    video.muted = true; video.defaultMuted = true;
    video.addEventListener('loadeddata', ready);
    video.addEventListener('canplay', ready);
    video.addEventListener('seeked', schedule);
    video.addEventListener('loadedmetadata', schedule);
    video.addEventListener('error', () => video.classList.remove('is-ready'), {once: true});
    addEventListener('scroll', schedule, {passive: true});
    addEventListener('resize', schedule);
    addEventListener('touchstart', prime, {passive: true});
    addEventListener('touchend', prime, {passive: true});
    addEventListener('pageshow', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', schedule);
    reduced.addEventListener('change', preference);
    return () => {
      disposed = true; observer.disconnect(); cancelAnimationFrame(frame); video.pause();
      video.removeEventListener('canplay', ready);
      video.removeEventListener('loadeddata', ready); video.removeEventListener('seeked', schedule);
      video.removeEventListener('loadedmetadata', schedule);
      removeEventListener('scroll', schedule); removeEventListener('resize', schedule);
      removeEventListener('touchstart', prime);
      removeEventListener('touchend', prime); removeEventListener('pageshow', schedule);
      window.visualViewport?.removeEventListener('resize', schedule); document.removeEventListener('visibilitychange', schedule);
      reduced.removeEventListener('change', preference);
    };
  }, []);
  useEffect(() => {
    const film = filmRef.current;
    if (!film) return;
    const touchLike = matchMedia('(hover: none), (pointer: coarse)');
    const toggle = () => { if (touchLike.matches) film.classList.toggle('is-expanded'); };
    film.addEventListener('click', toggle);
    return () => film.removeEventListener('click', toggle);
  }, []);
  return <figure ref={filmRef} className="scroll-film" aria-hidden="true">
    <div className="scroll-film-frame">
      <img src="/assets/motion/space220-poster.jpg" alt="" width="512" height="910"/>
      <video ref={ref} muted playsInline preload="auto" disablePictureInPicture tabIndex={-1}/>
    </div>
    <figcaption>SPACE 220</figcaption>
    <div className="scroll-film-progress"/>
  </figure>;
}
