import { useEffect, useState } from 'react';

const useScroll = () => {
  const [current, setCurrent] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [isStart, setIsStart] = useState(true);

  useEffect(() => {
    const main = document.querySelector('#main') as HTMLDivElement;
    function handleScroll(e: Event) {
      const target = e.target as HTMLElement;
      const max = target.scrollHeight - target.clientHeight;
      const current = Math.ceil(target.scrollTop);
      setIsStart(current === 0);
      setIsEnd(current === max);
      setCurrent(current);
    }
    main!.addEventListener('scroll', handleScroll);
    return () => {
      main!.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { current, isEnd, isStart };
};

export default useScroll;
