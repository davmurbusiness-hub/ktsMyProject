import { type RefObject, useEffect, useRef } from 'react';

export const useObserver = (
  ref: RefObject<HTMLElement | null>,
  canLoad: boolean,
  isPostsLoading: boolean,
  callback: () => void
) => {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (isPostsLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && canLoad) {
        callback();
      }
    });
    if (ref.current) {
      observer.current.observe(ref.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [isPostsLoading, canLoad, ref, callback]);
};
