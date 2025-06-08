import { snapPollAtom } from '@/recoils/snapPoll.atom';
import { getGraphPollData } from '@apis/poll/getGraphPollData';
import SkeletonCreatePoll from '@components/moleculars/SkeletonCreatePoll';
import { SnapPoll } from '@models/SnapPoll';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import CreatePollPage from './CreatePollPage';

interface EditPollPageProps {}
const EditPollPage: React.FC<EditPollPageProps> = () => {
  const { id } = useParams();
  const setSnapPoll = useSetRecoilState(snapPollAtom);

  const mutate = useMutation<
    SnapResponseType<SnapPoll>,
    Error,
    string | undefined
  >({
    mutationKey: ['getGraphPollData', id],
    mutationFn: getGraphPollData,
    onSuccess(data, variables, context) {
      if (data.data) {
        setSnapPoll(data.data);
      }
    },
  });

  useEffect(() => {
    mutate.mutate(id);
    return () => {
      setSnapPoll(new SnapPoll());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (mutate.isPending) {
    return <SkeletonCreatePoll mode="edit" />;
  }

  return <CreatePollPage edit />;
};

export default EditPollPage;
