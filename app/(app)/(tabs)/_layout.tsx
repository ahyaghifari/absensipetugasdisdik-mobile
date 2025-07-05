import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";

export default function RootLayout() {
 
  return <Tabs screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        headerStyle: {
          backgroundColor: '#2563eb',
        },
        headerTintColor: '#fff',
      }}>
    <Tabs.Screen name="index" options={{ title:'Beranda', tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={24} />
          )}}></Tabs.Screen>
    <Tabs.Screen name="jadwal" options={{title:'Jadwal', tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} color={color} size={24} />
          )}}></Tabs.Screen>
    <Tabs.Screen name="akun" options={{title:'Akun', tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'at-circle' : 'at-circle-outline'} color={color} size={24} />
          )}}></Tabs.Screen>
  </Tabs>;
}
