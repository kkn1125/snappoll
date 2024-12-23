// import { HEADER_CHANGE_POINT } from '@common/variables';
import { useEffect, useState } from 'react';

const useScroll = () => {
  // const [current, setCurrent] = useState(0);
  // const [isEnd, setIsEnd] = useState(false);
  const [isStart, setIsStart] = useState(true);

  useEffect(() => {
    const main = document.querySelector('#main') as HTMLDivElement;
    function handleScroll(e: Event) {
      const target = e.target as HTMLElement;
      const max = target.scrollHeight - target.clientHeight;
      const valueCurrent = Math.ceil(target.scrollTop);
      const valueTop = valueCurrent === 0;
      const valueBottom = valueCurrent === max;
      setIsStart((isStart) => (isStart !== valueTop ? valueTop : isStart));
      // setIsEnd((isEnd) => (isEnd !== valueBottom ? valueBottom : isEnd));
      // setCurrent(valueCurrent);
    }
    main!.addEventListener('scroll', handleScroll);
    return () => {
      main!.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { /* current, isEnd, */ isStart };
};

export default useScroll;
