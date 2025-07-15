import api from "@/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import ToastManager, { Toast } from 'toastify-react-native';
import { formatTanggalIndonesia } from '../../functions/Time';
import { useSession } from "../ctx";

export default function UbahPassword() {
    const router = useRouter()
    const [keterangan, setKeterangan] = useState("")
    const [onKirim, setOnKirim] = useState(false)
    const [error, setError] = useState("")
    const {session} = useSession()
    const {absensi_id, tanggal, kantor, waktu_absensi, shift} = useLocalSearchParams<{absensi_id: string, tanggal: string, kantor: string, waktu_absensi: string, shift: string}>()
    

    const kirim = async () => {
        setError("")
        setOnKirim(true)
        api.post('/pembelaan', {
            absensi_id: absensi_id,
            waktu_absensi: waktu_absensi,
            keterangan: keterangan
        }).then((res) => {
            Toast.success(res.data.message)
            setTimeout(() => {
                router.replace('/')
            }, 2000);
        }).catch((err) => {
            setOnKirim(false)
            Toast.error('Keterangan gagal dikirim')
        })
    }


    return(
        <View className="flex-1">
            <ToastManager />
            <View className="flex-1 bg-gray-50 flex flex-col pt-10 items-center">
                <Text className="text-center text-gray-600">Isi Keterangan atau Pembelaan anda untuk ketidakhadiran absensi</Text>
                <View className="mt-5 bg-red-100 w-10/12 p-3 rounded-xl border border-dashed border-red-500">
                    <Text className="text-gray-700 text-sm text-center capitalize">Absensi {waktu_absensi}</Text>
                    <Text className="text-lg text-red-800 text-center mt-1 font-semibold">{formatTanggalIndonesia(tanggal)}</Text>
                    <Text className="text-red-800 text-center mt-1 bg-red-200 p-2 rounded-lg">{kantor}</Text>
                    <Text className="text-red-800 text-center mt-1">{shift}</Text>
                </View>
                 <TextInput
                    className="border-2 border-red-300 text-gray-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5 mt-5 w-10/12 align-text-top break-words text-wrap py-10"    
                    onChangeText={setKeterangan}
                    value={keterangan}
                    placeholder="Masukkan Keterangan / Pembelaan anda..."
                />
                <TouchableOpacity className="mt-5 bg-red-500 text-white px-3 py-4 rounded-full w-10/12" style={{opacity:(keterangan === '' || onKirim === true) ? 0.5 : 1 }} disabled={keterangan === '' || onKirim === true} onPress={kirim}>
                    <Text className="text-white text-center">Kirim Keterangan</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
