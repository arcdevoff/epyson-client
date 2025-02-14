'use client';
import React from 'react';
import Image from 'next/image';
import styles from './UserProfile.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { IconPencil, IconPhoto, IconSettings, IconTrash } from '@tabler/icons-react';
import { setMessage, setModal } from '@/redux/reducers/ui/slice';
import { UserService } from '@/services/user.service';
import SubscribersModal from '@/components/modals/User/Subscribers';
import SubscriptionsModal from '@/components/modals/User/Subscriptions';
import UserFeed from './Feed';
import { UploadService } from '@/services/upload.service';
import getApiMessage from '@/utils/getApiMessage';
import Loading from '@/components/ui/Loading';
import { setUserData } from '@/redux/reducers/user/slice';
import MainPopover from '@/components/ui/Main/Popover';
import { useRouter } from 'next/navigation';
import ContentLoader from 'react-content-loader';

const subscribersLimit = process.env.NEXT_PUBLIC_SUBSCRIBERS_LIMIT;
const UserProfile = ({ data }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user.data);
  const myProfile = user?.id === data.id;
  const [profile, setProfile] = React.useState(myProfile ? user : data);
  const [info, setInfo] = React.useState(null);
  const [showCoverEditorActions, setShowCoverEditorActions] = React.useState(false);
  const [showAvatarEditorActions, setShowAvatarEditorActions] = React.useState(false);
  const [coverUploadStatus, setCoverUploadStatus] = React.useState('');
  const [avatarUpdateStatus, setAvatarUpdateStatus] = React.useState('');
  const uploadCoverInputRef = React.useRef();
  const uploadAvatarInputRef = React.useRef();

  const onClickSubscription = async (action) => {
    if (!user?.id) {
      dispatch(setModal({ modal: 'auth', data: { login: { isOpen: true } } }));
    } else {
      try {
        const status = await UserService.subscription({ target_id: data.id, action });

        if (action === 'subscribe' && status) {
          setInfo({
            ...info,
            isSubscribed: true,
            subscribers: info.subscribers + 1,
          });
        } else {
          setInfo({
            ...info,
            isSubscribed: false,
            subscribers: info.subscribers - 1,
          });
        }
      } catch (error) {
        setInfo({ ...info, isSubscribed: false });
        dispatch(setMessage({ text: 'Ошибка', status: false }));
      }
    }
  };

  const getSubscribers = async ({ page }) => {
    const res = await UserService.getSubscribersById({
      id: data.id,
      page,
      limit: subscribersLimit,
    });
    return res.result;
  };

  const getSubscriptions = async ({ page }) => {
    const res = await UserService.getSubscriptionsById({
      id: data.id,
      page,
      limit: subscribersLimit,
    });
    return res.result;
  };

  // cover change
  const handleUploadCover = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    let msg;

    if (file) {
      setCoverUploadStatus('loading');
      formData.append('image', file);
      const newProfile = { ...profile };
      newProfile.cover = null;
      setProfile(newProfile);

      UploadService.image(formData)
        .then(({ data }) => {
          const image = process.env.NEXT_PUBLIC_STORAGE_URL + data.url;
          newProfile.cover = image;
          setProfile(newProfile);

          setCoverUploadStatus('success');
        })
        .catch((error) => {
          setCoverUploadStatus('error');
          msg = getApiMessage(error.response);

          if (msg) {
            dispatch(setMessage(msg));
          }

          newProfile.cover = data.cover;
          setProfile(newProfile);
        });
    }
  };

  const handleCancelChangeCover = () => {
    const newProfile = { ...profile };
    newProfile.cover = user.cover;
    setProfile(newProfile);
    setCoverUploadStatus(null);
  };

  const handleSaveCover = () => {
    UserService.changeCover(profile.cover)
      .then(() => {
        const newUserData = { ...user };
        newUserData.cover = profile.cover;
        dispatch(setUserData(newUserData));
        setCoverUploadStatus(null);
      })
      .catch(() => {
        dispatch(setMessage({ text: 'Ошибка', status: false }));
      });
  };

  const handleDeleteCover = () => {
    UserService.changeCover(null)
      .then(() => {
        const newUserData = { ...user };
        newUserData.cover = null;
        dispatch(setUserData(newUserData));

        const newProfile = { ...profile };
        newProfile.cover = null;
        setProfile(newProfile);
      })
      .catch(() => {
        dispatch(setMessage({ text: 'Ошибка', status: false }));
      });
  };

  // avatar update
  const handleChangeAvatar = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    let msg;

    if (file) {
      setAvatarUpdateStatus('loading');
      formData.append('image', file);

      UploadService.image(formData)
        .then(({ data }) => {
          const image = process.env.NEXT_PUBLIC_STORAGE_URL + data.url;

          UserService.changeAvatar(image)
            .then(() => {
              const newProfile = { ...profile };
              newProfile.avatar = image;
              setProfile(newProfile);

              const newUserData = { ...user };
              newUserData.avatar = image;
              dispatch(setUserData(newUserData));

              setAvatarUpdateStatus('success');
            })
            .catch(() => {
              dispatch(setMessage({ text: 'Ошибка', status: false }));
            });
        })
        .catch((error) => {
          setAvatarUpdateStatus('error');
          msg = getApiMessage(error.response);

          if (msg) {
            dispatch(setMessage(msg));
          }
        });
    }
  };

  // get info
  React.useEffect(() => {
    UserService.getInfoById({ id: profile.id }).then((res) => {
      setInfo(res);
    });
  }, [profile.id]);

  return (
    <div className={styles.root}>
      {info?.subscribers ? (
        <SubscribersModal
          pages={Math.ceil(info?.subscribers / subscribersLimit)}
          getSubscribers={getSubscribers}
        />
      ) : (
        ''
      )}

      {info?.subscriptions ? (
        <SubscriptionsModal
          pages={Math.ceil(info?.subscriptions / subscribersLimit)}
          getSubscriptions={getSubscriptions}
        />
      ) : (
        ''
      )}

      <div className={styles.cover}>
        {myProfile && (
          <>
            <input type="file" onChange={handleUploadCover} ref={uploadCoverInputRef} hidden />

            <div
              className={styles.editor}
              style={{
                display: coverUploadStatus === 'success' ? 'none' : 'flex',
              }}>
              <button
                onBlur={() => setShowCoverEditorActions(false)}
                onClick={() => setShowCoverEditorActions(!showCoverEditorActions)}
                className={styles.showActions}>
                {coverUploadStatus === 'loading' ? (
                  <Loading style={{ width: 25, height: 25 }} type="circle" />
                ) : (
                  <>
                    <IconPencil /> Изменить обложку
                  </>
                )}
              </button>

              {showCoverEditorActions && (
                <MainPopover
                  rootStyle={{ right: 0, top: 35 }}
                  options={[
                    {
                      style: { fontSize: 15 },
                      text: 'Изменить',
                      icon: <IconPhoto width={19} height={19} />,
                      onClick: () => uploadCoverInputRef.current.click(),
                    },
                    {
                      style: {
                        fontSize: 15,
                      },
                      isVisible: Boolean(profile.cover),
                      icon: <IconTrash width={20} height={20} />,
                      text: 'Удалить',
                      onClick: () => handleDeleteCover(),
                    },
                  ]}
                />
              )}
            </div>

            <span
              style={{ display: coverUploadStatus === 'success' ? 'none' : 'flex' }}
              className={styles.coverSize}>
              640x200
            </span>

            {coverUploadStatus === 'success' && (
              <div className={styles.control}>
                <button className={styles.cancel} onClick={handleCancelChangeCover}>
                  Отменить
                </button>
                <button onClick={handleSaveCover} className={styles.save}>
                  Сохранить
                </button>
              </div>
            )}
          </>
        )}

        {profile.cover ? (
          <Image quality={100} src={profile.cover} width={640} height={200} alt="cover" />
        ) : (
          <div className={styles.noCover}></div>
        )}
      </div>

      <div className={styles.padding}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            {myProfile && (
              <>
                <input
                  type="file"
                  hidden
                  ref={uploadAvatarInputRef}
                  onChange={handleChangeAvatar}
                />

                <button
                  disabled={avatarUpdateStatus === 'loading'}
                  onBlur={() => setShowAvatarEditorActions(false)}
                  onClick={() => setShowAvatarEditorActions(!showAvatarEditorActions)}
                  className={styles.overlay}>
                  {avatarUpdateStatus === 'loading' ? <Loading type="circle" /> : <IconPhoto />}
                </button>

                <div className="editor">
                  {showAvatarEditorActions && (
                    <MainPopover
                      rootStyle={{ left: -10, top: 85 }}
                      options={[
                        {
                          style: { fontSize: 15 },
                          text: 'Изменить',
                          icon: <IconPhoto width={19} height={19} />,
                          onClick: () => uploadAvatarInputRef.current.click(),
                        },
                      ]}
                    />
                  )}
                </div>
              </>
            )}

            <Image quality={100} src={profile.avatar} width={90} height={90} alt="avatar" />
          </div>

          <div className={styles.actions}>
            {myProfile ? (
              <button
                onClick={() => router.push('/user/settings')}
                className={`btn-secondary ${styles.settings}`}>
                <IconSettings width={23} height={23} />
              </button>
            ) : (
              <>
                {info === null ? (
                  <ContentLoader
                    speed={2}
                    width={115}
                    height={36}
                    viewBox={`0 0 115 36`}
                    backgroundColor="#b7b7b730"
                    foregroundColor="#6d6d6d30">
                    <rect x="0" y="0" rx="10" ry="10" width={115} height={36} />
                  </ContentLoader>
                ) : !info.isSubscribed ? (
                  <button
                    onClick={() => onClickSubscription('subscribe')}
                    className={`btn-primary ${styles.subscribe}`}>
                    Подписаться
                  </button>
                ) : (
                  <button
                    onClick={() => onClickSubscription('unsubscribe')}
                    className={`btn-primary ${styles.unsubscribe}`}>
                    Отписаться
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <h1 className={styles.name}>{profile.name}</h1>

        <p className={styles.description}>{profile.description && profile.description}</p>

        <div className={styles.followers}>
          <div
            onClick={() =>
              info?.subscribers > 0
                ? dispatch(setModal({ modal: 'subscribers', data: { isOpen: true } }))
                : ''
            }
            className={styles.item}>
            {info?.subscribers} {Number(info?.subscribers) === 1 ? 'подписчик' : 'подписчиков'}
          </div>

          <div
            onClick={() =>
              info?.subscriptions > 0
                ? dispatch(setModal({ modal: 'subscriptions', data: { isOpen: true } }))
                : ''
            }
            className={styles.item}>
            {info?.subscriptions} {Number(info?.subscriptions) === 1 ? 'подписка' : 'подписки'}
          </div>
        </div>
      </div>

      <UserFeed id={profile.id} />
    </div>
  );
};

export default UserProfile;
