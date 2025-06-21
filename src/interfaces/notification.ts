export interface INotification {
  id: number;
  title: string;
  body: string;
  data: object;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
}
