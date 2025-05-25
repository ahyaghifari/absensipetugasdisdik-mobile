import { useFonts } from "expo-font";
import { Redirect, Stack } from "expo-router";
import { Text } from 'react-native';

import '../../assets/global.css';
import { useSession } from "../ctx";

export default function RootLayout() {
  const {session, isLoading} = useSession()

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/login" />;
  }

  const [loaded, error] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
  });
  return <Stack>
    <Stack.Screen name="index" options={{title:'Beranda'}}></Stack.Screen>
    <Stack.Screen name="login" options={{title:'Login'}}></Stack.Screen>
    <Stack.Screen name="absen" options={{title:'Absensi', }}></Stack.Screen>
    <Stack.Screen name="absensi" options={{title:'Absensi'}}></Stack.Screen>
    <Stack.Screen name="ubah_profile" options={{title: 'Ubah Foto Profik', presentation: 'modal'}}></Stack.Screen>
    <Stack.Screen name="ubah_password" options={{title:'Ubah Password'}}></Stack.Screen>
  </Stack>;
}
