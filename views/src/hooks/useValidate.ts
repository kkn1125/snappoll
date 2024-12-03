import { Message } from '@common/messages';
import { useCallback, useMemo, useState } from 'react';

function useValidate<T extends object>(data: T) {
  const [errors, setErrors] = useState<ErrorMessage<T>>({});

  const validate = useCallback(() => {
    const validateErrors = {} as ErrorMessage<T>;
    const validateKeys = Object.keys(data) as (keyof T)[];
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
        } else if (
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
    }
    // console.log(validateErrors);
    setErrors(validateErrors);
    return Object.keys(validateErrors).length === 0;
  }, [data]);

  // const isPass = useMemo(() => {
  //   return Object.keys(errors).length === 0;
  // }, [errors]);

  return { errors, validate };
}

export default useValidate;
