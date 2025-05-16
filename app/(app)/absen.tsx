import { Color } from '@/constants/Color';
import Entypo from '@expo/vector-icons/Entypo';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native';
import ToastManager, { Toast } from 'toastify-react-native';
// import { CameraView,CameraType,useCameraPermissions} from 'expo-camera'
import ApiUrl from '@/api/ApiUrl';
import NotOnLocation from '@/components/NotOnLocation';
import SearchLocation from '@/components/SearchLocation';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useSession } from '../ctx';
// import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';


type Position = {
    latitude: number,
    longitude: number
}

export default function Absen() {
    const {session} = useSession()
    const navigation = useNavigation();
    const {sudahAbsen} = useLocalSearchParams<{sudahAbsen: string}>()
    const cameraRef = useRef<CameraView | null>(null)
    const [facing, setFacing] = useState<CameraType>('back');
    const [cameraPermission, setCameraPermission] = useCameraPermissions();
    const [onLocation, setOnLocation] = useState(false)
    const [location, setLoc] = useState<Location.LocationObject | null>(null)
   
    const [photoUri, setPhotoUri]=useState<string | undefined>("")
    const [photoSend, setPhotoSend] = useState("")
    const [permissions, setPermissions] = useState(true)
    const [onAbsen, setOnAbsen] = useState(false)
    const [onLoadPhoto, setOnLoadPhoto] = useState(false)

    useEffect(()=>{
        if(sudahAbsen == undefined){
            navigation.setOptions({title: 'Absensi'})
        }else{
            navigation.setOptions({title: 'Foto Kegiatan'})
        }
        requestLocation()
    },[])
    
    const requestLocation = async () =>{
        let {status} = await Location.requestForegroundPermissionsAsync()
        if(status != 'granted'){
            setPermissions(false)
            return
        }
        
        // setCameraPermission()
        let loc = await Location.getCurrentPositionAsync({})
        if(loc){
            let formLoc = new FormData()
            formLoc.append('coords', JSON.stringify({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude
            }))
            setOnLocation(true)
            setLoc(loc)
            setPermissions(true)
            // try {
            //     const reqLoc = await fetch(ApiUrl + '/location',{
            //         method: 'POST',
            //         body: formLoc
            //     })
            //     if(reqLoc){
            //         const res =await reqLoc.json()
            //         if(res){
            //             console.log(res)
            //             if(res.status != 200){
            //                 setOnLocation(false)
            //                 setLoc(loc)
            //             }else{
            //                 setOnLocation(true)
            //                 setLoc(loc)
            //                 setPermissions(true)
            //             }
            //         }
            //     }
            // } catch (err) {
                
            // }
        }
    }
    
    const absen = async ()=>{
        setOnAbsen(true)
        let formData = new FormData()
        formData.append('photo', JSON.stringify({
            uri: photoSend,
            name: 'photo.png',
            type:'image/png'
        })as any)
        if(session){
            formData.append('nik', session.nik)
        }
        try {
            const req = await fetch(ApiUrl +  '/absen',{
                method:'POST',
                body:formData,
            })
            if(req.status == 200){
                Toast.success("Absen berhasil dilakukan :)")
                setTimeout(() => {
                    router.replace('/')
                }, 1000);
            }
        } catch (error) {
            console.error(error)
            setOnAbsen(false)
        }
    }

    const ambilGambar = async ()=>{
        setOnLoadPhoto(true)
        const gambar = await cameraRef.current?.takePictureAsync({
            quality: 0.2,
            shutterSound: false,
            base64:true
        })
        setPhotoUri("")
            if(gambar?.base64){
                setOnLoadPhoto(false)
                if(Platform.OS == 'web'){
                    setPhotoUri(gambar.base64)
                }else{
                    setPhotoUri(gambar.uri)
                }
                setPhotoSend(gambar.base64)
            }
    }

    const swapFace = () =>{
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const ulang = ()=>{
        setPhotoUri("")
    }

    if(!cameraPermission){
        return (
            <View>
                
            </View>
        )
    }

    if(permissions == false){
        return (
            <View style={{justifyContent:'center', flexDirection:'row', flex:1, alignItems:'center'}}>
                <View style={{backgroundColor:'white', flex:1, padding:30, alignItems:'center', marginRight:45, marginLeft:45, borderRadius:15}}>
                    <View style={{flexDirection:'row', justifyContent:'space-around', gap:30}}>
                    <Image
                    style={{height: 80, width: 80}}
                    source={require('@/assets/images/map.png')}
                    contentFit="cover"
                    />
                    
                    </View>
                
                <Text style={{marginTop:20, fontFamily:'Poppins-Regular', color:'gray', textAlign:'center', fontSize:12}}>Berikan kami izin untuk mencari lokasi melalui perangkat a</Text>
                <TouchableOpacity style={{backgroundColor:'#10b981', width:80,  marginLeft: 'auto', marginRight:'auto', padding: 5,marginTop: 8, borderRadius: 20}} onPress={requestLocation}>
                    <Text style={{color:'white',textAlign:'center', fontSize:14}}>Izinkan</Text>
                </TouchableOpacity>
                </View>
            </View>
            )
    }
   
    if(location == null){
        return <SearchLocation />
    }

    if(!onLocation){
       return <NotOnLocation />
    }

    if(onLocation){
    return (
        <View style={{flex:1, backgroundColor:'white'}}>
            <ToastManager />
            <View className="bg-emerald-500 p-4">
                <Text style={{fontFamily:'Poppins-Regular'}} className='text-white text-sm text-center'>Anda berada di lingkungan kerja</Text>
                <Text style={{fontFamily:'Poppins-Bold'}} className='text-white text-lg my-2 text-center'>Dinas Pendidikan Kota Banjarbaru</Text>
                <Text style={{fontFamily:'Poppins-Regular'}} className='text-yellow-50 text-center text-xs'>Senin, 28 Agustus 2025 08:24:25</Text>
            </View>
            <View className='p-2 flex-row items-center justify-center'>
                <Image
                    style={{height: 100, width: 100}}
                    source={require('@/assets/images/onlocation.gif')}
                    contentFit="cover"
                    />
                <View>
                    <Text style={{fontFamily:'Poppins-Bold'}} className=' text-gray-600'>Muhammad Ahya Ghifari</Text>
                    <Text style={{fontFamily:'Poppins-Regular'}} className='text-gray-500 text-sm'>Petugas Kebersihan</Text>
                </View>
            </View> 

            {photoUri == "" && (
            <View>
                <View className="w-full mx-auto h-64">
                    <CameraView facing={facing} style={{flex:1}} ref={cameraRef}></CameraView>
                </View>
                <View className='bg-refd' style={{flexDirection:'row', position:'relative',  justifyContent:'center'}}>
                    {/* TOMBOL AMBIL GAMBAR */}
                    <View style={{alignItems:'center'}}>
                        <Text style={{fontFamily:'Poppins-Regular'}} className='text-sm text-gray-600 mt-2'>Ambil Gambar</Text>
                        <TouchableOpacity disabled={onLoadPhoto} style={{opacity: (onLoadPhoto ? 0.6:1)}} className='bg-blue-600 p-5 mt-2 rounded-full' onPress={ambilGambar}>
                            <Entypo name="camera" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{right:25, top:5, position:'absolute'}} className='bg-gray-400 p-3 rounded-full' onPress={swapFace}>
                        <Entypo name="swap" size={25} color="white" />
                        </TouchableOpacity>
                </View>
            </View>
            )}

            {onLoadPhoto && (
                <View className='w-full justify-center align-center mt-5'>
                <ActivityIndicator size="large" color={Color.blue} />
                </View>
            )}

            {photoUri != "" && onLoadPhoto == false && (
                <View>
                    <View className='h-64 w-full'>
                        <Image
                        source={{ uri: photoUri }}
                        style={{flex:1}}
                        />
                        </View>
                    <View style={{alignItems:'flex-end', paddingRight:20}}>
                        <TouchableOpacity style={{backgroundColor:'#93c5fd', justifyContent:'center', alignItems:'center', flexDirection:'row', width: 100, padding: 8, gap:5,borderRadius: 10, marginTop:10}} onPress={ulang}>
                        <FontAwesome name="repeat" size={15} color="#1e40af" />
                            <Text style={{color:'#1e40af'}}>Ulang</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
           
             {/* TOMBOL ABSEN */}
             {!onAbsen && (
                <TouchableOpacity onPress={absen} disabled={photoUri == ""} style={{opacity: (photoUri == "" ? 0.6:1)}} className='bg-emerald-500 w-fit mx-auto px-5 py-4 rounded-full mt-5 flex-row border-4 border-emerald-200'>
                    <Entypo name="check" size={30} color="white" />
                    <Text style={{fontFamily:'Poppins-Regular'}} className='text-white text-xl'>{sudahAbsen == 'true' ? 'Simpan' : 'Absen'}</Text>
                </TouchableOpacity>
                )}
                {onAbsen && (
                    <ActivityIndicator size="large" color="#10b981" />
                )}
        </View>
    )
}
       
}