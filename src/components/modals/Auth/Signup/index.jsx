'use client';
import { queryClient } from '@/components/providers/MainProvider';
import styles from '../AuthModal.module.scss';
import MainModalLayout from '@/components/layouts/Modal/Main';
import { setMessage, setModal } from '@/redux/reducers/ui/slice';
import { setAccessToken, setUserDataRefresh } from '@/redux/reducers/user/slice';
import { AuthService } from '@/services/auth.service';
import getApiMessage from '@/utils/getApiMessage';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import ReactModal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

const SignupModal = () => {
  const dispatch = useDispatch();
  const [formLoading, setFormLoading] = React.useState(false);
  const [successSignup, setSuccessSignup] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const isOpen = useSelector((state) => state.ui.modal.auth.signup?.isOpen);

  const onRequestClose = () => {
    dispatch(setModal({ modal: 'auth', data: { signup: { isOpen: false } } }));
    setSuccessSignup(false);
    setEmail('');
  };

  const onSubmit = (values) => {
    setFormLoading(true);

    AuthService.signup(values)
      .then((res) => {
        setEmail(values.email);
        setSuccessSignup(true);
        queryClient.refetchQueries({ queryKey: ['topics'] });
      })
      .catch((error) => {
        const msg = getApiMessage(error.response);

        if (msg) {
          dispatch(setMessage(msg));
        }
      })
      .finally(() => {
        setFormLoading(false);
      });
  };

  return (
    <ReactModal
      overlayClassName="main-modal-overlay"
      className={`main-modal ${styles.root}`}
      isOpen={isOpen}
      ariaHideApp={false}
      onRequestClose={onRequestClose}>
      {successSignup && (
        <MainModalLayout title={'Письмо отправлено'} onClose={onRequestClose}>
          <span className={styles.message}>
            Мы отправили письмо для подтверждения почтового адреса на {email}
          </span>
        </MainModalLayout>
      )}

      {!successSignup && (
        <MainModalLayout title={'Регистрация'} onClose={onRequestClose}>
          <Formik onSubmit={onSubmit} initialValues={{ name: '', email: '', password: '' }}>
            <Form>
              <Field name="name" type="text" placeholder="Имя или название" />
              <Field name="email" type="email" placeholder="Эл. почта" />
              <Field name="password" type="password" placeholder="Пароль" />

              <div className={styles.terms}>
                Регистрируясь, вы соглашаетесь с{' '}
                <Link href="/page/terms">условиями использования</Link>
              </div>

              <button className="btn-primary" type="submit">
                Зарегистрироваться
              </button>
            </Form>
          </Formik>

          <div className={styles.secondary}>
            Есть аккаунт?{' '}
            <button
              disabled={formLoading}
              onClick={() =>
                dispatch(
                  setModal({
                    modal: 'auth',
                    data: { login: { isOpen: true }, signup: { isOpen: false } },
                  }),
                )
              }>
              Войти
            </button>
          </div>
        </MainModalLayout>
      )}
    </ReactModal>
  );
};

export default SignupModal;
