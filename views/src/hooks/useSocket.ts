import { messageAtom } from '@/recoils/message.atom';
import { tokenAtom } from '@/recoils/token.atom';
import { Message } from '@common/messages';
import { MessageManager } from '@models/MessageManager';
import { socket } from '@utils/socket';
import { useCallback, useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import useModal from './useModal';

const useSocket = () => {
  const { openModal } = useModal();
  const { user } = useRecoilValue(tokenAtom);
  const setMessage = useSetRecoilState(messageAtom);
  const connect = useCallback(() => {
    return socket.connect;
  }, []);

  const sendMessage = useCallback(
    (message: any) => {
      if (!user) {
        openModal(Message.Require.Login);
        return;
      }
      socket.emit('message', message);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user],
  );

  const messageRead = useCallback(
    (messageId: string) => {
      console.log(user);
      if (!user) {
        openModal(Message.Require.Login);
        return;
      }
      socket
        .emitWithAck('readMessage', {
          userId: user?.id,
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
    [openModal, setMessage, user],
  );

  const memoSocket = useMemo(() => {
    return socket;
  }, []);
  return { socket: memoSocket, connect, sendMessage, messageRead };
};

export default useSocket;
