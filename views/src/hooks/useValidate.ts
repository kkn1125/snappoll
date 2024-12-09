import { Message } from '@common/messages';
import { SnapPollQuestion } from '@models/SnapPollQuestion';
import { useCallback, useMemo, useState } from 'react';

function useValidate<T extends { [k in string]: any }>(data: T) {
  const [errors, setErrors] = useState<ErrorMessage<T>>({});
  const [validated, setValidated] = useState(false);

  const validate = useCallback(
    (type?: string) => {
      const validateErrors = {} as ErrorMessage<T>;
      const validateKeys = Object.keys(data) as (keyof T)[];

      if (type === 'onlyEmail') {
        const value = data['email'] as string;
        if (value === '') {
          // console.log('email???', data, key, value);
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
        setErrors(validateErrors);
        return Object.keys(validateErrors).length === 0;
      }

      for (const key of validateKeys) {
        const value = data[key] as string;
        if ('email' === key) {
          if (value === '') {
            // console.log('email???', data, key, value);
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
        }
        if ('username' === key) {
          if (value === '') {
            Object.assign(validateErrors, { username: '필수입니다.' });
          } else if (value.length < 4 || value.length > 15) {
            Object.assign(validateErrors, {
              username: Message.Wrong.Username,
            });
          }
        }
        if ('password' === key) {
          if (value === '') {
            Object.assign(validateErrors, { password: '필수입니다.' });
          } else {
            if (type !== 'login') {
              if (
                value.match(
                  /^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*./?\-+])[A-Za-z0-9!@#$%^&*./?\-+]{5,12})$/g,
                ) === null
              ) {
                Object.assign(validateErrors, {
                  password: Message.Wrong.PasswordFormat,
                });
              } else if (
                ((value.match(/[!@#$%^&*./?\-+]/g) as Array<string> | null)
                  ?.length || 0) < 1
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
          }
        }
        if ('checkPassword' === key) {
          if (value === '') {
            Object.assign(validateErrors, {
              checkPassword: Message.Wrong.Required,
            });
          } else if (
            'password' in data &&
            'checkPassword' in data &&
            'checkPassword' === key &&
            data.password !== data.checkPassword
          ) {
            Object.assign(validateErrors, {
              checkPassword: Message.Wrong.CheckPassword,
            });
          }
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
      // console.log(validateErrors);
      setErrors(validateErrors);
      return Object.keys(validateErrors).length === 0;
    },
    [data],
  );

  // const isPass = useMemo(() => {
  //   return Object.keys(errors).length === 0;
  // }, [errors]);

  return { errors, validate, validated, setValidated };
}

export default useValidate;
