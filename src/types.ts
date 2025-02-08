export interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface TelegramWebApp {
  initDataUnsafe?: {
    user?: TelegramWebAppUser;
  };
  expand: () => void;
  ready: () => void;
}

export type Item = {
  id: number;
  title: string;
  amount?: number;
  unit?: string;
}

export type Category = {
  id: number;
  title: string;
  items: Item[];
}
