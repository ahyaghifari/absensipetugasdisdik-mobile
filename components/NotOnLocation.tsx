import { Image } from 'expo-image'
import { Text, View } from 'react-native'
import '../assets/global.css'
export default function NotOnLocation(){
    return (
        <View style={{justifyContent:'center', flex:1, alignItems:'center', backgroundColor:'white'}}>
            <Image
                style={{width:150, height:150}}
                source={require('@/assets/images/outlocation.gif')}
                contentFit="cover"
                />
            <Text style={{fontFamily:'Poppins-Bold'}} className='text-4xl text-gray-600'>Ups...</Text>
            <Text style={{fontFamily:'Poppins-Regular'}} className='mt-3 text-sm text-gray-500'>Anda berada diluar lingkungan kantor</Text>
        </View>
    )
}