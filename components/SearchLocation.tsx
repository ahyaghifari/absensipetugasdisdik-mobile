import { Image } from 'expo-image'
import { Text, View } from 'react-native'
import '../assets/global.css'
export default function SearchLocation(){
    return(
        <View style={{justifyContent:'center', flex:1, alignItems:'center'}}>
            <View className='bg-white rounded-lg p-4 rounded shadow-sm'>
            <Image
                style={{height: 150, width: 150, marginRight:'auto', marginLeft:'auto'}}
                source={require('@/assets/images/travel.gif')}
                contentFit="cover"
                />
            <Text style={{fontFamily:'Poppins-Regular'}} className='mt-5 text-gray-500'>Menemukan lokasi anda...</Text>
            </View>
        </View>
    )
}