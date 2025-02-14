'use client';
import BackButton from '@/components/ui/BackButton';
import styles from './UserProfileSettings.module.scss';
import { Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { UserService } from '@/services/user.service';
import { setMessage } from '@/redux/reducers/ui/slice';
import getApiMessage from '@/utils/getApiMessage';
import { setUserData } from '@/redux/reducers/user/slice';

const UserProfileSettings = () => {
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();

  const onChange = (values) => {
    UserService.changeProfile(values)
      .then(() => {
        const { name, description } = values;
        dispatch(setUserData({ ...user, name, description }));

        dispatch(setMessage({ text: 'Настройки обновлены', status: true }));
      })
      .catch((error) => {
        const msg = getApiMessage(error.response);
        if (msg) {
          dispatch(setMessage(msg));
        } else {
          dispatch(setMessage({ text: 'Ошибка', status: false }));
        }
      });
  };

  return (
    <div className={styles.root}>
      <BackButton text="Настройки блога" />

      <div className={styles.wrap}>
        <Formik
          onSubmit={onChange}
          enableReinitialize
          initialValues={{ name: user.name, description: user.description }}>
          <Form>
            <div className={`floatingInput ${styles.input}`}>
              <Field name="name" type="text" />
              <label>Название</label>
            </div>

            <div className={`floatingInput ${styles.input}`}>
              <Field name="description" type="text" as="textarea" />
              <label>Описание</label>
            </div>

            <button className="btn-primary" type="submit">
              Сохранить
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default UserProfileSettings;
