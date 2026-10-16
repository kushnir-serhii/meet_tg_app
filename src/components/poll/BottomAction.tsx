import { BottomButton } from '../ui/BottomButton';

/** The screen's one primary action, e.g. "Send to chat" or "Done". */
export type PrimaryAction = {
  text: string;
  run: () => Promise<void> | void;
};

type BottomActionProps = {
  text: string;
  onPress: () => Promise<void>;
};

export const BottomAction = ({ text, onPress }: BottomActionProps) => (
  <BottomButton text={text} onPress={onPress} />
);
