import { Color } from '@/constants/Color';
import Entypo from '@expo/vector-icons/Entypo';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native';
import ToastManager, { Toast } from 'toastify-react-native';
// import { CameraView,CameraType,useCameraPermissions} from 'expo-camera'
import ApiUrl from '@/api/ApiUrl';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
// import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';


type Position = {
    latitude: number,
    longitude: number
}

export default function Absen() {
    const cameraRef = useRef<CameraView | null>(null)
    const [facing, setFacing] = useState<CameraType>('back');
    const [cameraPermission, setCameraPermission] = useCameraPermissions();
    const [onLocation, setOnLocation] = useState(false)
    const [location, setLoc] = useState<Location.LocationObject | null>(null)
   
    // const device = useCameraDevice('front')
    // const { hasPermission } = useCameraPermission()
   
    const [photoUri, setPhotoUri]=useState<string | undefined>("")
    const [photoSend, setPhotoSend] = useState("")
    const [permissions, setPermissions] = useState(true)
    const [onAbsen, setOnAbsen] = useState(false)
    const [onLoadPhoto, setOnLoadPhoto] = useState(false)

    useEffect(()=>{
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
        formData.append('username', 'ahyaghifari')
        try {
            const req = await fetch(ApiUrl +  '/absen',{
                method:'POST',
                body:formData,
            })
            if(req.status == 200){
                Toast.success("Absen berhasil dilakukan :)")
                setTimeout(() => {
                    router.navigate('/')
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
    return(
        <View style={{justifyContent:'center', flex:1, alignItems:'center'}}>
            <View style={{alignItems:'center', padding:10, height: 220,backgroundColor:'white', borderRadius:20, shadowColor: '#171717',shadowOffset: {width: 0, height: 4},shadowOpacity: 0.1,shadowRadius: 3,}}>
            <Image
            style={{height: 150, width: 150}}
            source={require('@/assets/images/travel.gif')}
            contentFit="cover"
            />
            <Text style={{marginTop:20, fontFamily:'Poppins-Regular', color:'gray'}}>Menemukan lokasi anda...</Text>
            </View>
        </View>
        )
    }

    if(!onLocation){
        return (
        <View style={{flex:1, backgroundColor:'white', justifyContent:'center', alignItems:'center'}}>
            <Image
                    style={{height: 180, width: 180}}
                    source={require('@/assets/images/outlocation.gif')}
                    contentFit="cover"
                    />
            <Text style={{fontFamily:'Poppins-Bold',  fontSize:30, color:'#4b5563'}}>Ups...</Text>
            <Text style={{fontFamily:'Poppins-Regular',  fontSize:12, color:'#4b5563'}}>Anda berada diluar lingkungan kantor</Text>
        </View>
        )
    }

    if(onLocation){
    return (
        <View style={{flex:1, backgroundColor:'white'}}>
            <ToastManager />
            <View className="bg-emerald-500 p-5">
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, textAlign:'center', color:'white'}}>Anda berada di lingkungan kerja</Text>
                <Text style={{textAlign:'center', fontSize:17, color:'white', fontFamily:'Poppins-Bold', borderRadius:10}}>Dinas Pendidikan Kota Banjarbaru</Text>
                <Text style={{textAlign:'center',fontFamily:'Poppins-Regular', color:'white', opacity:0.7, fontSize:12}}>Senin, 28 Agustus 2025 08:24:25</Text>
            </View>
            <View style={{flexDirection:'row', padding:5, alignItems:'center'}}>
                <Image
                    style={{height: 110, width: 110}}
                    source={require('@/assets/images/onlocation.gif')}
                    contentFit="cover"
                    />
                <View>
                    <Text style={{fontFamily:'Poppins-Bold', fontSize:16, color:'#374151'}}>Muhammad Ahya Ghifari</Text>
                    <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'gray'}}>Petugas Kebersihan</Text>
                </View>
            </View>

            {photoUri == "" && (
            <View>
                <View className="w-10/12 mx-auto h-52">
                    <CameraView facing={facing}  ref={cameraRef}></CameraView>
                </View>
                <View style={{flexDirection:'row', position:'relative',  justifyContent:'center', marginTop:-30}}>
                    {/* TOMBOL AMBIL GAMBAR */}
                    <View style={{alignItems:'center'}}>
                        <Text style={{fontFamily:'Poppins-Regular', fontSize:11, color:'white'}}>Ambil Gambar</Text>
                        <TouchableOpacity disabled={onLoadPhoto} style={{backgroundColor:Color.blue, justifyContent:'center',opacity: (onLoadPhoto ? 0.6:1), alignItems:'center', width: 70, height:70, padding: 3, borderRadius: 100, marginTop:5}} onPress={ambilGambar}>
                            <Entypo name="camera" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{backgroundColor:'#ef4444', justifyContent:'center',right:25, alignItems:'center', width: 50, height:50, padding: 3, borderRadius: 100,position:'absolute'}} onPress={swapFace}>
                        <Entypo name="swap" size={25} color="white" />
                        </TouchableOpacity>
                </View>
            </View>
            )}

            {onLoadPhoto && (
                <View style={{width:350, height:220, alignSelf:'center', justifyContent:'center', marginTop:10}}>
                <ActivityIndicator size="large" color={Color.blue} />
                </View>
            )}

            {photoUri != "" && onLoadPhoto == false && (
                <View>
                <Image
                 source={{ uri: photoUri }}
                 style={{height: 220, width:350, marginLeft:'auto', marginRight:'auto' }}
             />
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
                <TouchableOpacity onPress={absen} disabled={photoUri == ""} style={{backgroundColor:'#22c55e',opacity: (photoUri == "" ? 0.6:1),  marginLeft: 'auto', marginRight:'auto', padding: 15, paddingLeft:50, paddingRight:50, borderRadius: 20, marginTop:20}}>
                    <Text style={{fontFamily:'Poppins-Regular', color:'white', fontWeight:'bold', fontSize:18, textAlign:'center'}}>&#128070; Absen</Text>
                </TouchableOpacity>
                )}
                {onAbsen && (
                    <ActivityIndicator size="large" color="#00ff00" />
                )}
        </View>
    )
}
       
}