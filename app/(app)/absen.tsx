import NotOnLocation from '@/components/NotOnLocation';
import SearchLocation from '@/components/SearchLocation';
import Entypo from '@expo/vector-icons/Entypo';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import ToastManager, { Toast } from 'toastify-react-native';
import api from '../../api';
import { useSession } from '../ctx';

export default function Absen() {
    const [location, setLoc] = useState<Location.LocationObject | null>(null)
   
    const [permissions, setPermissions] = useState(true)
    const [onAbsen, setOnAbsen] = useState(false)

    const {session} = useSession()
    const {sudahAbsen} = useLocalSearchParams<{sudahAbsen: string}>()
    const {waktuAbsensi} = useLocalSearchParams<{waktuAbsensi: string}>()
    const {jadwalId} = useLocalSearchParams<{jadwalId:string}>()
    const [onLocation, setOnLocation] = useState(false)

    useEffect(()=>{
        requestLocation()
    },[])
    
    const requestLocation = async () =>{
        let {status} = await Location.requestForegroundPermissionsAsync()
        if(status !== 'granted'){
            setPermissions(false)
            return
        }
        
        let loc = await Location.getCurrentPositionAsync({})
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
    
    const send = async ()=>{
        setOnAbsen(true)

        api.post('/absen', {
            kode: session?.kode,
            waktu_absensi: waktuAbsensi,
            jadwal_id : jadwalId
        }).then((res) => {

            Toast.success(res.data.message)
            setTimeout(() => {
                router.replace('/')
            }, 1000);

        }).catch((err) => {
            setOnAbsen(false)
        })
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
                
                <Text style={{marginTop:20, fontFamily:'Poppins-Regular', color:'gray', textAlign:'center', fontSize:12}}>Berikan kami izin untuk mencari lokasi melalui perangkat anda</Text>
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
                <Text style={{fontFamily:'Poppins-Bold'}} className='text-white text-sm text-center'>ABSENSI {waktuAbsensi}</Text>
                <Text style={{fontFamily:'Poppins-Regular'}} className='text-white text-lg my-2 text-center'>Dinas Pendidikan Kota Banjarbaru</Text>
                <Text style={{fontFamily:'Poppins-Regular'}} className='text-white text-xs my-1 text-center'>Waktu Absensi : 08:00 - 12:00</Text>
            </View>
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

            <View className='h-96 mb-10'>
            <MapView
                style={{flex:1}}
                initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }}
                scrollEnabled={false}    // ❌ Nonaktifkan geser / drag
                zoomEnabled={false}      // ❌ Nonaktifkan pinch-to-zoom
                pitchEnabled={false}     // ❌ Nonaktifkan kemiringan kamera
                rotateEnabled={false}    // ❌ Nonaktifkan rotasi
            >
                <Marker
                coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
                title="Lokasi Saya"
                description="Lokasi saya saat ini"
                />
            </MapView>
            </View>

             {/* TOMBOL ABSEN */}
             {!onAbsen && (
                <TouchableOpacity onPress={send}className='bg-amber-500 w-fit mx-auto px-5 py-3 rounded-full flex-row items-center border-2 border-amber-200'>
                    <Entypo name="check" size={25} color="white" />
                    <Text style={{fontFamily:'Poppins-Regular'}} className='text-white text-xl ml-2'>{sudahAbsen === 'true' ? 'Simpan' : 'Absen'}</Text>
                </TouchableOpacity>
                )}
                {onAbsen && (
                    <ActivityIndicator size="large" color="#10b981" />
                )}
        </View>
    )
}
       
}