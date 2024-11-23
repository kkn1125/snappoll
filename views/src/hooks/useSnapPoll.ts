import snapPollAtom from '@/recoils/snapPoll.atom';
import { SelectChangeEvent } from '@mui/material';
import { Poll } from '@utils/Poll';
import { ChangeEvent, useCallback } from 'react';
import { useRecoilState } from 'recoil';

const useSnapPoll = () => {
  const [snapPoll, setSnapPoll] = useRecoilState(snapPollAtom);

  const updateSnapPoll = useCallback(
    function <T extends 'text' & 'option' & 'checkbox'>(current: Poll<T>) {
      setSnapPoll((snapPoll) => ({
        ...snapPoll,
        polls: snapPoll.polls.map((poll) => {
          if (poll.name === current.name) {
            return new Poll<T>(current);
          }
          return poll;
        }),
      }));
    },
    [setSnapPoll],
  );

  const addSnapPoll = useCallback(
    function <T extends 'text' & 'option' & 'checkbox'>(current: Poll<T>) {
      setSnapPoll((snapPoll) => ({
        ...snapPoll,
        polls: snapPoll.polls.concat(new Poll<T>(current)),
      }));
    },
    [setSnapPoll],
  );

  const addSnapPolls = useCallback(
    function <T extends 'text' & 'option' & 'checkbox'>(polls: Poll<T>[]) {
      for (const poll of polls) {
        addSnapPoll(poll);
      }
    },
    [addSnapPoll],
  );

  const setSnapPolls = useCallback(
    (polls: Poll<PollType['type']>[]) => {
      setSnapPoll((snapPoll) => ({
        ...snapPoll,
        polls,
      }));
    },
    [setSnapPoll],
  );

  const clearSnapPoll = useCallback(() => {
    setSnapPoll((snapPoll) => ({
      ...snapPoll,
      polls: [],
    }));
  }, [setSnapPoll]);

  const onChange = useCallback(
    (pollId: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      const checked = target.checked;

      function updateItems(poll: Poll<PollType['type']>) {
        poll.items = poll.items.map((item) => {
          if (poll.id === pollId) {
            poll.value = value;
          }
          if (poll.id === pollId) {
            (item as Poll<'option'>['items'][number]).value = value;
          }
          if (poll.id === pollId) {
            (item as Poll<'checkbox'>['items'][number]).checked = checked;
          }
          return item;
        });
        return poll;
      }

      function updateText(poll: Poll<PollType['type']>) {
        if (name === 'required') {
          Object.assign(poll, { [name]: checked });
        } else {
          Object.assign(poll, { [name]: value });
        }
        return poll;
      }

      setSnapPoll((snapPoll) => ({
        ...snapPoll,
        polls: snapPoll.polls.map((poll) => {
          if (poll.id === pollId) {
            if (name === 'items') {
              return updateItems(new Poll(poll));
            } else {
              return updateText(new Poll(poll));
            }
          }
          return poll;
        }),
      }));
    },
    [setSnapPoll],
  );
  const onSelectChange = useCallback(
    (pollId: string) => (e: SelectChangeEvent) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;

      function updateItems(poll: Poll<PollType['type']>) {
        poll.items = poll.items.map((item) => {
          if (poll.id === pollId) {
            poll.value = value;
          }
          if (poll.id === pollId) {
            (item as Poll<'option'>['items'][number]).value = value;
          }
          return item;
        });
        return poll;
      }

      function updateText(poll: Poll<PollType['type']>) {
        Object.assign(poll, { [name]: value });
        return poll;
      }

      setSnapPoll((snapPoll) => ({
        ...snapPoll,
        polls: snapPoll.polls.map((poll) => {
          if (poll.id === pollId) {
            if (name === 'items') {
              return updateItems(new Poll(poll));
            } else {
              return updateText(new Poll(poll));
            }
          }
          return poll;
        }),
      }));
    },
    [setSnapPoll],
  );

  return {
    polls: snapPoll.polls,
    setSnapPolls,
    addSnapPoll,
    addSnapPolls,
    updateSnapPoll,
    clearSnapPoll,
    onChange,
    onSelectChange,
  };
};

export default useSnapPoll;
