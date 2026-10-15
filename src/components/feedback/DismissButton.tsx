import styles from './feedback.module.css';

type DismissButtonProps = {
  label: string;
  onClick: () => void;
};

export const DismissButton = ({ label, onClick }: DismissButtonProps) => (
  <button type="button" className={styles.dismiss} aria-label={label} onClick={onClick}>
    ✕
  </button>
);
