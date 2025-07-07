import { useSession } from '@/app/ctx';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Alert, Platform, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function AkunScreen() {
  const {signOut} = useSession()
   const router = useRouter();

  const logout = () =>{
      if(Platform.OS === 'web'){
        if(confirm('Yakin logout') === true){
          signOut()
        }
      }else{
        return Alert.alert('Logout', 'Yakin ingin logout?', [
          {
            text: 'Batal',
            onPress: () => false,
            style: 'cancel',
          },
          {text: 'Ya, saya yakin', onPress: () => signOut()},
        ]);
      }
    } 
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView style={{padding:15}}>
            <TouchableOpacity onPress={() => router.push('/(app)/ubah_password')} className='p-3 py-6 bg-white shadow-lg border-gray-300 rounded-t-lg flex flex-row gap-3 items-center border-b'>
              <MaterialCommunityIcons name="key-variant" size={25} color="#4b5563" />
              <Text className='text-gray-600'>Ubah Password</Text>
            </TouchableOpacity>
            <TouchableOpacity className='flex flex-row items-center gap-3 p-3 py-6 bg-white border-b border-gray-300 rounded-b-lg' onPress={logout}>
                <MaterialCommunityIcons name="logout" size={25} color="#4b5563" />
                <Text className='text-gray-600'>Logout</Text>
            </TouchableOpacity> 
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


