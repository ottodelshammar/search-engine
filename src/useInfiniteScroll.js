import { useState, useEffect } from 'react';

const useInfiniteScroll = (handleMovieData) => {
    const [isFetching, setIsFetching] = useState(false);

    const handleScroll = () => {
        if (Math.round(window.innerHeight + document.documentElement.scrollTop) !== document.documentElement.offsetHeight) return;
        setIsFetching(true);
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (!isFetching) return;
        handleMovieData();
    }, [isFetching]);

    return [isFetching, setIsFetching];

};

export default useInfiniteScroll;

