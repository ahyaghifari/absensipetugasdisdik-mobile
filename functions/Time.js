const formatTanggalIndonesia = (tanggalString) => {
  const tanggal = new Date(tanggalString);
  return tanggal.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export { formatTanggalIndonesia };

