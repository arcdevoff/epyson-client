'use client';
import { TopicService } from '@/services/topic.service';
import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import styles from './TopicsAll.module.scss';
import Loading from '@/components/ui/Loading';
import Link from 'next/link';
import Image from 'next/image';
import { IconChevronDown, IconSearch } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import BackButton from '@/components/ui/BackButton';

const limit = 3;
const TopicsAll = () => {
  const allTopics = useSelector((state) => state.topic.topics);
  const [search, setSearch] = React.useState('');
  const [topics, setTopics] = React.useState();

  React.useEffect(() => {
    const filtered = allTopics.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
    setTopics(filtered);
  }, [search, allTopics]);

  return (
    <div className={styles.root}>
      <div className={styles.title}>Все темы</div>

      <input
        className={styles.search}
        placeholder="Поиск"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {topics && (
        <div className={styles.topics}>
          {topics.map((data, key) => (
            <Link href={`/topic/${data.slug}`} key={key} className={styles.item}>
              <Image
                quality={100}
                className={styles.cover}
                src={data.cover}
                width={200}
                height={70}
                alt="avatar"
              />

              <Image
                quality={100}
                className={styles.avatar}
                src={data.avatar}
                width={70}
                height={70}
                alt="avatar"
              />

              <div className={styles.info}>
                <span className={styles.name}>{data.name}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicsAll;
