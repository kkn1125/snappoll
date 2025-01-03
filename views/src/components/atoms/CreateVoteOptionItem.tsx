import { snapVoteAtom } from '@/recoils/snapVote.atom';
import { Message } from '@common/messages';
import useModal from '@hooks/useModal';
import { SnapVote } from '@models/SnapVote';
import { SnapVoteOption } from '@models/SnapVoteOption';
import { ChangeEvent, useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import InputItem from './InputItem';
import useLogger from '@hooks/useLogger';

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
  const { debug } = useLogger('CreateVoteOptionItem');
  const { openInteractiveModal } = useModal();
  const setSnapVote = useSetRecoilState(snapVoteAtom);
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSnapVote((snapVote) => {
      const copySnapVote = SnapVote.copy(snapVote);
      copySnapVote.voteOption = copySnapVote.voteOption.map((opt) => {
        if (opt.id === option.id) {
          const copyOption = SnapVoteOption.copy(opt);
          copyOption.content = value;
          // debug(`${copyOption.content} : ${copyOption.order}`);
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

  function handleOrder(dir: boolean) {
    setSnapVote((snapVote) => {
      const copyVote = SnapVote.copy(snapVote);
      const index = copyVote.voteOption.findIndex(
        (voteOption) => voteOption.id === option.id,
      );
      copyVote.voteOption = copyVote.voteOption.map((voteOption, index) =>
        SnapVoteOption.copy(voteOption),
      );

      if (dir) {
        // top
        if (index - 1 >= 0) {
          [copyVote.voteOption[index - 1], copyVote.voteOption[index]] = [
            copyVote.voteOption[index],
            copyVote.voteOption[index - 1],
          ];
        }
      } else {
        // down
        if (index + 1 < copyVote.voteOption.length) {
          [copyVote.voteOption[index + 1], copyVote.voteOption[index]] = [
            copyVote.voteOption[index],
            copyVote.voteOption[index + 1],
          ];
        }
      }
      copyVote.voteOption = copyVote.voteOption.map((option, index) => {
        option.order = index;
        return option;
      });
      // debug(copyVote.voteOption.map((opt) => `${opt.content} : ${opt.order}`));
      return copyVote;
    });
  }

  return (
    <InputItem
      index={index}
      content={option.content}
      onChange={onChange}
      handleRemove={handleRemove}
      errors={errors}
      handleOrder={handleOrder}
    />
  );
};

export default CreateVoteOptionItem;
