import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { refreshAdmissionCache, REFRESH_INTERVAL_MS } from '../store/admissionSlice';
import type { AppDispatch } from '../store';

/**
 * Keeps the cached admissions data current by re-fetching it every few minutes
 * in the background.
 *
 * The refresh writes straight into the Redux cache, so components re-render
 * with newer data without ever showing a loading state — nothing the visitor is
 * reading disappears while a request is in flight.
 *
 * Two things keep this from being wasteful:
 *
 *  - only keys already in the cache are refreshed, so it never fetches data
 *    nobody has looked at;
 *  - the timer stops while the tab is hidden, and a refresh runs on return if
 *    the tab was away longer than the interval, so a backgrounded tab does not
 *    poll all day.
 */
const useAdmissionRefresh = (): void => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        let timer: number | undefined;
        let lastRun = Date.now();

        const runRefresh = () => {
            lastRun = Date.now();
            dispatch(refreshAdmissionCache());
        };

        const start = () => {
            window.clearInterval(timer);
            timer = window.setInterval(runRefresh, REFRESH_INTERVAL_MS);
        };

        const stop = () => {
            window.clearInterval(timer);
            timer = undefined;
        };

        const handleVisibility = () => {
            if (document.hidden) {
                stop();
                return;
            }

            // Catch up on anything missed while the tab was in the background.
            if (Date.now() - lastRun >= REFRESH_INTERVAL_MS) {
                runRefresh();
            }
            start();
        };

        if (!document.hidden) {
            start();
        }

        document.addEventListener('visibilitychange', handleVisibility);
        return () => {
            stop();
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [dispatch]);
};

export default useAdmissionRefresh;
