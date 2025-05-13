import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import '../assets/global.css';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });
  return <Stack>
    <Stack.Screen name="index" options={{title:'Beranda'}}></Stack.Screen>
    <Stack.Screen name="login" options={{title:'Login'}}></Stack.Screen>
    <Stack.Screen name="absen" options={{title:'Absensi', }}></Stack.Screen>
    <Stack.Screen name="absensi" options={{title:'Absensi'}}></Stack.Screen>
  </Stack>;
}
