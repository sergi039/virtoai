export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    role: string;
}

export interface IUserProfile {
    id: string;
    name: string;
    email: string | null;
    photoUrl: string | null;
}