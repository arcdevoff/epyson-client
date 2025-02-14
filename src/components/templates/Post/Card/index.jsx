'use client';
import React from 'react';
import Image from 'next/image';
import styles from './PostCard.module.scss';
import {
  IconChevronLeft,
  IconChevronRight,
  IconCircleFilled,
  IconDots,
  IconEye,
  IconFlag,
  IconHeart,
  IconLink,
  IconMessageCircle,
  IconPencil,
  IconShare3,
  IconTrash,
} from '@tabler/icons-react';
import Link from 'next/link';
import { setMessage, setModal } from '@/redux/reducers/ui/slice';
import MainPopover from '@/components/ui/Main/Popover';
import { PostService } from '@/services/post.service';

const PostCard = ({
  page,
  data,
  refetch,
  user,
  info,
  authorized,
  router,
  dispatch,
  unixToDateTime,
  copyText,
}) => {
  const [currentAttachmentsIndex, setCurrentAttachmentsIndex] = React.useState(0);
  const [shareListShow, setShareListShow] = React.useState(false);
  const [liked, setLiked] = React.useState();
  const [likes, setLikes] = React.useState();
  const [showActions, setShowActions] = React.useState(false);
  let cleanText = data.text.replace(/<[^>]*>/g, '');
  cleanText = cleanText.trim();
  const [sliceText, setSliceText] = React.useState(cleanText.length > 500);

  const handleCopyUrl = () => {
    copyText(`${process.env.NEXT_PUBLIC_DOMAIN}/post/${data.id}`);
    dispatch(setMessage({ text: 'Ссылка скопирована', status: true }));
    setShareListShow(false);
  };

  React.useEffect(() => {
    setLiked(info.liked);
    setLikes(info.likes);
  }, [info]);

  const handleLike = () => {
    if (authorized) {
      const action = liked ? 'dislike' : 'like';

      PostService.reaction({
        id: data.id,
        action,
        author: data.author.id,
      })
        .then((res) => {
          if (action === 'like') {
            setLiked(true);
            setLikes(likes + 1);
          } else {
            setLiked(false);
            setLikes(likes - 1);
          }
        })
        .catch((_) => {
          dispatch(setMessage({ text: 'Ошибка', status: false }));
        });
    } else {
      dispatch(setModal({ modal: 'auth', data: { login: { isOpen: true } } }));
    }
  };

  const handleDeletePost = () => {
    if (window.confirm('Вы уверены?')) {
      PostService.deleteById(data.id).then(() => {
        dispatch(setMessage({ text: 'Готово', status: true }));

        if (page === 'view') {
          router.push(`/user/${user.id}`);
        } else {
          refetch();
        }
      });
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.right}>
          <Link href={`/topic/${data.topic.slug}`} className={styles.topicAvatar}>
            <Image src={data.topic.avatar} width={50} height={50} alt={data.topic.name} />
          </Link>

          <div>
            <Link href={`/topic/${data.topic.slug}`} className={styles.topic}>
              <span>{data.topic.name}</span>
            </Link>

            <div>
              <Link href={`/user/${data.author.id}`} className={styles.author}>
                {data.author.name}
              </Link>

              <span className={styles.date}>{unixToDateTime(data.created_at)}</span>
            </div>
          </div>
        </div>

        <div className={styles.left}>
          <div className={styles.actions}>
            <button
              onClick={() => setShowActions(!showActions)}
              onBlur={() => setShowActions(false)}
              className={styles.showButton}>
              <IconDots />
            </button>

            {showActions && (
              <MainPopover
                rootStyle={{ right: -15, top: 34 }}
                options={[
                  {
                    style: { fontSize: 15 },
                    isVisible: Number(user?.id) === Number(data.author.id),
                    icon: <IconPencil stroke={2} width={20} height={20} />,
                    text: 'Редактировать',
                    onClick: () =>
                      dispatch(
                        setModal({ modal: 'post', data: { edit: { isOpen: true, data: data } } }),
                      ),
                  },
                  {
                    style: { fontSize: 15 },
                    isVisible: Number(user?.id) === Number(data.author.id),
                    icon: <IconTrash stroke={2} width={20} height={20} />,
                    text: 'Удалить',
                    onClick: () => handleDeletePost(),
                  },
                  {
                    style: { fontSize: 15 },
                    icon: <IconFlag stroke={2} width={20} height={20} />,
                    text: 'Пожаловаться',
                    onClick: () =>
                      dispatch(
                        setModal({
                          modal: 'content',
                          data: {
                            complain: { isOpen: true, data: { content: `/post/${data.id}` } },
                          },
                        }),
                      ),
                  },
                ]}
              />
            )}
          </div>
        </div>
      </div>

      {data.attachments && (
        <div className={styles.attachments}>
          {data.attachments.map((obj, index) => {
            return (
              <div
                className={`${styles.attachment} ${
                  index === currentAttachmentsIndex ? styles.active : ''
                }`}
                key={index}>
                {obj.type === 'image' && (
                  <Image src={obj.url} width={500} height={500} alt="image" />
                )}
                {obj.type === 'video' && (
                  <video controls={true} key={index} src={obj.url} poster={obj.poster} />
                )}

                {data.attachments.length > 1 && (
                  <div className={styles.control}>
                    {currentAttachmentsIndex >= 1 && (
                      <button
                        className={styles.previous}
                        onClick={() => setCurrentAttachmentsIndex(currentAttachmentsIndex - 1)}>
                        <IconChevronLeft width={27} height={27} />
                      </button>
                    )}

                    {currentAttachmentsIndex + 1 < data.attachments.length && (
                      <button
                        className={styles.next}
                        onClick={() => setCurrentAttachmentsIndex(currentAttachmentsIndex + 1)}>
                        <IconChevronRight width={27} height={27} />
                      </button>
                    )}

                    <div className={styles.current}>
                      {data.attachments.map((obj, index) => (
                        <IconCircleFilled
                          onClick={() => setCurrentAttachmentsIndex(index)}
                          className={index === currentAttachmentsIndex ? styles.active : ''}
                          key={index}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.text}>
        <div
          dangerouslySetInnerHTML={{
            __html: sliceText && page !== 'view' ? data.text.slice(0, 500) : data.text,
          }}></div>

        {sliceText && page !== 'view' && (
          <div className={styles.showFullText}>
            <div className={styles.shadow}></div>
            <button onClick={() => setSliceText(false)}>Показать полностью</button>
          </div>
        )}
      </div>

      {data.tags[0].id && (
        <div className={styles.tags}>
          {data.tags.map((obj, key) => (
            <Link className={styles.tag} href={`/tag/${obj.text}`} key={key}>
              #{obj.text}
            </Link>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.flex}>
          {info.status !== 'loading' && (
            <div className={styles.left}>
              <button
                onClick={handleLike}
                className={`${styles.like} ${liked ? styles.active : ''}`}>
                <IconHeart />
                <span>{likes}</span>
              </button>
              <button
                onClick={() => router.push(`/post/${data.id}#comments`)}
                className={styles.comments}>
                <IconMessageCircle />
                <span>{info.commentsCount}</span>
              </button>{' '}
            </div>
          )}

          <div className={styles.right}>
            <button className={styles.views}>
              <IconEye /> <span>{info.views}</span>
            </button>

            <div onBlur={() => setShareListShow(false)} className={styles.share}>
              <button onClick={() => setShareListShow(!shareListShow)}>
                <IconShare3 />
              </button>

              {shareListShow && (
                <MainPopover
                  rootStyle={{ right: 0 }}
                  options={[
                    {
                      icon: <IconLink />,
                      text: 'Копировать ссылку',
                      onClick: handleCopyUrl,
                    },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
