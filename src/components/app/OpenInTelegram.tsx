import { useI18n } from '@/hooks/useI18n';

import { ButtonLink } from '../ui/Button';
import styles from './app.module.css';

type OpenInTelegramProps = {
  link: string | null;
};

/** Shown when the page is opened in a regular browser. */
export const OpenInTelegram = ({ link }: OpenInTelegramProps) => {
  const { t } = useI18n();

  return (
    <div className={styles.landing}>
      <span className={styles.logo} aria-hidden="true">
        🗓️
      </span>
      <h1 className={styles.title}>Pick to Meet</h1>
      <p className={styles.text}>{t.app.landing}</p>
      {link ? (
        <ButtonLink href={link}>{t.app.openButton}</ButtonLink>
      ) : (
        <p className={styles.text}>{t.app.openInTelegram}</p>
      )}
    </div>
  );
};
