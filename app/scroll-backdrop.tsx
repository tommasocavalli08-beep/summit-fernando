'use client';

import {useEffect, useRef} from 'react';

/** Decorative, silent footage. Native scrolling is never intercepted. */
export function ScrollBackdrop() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    const section = video?.closest<HTMLElement>('section');
    if (!video || !section) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & {connection?: {saveData?: boolean}}).connection;
    let frame = 0, active = false, target = 0, disposed = false;
    const seek = () => {
      if (!active || reduced.matches || video.seeking || video.readyState < 2 || !Number.isFinite(video.duration)) return;
      const time = target * Math.max(0, video.duration - .08);
      if (Math.abs(video.currentTime - time) > .055) video.currentTime = time;
    };
    const update = () => {
      frame = 0;
      if (!active || document.hidden) return;
      const rect = section.getBoundingClientRect();
      target = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
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
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) { load(); schedule(); }
    }, {rootMargin: '300px 0px'});
    observer.observe(section);
    // A first touch also primes inline decoding on iOS without playing audio.
    const prime = () => {
      if (!active || reduced.matches || connection?.saveData || !video.src) return;
      void video.play().then(() => { video.pause(); if (!disposed) schedule(); }).catch(() => {});
    };
    const preference = () => {
      video.pause();
      if (reduced.matches) {
        video.removeAttribute('src'); video.load(); video.classList.remove('is-ready');
      } else if (active) { load(); schedule(); }
    };
    video.addEventListener('loadeddata', ready);
    video.addEventListener('seeked', seek);
    video.addEventListener('error', () => video.classList.remove('is-ready'), {once: true});
    addEventListener('scroll', schedule, {passive: true});
    addEventListener('resize', schedule);
    addEventListener('touchstart', prime, {passive: true});
    document.addEventListener('visibilitychange', schedule);
    reduced.addEventListener('change', preference);
    return () => {
      disposed = true; observer.disconnect(); cancelAnimationFrame(frame); video.pause();
      video.removeEventListener('loadeddata', ready); video.removeEventListener('seeked', seek);
      removeEventListener('scroll', schedule); removeEventListener('resize', schedule);
      removeEventListener('touchstart', prime); document.removeEventListener('visibilitychange', schedule);
      reduced.removeEventListener('change', preference);
    };
  }, []);
  return <div className="venue-backdrop" aria-hidden="true">
    <img src="/assets/motion/space220-poster.jpg" alt="" loading="lazy" width="512" height="910"/>
    <video ref={ref} muted playsInline preload="none" disablePictureInPicture tabIndex={-1}/>
    <div className="venue-backdrop-shade"/>
  </div>;
}
