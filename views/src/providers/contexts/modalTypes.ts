export type ModalInitialValue = {
  title: string;
  content: string;
  open: boolean;
  interactive: boolean;
  callback: () => void | Promise<void>;
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
export type ModalReducerAction = {
  type: ModalActionType;
  title?: string;
  content?: string;
  callback?: () => void | Promise<void>;
};
