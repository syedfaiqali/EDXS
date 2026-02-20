import { useEffect, useState } from 'react';

const useIntersectionObserver = (ref: any, options: IntersectionObserverInit = { threshold: 0.1 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const currentRef = ref.current;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, options);

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.disconnect();
            }
        };
    }, [ref]); // options is excluded to avoid infinite loop if not memoized by caller

    return isVisible;
};

export default useIntersectionObserver;
