// context/UserContext.tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type UserType = {
  _id?: string;
  email?: string;
  fullname?: string;
  isVerified?: boolean;
  profileImage?: string;
  isAcceptingMessages?: boolean;
  role?: 'admin' | 'user';
};

const AuthContext = createContext<{
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  token: string | null;
}>({
  user: null,
  setUser: () => { },
  token: null,
});

export const UserAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser(session.user as UserType);
      // 🔥 Get token from session (depends on your NextAuth config)
      // If you added it in callbacks.jwt -> token.accessToken
      const accessToken = (session as any)?.accessToken || (session as any)?.user?.accessToken;
      setToken(accessToken || null);
    } else {
      setUser(null);
      setToken(null);
    }
  }, [session, status]);

  return (
    <AuthContext.Provider value={{ user, setUser, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// // context/UserContext.tsx
// 'use client';
// import { createContext, useContext, useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';

// type UserType = {
//   _id?: string;
//   email?: string;
//   fullname?: string;
//   isVerified?: boolean;
//   profileImage?: string;
//   isAcceptingMessages?: boolean;
//   role?: 'admin' | 'user';
// };

// const AuthContext = createContext<{
//   user: UserType | null;
//   setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
// }>({
//   user: null,
//   setUser: () => {},
// });

// export const UserAuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const { data: session, status } = useSession();
//   const [user, setUser] = useState<UserType | null>(null);

//   useEffect(() => {
//     if (status === 'authenticated' && session?.user) {
//       setUser(session.user as UserType);
//     }
//   }, [session, status]);

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
