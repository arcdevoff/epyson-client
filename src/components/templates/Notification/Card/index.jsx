import Image from 'next/image';
import styles from './NotificationCard.module.scss';
import {
  IconHeartFilled,
  IconMessageCircle,
  IconMessageCircle2,
  IconMessageCircle2Filled,
  IconUserFilled,
} from '@tabler/icons-react';
import Link from 'next/link';

const NotificationCard = ({ data, unixToDateTime }) => {
  return (
    <div className={styles.root}>
      <div className={styles.left}>
        {data.type === 'like' && (
          <IconHeartFilled className={`${styles.icon} ${styles[data.type]}`} />
        )}

        {data.type === 'subscribe' && (
          <IconUserFilled className={`${styles.icon} ${styles[data.type]}`} />
        )}

        {data.type === 'reply_comment' ||
          (data.type === 'comment' && (
            <IconMessageCircle2Filled className={`${styles.icon} ${styles[data.type]}`} />
          ))}
      </div>

      <div className={styles.right}>
        {data.type === 'like' && (
          <span className={styles.text}>
            Пользователь{' '}
            <Link onMouseDown={(e) => e.preventDefault()} href={`/user/${data.sender.id}`}>
              {data.sender.name}
            </Link>{' '}
            лайкнул(а) ваш{' '}
            <Link onMouseDown={(e) => e.preventDefault()} href={`/post/${data.post_id}`}>
              пост
            </Link>
          </span>
        )}

        {data.type === 'subscribe' && (
          <span className={styles.text}>
            Пользователь{' '}
            <Link onMouseDown={(e) => e.preventDefault()} href={`/user/${data.sender.id}`}>
              {data.sender.name}
            </Link>{' '}
            подписался(лась) на ваши обновления
          </span>
        )}

        {data.type === 'reply_comment' && (
          <span className={styles.text}>
            Пользователь{' '}
            <Link onMouseDown={(e) => e.preventDefault()} href={`/user/${data.sender.id}`}>
              {data.sender.name}
            </Link>{' '}
            ответил(а) на ваш{' '}
            <Link
              onMouseDown={(e) => e.preventDefault()}
              href={`/post/${data.post_id}#comment-${data.comment_id}`}>
              комментарий
            </Link>
          </span>
        )}

        {data.type === 'comment' && (
          <span className={styles.text}>
            Пользователь{' '}
            <Link onMouseDown={(e) => e.preventDefault()} href={`/user/${data.sender.id}`}>
              {data.sender.name}
            </Link>{' '}
            оставил(а) комментарий под вашим{' '}
            <Link
              onMouseDown={(e) => e.preventDefault()}
              href={`/post/${data.post_id}#comment-${data.comment_id}`}>
              постом
            </Link>
          </span>
        )}

        <span className={styles.date}>{unixToDateTime(data.created_at)}</span>
      </div>
    </div>
  );
};

export default NotificationCard;
