import ApiUrl from '@/api/ApiUrl';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Link, useNavigation } from 'expo-router';
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type BerandaData = {
  nama: string,
  nik: string,
  jabatan:string,
  hadir: number,
  absen: number,
  sakit: number,
  sudahAbsen: boolean
}

const defaultProfile :BerandaData ={
  nama: '-',
  nik: '-',
  jabatan:'-',
  hadir: 0,
  absen: 0,
  sakit: 0,
  sudahAbsen: false
} 
export default function Index() {
  const [profile, setProfile] = useState<BerandaData>(defaultProfile)
  const absen = () => alert("TEKAN")
  const navigation = useNavigation();
  const [sudahAbsen, setSudahAbsen] = useState(false)


  
  useEffect(() => {
    const getProfile = async ()=>{
      const req = await fetch(ApiUrl + '/beranda',{method:'get'})
      if(req){
        const res = await req.json().then((r) => {
          const data :BerandaData={
                  nama : r.nama,
                  nik: r.nik,
                  jabatan: r.jabatan,
                  hadir: r.hadir,
                  absen: r.absen,
                  sakit: r.sakit,
                  sudahAbsen: true
                }
            setProfile(data)
        })
      }
        
    }
    getProfile()
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    
    <ScrollView
    contentContainerStyle={{flexGrow:1}}
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <View className='bg-blue-600 p-3'>
        <Text style={{color: 'white', fontFamily: 'Poppins-Regular', fontSize:12, opacity: 0.7}}>Aplikasi Absensi Petugas</Text>
        {/* <Text style={{color: 'white', fontFamily: 'Poppins-Regular', fontSize:12}}>Dinas Pendidikan Kota Banjarbaru</Text> */}
        <Text style={{color: 'white', fontFamily: 'Poppins-Regular', fontSize:12}}>Dinas Pendidikan Kota Banjarbaru</Text>
        <Text style={{color: '#374151', marginTop: 15, fontFamily: 'Poppins-Regular', fontSize:13, backgroundColor: 'white', borderRadius: 10, padding: 4,}}>Selamat datang dan selamat bekerja &#128527;&#128077;</Text>
       
      </View>
      
      <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:10}}>
      <Image
        style={{height: 94, width: 94}}
        source="https://img.icons8.com/3d-fluency/94/user-male-circle.png"
        contentFit="cover"
      />
      {/* NAMA */}
      <View className='flex-row mt-2 gap-2'>
        <AntDesign name="user" size={24} color="#1f2937" />
        <Text style={{fontFamily:'Poppins-Bold'}} className='text-gray-600 text-xl'>{profile.nama}</Text>
      </View>
      {/* NIK */}
      <View className='flex-row mt-1 gap-2'>
        <AntDesign name="idcard" size={18} color="#71717a" />
        <Text className='text-sm text-gray-500' style={{fontFamily:'Poppins-Regular'}} >{profile.nik}</Text>
      </View>
      {/* JABATAN */}
      <View className='flex-row mt-1 gap-2'>
        <Text className='text-sm text-gray-500' style={{fontFamily:'Poppins-Regular'}} >{profile.jabatan}</Text>
      </View>

      <TouchableOpacity style={{backgroundColor:'#d1d5db', width:80,  marginLeft: 'auto', marginRight:'auto', padding: 5,marginTop: 8, borderRadius: 20}} onPress={absen}>
          <Text style={{color:'#6b7280',textAlign:'center', fontSize:10}}>Pengaturan</Text>
        </TouchableOpacity>
      </View>

      <View className='h-0.5 mt-8 mb-4 w-full bg-gray-200'></View>

    {/* REKAP KEHADIRAN */}
      <View className='flex-row justify-around'>
        {/* HADIR */}
        <View style={{display:'flex', flexDirection: 'row', gap: 5,justifyContent: 'space-around'}}>
        <AntDesign name="checkcircle" size={20} color="#4ade80" />
          <View>
          <Text style={{fontFamily:'Poppins-Regular'}} className='text-gray-500 text-sm'>Hadir</Text>
          <Text className='text-2xl text-gray-600' style={{fontFamily:'Poppins-Bold'}} >{profile.hadir}</Text>
          </View>
        </View>
        {/* ABSEN */}
        <View style={{display:'flex', flexDirection: 'row', gap: 5,justifyContent: 'space-around'}}>
        <AntDesign name="closecircleo" size={20} color="#ef4444" />
          <View>
          <Text style={{fontFamily:'Poppins-Regular'}} className='text-gray-500 text-sm'>Absen</Text>
          <Text  className='text-2xl text-gray-600' style={{fontFamily:'Poppins-Bold'}} >{profile.absen}</Text>
          </View>
        </View>
        {/* SAKIT */}
        <View style={{display:'flex', flexDirection: 'row', gap: 5,justifyContent: 'space-around'}}>
        <MaterialIcons name="sick" size={20} color="#f59e0b" />
          <View>
          <Text style={{fontFamily:'Poppins-Regular'}} className='text-gray-500 text-sm'>Sakit</Text>
          <Text  className='text-2xl text-gray-600' style={{fontFamily:'Poppins-Bold'}} >{profile.sakit}</Text>
          </View>
        </View>
      </View>

      <View className='h-0.5 my-4 w-full bg-gray-200'></View>

    {/* ABSEN */}
    {/* BELUM ABSEN */}
    {profile.sudahAbsen == false && (
    <View style={{ marginTop:15, backgroundColor: '#10b981', marginRight:30, marginLeft:30, borderRadius: 10, padding: 10}}>
    <Text style={{textAlign:'center', fontFamily:'Poppins-Regular', color:'white', fontSize:12, fontWeight:'bold'}}>Jadwal Hari ini : 08.00 - 12.00</Text>
    <View style={{display:'flex', flexDirection:'row', justifyContent:'center', gap:4}}>
      <MaterialCommunityIcons name="office-building-marker" size={18} color="white" />
      <Text style={{textAlign:'center', fontSize:14, color:'white'}}>Kantor Blue Umbrella</Text>
    </View>
        <Link href="/absen" style={{backgroundColor:'white',  marginLeft: 'auto', marginRight:'auto', padding: 10, paddingLeft:25, paddingRight:25, marginTop: 15, borderRadius: 20}}>
          <Text style={{fontFamily:'Poppins-Regular', color:'#10b981', fontWeight:'bold', textAlign:'center'}}>&#128070; Absen Sekarang</Text>
        </Link>
    </View>
    )}
    {/* SUDAH ABSEN */}
    {profile.sudahAbsen == true && (
      <View className="bg-emerald-500 mt-3 w-11/12 mx-auto border border-emerald-500 rounded-lg">
        <Text className="text-white text-center p-2 text-xs" style={{fontFamily:'Poppins-Regular'}}>Anda sudah absen hari ini pada pukul 18.02</Text>
        <View className="bg-white rounded-b-lg px-2 pb-4">
          <Text className="text-red-700 text-center p-1 mt-2 w-fit mx-auto rounded text-[11px] bg-red-100" style={{fontFamily:'Poppins-Regular'}}>Foto Kegiatan 2/3 </Text>
          <View className='flex-row mt-4 justify-center gap-5'>
          <Link href="/absensi" className='bg-white p-2 rounded-lg hover:bg-emerald-100 border border-emerald-500'>
            <Text style={{fontFamily:'Poppins-Regular'}} className="text-emerald-600 text-sm">&#128203; Lihat Absensi</Text>
          </Link>
          <Link href={{pathname: '/absen', params:{sudahAbsen: 'true'}}} className='bg-emerald-500 p-2 rounded-lg hover:bg-emerald-600'>
            <Text style={{fontFamily:'Poppins-Regular'}} className="text-white text-sm">&#128247; Foto Kegiatan</Text>
          </Link>
          </View>
        </View>
      </View>
    )}
    

    {/* JADWAL BERIKUTNYA */}
    <View style={{marginLeft: 30, marginRight:30, marginTop:30}}>
      <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', borderBottomWidth:1, paddingBottom:8, borderBottomColor:'#d4d4d8'}}>
        <Text style={{fontSize:14, color:'#374151',fontWeight:'600'}}>Jadwal berikutnya</Text>
        <TouchableOpacity style={{backgroundColor:'#d1fae5', width: 100, padding: 5, borderRadius: 10}} onPress={absen}>
            <Text style={{fontFamily:'Poppins-Regular', color:'#10b981', textAlign:'center', fontSize:10}}>Lihat Jadwal</Text>
          </TouchableOpacity>
      </View>
      <View style={{marginTop: 8}}>
        <Text style={{fontSize:11, color:'#4b5563', marginBottom:10}}>Sabtu, 25 Agustus 2025, Pukul 08.00 - 10.00 | Kantor Blue Umbrella</Text>
        <Text style={{fontSize:11, color:'#4b5563', marginBottom:10}}>Minggu, 26 Agustus 2025, Pukul 08.00 - 10.00 | Markas Chris Redfield</Text>
      </View>
    </View>

    </ScrollView>
  );
}

