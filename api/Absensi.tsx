export type Absensi = {
    id: string,
    waktu_absensi: string,
    absensi_masuk: {
        waktu_awal: string,
        waktu_akhir: string,
        bisa_absen: boolean,
        sudah_absen: boolean,
        status_kehadiran: string,
        waktu_absen: string,
        keterangan: string | null
    },
    absensi_pulang: {
        waktu_awal: string,
        waktu_akhir: string,
        bisa_absen: boolean,
        sudah_absen: boolean,
        status_kehadiran: string,
        waktu_absen: string
        keterangan: string | null
    },
    jumlah_foto_kegiatan:number
}