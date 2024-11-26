import {
  ModalContext,
  ModalDispatchContext,
} from '@providers/contexts/ModalContext';
import { ModalActionType } from '@providers/contexts/modalTypes';
import { useCallback, useContext, useState } from 'react';

const useModal = () => {
  const modalState = useContext(ModalContext);
  const modalDispatch = useContext(ModalDispatchContext);
  const openModal = useCallback(
    (info: { title: string; content: string }) => {
      modalDispatch({ type: ModalActionType.Open, ...info });
    },
    [modalDispatch],
  );
  const closeModal = useCallback(() => {
    modalDispatch({ type: ModalActionType.Close });
  }, [modalDispatch]);

  return {
    modalState,
    openModal,
    closeModal,
  };
};

export default useModal;
