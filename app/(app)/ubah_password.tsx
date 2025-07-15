import api from "@/api";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import ToastManager, { Toast } from 'toastify-react-native';
import { useSession } from "../ctx";

export default function UbahPassword() {
    const router = useRouter()
    const [passwordLama, setPasswordLama] = useState("")
    const [passwordBaru, setPasswordBaru] = useState("")
    const [showPasswordLama, setShowPasswordLama] = useState(true)
    const [showPasswordBaru, setShowPasswordBaru] = useState(true)
    const [onUbah, setOnUbah] = useState(false)
    const [error, setError] = useState("")
    const {signOut, session} = useSession()

    const ubah = async () =>{
        setError("")
        setOnUbah(true)
        api.post('/ubah-password', {
            password: passwordLama,
            email: session?.email,
            passwordbaru: passwordBaru
        }).then((res)=>{
            console.log(res.data)
            setPasswordBaru("")
            setPasswordLama("")
            Toast.success(res.data.message)
            setTimeout(() => {
                signOut()
            }, 2000);
            router.push('/(app)/(tabs)')
        }).catch((err) => {
            setOnUbah(false)
            console.log(err)
            setError(err.messages.error)
        })
    }

    return(
        <View className="items-center flex-1">
            <ToastManager />
            <View className="bg-white mt-10 w-10/12">
            <View className="flex flex-row items-center gap-3 p-3 justify-center bg-amber-200">
                <Image
                    style={{height: 70, width: 70}}
                    source='https://img.icons8.com/3d-fluency/70/password.png'
                    className='rounded-full overflow-hidden'
                    contentFit="cover"
                    />
                <Text className="text-amber-700 font-bold text-lg mt-3" style={{fontFamily: 'Poppins-Regular'}}>Ubah Password</Text>
            </View>
            <View className="px-3 pt-3 pb-8 flex flex-col items-center">
            {error !== "" && (
                <View className='mt-3 gap-2 bg-red-200 w-full p-2'>
                    <Text className='text-[0.7rem] text-red-600' style={{fontFamily:'Poppins-Regular'}}>{error}</Text>
                </View>
                )}
            {/* password lama */}
            <View className="w-full relative flex justify-center">
                <TextInput
                    className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-5"
                        onChangeText={setPasswordLama}
                        value={passwordLama}
                        placeholder="Masukkan Password Lama / Saat Ini"
                        secureTextEntry={showPasswordLama}
                 />
                 <TouchableOpacity className="absolute top-8 right-4" onPress={() => setShowPasswordLama(!showPasswordLama)}>
                    <FontAwesome5 name={showPasswordLama ? 'eye' : 'eye-slash'} size={18} color="gray" />
                 </TouchableOpacity>
            </View>
            {/* password baru */}
            <View className="w-full relative flex justify-center mt-5">
                <TextInput
                    className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChangeText={setPasswordBaru}
                        value={passwordBaru}
                        placeholder="Masukkan Password Baru"
                        secureTextEntry={showPasswordBaru}
                    />
                <TouchableOpacity className="absolute top-3 right-4" onPress={() => setShowPasswordBaru(!showPasswordBaru)}>
                    <FontAwesome5 name={showPasswordBaru ? 'eye' : 'eye-slash'} size={18} color="gray" />
                 </TouchableOpacity>
            </View>
            {/* tombol ubah password */}
            <TouchableOpacity className="mt-5 bg-amber-500 text-white px-3 py-2 rounded-full" style={{opacity:(passwordBaru === '' || passwordLama === '' || onUbah === true) ? 0.5 : 1 }} disabled={passwordBaru === '' || passwordLama === '' || onUbah === true} onPress={ubah}>
                <Text className="text-white">Ganti Password</Text>
            </TouchableOpacity>
            </View>
        </View>
        </View>
    )
}
