import { Message } from '@common/messages';
import { SnapPollOption } from '@models/SnapPollOption';
import { SnapPollQuestion } from '@models/SnapPollQuestion';
import { SnapVoteOption } from '@models/SnapVoteOption';
import { isNil } from '@utils/isNil';
import { useCallback, useMemo, useState } from 'react';
import { Q } from 'vitest/dist/chunks/reporters.D7Jzd9GS.js';

function useValidate<T extends { [k in string]: any }>(data: T) {
  const [errors, setErrors] = useState<ErrorMessage<T>>({});
  const [validated, setValidated] = useState(false);

  const validateOnlyEmail = useCallback(function <Q extends T, E>(
    data: Q,
    validateErrors: ErrorMessage<E>,
  ) {
    const value = data['email'] as string;

    if (value === '') {
      Object.assign(validateErrors, { email: '필수입니다.' });
    } else if (
      value.match(
        /^((?=.*[A-Za-z])(?=.*[0-9A-Za-z]?)[A-Za-z0-9]{3,}@{1}(?=.*[A-Za-z0-9-])[A-Za-z0-9-]{1,}(\.(?=.*[a-z])[a-z]{1,}){1,})$/g,
      ) === null
    ) {
      Object.assign(validateErrors, {
        email: Message.Wrong.EmailFormat,
      });
    }
  }, []);

  const validateOnlyPassword = useCallback(function <Q extends T, E>(
    data: Q,
    validateErrors: ErrorMessage<E>,
  ) {
    const value = data['password'] as string;
    if (value === '') {
      Object.assign(validateErrors, { password: '필수입니다.' });
    } /* else if (
      value.match(
        /^((?=.*[A-Za-z])(?=.*[0-9A-Za-z]?)[A-Za-z0-9]{2,10}@{1}(?=.*[A-Za-z0-9-])[A-Za-z0-9-]{1,}(\.(?=.*[a-z])[a-z]{1,}){1,})$/g,
      ) === null
    ) {
      Object.assign(validateErrors, {
        password: Message.Wrong.Password,
      });
    } */
  }, []);
  const validatePassword = useCallback(function <Q extends T, E>(
    data: Q,
    validateErrors: ErrorMessage<E>,
    key: string,
  ) {
    const value = data[key] as string;
    if (value === '') {
      Object.assign(validateErrors, { password: '필수입니다.' });
    } else {
      if (
        value.match(
          /^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*./?\-+])[A-Za-z0-9!@#$%^&*./?\-+]{5,12})$/g,
        ) === null
      ) {
        Object.assign(validateErrors, {
          password: Message.Wrong.PasswordFormat,
        });
      } else if (
        ((value.match(/[!@#$%^&*./?\-+]/g) as Array<string> | null)?.length ||
          0) < 1
      ) {
        Object.assign(validateErrors, {
          password: Message.Wrong.PasswordFormat,
        });
      } else if (value.length < 5 || value.length > 12) {
        Object.assign(validateErrors, {
          password: Message.Wrong.Password,
        });
      }
    }
  }, []);

  const validateUsername = useCallback(function <Q extends T, E>(
    data: Q,
    validateErrors: ErrorMessage<E>,
  ) {
    const value = data['username'] as string;
    if (value === '') {
      Object.assign(validateErrors, { username: '필수입니다.' });
    } else if (value.length < 4 || value.length > 15) {
      Object.assign(validateErrors, {
        username: Message.Wrong.Username,
      });
    }
  }, []);

  const validateCheckPassword = useCallback(function <Q extends T, E>(
    data: Q,
    validateErrors: ErrorMessage<E>,
  ) {
    const value = data['checkPassword'] as string;
    if (value === '') {
      Object.assign(validateErrors, {
        checkPassword: Message.Wrong.Required,
      });
    } else if (
      'password' in data &&
      'checkPassword' in data &&
      data.password !== data.checkPassword
    ) {
      Object.assign(validateErrors, {
        checkPassword: Message.Wrong.CheckPassword,
      });
    }
  }, []);

  const validateBoardPassword = useCallback(function <Q extends T, E>(
    data: Q,
    validateErrors: ErrorMessage<E>,
  ) {
    const password = data['password'] as string;

    if (password === undefined || password === '') {
      Object.assign(validateErrors, {
        password: Message.Wrong.Required,
      });
    } else if (password.length < 3 || password.length > 10) {
      Object.assign(validateErrors, {
        password: '비밀번호는 3 ~ 10자 이내입니다.',
      });
    }
  }, []);

  const validateWriteBoard = useCallback(function <Q extends T, E>(
    data: Q,
    validateErrors: ErrorMessage<E>,
  ) {
    const title = data['title'] as string;
    const content = data['content'] as string;
    const password = data['password'] as string;
    if (title === '') {
      Object.assign(validateErrors, {
        title: Message.Wrong.Required,
      });
    }
    if (content === '') {
      Object.assign(validateErrors, {
        content: Message.Wrong.Required,
      });
    }
    if (password === undefined || password === '') {
      Object.assign(validateErrors, {
        password: Message.Wrong.Required,
      });
    } else if (password.length < 3 || password.length > 10) {
      Object.assign(validateErrors, {
        password:
          '게시글 수정에 필요한 비밀번호입니다. 비밀번호는 3 ~ 10자 이내로 설정할 수 있습니다.',
      });
    }
  }, []);

  const validateWriteBoardForUser = useCallback(function <Q extends T, E>(
    data: Q,
    validateErrors: ErrorMessage<E>,
  ) {
    const title = data['title'] as string;
    const content = data['content'] as string;
    if (title === '') {
      Object.assign(validateErrors, {
        title: Message.Wrong.Required,
      });
    }
    if (content === '') {
      Object.assign(validateErrors, {
        content: Message.Wrong.Required,
      });
    }
  }, []);

  const validate = useCallback(
    (type?: string) => {
      const validateErrors = {} as ErrorMessage<T>;
      const validateKeys = Object.keys(data) as (keyof T)[];

      switch (type) {
        case 'comment': {
          if (data.content === '') {
            Object.assign(validateErrors, {
              content: Message.Wrong.Required,
            });
          }
          break;
        }
        case 'snapPoll': {
          if (data.title === '') {
            Object.assign(validateErrors, {
              title: Message.Wrong.Required,
            });
          }
          if (data.description === '') {
            Object.assign(validateErrors, {
              description: Message.Wrong.Required,
            });
          }
          if (!isNil(data.expiresAt) && data.expiresAt < new Date()) {
            Object.assign(validateErrors, {
              expiresAt: '현재보다 과거일 수 없습니다.',
            });
          }
          if (data.question.length === 0) {
            Object.assign(validateErrors, {
              question: Message.Wrong.LeastRequired,
            });
          }
          if (data.question.length > 0) {
            Object.assign(validateErrors, {
              question: data.question.reduce(
                (
                  acc: ErrorMessage<SnapPollQuestion>[],
                  question: SnapPollQuestion,
                ) => {
                  const error = {} as ErrorMessage<SnapPollQuestion>;
                  if (question.title === '') {
                    error.title = Message.Wrong.Required;
                  }
                  if (
                    question.type === 'checkbox' ||
                    question.type === 'select'
                  ) {
                    if (question.option.length === 0) {
                      error.option = Message.Wrong.LeastRequired;
                    } else {
                      const errors = question.option.reduce(
                        (acc: ErrorMessage<SnapPollOption>[], opt) => {
                          const error = {} as ErrorMessage<SnapPollOption>;
                          if (opt.content === '') {
                            error.content = Message.Wrong.Required;
                          }
                          acc.push(error);
                          return acc;
                        },
                        [],
                      );
                      if (
                        errors.length > 0 &&
                        errors.filter((er) => er.content).length > 0
                      ) {
                        Object.assign(error, {
                          option: errors,
                        });
                      }
                    }
                  }
                  if (Object.keys(error).length > 0) {
                    acc.push(error);
                  }
                  return acc;
                },
                [],
              ),
            });
            //@ts-ignore
            if (validateErrors.question.length === 0) {
              delete validateErrors.question;
            }
          }
          break;
        }
        case 'snapVote':
          if (data.title === '') {
            Object.assign(validateErrors, {
              title: Message.Wrong.Required,
            });
          }
          if (data.description === '') {
            Object.assign(validateErrors, {
              description: Message.Wrong.Required,
            });
          }
          if (!isNil(data.expiresAt) && data.expiresAt < new Date()) {
            Object.assign(validateErrors, {
              expiresAt: '현재보다 과거일 수 없습니다.',
            });
          }
          if (data.voteOption.length === 0) {
            Object.assign(validateErrors, {
              voteOption: Message.Wrong.LeastRequired,
            });
          }
          if (
            data.voteOption.some(
              (voteOption: SnapVoteOption) => voteOption.content.length === 0,
            )
          ) {
            Object.assign(validateErrors, {
              voteOption: data.voteOption.map((opt: SnapVoteOption) => {
                const error = {} as ErrorMessage<SnapPollOption>;
                if (opt.content === '') {
                  error.content = Message.Wrong.Required;
                }
                return error;
              }),
            });
          }
          break;
        case 'passwordChange':
          validatePassword(data, validateErrors, 'currentPassword');
          validatePassword(data, validateErrors, 'password');
          validateCheckPassword(data, validateErrors);
          break;
        case 'boardPassword': {
          validateBoardPassword(data, validateErrors);
          break;
        }
        case 'writeBoard': {
          validateWriteBoard(data, validateErrors);
          break;
        }
        case 'writeBoardForUser': {
          validateWriteBoardForUser(data, validateErrors);
          break;
        }
        case 'login': {
          validateOnlyEmail(data, validateErrors);
          validateOnlyPassword(data, validateErrors);
          break;
        }
        case 'onlyEmail':
          validateOnlyEmail(data, validateErrors);
          break;
        case 'signup':
        default:
          for (const key of validateKeys) {
            if ('email' === key) {
              validateOnlyEmail(data, validateErrors);
            }
            if ('username' === key) {
              validateUsername(data, validateErrors);
            }
            if ('currentPassword' === key) {
              validatePassword(data, validateErrors, 'currentPassword');
            }
            if ('password' === key) {
              validatePassword(data, validateErrors, 'password');
            }
            if ('checkPassword' === key) {
              validateCheckPassword(data, validateErrors);
            }
            if (type === 'snapPoll') {
              if (data.title === '') {
                Object.assign(validateErrors, {
                  title: Message.Wrong.Required,
                });
              }
              if (data.description === '') {
                Object.assign(validateErrors, {
                  description: Message.Wrong.Required,
                });
              }
              if (data.expiresAt && data.expiresAt < new Date()) {
                Object.assign(validateErrors, {
                  expiresAt: '현재보다 과거일 수 없습니다.',
                });
              }
              if (
                data.question.some(
                  (question: SnapPollQuestion) => question.title.length === 0,
                )
              ) {
                const found = data.question.findIndex(
                  (question: SnapPollQuestion) => question.title.length === 0,
                );
                const array = new Array(data.question.length);
                array[found] = '질문을 완성해주세요.';
                Object.assign(validateErrors, {
                  question: array,
                });
              }
            }
          }
          break;
      }

      setErrors(validateErrors);
      return Object.keys(validateErrors).length === 0;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  const clearValidate = useCallback(() => {
    setErrors({});
  }, []);

  // const isPass = useMemo(() => {
  //   return Object.keys(errors).length === 0;
  // }, [errors]);

  return { errors, validate, validated, setValidated, clearValidate };
}

export default useValidate;
