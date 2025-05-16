import type { UserSession } from "@/constants/UserSession";
import { createContext, use, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';


const AuthContext = createContext<{
  signIn: (user:UserSession) => void;
  signOut: () => void;
  session: UserSession | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, rawSession], setSession] = useStorageState('session');
  const session = rawSession ? JSON.parse(rawSession) as UserSession : null

  return (
    <AuthContext
      value={{
        signIn: (userData:UserSession) => {
          // Perform sign-in logic here
          setSession(JSON.stringify(userData));
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext>
  );
}
