import {useEffect, useRef} from "react";

export const useObserver = (ref: any, canLoad: boolean, isPostsLoading: boolean, cal: () => void) => {
    const observer = useRef<any>(null);

    useEffect(() => {
        if (isPostsLoading) return;
        if (observer.current) observer.current.disconnect();

        var callback = function (entries: any) {
            if (entries[0].isIntersecting && canLoad) {
                cal();
            }
        };
        observer.current = new IntersectionObserver(callback);
        observer.current.observe(ref.current)
    }, [isPostsLoading]);
}