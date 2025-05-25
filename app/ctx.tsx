import type { UserSession } from "@/constants/UserSession";
import * as FileSystem from 'expo-file-system';
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
function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, rawSession], setSession] = useStorageState('session');
  const session = rawSession ? JSON.parse(rawSession) as UserSession : null

  return (
    <AuthContext
      value={{
        signIn: (userData:UserSession) => {
          // Perform sign-in logic here
          setSession(JSON.stringify(userData));
        },
        signOut: async () => {
            //  hapus foto profil
            const fileUri = FileSystem.documentDirectory + 'profile.png';
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            if (fileInfo.exists) {
              await FileSystem.deleteAsync(fileUri, { idempotent: true });
            }
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext>
  );
}

export { SessionProvider, useSession };

