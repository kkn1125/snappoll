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
}
const CreateOptionForm: React.FC<CreateOptionFormProps> = ({
  index,
  questionId,
  option,
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

  return (
    <InputItem
      index={index}
      content={option.content}
      onChange={onChange}
      handleRemove={handleRemove}
    />
  );
};

export default memo(CreateOptionForm);
