import { Absensi } from '@/api/Absensi';
import ApiUrl from '@/api/ApiUrl';
import { Jadwal } from '@/api/Jadwal';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Link, useNavigation } from 'expo-router';
import { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { formatTanggalIndonesia } from '../../functions/Time';
import { useSession } from '../ctx';

type BerandaData = {
  nama: string,
  nik: string,
  jabatan:string,
  hadir: number,
  absen: number,
  sakit: number,
  sudahAbsen: boolean,
  bisaAbsen: boolean,
  jadwal: Jadwal | null,
  absensi: Absensi|null,
  jumlah_foto_kegiatan: number,
  jadwal_berikutnya: Jadwal[] | null
}

const defaultProfile :BerandaData ={
  nama: '-',
  nik: '-',
  jabatan:'-',
  hadir: 0,
  absen: 0,
  sakit: 0,
  sudahAbsen: false,
  bisaAbsen: false,
  jadwal: null,
  absensi: null,
  jumlah_foto_kegiatan: 0,
  jadwal_berikutnya: null
} 
export default function Index() {
  const [profile, setProfile] = useState<BerandaData>(defaultProfile)
  const absen = () => alert("TEKAN")  
  const navigation = useNavigation();
  const [sudahAbsen, setSudahAbsen] = useState(false)
  const {signOut, session} = useSession()
  
  useEffect(() => {
    const getProfile = async ()=>{
      if(session){
      const params = new URLSearchParams({
        'nik' : session.nik
      })
      const req = await fetch(ApiUrl + '/beranda?' + params,{method:'get'})
      if(req){
        const res = await req.json()
        console.log(res)
        let jadwal : Jadwal | null = null
        let absensi : Absensi|null = null
        let jadwal_berikutnya : Jadwal[] | null = null
        
        if(res.jadwal != null){
          jadwal = {
            tanggal: null,
            kantor: res.jadwal.nama_kantor,
            shift:res.jadwal.shift,
            jam_absen_mulai: res.jadwal.waktu_absen_mulai,
            jam_absen_pulang: res.jadwal.waktu_absen_pulang
          }
        }

        if(res.absensi != null){
          absensi = {
            jumlah_kegiatan: res.absensi.jumlah_kegiatan,
            created_at: res.absensi.created_at,
            status_kehadiran: res.absensi.status_kehadiran
          }
        }

        if(res.jadwal_berikutnya != null){
          jadwal_berikutnya = []
          res.jadwal_berikutnya.forEach((jb: {
            tanggal: string | null; nama_kantor: any; shift: any; 
            }) => {
            jadwal_berikutnya?.push({
              tanggal: jb.tanggal,
              kantor: jb.nama_kantor,
              shift: jb.shift,
              jam_absen_mulai: "",
              jam_absen_pulang: ""
            })
          });
        }

        const data : BerandaData= {
            nama : session.nama,
            nik: session.nik,
            jabatan: session.jabatan,
            hadir: res.hadir,
            absen: res.absen,
            sakit: res.sakit,
            sudahAbsen: res.sudah_absen,
            bisaAbsen: res.bisa_absen,
            jadwal: jadwal,
            absensi: absensi,
            jumlah_foto_kegiatan: res.jadwal.jumlah_foto_kegiatan,
            jadwal_berikutnya: jadwal_berikutnya
        }
        setProfile(data)
      }
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
        <Text style={{color: 'white', fontFamily: 'Poppins-Regul`ar', fontSize:12}}>Dinas Pendidikan Kota Banjarbaru</Text>
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
        <Text style={{fontFamily:'Poppins-Bold'}} className='text-gray-700 text-lg'>{profile.nama}</Text>
      </View>
      {/* NIK */}
      <View className='flex-row mt-1 gap-2'>
        <AntDesign name="idcard" size={18} color="#71717a" />
        <Text className='text-xs text-gray-600' style={{fontFamily:'Poppins-Regular'}} >{profile.nik}</Text>
      </View>
      {/* JABATAN */}
      <View className='flex-row mt-1 gap-2'>
        <Text className='text-xs text-gray-600' style={{fontFamily:'Poppins-Regular'}} >{profile.jabatan}</Text>
      </View>

      <TouchableOpacity style={{backgroundColor:'#d1d5db', width:80,  marginLeft: 'auto', marginRight:'auto', padding: 5,marginTop: 8, borderRadius: 20}} onPress={signOut}>
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
    {/* JIKA LIBUR */}
    {profile.jadwal == null && (
      <View className='flex w-11/12 mx-auto flex-row items-center justify-center p-2 rounded-lg border border-red-500 gap-3'>
        <Image
        style={{height: 30, width: 30}}
        source={require('@/assets/images/smile-libur.gif')}
        contentFit="cover"
      />
        <Text className='text-red-500 text-xs' style={{fontFamily:'Poppins-Regular'}}>Anda hari ini libur, tidak ada absen.</Text>
      </View>
    )}
    {/* BELUM ABSEN */}
    {profile.sudahAbsen == false && profile.jadwal != null && (
    <View style={{ marginTop:15, backgroundColor: '#10b981', marginRight:30, marginLeft:30, borderRadius: 10, padding: 10}}>
        <View style={{display:'flex', flexDirection:'row', justifyContent:'center', gap:4}}>
          <MaterialCommunityIcons name="office-building-marker" size={20} color="white" />
          <Text style={{fontFamily:'Poppins-Bold'}} className='text-white font-semibold text-sm'>{profile.jadwal.kantor} | {profile.jadwal.shift}</Text>
        </View>
        <Text style={{fontFamily:'Poppins-Regular'}} className='text-white text-xs text-center mt-1'>Waktu Absen : {profile.jadwal.jam_absen_mulai} - {profile.jadwal.jam_absen_pulang}</Text>
        
        {/* jika bisa absen sesuai jam  */}
        {profile.bisaAbsen && (
          <Link href="/absen" className='bg-white mt-3 w-fit py-2 px-3 rounded-full mx-auto shadow shadow-emerald-300'>
          <Text style={{fontFamily:'Poppins-Regular', color:'#10b981', fontWeight:'bold', textAlign:'center'}}>&#128070; Absen Sekarang</Text>
        </Link>
        )}
        {!profile.bisaAbsen && (
          <Text style={{fontFamily:'Poppins-Regular'}} className='text-xs text-center opacity-75 mt-3 text-white'>Anda tidak bisa melakukan absen saat ini</Text>
        )}
    </View>
    )}
    {/* SUDAH ABSEN */}
    {profile.sudahAbsen == true && profile.absensi != null && (
      <View className="bg-emerald-500 mt-3 w-11/12 mx-auto border border-emerald-500 rounded-lg">
        <Text className="text-white text-center p-2 text-xs" style={{fontFamily:'Poppins-Regular'}}>Anda sudah absen hari ini pada pukul {profile.absensi.created_at}</Text>
        <View className="bg-white rounded-b-lg px-2 pb-4">
          <Text className="text-red-700 text-center p-1 mt-2 w-fit mx-auto r  ounded text-[11px] bg-red-100" style={{fontFamily:'Poppins-Regular'}}>Foto Kegiatan {profile.absensi.jumlah_kegiatan}/{profile.jumlah_foto_kegiatan} </Text>
          <View className='flex-row mt-4 justify-center gap-5'>
          <Link href="/absensi" className='bg-white p-2 rounded-lg hover:bg-emerald-100 border border-emerald-500'>
            <Text style={{fontFamily:'Poppins-Regular'}} className="text-emerald-600 text-sm">&#128203; Lihat Absensi</Text>
          </Link>
          {profile.jumlah_foto_kegiatan != profile.absensi.jumlah_kegiatan && (
            <Link href={{pathname: '/absen', params:{sudahAbsen: 'true'}}} className='bg-blue-500 p-2 rounded-lg hover:bg-emerald-600'>
            <Text style={{fontFamily:'Poppins-Regular'}} className="text-white text-sm">&#128247; Foto Kegiatan</Text>
          </Link>
          )}
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

      {profile.jadwal_berikutnya != null && (
        <FlatList data={profile.jadwal_berikutnya} renderItem={({item, index}) => (
          <View className='my-2'>
          <Text className='text-xs text-gray-600'>{formatTanggalIndonesia(item.tanggal)}, {item.kantor} | {item.shift}</Text>
        </View>
        )}
        />
      )}
    </View>

    </ScrollView>
  );
}

