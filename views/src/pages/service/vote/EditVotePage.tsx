import { snapVoteAtom } from '@/recoils/snapVote.atom';
import { getGraphVoteData } from '@apis/vote/getGraphVoteData';
import SkeletonCreatePoll from '@components/moleculars/SkeletonCreatePoll';
import { SnapVote } from '@models/SnapVote';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import CreateSnapVote from './CreateVotePage';

interface EditVotePageProps {}
const EditVotePage: React.FC<EditVotePageProps> = () => {
  const { id } = useParams();
  const setSnapVote = useSetRecoilState(snapVoteAtom);

  const mutate = useMutation<
    SnapResponseType<SnapVote>,
    Error,
    string | undefined
  >({
    mutationKey: ['getGraphVoteData', id],
    mutationFn: getGraphVoteData,
    onSuccess(data, variables, context) {
      if (data.data) {
        setSnapVote(data.data);
      }
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

export default EditVotePage;
