import { snapApi } from '..';

interface UpdateBoardProps {
  id: string;
  boardData: Record<string, unknown>;
}
export const updateBoard = async ({ id, boardData }: UpdateBoardProps) => {
  const { data } = await snapApi.patch(`/boards/${id}`, boardData);
  return data;
};
