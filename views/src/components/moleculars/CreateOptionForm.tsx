import { snapPollAtom } from '@/recoils/snapPoll.atom';
import { Message } from '@common/messages';
import InputItem from '@components/atoms/InputItem';
import useModal from '@hooks/useModal';
import { SnapPoll } from '@models/SnapPoll';
import { SnapPollOption } from '@models/SnapPollOption';
import { ChangeEvent, memo, useCallback } from 'react';
import { useSetRecoilState } from 'recoil';

interface CreateOptionFormProps {
  index: number;
  questionId: string;
  option: SnapPollOption;
  errors: ErrorMessage<SnapPollOption>;
}
const CreateOptionForm: React.FC<CreateOptionFormProps> = ({
  index,
  questionId,
  option,
  errors,
}) => {
  const { openInteractiveModal } = useModal();
  const setSnapPoll = useSetRecoilState(snapPollAtom);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSnapPoll((snapPoll) => {
      const copyOption = SnapPollOption.copy(option);
      copyOption.setContent(value);

      const copyPoll = SnapPoll.copy(snapPoll);
      copyOption.setContent(value);
      copyPoll.updateOptionByInfo(questionId, copyOption);
      return copyPoll;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = useCallback(() => {
    openInteractiveModal({
      content: Message.Single.Remove,
      callback: () => {
        setSnapPoll((snapPoll) => {
          const copyPoll = SnapPoll.copy(snapPoll);
          copyPoll.deleteOption(questionId, option.id);
          return copyPoll;
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleOrder(optionId: string) {
    return (dir: boolean) => {
      setSnapPoll((snapPoll) => {
        const copyPoll = SnapPoll.copy(snapPoll);
        const question = copyPoll.question.find(
          (question) => question.id === questionId,
        );

        if (!question) return copyPoll;

        const index = question.option.findIndex(
          (voteOption) => voteOption.id === optionId,
        );
        question.option = question.option.map((voteOption, index) =>
          SnapPollOption.copy(voteOption),
        );

        if (dir) {
          // top
          if (index - 1 >= 0) {
            [question.option[index - 1], question.option[index]] = [
              question.option[index],
              question.option[index - 1],
            ];
          }
        } else {
          // down
          if (index + 1 < question.option.length) {
            [question.option[index + 1], question.option[index]] = [
              question.option[index],
              question.option[index + 1],
            ];
          }
        }
        question.option = question.option.map((option, index) => {
          option.order = index;
          return option;
        });
        return copyPoll;
      });
    };
  }

  return (
    <InputItem
      index={index}
      content={option.content}
      onChange={onChange}
      handleRemove={handleRemove}
      errors={errors}
      handleOrder={handleOrder(option.id)}
    />
  );
};

export default memo(CreateOptionForm);
