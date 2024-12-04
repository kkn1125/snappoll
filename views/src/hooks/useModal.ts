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
      content: Q | readonly Q[],
      callback: () => T | Promise<T>,
    ) {
      const concatContent = [];
      if (content instanceof Array) {
        concatContent.push(...content);
      } else {
        concatContent.push(content);
      }
      modalDispatch({
        type: ModalActionType.OpenInteractive,
        title: '안내',
        content: concatContent,
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
  };
};

export default useModal;
