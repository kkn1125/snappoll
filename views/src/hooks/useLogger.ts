import { Logger } from '@utils/Logger';
import { useEffect, useState } from 'react';

const useLogger = function <T extends string | object>(context?: T) {
  const [logger, setLogger] = useState<Logger<T>>(new Logger(context));

  useEffect(() => {
    setLogger(new Logger(context));
    return () => {
      setLogger(new Logger(context));
    };
  }, [context]);

  return logger;
};

export default useLogger;
