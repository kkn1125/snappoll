import { Message } from '@common/messages';
import {
  ModalContext,
  ModalDispatchContext,
} from '@providers/contexts/ModalContext';
import { ModalActionType } from '@providers/contexts/modalTypes';
import React, { useCallback, useContext, useMemo } from 'react';

export type OpenModalProps<T = void> = {
  info: MessageTemplate;
  slot?: React.ReactNode | null;
  closeCallback?: () => T | Promise<T>;
};

export type OpenInteractiveModalProps<Q extends string, T = void> = {
  slot?: React.ReactNode;
  content: { title: string; content: Q | readonly Q[] } | Q | readonly Q[];
  callback?: () => T | Promise<T>;
  closeCallback?: () => T | Promise<T>;
};

const useModal = () => {
  const modalState = useContext(ModalContext);
  const modalDispatch = useContext(ModalDispatchContext);

  const openModal = useCallback(
    function <T = void>({ info, slot, closeCallback }: OpenModalProps<T>) {
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
        slot,
        closeCallback,
      });
    },
    [modalDispatch],
  );

  const openInteractiveModal = useCallback(
    function <Q extends string, T = void>({
      slot,
      content,
      callback,
      closeCallback,
    }: OpenInteractiveModalProps<Q, T>) {
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
        slot,
        callback,
        closeCallback,
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
