import { Message } from '@common/messages';
import { SnapPollQuestion } from '@models/SnapPollQuestion';
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
        /^((?=.*[A-Za-z])(?=.*[0-9A-Za-z]?)[A-Za-z0-9]{2,10}@{1}(?=.*[A-Za-z0-9-])[A-Za-z0-9-]{1,}(\.(?=.*[a-z])[a-z]{1,}){1,})$/g,
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

  const validate = useCallback(
    (type?: string) => {
      const validateErrors = {} as ErrorMessage<T>;
      const validateKeys = Object.keys(data) as (keyof T)[];

      switch (type) {
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
          break;
        }
        case 'login': {
          validateOnlyEmail(data, validateErrors);
          validateOnlyPassword(data, validateErrors);
          break;
        }
        case 'signup':
          for (const key of validateKeys) {
            // const value = data[key] as string;
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
          }
          break;
        default:
          for (const key of validateKeys) {
            // const value = data[key] as string;
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

  // const isPass = useMemo(() => {
  //   return Object.keys(errors).length === 0;
  // }, [errors]);

  return { errors, validate, validated, setValidated };
}

export default useValidate;
