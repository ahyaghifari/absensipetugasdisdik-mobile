import { Absensi } from '@/api/Absensi';
import ApiUrl from '@/api/ApiUrl';
import { Jadwal } from '@/api/Jadwal';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import { Link, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from "react";
import { Alert, Platform, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '../../ctx';

type BerandaData = {
  nama: string,
  kode: string,
  jabatan:string,
  hadir: number,
  absen: number,
  sakit: number,
  jadwal: Jadwal | null,
  jadwalId: string | null,
  absensi: Absensi|null,
  jam_absen_mulai: string,
  jam_absen_pulang: string,
  libur: boolean,
  jumlah_foto_kegiatan: number,
  jadwal_berikutnya: Jadwal[] | null
}

const defaultProfile :BerandaData ={
  nama: '-',
  kode: '-',
  jabatan:'-',
  hadir: 0,
  absen: 0,
  sakit: 0,
  jadwal: null,
  jadwalId: null,
  absensi: null,
  jam_absen_mulai: '-',
  jam_absen_pulang: '-',
  libur: false,
  jumlah_foto_kegiatan: 0,
  jadwal_berikutnya: null
} 

export default function Index() {
  const defaultPhotoProfile = "https://img.icons8.com/3d-fluency/94/user-male-circle.png"
  const [photoProfile, setPhotoProfil] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [profile, setProfile] = useState<BerandaData>(defaultProfile)
  const navigation = useNavigation();
  const {signOut, session} = useSession()
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getProfile()
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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
  
   const loadSavedImage = async () => {
    const fileUri = FileSystem.documentDirectory + 'profile.png';
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      setPhotoProfil(fileInfo.uri)
    } else {
      setPhotoProfil(defaultPhotoProfile); // tidak ada file tersimpan
    }
  };

  const getProfile = async ()=>{
      if(session){
      const params = new URLSearchParams({
        'kode' : session.kode,
        'email' : session.email
      })
      const req = await fetch(ApiUrl + '/beranda?' + params,{method:'get'})
      if(req){
        const res = await req.json()
        // console.log(res)
        let jadwal : Jadwal | null = null
        let absensi : Absensi|null = null
        let jadwal_berikutnya : Jadwal[] | null = null
        let jadwal_id : string | null = null
        
        if(res.jadwal != null){
          jadwal = {
            tanggal: null,
            kantor: res.jadwal.kantor,
            shift:res.jadwal.shift,
          }
        }

        if(res.jadwal_id != null){
          jadwal_id = res.jadwal_id
        }

        if(res.absensi != null){
          absensi = res.absensi
        }

        if(res.jadwal_berikutnya != null){
          jadwal_berikutnya = []
          res.jadwal_berikutnya.forEach((jb: {
            tanggal: string | null; nama_kantor: any; shift: any; 
            }) => {
            jadwal_berikutnya?.push({
              tanggal: jb.tanggal,
              kantor: jb.nama_kantor,
              shift: jb.shift
            })
          });
        }

        const data : BerandaData= {
            nama : session.nama,
            kode: session.kode,
            jabatan: session.jabatan,
            hadir: res.hadir,
            absen: res.absen,
            sakit: res.sakit,
            jadwal: jadwal,
            jadwalId: jadwal_id,
            absensi: absensi,
            libur: res.libur,
            jam_absen_mulai: res.waktu_absen_awal,
            jam_absen_pulang: res.waktu_absen_akhir,
            jumlah_foto_kegiatan: (res.jadwal == null)  ? 0: res.jadwal.jumlah_foto_kegiatan,
            jadwal_berikutnya: jadwal_berikutnya
        }
        setProfile(data)
      }
    }
        
    }

  useEffect(() => {
    getProfile()
    setPhotoProfil(defaultPhotoProfile)
    loadSavedImage()
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <SafeAreaProvider style={{backgroundColor:'white'}}>
      <SafeAreaView>
        <ScrollView 
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{flex: 1,backgroundColor: 'white'}}
        >
          <View className='bg-blue-600 p-3 pt-5'>
            <Text style={{color: 'white', fontFamily: 'Poppins-Regular', fontSize:12, opacity: 0.7}}>Aplikasi Absensi Petugas</Text>
            <Text style={{color: 'white', fontFamily: 'Poppins-Regul`ar', fontSize:12}}>Dinas Pendidikan Kota Banjarbaru</Text>
            <Text style={{color: '#374151', marginTop: 15, fontFamily: 'Poppins-Regular', fontSize:12, backgroundColor: 'white', borderRadius: 10, padding: 4,}}>Selamat datang dan selamat bekerja &#128527;&#128077;</Text>
          </View>
          
          <View className='mt-5 flex flex-row px-5 gap-x-3'>
            {/* foto profil */}
            <View style={{height:94, width:94}} className='rounded-full overflow-hidden'>
              <Image
                style={{height: 94, width: 94}}
                source={photoProfile}
                className='rounded-full overflow-hidden'
                contentFit="cover"
                />
            </View>
            <View>
            {/* NAMA */}
            <View className='flex-row mt-2 gap-2'>
              <Text style={{fontFamily:'Poppins-Bold'}} className='text-gray-700 text-lg'>{profile.nama}</Text>
            </View>
            {/* kode */}
            <View className='flex-row mt-1 gap-2'>
              <Text className='text-xs text-gray-600' style={{fontFamily:'Poppins-Regular'}} >{profile.kode}</Text>
            </View>
            {/* JABATAN */}
            <View className='flex-row mt-1 gap-2'>
              <Text className='text-xs text-gray-600' style={{fontFamily:'Poppins-Regular'}} >{profile.jabatan}</Text>
            </View>
            <View className='flex flex-row mt-3 gap-1'>
              <Link href="/(app)/ubah_profil" className='bg-blue-100 hover:bg-blue-200 flex gap flex-row px-3 py-2 rounded-full items-center'>
                  <Text className='text-blue-800 text-[0.6rem] ml-2'>Ubah Foto Profil</Text>
              </Link>
              {/* <Link href="/(app)/ubah_password" className='bg-red-100 hover:bg-red-200 flex gap-1 flex-row px-3 py-2 rounded-full items-center'>
                  <MaterialCommunityIcons name="key-variant" size={14} color="#991b1b" />
                  <Text className='text-red-800 text-[0.6rem]'>Ubah Password</Text>
              </Link>
              <TouchableOpacity className='bg-neutral-100 hover:bg-neutral-200 flex gap-1 flex-row px-3 py-2 rounded-full items-center' onPress={logout}>
                <MaterialCommunityIcons name="logout" size={14} className="text-neutral-600" />
                <Text className='text-neutral-600 text-[0.6rem]'>Logout</Text>
              </TouchableOpacity> */}
            </View>
          </View>
          </View>

          <View className='h-0.5 mt-5 mb-4 w-full bg-gray-200'></View>

        {/* REKAP KEHADIRAN */}
          <View className='flex-row justify-around'>
            {/* HADIR */}
            <View style={{display:'flex', flexDirection: 'row', gap: 5,justifyContent: 'space-around'}}>
            <AntDesign name="checkcircle" size={20} color="#4ade80" />
              <View>
              <Text style={{fontFamily:'Poppins-Regular'}} className='text-gray-500 text-sm'>Hadir</Text>
              <Text className='text-xl text-gray-600' style={{fontFamily:'Poppins-Bold'}} >{profile.hadir}</Text>
              </View>
            </View>
            {/* ABSEN */}
            <View style={{display:'flex', flexDirection: 'row', gap: 5,justifyContent: 'space-around'}}>
            <AntDesign name="closecircleo" size={18} color="#ef4444" />
              <View>
              <Text style={{fontFamily:'Poppins-Regular'}} className='text-gray-500 text-sm'>Absen</Text>
              <Text  className='text-xl text-gray-600' style={{fontFamily:'Poppins-Bold'}} >{profile.absen}</Text>
              </View>
            </View>
            {/* SAKIT */}
            <View style={{display:'flex', flexDirection: 'row', gap: 5,justifyContent: 'space-around'}}>
            <MaterialIcons name="sick" size={20} color="#f59e0b" />
              <View>
              <Text style={{fontFamily:'Poppins-Regular'}} className='text-gray-500 text-sm'>Sakit</Text>
              <Text  className='text-xl text-gray-600' style={{fontFamily:'Poppins-Bold'}} >{profile.sakit}</Text>
              </View>
            </View>
          </View>

          <View className='h-0.5 my-4 w-full bg-gray-200'></View>

        {/* ABSEN */}
        {/* JIKA LIBUR */}
        {profile.libur === true && (
          <View className='flex w-11/12 mx-auto flex-row items-center justify-center p-2 rounded-lg border border-red-500 gap-3'>
            <Image
            style={{height: 30, width: 30}}
            source={require('@/assets/images/smile-libur.gif')}
            contentFit="cover"
          />
            <Text className='text-red-500 text-xs' style={{fontFamily:'Poppins-Regular'}}>Anda hari ini libur, tidak ada absensi.</Text>
          </View>
        )}
        {/* JADWAL DAN ABSENSI */}
        {profile.jadwal != null && (
          <View className='px-6'>
            {/* jadwal */}
            <View className='border p-3 rounded-xl border-emerald-500'>
              <Text className='text-center text-emerald-600 mb-1 text-xs opacity-90'>Jadwal anda hari ini</Text>
              <View style={{display:'flex', flexDirection:'row', justifyContent:'center', gap:4}}>
                <MaterialCommunityIcons name="office-building-marker" size={20} color="#059669" />
                <Text style={{fontFamily:'Poppins-Bold'}} className='text-emerald-600 text-sm'>{profile.jadwal.kantor} {profile.jadwal.shift != null ? '| ' + profile.jadwal.shift : ''}</Text>
              </View>
            {/* foto kegiatan */}
            {
              profile.absensi?.absensi_masuk.sudah_absen && (
                  <View className='mt-3 flex flex-row gap-2 items-center justify-around bg-emerald-100 p-2 px-2 rounded-lg'>
                    <View className='flex flex-row gap-1'>
                      <Text className='text-center text-gray-600 text-sm'>Foto Kegiatan : </Text>
                      <Text className='text-center text-sky-600 font-semibold text-sm'>{profile.absensi?.jumlah_foto_kegiatan}/{profile.jumlah_foto_kegiatan}</Text>
                    </View>
                    {profile.jumlah_foto_kegiatan !== profile.absensi?.jumlah_foto_kegiatan && (
                      <Link href={{pathname: '/(app)/foto_kegiatan', params:{absensiId: profile.absensi.id}}} className='bg-sky-500 p-2 rounded-lg active:bg-sky-600'>
                      <Text style={{fontFamily:'Poppins-Regular'}} className="text-white text-sm">Foto Kegiatan</Text>
                    </Link>
                    )}
                  </View>
              )
            }
            </View>
            {/* absensi masuk */}
            <View className='mt-5 bg-amber-100 p-3 rounded-xl border border-amber-300'>
              <Text className='text-xs text-amber-700 text-center mb-3'>Absensi Masuk | {profile.absensi?.absensi_masuk.waktu_awal} - {profile.absensi?.absensi_masuk.waktu_akhir}</Text>
              {/* belum bisa absen masuk */}
              {profile.absensi?.absensi_masuk.bisa_absen === false && profile.absensi?.absensi_masuk.sudah_absen === false && (
                <Text className='text-center p-2 rounded-full bg-amber-200 text-sm text-amber-600'>Anda belum atau tidak bisa absen</Text>
              )}
              {/* bisa absen masuk */}
              {profile.absensi?.absensi_masuk.bisa_absen && profile.absensi?.absensi_masuk.sudah_absen === false && (
                <Link href={{pathname: '/(app)/absen', params:{waktuAbsensi: 'MASUK', jadwalId: profile.jadwalId}}}  className='bg-white w-full py-3 px-3 rounded-full mx-auto border border-amber-400 active:bg-amber-300'>
                  <Text style={{fontFamily:'Poppins-Regular', color:'#d97706', fontWeight:'bold', textAlign:'center'}}>&#128070; Absen Masuk</Text>
              </Link>
              )}
              {/* sudah absen */}
              {profile.absensi?.absensi_masuk.sudah_absen && (
                <View>
                  <Text className='text-xs text-amber-800 text-center font-semibold'>Anda sudah diabsensi pada {profile.absensi?.absensi_masuk.waktu_absen}</Text>
                  <Text className='text-xs text-amber-600 text-center mt-1'>Status kehadiran</Text>
                  <Text className='text-sm text-center bg-green-400 rounded-lg text-white mt-1 font-semibold p-2'>HADIR</Text>
                </View>
              )}
            </View>
            {/* pulang */}
            <View className='mt-5 bg-red-100 p-3 rounded-xl border border-red-300'>
              <Text className='text-xs text-red-700 text-center mb-3'>Absensi Pulang | {profile.absensi?.absensi_pulang.waktu_awal} - {profile.absensi?.absensi_pulang.waktu_akhir}</Text>
              {/* belum bisa absen masuk */}
              {profile.absensi?.absensi_pulang.bisa_absen === false && profile.absensi?.absensi_pulang.sudah_absen === false && (
                <Text className='text-center p-2 rounded-full bg-red-200 text-sm text-red-600'>Anda belum atau tidak bisa absen</Text>
              )}
              {/* bisa absen masuk */}
              {profile.absensi?.absensi_pulang.bisa_absen && profile.absensi?.absensi_pulang.sudah_absen === false && (
                <Link href={{pathname: '/(app)/absen', params:{waktuAbsensi: 'PULANG', jadwalId: profile.jadwalId}}}  className='bg-white w-full py-3 px-3 rounded-full mx-auto border border-red-400 active:bg-red-300'>
                  <Text style={{fontFamily:'Poppins-Regular', color:'#dc2626', fontWeight:'bold', textAlign:'center'}}>&#128070; Absen Pulang</Text>
              </Link>
              )}
              {/* sudah absen */}
              {profile.absensi?.absensi_pulang.sudah_absen && (
                <View>
                  <Text className='text-xs text-red-800 text-center font-semibold'>Anda sudah diabsensi pada {profile.absensi?.absensi_pulang.waktu_absen}</Text>
                  <Text className='text-xs text-red-600 text-center mt-1'>Status kehadiran</Text>
                  <Text className='text-sm text-center bg-green-400 rounded-lg text-white mt-1 font-semibold p-2'>HADIR</Text>
                </View>
              )}
            </View>
          </View>
        )}

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

