export type ModalInitialValue<T = any> = {
  title: string;
  content: string[];
  slot?: React.ReactNode;
  open: boolean;
  interactive: boolean;
  callback: () => T | Promise<T>;
  closeCallback?: () => T | Promise<T>;
};
export const initialValue = {
  title: '',
  content: [],
  slot: undefined,
  open: false,
  interactive: false,
  callback: () => {},
  closeCallback: () => {},
} as ModalInitialValue;
export const ModalActionType = {
  Open: 'Open',
  OpenInteractive: 'OpenInteractive',
  Close: 'Close',
} as const;
export type ModalActionType =
  (typeof ModalActionType)[keyof typeof ModalActionType];
export type ModalReducerAction<T = any> = {
  type: ModalActionType;
  title?: string;
  content?: string[];
  slot?: React.ReactNode;
  callback?: () => T | Promise<T>;
  closeCallback?: () => T | Promise<T>;
};
