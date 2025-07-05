import api from '@/api';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function JadwalScreen() {

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

  
  const [jadwal, setJadwal] = useState([])
  const [calendarMarked, setCalendarMarked] = useState({})
  const [selected, setSelected] = useState('');


  useEffect(() => {
    api.get('/jadwal').then((res) => {
      setJadwal(res.data.data)
      setCalendarMarked(convertToMarkedDates(res.data.data))
    })
  }, []);

  const convertToMarkedDates = (data : any) => {
    const result: { [key: string]: any } = {};

    data.forEach((item: { tanggal: string; background: any | null; color: any | null}) => {
      result[item.tanggal] = {
        customStyles: {
          container: {
            backgroundColor: item.background != null ? item.background : '',
          },
          text: {
            color: item.color != null ? item.color : 'black',
          }
        }
      };
    });

    return result;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{padding:15}}>
        <ScrollView>
        <View className='bg-white w-full rounded-lg p-2 overflow-hidden'>
          <Calendar
            monthFormat='MMMM yyyy'
            onDayPress={day => {  
              setSelected(day.dateString);
            }}
            markingType='custom'
            markedDates={{
              ...calendarMarked,
              [selected]: {selected: true, disableTouchEvent: true, customStyles: {container:{backgroundColor: '#ef4444'}}}
            }}
          />
        </View>
        <View className='mt-3 p-2'>
          {/* <Text className='text-gray-600'>Jadwal Berikutnya</Text> */}
          <View className='bg-white rounded-lg p-3 mt-3 border border-gray-200'>
              <View className='bg-emerald-500 p-2 rounded'>
                <Text className='text-center font-semibold text-white p-2'>Rabu, 12 Juni 2025</Text>
                <Text className='text-center text-emerald-200'>Dinas Pendidikan | MALAM</Text>
              </View>
              <View className='h-0.5 bg-gray-100 my-2'></View>
              <View className='flex flex-row  justify-around'>
                <View className='flex flex-col  items-center p-3 w-1/2 bg-amber-100/80'>
                  <Text className='text-sm text-amber-600'>Absensi Masuk</Text>
                  <Text className='text-white font-semibold my-2 bg-green-500 p-1 rounded'>HADIR</Text>
                  <Text className='text-gray-500 text-xs'>2025-12-01 12:12:12</Text>
                  {/* <Text className='text-gray-800'>08:00 - 12:00</Text> */}
                </View>
                <View className='flex flex-col items-center p-3 w-1/2 bg-red-100/80 '>
                  <Text className='text-sm text-red-400'>Absensi Pulang</Text>
                  <Text className='text-white bg-sky-500 font-semibold my-2 p-1 rounded'>IZIN</Text>
                  <Text className='text-gray-500 text-xs'>2025-12-01 12:12:12</Text>
                  {/* <Text className='text-gray-800'>08:00 - 12:00</Text> */}
                </View>
              </View>
              <View className='h-0.5 bg-gray-100 my-2'></View>
              <Text className='mt-2 text-center text-sm text-gray-500'>Jumlah Foto Kegiatan : 3</Text>
          </View>
        </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

