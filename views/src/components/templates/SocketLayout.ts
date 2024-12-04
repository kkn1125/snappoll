import { messageAtom } from '@/recoils/message.atom';
import { tokenAtom } from '@/recoils/token.atom';
import useSocket from '@hooks/useSocket';
import { MessageManager } from '@models/MessageManager';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

interface SocketLayoutProps {
  children: React.ReactNode;
}
const SocketLayout: React.FC<SocketLayoutProps> = ({ children }) => {
  const setMessage = useSetRecoilState(messageAtom);
  const { user } = useRecoilValue(tokenAtom);
  const { socket, getMessages } = useSocket();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState<any[]>([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      getMessages();
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value: any) {
      setFooEvents((previous) => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message', onFooEvent);

    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message', onFooEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};

export default SocketLayout;
