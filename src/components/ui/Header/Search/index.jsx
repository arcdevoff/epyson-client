'use client';
import React, { Suspense } from 'react';
import { IconCornerDownLeft, IconSearch } from '@tabler/icons-react';
import styles from './Search.module.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from '../../Loading';

const HeaderSearch = () => {
  const searchParams = useSearchParams();
  const [value, setValue] = React.useState(searchParams.get('query') || '');
  const [focused, setFocused] = React.useState(false);
  const router = useRouter();

  return (
    <div className={styles.root}>
      <IconSearch width={24} height={24} />
      <input
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Поиск"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {focused && value && (
        <div className={styles.window}>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => router.push(`/search?query=${value}`)}>
            <IconCornerDownLeft /> Перейти к результатам
          </button>
        </div>
      )}
    </div>
  );
};

const HeaderSearchWithSuspense = () => (
  <Suspense fallback={''}>
    <HeaderSearch />
  </Suspense>
);

export default HeaderSearchWithSuspense;
