export interface ITemplate {
  id: number;
  name: string;
  description?: string;
  userId: number;
  renderData?: object;
  public: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
