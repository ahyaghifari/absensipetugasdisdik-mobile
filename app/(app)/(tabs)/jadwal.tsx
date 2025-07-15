import api from '@/api';
import { useSession } from '@/app/ctx';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ALPA, HADIR, IZIN, SAKIT } from '../../../constants/JadwalAbsensi';

type Absensi = {
  status_kehadiran : string,
  waktu_absensi: string | null
}

type Jadwal = {
  tanggal: string,
  shift: string,
  kantor: string,
  jenis: string,
  background: string,
  color: string| null,
  absensi: boolean,
  absensi_masuk: Absensi | null,
  absensi_pulang: Absensi | null
}

export default function JadwalScreen() {
    const {session} = useSession()


  LocaleConfig.locales['id'] = {
  monthNames: [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'October',
    'November',
    'Desember'
  ],
  monthNamesShort: ['Jan', 'Feb.', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sept', 'Oct', 'Nov', 'Des'],
  dayNames: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  dayNamesShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
  today: "Hari ini"
};

  LocaleConfig.defaultLocale = 'id'

  const [onload, setOnLoad] = useState(true)
  const [jadwal, setJadwal] = useState<Jadwal[]>([])
  
  const [calendarMarked, setCalendarMarked] = useState({})
  const [colorJadwal, setColorJadwal] = useState('green') 
  const [refreshing, setRefreshing] = useState(false)

  const [selected, setSelected] = useState<string | undefined>('');

  const [selectedJadwal, setSelectedJadwal] = useState<Jadwal | null>(null)

  const isColorDark = (hex: string) => {
    // Hapus tanda "#" jika ada
    hex = hex.replace('#', '');

    // Konversi 3 digit HEX ke 6 digit
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    // Konversi HEX ke RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Hitung luminance (per WCAG)
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Jika luminance < 128, anggap gelap
    return luminance < 128;
  }


  const onRefresh = useCallback(() => {
      setRefreshing(true);
      getJadwal()
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }, []);

  const getIconAbsensi = (status_kehadiran :any) =>{
      if(status_kehadiran === HADIR){
        return <Entypo name="check" size={17} color="green" />
      }else if(status_kehadiran === SAKIT){
        return <MaterialCommunityIcons name="emoticon-sick" size={17} color="yellow" />
      }else if(status_kehadiran === IZIN){
        return <Entypo name="info" size={17} color="blue" />
      }else if(status_kehadiran === ALPA){
        return <Entypo name="cross" size={17} color="red" />
      }
  }

  const getStatusAbsensi = (status_kehadiran: string | undefined, waktu_absensi: string | null | undefined) => {
    let warna = '#10b981'
    if(status_kehadiran === SAKIT){
      warna = '#f59e0b'
    }else if(status_kehadiran === IZIN){
      warna = '#0ea5e9'
    }else if(status_kehadiran === ALPA){
      warna = '#ef4444'
    }
    return (
      <View className='flex flex-row justify-between items-center rounded-lg p-2 mt-2' style={{backgroundColor: warna}}>
        <Text className='font-semibold text-white inline'>{status_kehadiran}</Text>
        {waktu_absensi != null && (
          <Text className='text-white opacity-80 text-sm'>{waktu_absensi}</Text>
        )}
      </View>
    )
  }

  const chooseJadwal = (tanggal : string | undefined)=>{
    let selected = jadwal.find((j) => j.tanggal === tanggal)
    if(selected !== undefined){
      setColorJadwal(selected.background)
      setSelectedJadwal(selected)
    }
  }

  const formatTanggal = (tanggalString: string) => {
  const tanggal = new Date(tanggalString);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    }).format(tanggal);
  };

  const getJadwal = () => {
    setOnLoad(true)
    api.get('/jadwal', {params: {kode: session?.kode}}).then((res) => {
      setJadwal(res.data.data)
      setOnLoad(false)
      // setCalendarMarked(convertToMarkedDates(res.data.data))
    })
  }

  useEffect(() => {
    getJadwal()
  }, []);

  // const convertToMarkedDates = (data : any) => {
  //   const result: { [key: string]: any } = {};

  //   data.forEach((item: { tanggal: string; background: any | null; color: any | null}) => {
  //     result[item.tanggal] = {
  //       customStyles: {
  //         container: {
  //           dotColor: 'red',
  //           backgroundColor: item.background != null ? item.background : '',
  //         },
  //         text: {
  //           color: item.color != null ? item.color : 'black',
  //         }
  //       }
  //     };
  //   });

  //   return result;
  // };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={{padding:15, paddingBottom:100}}>
        {/* kalender */}
        <View className='bg-white w-full rounded-lg p-2 overflow-hidden'>
          <Calendar
            monthFormat='MMMM yyyy'
            // onDayPress={day => {  
            //   console.log(day.dateString)
            //   chooseJadwal(day.dateString);
            // }}
            markingType='custom'
            // markedDates={{
            //   ...calendarMarked,
            //   [selected]: {selected: true, disableTouchEvent: true, customStyles: {container:{backgroundColor: '#ef4444'}}}
            // }}
            dayComponent={({date, state}) => {
              let jadwalIndex = jadwal.findIndex((j) => j.tanggal === date?.dateString)
              return (
                <TouchableOpacity onPress={() => chooseJadwal(date?.dateString)} className='aspect-square justify-center items-center flex rounded-full p-2 relative' style={{backgroundColor: jadwalIndex >= 0 ? jadwal[jadwalIndex].background : 'white', }}>
                  <Text className='' style={{color: jadwalIndex >= 0 && jadwal[jadwalIndex].color != null ? jadwal[jadwalIndex].color : 'black'}}>{date?.day}</Text>
                  {jadwalIndex >= 0 && jadwal[jadwalIndex].absensi === true && (
                    <View className='flex flex-row gap-1 absolute -right-1 -bottom-1' >
                      {getIconAbsensi(jadwal[jadwalIndex].absensi_masuk?.status_kehadiran)}
                      {getIconAbsensi(jadwal[jadwalIndex].absensi_pulang?.status_kehadiran)}
                    </View>
                  )}
                </TouchableOpacity>
              )
            }}
          />
        </View>

        {onload === true && (
          <ActivityIndicator size="large" style={{marginTop: 20}} />
        )}

        {selectedJadwal != null && (
        <View className='p-2 bg-white mt-5 rounded-lg mb-20'>
          {/* jadwal */}
          <View className='rounded p-3' style={{backgroundColor: colorJadwal}}>
            <View className='flex items-center flex-row gap-3'>
                <FontAwesome5 name="calendar-day" size={18} color={isColorDark(colorJadwal) ? 'white' : '#1f2937'} />
                <Text className='font-semibold text-sm' style={{fontFamily: 'Poppins-Regular', color: isColorDark(colorJadwal) ? 'white' : '#1f2937'}}>{formatTanggal(selectedJadwal.tanggal)}</Text>
            </View>
            <View className='flex items-center flex-row gap-3 mt-2'>
                <Entypo name="location" size={18} color={isColorDark(colorJadwal) ? 'white' : '#1f2937'} />
                <Text className='text-sm' style={{fontFamily: 'Poppins-Regular', color:isColorDark(colorJadwal) ? 'white' : '#1f2937'}}>{selectedJadwal.kantor} | {selectedJadwal.shift}</Text>
            </View>
          </View>
          <View className='h-0.5 bg-gray-200 my-4'></View>
          {/* absensi masuk */}
          <View className='bg-amber-50 p-1.5'>
            <View className='flex justify-between flex-row'>
              <View>
                <Text className='text-amber-600 font-semibold text-lg'>Absensi Masuk</Text>
                <Text className=' mt-1 text-gray-600'>08:00 - 10:00</Text>
              </View>
              <MaterialCommunityIcons name="location-enter" size={30} color="#d97706" />
            </View>
            {selectedJadwal.absensi === true && (
              getStatusAbsensi(selectedJadwal.absensi_masuk?.status_kehadiran, selectedJadwal.absensi_masuk?.waktu_absensi)
            )}
          </View>
          {/* absensi pulang */}
          <View className='bg-red-50 p-1.5 mt-3'>
            <View className='flex justify-between flex-row'>
              <View>
                <Text className='text-red-600 font-semibold text-lg'>Absensi Pulang</Text>
                <Text className=' mt-1 text-gray-600'>08:00 - 10:00</Text>
              </View>
              <MaterialCommunityIcons name="location-exit" size={30} color="#ef4444" />
            </View>
            {selectedJadwal.absensi === true && (
              getStatusAbsensi(selectedJadwal.absensi_pulang?.status_kehadiran, selectedJadwal.absensi_pulang?.waktu_absensi)
            )}
          </View>
        </View>
        )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

