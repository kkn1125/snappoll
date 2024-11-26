export type InitialValue = {
  loading: boolean;
  timeout: number;
  content?: string;
  close?: boolean;
};

export const initialValue: InitialValue = {
  loading: false,
  timeout: 0,
  content: 'Loading...',
  close: undefined,
};

export const ActionType = {
  Open: 'Open',
  Update: 'Update',
  Close: 'Close',
} as const;
export type ActionType = (typeof ActionType)[keyof typeof ActionType];

export interface LoadingReducerAction {
  type: ActionType;
  timeout?: number;
  content?: string;
  close?: boolean;
}
