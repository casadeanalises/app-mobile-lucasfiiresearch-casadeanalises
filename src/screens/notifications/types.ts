export interface Notification {
  _id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'link' | 'announcement';
  imageUrl: string;
  link: string;
  createdAt: string;
  usersRead: string[];
  global: boolean;
  __v: number;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  unread: number;
}
