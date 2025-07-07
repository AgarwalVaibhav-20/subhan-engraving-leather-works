// context/UserContext.tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type UserType = {
  _id?: string;
  email?: string;
  fullname?: string;
  isVerified?: boolean;
  isAcceptingMessages?: boolean;
  role?: 'admin' | 'user';
};

const AuthContext = createContext<{
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}>({
  user: null,
  setUser: () => {},
});

export const UserAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser(session.user as UserType);
    }
  }, [session, status]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
