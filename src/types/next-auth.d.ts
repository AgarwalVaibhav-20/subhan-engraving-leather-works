import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    _id?: string;
    profileImage?:string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    email?: string;
    fullname?: string;
    role?: 'admin' | 'user';
  }

  interface Session {
    user: {
      _id?: string;
      profileImage?:string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      email?: string;
      fullname?: string;
      role?: 'admin' | 'user';
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    profileImage?:string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    email?: string;
    fullname?: string;
    role?: 'admin' | 'user';
  }
}
