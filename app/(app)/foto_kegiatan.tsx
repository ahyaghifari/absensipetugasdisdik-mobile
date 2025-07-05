import api from '@/api';
import NotOnLocation from '@/components/NotOnLocation';
import SearchLocation from '@/components/SearchLocation';
import { Color } from '@/constants/Color';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import ToastManager, { Toast } from 'toastify-react-native';
import { useSession } from '../ctx';


export default function Absen() {
    const {session} = useSession()
    const cameraRef = useRef<CameraView | null>(null)
    const [facing, setFacing] = useState<CameraType>('back');
    const [cameraPermission, setCameraPermission] = useCameraPermissions();
    const [onLocation, setOnLocation] = useState(false)
    const [location, setLoc] = useState<Location.LocationObject | null>(null)
    
    const [photoUri, setPhotoUri]=useState<string | undefined>("")
    const [photoSend, setPhotoSend] = useState("")
    const [permissions, setPermissions] = useState(true)
    const [onKirim, setOnKirim] = useState(false)
    const [onLoadPhoto, setOnLoadPhoto] = useState(false)

    const {absensiId} = useLocalSearchParams<{absensiId: string}>()

    useEffect(()=>{
        console.log(absensiId)
        requestLocation()
    },[])
    
    const requestLocation = async () =>{
        let {status} = await Location.requestForegroundPermissionsAsync()
        if(status !== 'granted'){
            setPermissions(false)
            return
        }
        
        setCameraPermission()
        let loc = await Location.getCurrentPositionAsync({})
        if(loc){
            if(loc){
            api.post('/location', {latitude: loc.coords.latitude, longitude: loc.coords.longitude}).then((res) =>{
                    if(res.data.onlocation === true){
                        setOnLocation(true)
                        setLoc(loc)
                        setPermissions(true)
                    }else{
                        setOnLocation(false)
                        setLoc(loc)
                    }
                })
            }
        }
    }
    
    const send = async ()=>{
        setOnKirim(true)

        let formData = new FormData()
        formData.append('photo', JSON.stringify({
            uri: photoSend,
            name: 'photo.png',
            type:'image/png'
        })as any)
        formData.append('absensi_id', absensiId)
        if(session){
            formData.append('kode', session.kode)
        }

        api.post('foto-kegiatan', formData, {headers: {"Content-Type": 'multipart/form-data'}}).then((res) => {
            Toast.success(res.data.message)
            setTimeout(() => {
                router.replace('/')
            }, 1000);
        }).catch((err) =>{
            Toast.error('Gagal kirim foto kegiatan')
            setOnKirim(false)
        })
    }

    const ambilGambar = async ()=>{
        setOnLoadPhoto(true)
        const gambar = await cameraRef.current?.takePictureAsync({
            quality: 0.35,
            shutterSound: false,
            base64: true
        })
        if(gambar?.base64){
            setOnLoadPhoto(false)
            setPhotoUri(gambar.uri)
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
            <View></View>
        )
    }

    if(permissions === false){
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
           <View className='p-2 flex-row items-center'>
                <Image
                    style={{height: 100, width: 100}}
                    source={require('@/assets/images/onlocation.gif')}
                    contentFit="cover"
                    />
                <View>
                    <Text style={{fontFamily:'Poppins-Bold'}} className=' text-gray-600'>{session?.nama}</Text>
                    <Text style={{fontFamily:'Poppins-Regular'}} className=' text-gray-500 text-xs my-1'>{session?.kode}</Text>
                    <Text style={{fontFamily:'Poppins-Regular'}} className='text-gray-500 text-sm'>{session?.jabatan}</Text>
                </View>
            </View> 

            {photoUri === "" && (
            <View>
                <View className="h-auto mx-auto w-full aspect-square">
                    <CameraView facing={facing} ratio='1:1' style={{flex:1}} ref={cameraRef}></CameraView>
                </View>
                <View className='bg-red' style={{flexDirection:'row', position:'relative',  justifyContent:'center'}}>
                    {/* TOMBOL AMBIL GAMBAR */}
                    <View style={{alignItems:'center'}}>
                        <Text style={{fontFamily:'Poppins-Regular'}} className='text-sm text-gray-600 mt-2'>Ambil Gambar</Text>
                        <TouchableOpacity disabled={onLoadPhoto} style={{opacity: (onLoadPhoto ? 0.6:1)}} className='bg-blue-600 p-5 mt-2 rounded-full' onPress={ambilGambar}>
                            <FontAwesome name="camera" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{right:25, top:10, position:'absolute'}} className='bg-gray-400 p-3 rounded-full' onPress={swapFace}>
                        <FontAwesome name="rotate-right" size={20} color="white" />
                        </TouchableOpacity>
                </View>
            </View>
            )}

            {onLoadPhoto && (
                <View className='w-full justify-center align-center mt-5'>
                <ActivityIndicator size="large" color={Color.blue} />
                </View>
            )}

            {photoUri !== "" && onLoadPhoto === false && (
                <View>
                    <View className='w-full aspect-square'>
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
           
             {/* TOMBOL SIMPAN */}
             {!onKirim && (
                <TouchableOpacity onPress={send} disabled={photoUri === ""} style={{opacity: (photoUri === "" ? 0.6:1)}} className='bg-emerald-500 w-fit mx-auto px-6 py-3 rounded-full mt-5 flex-row items-center border-4 border-emerald-200'>
                    <FontAwesome name="send" size={20} color="white" />
                    <Text style={{fontFamily:'Poppins-Regular'}} className='text-white text-xl ml-2'>Kirim</Text>
                </TouchableOpacity>
                )}
                {onKirim && (
                    <ActivityIndicator size="large" color="#10b981" />
                )}
        </View>
    )
}
       
}