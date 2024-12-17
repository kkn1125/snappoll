import { messageAtom } from '@/recoils/message.atom';
import { tokenAtom } from '@/recoils/token.atom';
import { MessageManager } from '@models/MessageManager';
import { socket } from '@utils/socket';
import { useCallback, useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import useModal from './useModal';
import { Message } from '@common/messages';

const useSocket = () => {
  const setMessage = useSetRecoilState(messageAtom);
  const { user } = useRecoilValue(tokenAtom);
  const { openModal } = useModal();
  const connect = useCallback(() => {
    return socket.connect;
  }, []);

  const sendMessage = useCallback(
    (message: any) => {
      if (!user) {
        openModal({ info: Message.Require.Login });
        return;
      }
      socket.emit('message', message);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const messageRead = useCallback(
    (messageId: string) => {
      if (!user) {
        openModal({ info: Message.Require.Login });
        return;
      }
      socket
        .emitWithAck('readMessage', {
          userId: user.id,
          messageId,
        })
        .then((res) => {
          setMessage((message) => {
            const newMessage = MessageManager.copy(message);
            newMessage.receiver = res;
            return newMessage;
          });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user],
  );

  const messageAllRead = useCallback(
    (messageIds: string[]) => {
      if (!user) {
        openModal({ info: Message.Require.Login });
        return;
      }
      socket
        .emitWithAck('readAllMessage', {
          userId: user.id,
          messageIds,
        })
        .then((res) => {
          setMessage((message) => {
            const newMessage = MessageManager.copy(message);
            newMessage.receiver = res;
            return newMessage;
          });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user],
  );

  const getMessages = useCallback(() => {
    socket.emitWithAck('getMessages', { userId: user?.id }).then((res) => {
      setMessage((message) => {
        const newMessage = MessageManager.copy(message);
        newMessage.receiver = res;
        return newMessage;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const memoSocket = useMemo(() => {
    return socket;
  }, []);
  return {
    socket: memoSocket,
    connect,
    getMessages,
    sendMessage,
    messageRead,
    messageAllRead,
  };
};

export default useSocket;
