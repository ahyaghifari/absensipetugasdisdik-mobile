import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { SessionProvider } from './ctx';

export default function Root() {
    const [loaded, error] = useFonts({
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
      });
  // Set up the auth context and render our layout inside of it.
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
