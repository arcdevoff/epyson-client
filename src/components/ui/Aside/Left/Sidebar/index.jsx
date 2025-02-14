'use client';
import React from 'react';
import { IconChevronDown, IconDeviceMobile, IconMoon, IconSun, IconX } from '@tabler/icons-react';
import styles from './Sidebar.module.scss';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { setShowSidebar } from '@/redux/reducers/ui/slice';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import MainPopover from '@/components/ui/Main/Popover';
import { useTheme } from 'next-themes';
import SidebarTopics from './Topics';
import sidebarSections from '@/constants/sidebarSections';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const [optionsThemesShow, setOptionsThemesShow] = React.useState(false);
  const { width } = useWindowDimensions();
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const { showSidebar } = useSelector((state) => state.ui);
  const pathname = usePathname();

  React.useEffect(() => {
    if (width < 991.98) {
      dispatch(setShowSidebar(false));
    }
  }, [pathname, dispatch]);

  if (width < 991.98 && !showSidebar) {
    return <></>;
  }

  return (
    <div className={`${styles.root} scroll`}>
      <div>
        <button
          onClick={() => dispatch(setShowSidebar(!showSidebar))}
          className={styles.controlSidebarBtn}>
          <IconX />
        </button>

        <div className={styles.sections}>
          {sidebarSections.map((obj, index) => (
            <Link
              onMouseDown={(e) => e.preventDefault()}
              key={index}
              className={`${styles.section} ${pathname === obj.url ? styles.active : ''}`}
              href={obj.url}>
              {obj.icon}
              <span>{obj.name}</span>
            </Link>
          ))}
        </div>

        <SidebarTopics />
      </div>

      <div className={styles.other}>
        <div className={styles.settings}>
          <div
            onMouseLeave={() => setOptionsThemesShow(false)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setOptionsThemesShow(!optionsThemesShow)}
            className={styles.item}>
            <div className={styles.label}>
              {theme === 'system' && <IconDeviceMobile />}
              {theme === 'light' && <IconSun />}
              {theme === 'dark' && <IconMoon />}
              Тема
            </div>

            <div className={styles.select}>
              <span className={styles.value}>
                {theme === 'system' && 'Авто'}
                {theme === 'light' && 'Светлая'}
                {theme === 'dark' && 'Тёмная'}
                <IconChevronDown />
              </span>

              {optionsThemesShow && (
                <div className={styles.options}>
                  <MainPopover
                    rootStyle={{ bottom: 45, right: 0 }}
                    options={[
                      {
                        text: 'Авто',
                        onClick: () => setTheme('system'),
                        active: theme === 'system',
                      },
                      {
                        text: 'Светлая',
                        onClick: () => setTheme('light'),
                        active: theme === 'light',
                      },
                      {
                        text: 'Тёмная',
                        onClick: () => setTheme('dark'),
                        active: theme === 'dark',
                      },
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.pages}>
          <Link onMouseDown={(e) => e.preventDefault()} href="/page/privacy">
            Политика конфиденциальности
          </Link>
          <Link onMouseDown={(e) => e.preventDefault()} href="/page/terms">
            Пользовательское соглашение
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
