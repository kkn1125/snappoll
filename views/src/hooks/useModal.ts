import { Message } from '@common/messages';
import {
  ModalContext,
  ModalDispatchContext,
} from '@providers/contexts/ModalContext';
import { ModalActionType } from '@providers/contexts/modalTypes';
import { useCallback, useContext, useMemo } from 'react';

const useModal = () => {
  const modalState = useContext(ModalContext);
  const modalDispatch = useContext(ModalDispatchContext);

  const openModal = useCallback(
    (info: MessageTemplate) => {
      const concatContent = [];
      if (info.content instanceof Array) {
        concatContent.push(...info.content);
      } else {
        concatContent.push(info.content);
      }
      modalDispatch({
        type: ModalActionType.Open,
        title: info.title,
        content: concatContent,
      });
    },
    [modalDispatch],
  );

  const openInteractiveModal = useCallback(
    function <Q extends string, T = void>(
      content: { title: string; content: Q | readonly Q[] } | Q | readonly Q[],
      callback: () => T | Promise<T>,
    ) {
      const concatContent = [];
      let title = '';
      if (
        content instanceof Object &&
        'title' in content &&
        'content' in content
      ) {
        //
        title = content.title;
        if (content.content instanceof Array) {
          concatContent.push(...content.content);
        } else {
          concatContent.push(content.content);
        }
      } else if (content instanceof Array) {
        concatContent.push(...content);
      } else {
        concatContent.push(content);
      }
      modalDispatch({
        type: ModalActionType.OpenInteractive,
        title: title || '안내',
        content: concatContent,
        callback,
      });
    },
    [modalDispatch],
  );

  const noSaveModal = useCallback(
    function <T = void>(callback: () => T | Promise<T>) {
      modalDispatch({
        type: ModalActionType.OpenInteractive,
        title: '사이트를 새로고침하시겠습니까?',
        content: [Message.Single.Redirect],
        callback,
      });
    },
    [modalDispatch],
  );

  const closeModal = useCallback(() => {
    modalDispatch({ type: ModalActionType.Close });
  }, [modalDispatch]);

  const memoModalState = useMemo(() => modalState, [modalState]);

  return {
    modalState: memoModalState,
    openModal,
    openInteractiveModal,
    closeModal,
    noSaveModal,
  };
};

export default useModal;
