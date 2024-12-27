import { snapVoteAtom } from '@/recoils/snapVote.atom';
import { Message } from '@common/messages';
import useModal from '@hooks/useModal';
import { SnapVote } from '@models/SnapVote';
import { SnapVoteOption } from '@models/SnapVoteOption';
import { ChangeEvent, useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import InputItem from './InputItem';

interface CreateVoteOptionItemProps {
  index: number;
  option: SnapVoteOption;
  errors: ErrorMessage<SnapVoteOption>;
}
const CreateVoteOptionItem: React.FC<CreateVoteOptionItemProps> = ({
  index,
  option,
  errors,
}) => {
  const { openInteractiveModal } = useModal();
  const setSnapVote = useSetRecoilState(snapVoteAtom);
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSnapVote((snapVote) => {
      const copySnapVote = SnapVote.copy(snapVote);
      copySnapVote.voteOption = copySnapVote.voteOption.map((opt) => {
        if (opt.id === option.id) {
          const copyOption = SnapVoteOption.copy(option);
          copyOption.content = value;
          return copyOption;
        }
        return opt;
      });
      return copySnapVote;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = useCallback(() => {
    openInteractiveModal({
      content: Message.Single.Remove,
      callback: () => {
        setSnapVote((snapVote) => {
          const copySnapVote = SnapVote.copy(snapVote);
          copySnapVote.deleteOption(option.id);
          return copySnapVote;
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <InputItem
      index={index}
      content={option.content}
      onChange={onChange}
      handleRemove={handleRemove}
      errors={errors}
    />
  );
};

export default CreateVoteOptionItem;
