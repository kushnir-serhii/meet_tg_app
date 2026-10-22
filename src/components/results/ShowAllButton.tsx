import { useI18n } from '@/hooks/useI18n';

import { Button } from '../ui/Button';
import styles from './results.module.css';

type ShowAllButtonProps = {
  expanded: boolean;
  /** How many options the collapsed list leaves out. */
  hiddenCount: number;
  onToggle: () => void;
};

/** "Show all options (N more)" / "Show less" under a shortened results list. */
export const ShowAllButton = ({ expanded, hiddenCount, onToggle }: ShowAllButtonProps) => {
  const { t } = useI18n();

  return (
    <Button
      variant="secondary"
      className={styles.showAll}
      aria-expanded={expanded}
      onClick={onToggle}
    >
      {expanded ? t.results.showFewerOptions : t.results.showAllOptions(hiddenCount)}
    </Button>
  );
};
