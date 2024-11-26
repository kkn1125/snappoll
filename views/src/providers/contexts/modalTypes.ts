export type ModalInitialValue = {
  title: string;
  content: string;
  open: boolean;
};
export const initialValue = {
  title: '',
  content: '',
  open: false,
} as ModalInitialValue;
export const ModalActionType = {
  Open: 'Open',
  Close: 'Close',
} as const;
export type ModalActionType =
  (typeof ModalActionType)[keyof typeof ModalActionType];
export type ModalReducerAction = {
  type: ModalActionType;
  title?: string;
  content?: string;
};
