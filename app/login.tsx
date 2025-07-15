import api from "@/api";
import type { UserSession } from "@/constants/UserSession";
import * as Application from 'expo-application';
import { Image } from "expo-image";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSession } from "./ctx";

export default function Login(){
    const navigation = useNavigation();
    const {signIn} = useSession()
    const [onLogin, setOnLogin] = useState(false)
    const [email,setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [deviceId, setDeviceId] = useState("")

    const getDeviceId = async () => {
        if(Platform.OS === 'android'){
            setDeviceId(Application.getAndroidId());
        }else if(Platform.OS === 'ios'){
           let waitId = await Application.getIosIdForVendorAsync()
           if(waitId !== null){
            setDeviceId(waitId)
           }
        }

    }

    useEffect(()=>{
        navigation.setOptions({ headerShown: false });
        getDeviceId()
    }, [])

    const login = async () =>{
        setError("")
        if(email === "" || password === ""){
            setError("Username dan password belum diisi")
            return
        }
        setOnLogin(true)
        api.post('/login', {
            email:email,
            password: password,
            device_id : deviceId
        }).then((res) => {
            let userData : UserSession={
                email: res.data.user.email,
                nama: res.data.user.nama,
                kode: res.data.user.kode,
                photo: null,
                jabatan:res.data.user.jabatan,
                token: res.data.access_token
            }

            signIn(userData)
            router.navigate('/')
        }).catch((err) => {
            setError(err.response.data.message)
            setOnLogin(false)
            return
        })
    }

    return (
        <SafeAreaView className="bg-blue-600 h-full w-full flex-1 justify-center items-center relative">
            <View className="h-1/2 w-full bg-white top-0 absolute"></View>
            
            <View className="absolute top-16 w-full flex-row justify-center items-center mx-auto">
                <View style={{padding:2.5, backgroundColor:'white', borderRadius:5}}>
                 <Image
                    style={{height: 25, width: 80, backgroundColor:'white',objectFit:'contain'}}
                    source={require('@/assets/images/logodisdik.png')}
                    />
                </View>
                <View style={{marginLeft:8}}>
                    <Text style={{fontFamily:'Poppins-bold'}} className="text-blue-500 text-xs">Aplikasi Absensi Petugas</Text>
                    <Text style={{fontFamily:'Poppins-Regular'}}className="text-gray-500 text-xs">Dinas Pendidikan Kota Banjarbaru</Text>
                </View>
            </View>
           
            <View className="absolute bg-white shadow-sm shadow-gray-700 p-3 rounded-lg left-auto right-auto w-10/12">
                {error !== "" && (
                <View style={{backgroundColor:'#fee2e2', padding:5,borderRadius:5}}>
                    <Text style={{color:'#b91c1c',textAlign:'center'}} className="text-xs">{error}</Text>
                </View>
                )}
                <Text style={{textAlign:'center', fontFamily:'Poppins-Bold', fontWeight:'bold', fontSize:25}} className="text-gray-700">Login</Text>
                <TextInput 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-3"
                onChangeText={setEmail}
                value={email}
                placeholder="Masukkan Email"
                />
                <TextInput 
               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChangeText={setPassword}
                value={password}
                placeholder="Masukkan Password"
                secureTextEntry={true}
                />
                <TouchableOpacity onPress={login} disabled={onLogin} className="bg-emerald-500 px-3 py-2 rounded-lg mt-5 w-fit mx-auto">
                    {!onLogin && (
                        <View className="flex flex-row gap-2 items-center">
                            <Text>&#128640;</Text>
                            <Text style={{fontFamily:'Poppins-Regular', color:'white', textAlign:'center'}}>Masuk</Text>
                        </View>
                    )}
                    {onLogin && (
                        <ActivityIndicator size="small" color="white" />
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
