'use client';
import profileStyles from '@/components/screens/User/Profile/UserProfile.module.scss';
import { TopicService } from '@/services/topic.service';
import Image from 'next/image';
import ContentLoader from 'react-content-loader';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage, setModal } from '@/redux/reducers/ui/slice';
import { queryClient } from '@/components/providers/MainProvider';
import SubscribersModal from '@/components/modals/User/Subscribers';
import TopicFeed from './Feed';

const subscribersLimit = process.env.NEXT_PUBLIC_SUBSCRIBERS_LIMIT;
const TopicView = ({ data }) => {
  const [info, setInfo] = React.useState(null);
  const { accessToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // subscribe | unsubscribe
  const onClickSubscription = async (action) => {
    if (!accessToken) {
      dispatch(setModal({ modal: 'auth', data: { login: { isOpen: true } } }));
    } else {
      try {
        const status = await TopicService.subscription({ target_id: data.id, action });
        queryClient.refetchQueries({ queryKey: ['topics'] });

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

  // get subscribers
  const getSubscribers = async ({ page }) => {
    const res = await TopicService.getSubscribersById({
      id: data.id,
      page,
      limit: subscribersLimit,
    });
    return res.result;
  };

  // get info
  React.useEffect(() => {
    TopicService.getInfoById({ id: data.id }).then((res) => {
      setInfo(res);
    });
  }, [data.id]);

  return (
    <div className={profileStyles.root}>
      {info?.subscribers ? (
        <SubscribersModal
          pages={Math.ceil(info?.subscribers / subscribersLimit)}
          getSubscribers={getSubscribers}
        />
      ) : (
        ''
      )}

      <div className={profileStyles.cover}>
        {data.cover ? (
          <Image quality={100} src={data.cover} width={640} height={200} alt="cover" />
        ) : (
          <div className={profileStyles.noCover}></div>
        )}
      </div>

      <div className={profileStyles.padding}>
        <div className={profileStyles.header}>
          <div className={profileStyles.avatar}>
            <Image quality={100} src={data.avatar} width={90} height={90} alt="avatar" />
          </div>

          <div className={profileStyles.actions}>
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
                className={`btn-primary ${profileStyles.subscribe}`}>
                Подписаться
              </button>
            ) : (
              <button
                onClick={() => onClickSubscription('unsubscribe')}
                className={`btn-primary ${profileStyles.unsubscribe}`}>
                Отписаться
              </button>
            )}
          </div>
        </div>

        <h1 className={profileStyles.name}>{data.name}</h1>

        <p className={profileStyles.description}>{data.description && data.description}</p>

        <div className={profileStyles.followers}>
          <div
            onClick={() =>
              info?.subscribers > 0
                ? dispatch(setModal({ modal: 'subscribers', data: { isOpen: true } }))
                : ''
            }
            className={profileStyles.item}>
            {info?.subscribers} {Number(info?.subscribers) === 1 ? 'подписчик' : 'подписчиков'}
          </div>
        </div>
      </div>

      <TopicFeed id={data.id} />
    </div>
  );
};

export default TopicView;
