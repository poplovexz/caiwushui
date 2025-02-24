import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface IUser extends DefaultUser {
  id: string
  role: UserRole
  email: string
  name: string
  emailVerified?: Date
}

declare module "next-auth" {
  interface User extends IUser {}

  interface Session extends DefaultSession {
    user: {
      id: string
      role: UserRole
      email: string
      name: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role: UserRole
    email: string
    name: string
  }
}
