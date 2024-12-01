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
      modalDispatch({ type: ModalActionType.Open, ...info });
    },
    [modalDispatch],
  );
  const openInteractiveModal = useCallback(
    function <T>(content: string, callback: () => T | Promise<T>) {
      modalDispatch({
        type: ModalActionType.OpenInteractive,
        title: '안내',
        content,
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
