import { snapVoteAtom } from '@/recoils/snapVote.atom';
import SkeletonCreatePoll from '@components/moleculars/SkeletonCreatePoll';
import { SnapVote } from '@models/SnapVote';
import CreateSnapVote from './CreateSnapVote';
import { getPoll } from '@/apis/poll/getPoll';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { getVote } from '@/apis/vote/getVote';

interface EditSnapVoteProps {}
const EditSnapVote: React.FC<EditSnapVoteProps> = () => {
  const { id } = useParams();
  const setSnapVote = useSetRecoilState(snapVoteAtom);

  const mutate = useMutation({
    mutationKey: ['getVote', id],
    mutationFn: getVote,
    onSuccess(data, variables, context) {
      setSnapVote(data);
    },
  });

  useEffect(() => {
    mutate.mutate(id);
    return () => {
      setSnapVote(new SnapVote());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (mutate.isPending) {
    return <SkeletonCreatePoll />;
  }

  return <CreateSnapVote edit />;
};

export default EditSnapVote;
