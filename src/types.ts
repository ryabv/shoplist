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

export type UniqueId = string | number;

export type Item = {
  id: UniqueId;
  title: string;
  amount?: number;
  unit?: string;
};

export type Category = {
  id: UniqueId;
  title: string;
  items: UniqueId[];
};

export type ShopListData = {
  categories: Record<UniqueId, Category>;
  items: Record<UniqueId, Item>;
  categoryOrder: UniqueId[];
};
