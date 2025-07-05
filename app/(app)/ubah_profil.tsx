import ApiUrl from "@/api/ApiUrl";
import * as FileSystem from 'expo-file-system';
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import ToastManager, { Toast } from 'toastify-react-native';
import { useSession } from "../ctx";

export default function UbahProfil(){
    const [image, setImage] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string>("")
    const {session} = useSession()
    const [onSimpan, setOnSimpan] = useState(false)
    
    const pilihGambar = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true
        });

        if (!result.canceled) {
            if(result.assets[0].base64){
                setBase64Image(result.assets[0].base64)
            }
            setImage(result.assets[0].uri);
        }
    };

    const ambilGambar = async () => {
        let take = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1,1],
            quality:1,
            base64:true
        })
          if (!take.canceled) {
            if(take.assets[0].base64){
                setBase64Image(take.assets[0].base64)
            }
            setImage(take.assets[0].uri);
        }
    }

    const simpan = async () => {
        setOnSimpan(true)
        let url = "/profile"
        let formData = new FormData()
        formData.append('photo', JSON.stringify({
            uri: base64Image,
            name: 'photo.png',
        }) as any)
        if(session){
            formData.append('email', session.email)
        }

        try {
            const req = await fetch(ApiUrl + url, {
                method:'post',
                body: formData
            })
            const res = await req.json()
            if(res.status === 200){
                
                 //  hapus foto profil
                    const fileUriLama = FileSystem.documentDirectory + 'profile.png';
                    const fileInfo = await FileSystem.getInfoAsync(fileUriLama);
                    if (fileInfo.exists) {
                        await FileSystem.deleteAsync(fileUriLama, { idempotent: true });
                    }

                const fileUri = FileSystem.documentDirectory + "profile.png"
                try {
                    await FileSystem.copyAsync({
                        from: image as string,
                        to: fileUri
                    })
                    Toast.success("Foto berhasil disimpan")
                    router.replace('/')
                } catch (error) {
                    Alert.alert('Error', 'Foto gagal disimpan diperangkat')
                }
            }
            setOnSimpan(false)
        } catch (error) {
            setOnSimpan(false)
        }
    }

    const ulang = () =>{
        setImage(null)
        setBase64Image("")
    }

    if(image != null){
        return (
            <View className="bg-white flex-1 pt-10 px-5 gap-5 justify-center">
                <ToastManager />
                
                <View className="mx-auto rounded-full justify-center w-3/4 items-center aspect-square overflow-hidden bg-gray-200">
                    <Image
                    source={{ uri: image }}
                    style={{width:'100%', height:'100%'}}
                    className="rounded-full overflow-hidden aspect-square"
                    contentFit="cover"
                    />
                </View>
                <TouchableOpacity disabled={onSimpan == true} className="bg-emerald-500 p-3 rounded-full mt-10" onPress={simpan}>
                    <Text className="text-white text-center" style={{fontFamily:'Poppins-Regular'}}>Simpan Foto</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={onSimpan == true} className="bg-gray-200 p-3 rounded-full mt-1" onPress={ulang}>
                    <Text className="text-gray-700 text-center" style={{fontFamily:'Poppins-Regular'}}>Ulang</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View className="bg-white flex-1 flex-row items-center justify-center px-5 gap-5">
            <TouchableOpacity onPress={pilihGambar} className="p-5 border border-dashed border-gray-700 rounded-lg w-40 h-40 justify-center items-center">
                <Image 
                    source="https://img.icons8.com/cute-clipart/100/image-gallery.png"
                    style={{height:85, width:85}}  
                    contentFit="contain"
                />
                <Text className="mt-2 text-gray-700 text-[0.6rem]" style={{fontFamily:'Poppins-Regular'}}>Ambil dari galeri</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={ambilGambar} className="p-5 border border-dashed border-gray-700 rounded-lg w-40 h-40 justify-center items-center">
                <Image 
                    source="https://img.icons8.com/bubbles/100/camera.png"
                    style={{height:85, width:85}}  
                    contentFit="contain"
                />
                <Text className="mt-2 text-gray-700 text-[0.6rem] text-center" style={{fontFamily:'Poppins-Regular'}}>Ambil dari kamera</Text>
            </TouchableOpacity>
        </View>
    )  
}