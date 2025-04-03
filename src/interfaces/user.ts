export type IRole = {
  id: number;
  name: UserRole;
  __entity: "RoleEntity";
};

export enum UserRole {
  ADMIN = "Admin",
  USER = "User",
}

export type IStatus = {
  id: number;
  name: UserStatus;
  __entity: "StatusEntity";
};

export enum UserStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export type IUser = {
  id: number;
  email: string;
  provider: string;
  socialId: string | null;
  fullName: string;
  role: IRole;
  status: IStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
