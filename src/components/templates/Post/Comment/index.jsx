import Image from 'next/image';
import styles from './PostComment.module.scss';
import Link from 'next/link';
import { IconDots, IconFlag, IconLink, IconTrash } from '@tabler/icons-react';
import React from 'react';
import MainPopover from '@/components/ui/Main/Popover';
import { setMessage, setModal } from '@/redux/reducers/ui/slice';

const PostComment = ({
  dispatch,
  copyText,
  user,
  replies,
  comment,
  parent = 0,
  onClickReply,
  unixToDateTime,
  onClickDeleteComment,
}) => {
  const [showActions, setShowActions] = React.useState(false);

  const handleCopyUrl = () => {
    copyText(`${process.env.NEXT_PUBLIC_DOMAIN}/post/${comment.post_id}#comment-${comment.id}`);
    dispatch(setMessage({ text: 'Ссылка скопирована', status: true }));
    setShowActions(false);
  };

  return (
    <div
      id={`comment-${comment.id}`}
      className={`${styles.root} ${parent >= 1 ? styles.reply : ''}`}>
      {comment.linked && <div className={styles.linkedBadge}>Комментарий открыт по ссылке</div>}

      <div className={styles.header}>
        <div className={styles.left}>
          <Link className={styles.avatar} href={`/user/${comment.user_id}`}>
            <Image src={comment.author.avatar} width={44} height={44} alt="avatar" />
          </Link>

          <div className={styles.flex}>
            <Link href={`/user/${comment.user_id}`} className={styles.name}>
              {comment.author.name}
            </Link>
            <span className={styles.date}>{unixToDateTime(comment.created_at)}</span>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.actions}>
            <button
              onBlur={() => setShowActions(false)}
              onClick={() => setShowActions(!showActions)}
              className={styles.showActions}>
              <IconDots />
            </button>

            {showActions && (
              <MainPopover
                rootStyle={{ right: 0, top: 30 }}
                options={[
                  {
                    style: { fontSize: 15 },
                    icon: <IconLink stroke={2} width={20.5} height={20.5} />,
                    text: 'Копировать ссылку',
                    onClick: () => handleCopyUrl(),
                  },
                  {
                    style: { fontSize: 15 },
                    isVisible: Number(user?.id) === Number(comment.user_id),
                    icon: <IconTrash stroke={2} width={20} height={20} />,
                    text: 'Удалить',
                    onClick: () => onClickDeleteComment(comment),
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
                            complain: { isOpen: true, data: { content: `comment:${comment.id}` } },
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

      <div className={styles.text} dangerouslySetInnerHTML={{ __html: comment.text }}></div>

      <div className={styles.footer}>
        <button
          className={styles.replyButton}
          onClick={() =>
            onClickReply({ id: comment.id, name: comment.author.name, user_id: comment.user_id })
          }>
          Ответить
        </button>
      </div>

      {replies(comment.id).map((obj) => (
        <div key={obj.id} style={{ marginLeft: parent + 10 }}>
          <PostComment
            user={user}
            dispatch={dispatch}
            onClickDeleteComment={onClickDeleteComment}
            onClickReply={onClickReply}
            parent={parent + 1}
            replies={replies}
            unixToDateTime={unixToDateTime}
            comment={obj}
            copyText={copyText}
          />
        </div>
      ))}
    </div>
  );
};

export default PostComment;
