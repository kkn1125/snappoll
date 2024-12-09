import { useSetRecoilState } from 'recoil';
import CreateSnapPoll from './CreateSnapPoll';
import { snapPollAtom } from '@/recoils/snapPoll.atom';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { getPoll } from '@/apis/poll/getPoll';
import SkeletonCreatePoll from '@components/moleculars/SkeletonCreatePoll';
import { SnapPoll } from '@models/SnapPoll';

interface EditSnapPollProps {}
const EditSnapPoll: React.FC<EditSnapPollProps> = () => {
  const { id } = useParams();
  const setSnapPoll = useSetRecoilState(snapPollAtom);

  const mutate = useMutation({
    mutationKey: ['getPoll', id],
    mutationFn: getPoll,
    onSuccess(data, variables, context) {
      setSnapPoll(data);
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

  return <CreateSnapPoll edit />;
};

export default EditSnapPoll;
