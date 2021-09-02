export enum UserTokenType {
  PasswordReset = 'password_reset',
  EmailVerification = 'email_verification',
}

export interface IUserToken {
  id: number;
  userId: number;
  type: UserTokenType;
  value: string;
  createdAt: Date;
  expiresAt: Date;
}
