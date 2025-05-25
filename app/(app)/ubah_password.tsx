import ApiUrl from "@/api/ApiUrl";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import ToastManager, { Toast } from 'toastify-react-native';
import { useSession } from "../ctx";
export default function UbahPassword() {
    const [passwordLama, setPasswordLama] = useState("")
    const [passwordBaru, setPasswordBaru] = useState("")
    const [onUbah, setOnUbah] = useState(false)
    const [error, setError] = useState("")
    const {signOut, session} = useSession()

    const ubah = async () =>{
        setError("")
        setOnUbah(true)
        let url = "/ubah-password"

        let formData = new FormData()
        if(session){
            formData.append("email", session.email)
        }
        formData.append("password", passwordLama)
        formData.append("passwordbaru", passwordBaru)

        const req = await fetch(ApiUrl + url, {
            method: 'POST',
            body: formData
        })

        const res = await req.json()
        if(res.status == 200){
            setPasswordBaru("")
            setPasswordLama("")
            setTimeout(() => {
                Toast.success(res.message)
                signOut()
            }, 2000);
            // router.navigate('/')
        }else{
            setOnUbah(false)
            setError(res.messages.error)
        }
    }

    return(
        <View className="p-5 pt-10 items-center flex-1">
            <ToastManager />
            <View className="flex flex-row items-center gap-3">
                <MaterialCommunityIcons name="key-variant" color="#374151" size={30} />
                <Text className="text-gray-700 font-bold text-lg mt-3" style={{fontFamily: 'Poppins-Regular'}}>Ubah Password</Text>
            </View>
            {error != "" && (
                <View className='mt-3 gap-2 bg-red-200 w-full p-2'>
                    <Text className='text-[0.7rem] text-red-600' style={{fontFamily:'Poppins-Regular'}}>{error}</Text>
                </View>
                )}
            <TextInput
                className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-5"
                    onChangeText={setPasswordLama}
                    value={passwordLama}
                    placeholder="Masukkan Password Lama / Saat Ini"
                    secureTextEntry={true}
                 />
            <TextInput
                className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-3"
                    onChangeText={setPasswordBaru}
                    value={passwordBaru}
                    placeholder="Masukkan Password Baru"
                    secureTextEntry={true}
                 />
            <TouchableOpacity className="mt-5 bg-gray-800 px-3 py-2 rounded-full" style={{opacity:(passwordBaru == '' || passwordLama == '' || onUbah == true) ? 0.5 : 1 }} disabled={passwordBaru == '' || passwordLama == '' || onUbah == true} onPress={ubah}>
                <Text className="text-white">Ganti Password</Text>
            </TouchableOpacity>
        </View>
    )
}
