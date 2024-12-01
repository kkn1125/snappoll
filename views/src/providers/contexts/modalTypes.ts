export type ModalInitialValue<T = any> = {
  title: string;
  content: string;
  open: boolean;
  interactive: boolean;
  callback: () => T | Promise<T>;
};
export const initialValue = {
  title: '',
  content: '',
  open: false,
  interactive: false,
  callback: () => {},
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
  content?: string;
  callback?: () => T | Promise<T>;
};
