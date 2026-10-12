/** Minimal typings for the parts of `window.Telegram.WebApp` we use. */

type BottomButton = {
  setText: (text: string) => BottomButton;
  onClick: (callback: () => void) => BottomButton;
  offClick: (callback: () => void) => BottomButton;
  show: () => BottomButton;
  hide: () => BottomButton;
  enable: () => BottomButton;
  disable: () => BottomButton;
  showProgress: (leaveActive?: boolean) => BottomButton;
  hideProgress: () => BottomButton;
};

type BackButton = {
  show: () => void;
  hide: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
};

type HapticFeedback = {
  selectionChanged: () => void;
  notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
};

export type InvoiceStatus = 'paid' | 'cancelled' | 'failed' | 'pending';

export type ChatType = 'users' | 'bots' | 'groups' | 'channels';

export type WebApp = {
  initData: string;
  initDataUnsafe: {
    start_param?: string;
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
  };
  version: string;
  colorScheme: 'light' | 'dark';
  ready: () => void;
  expand: () => void;
  disableVerticalSwipes?: () => void;
  close: () => void;
  isVersionAtLeast: (version: string) => boolean;
  switchInlineQuery: (query: string, chatTypes?: ChatType[]) => void;
  MainButton: BottomButton;
  BackButton: BackButton;
  HapticFeedback: HapticFeedback;
  showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
  openInvoice: (url: string, callback: (status: InvoiceStatus) => void) => void;
};

declare global {
  // Declaration merging with the DOM `Window` requires an interface.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    Telegram?: { WebApp?: WebApp };
  }
}

export const getWebApp = (): WebApp | null =>
  typeof window === 'undefined' ? null : (window.Telegram?.WebApp ?? null);

/** True only when opened inside Telegram (outside, initData is an empty string). */
export const isInsideTelegram = (webApp: WebApp | null): webApp is WebApp =>
  Boolean(webApp?.initData);
