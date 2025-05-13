import { View, Text,TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, router } from "expo-router";
import { useEffect, useState } from "react";
import { Color } from "@/constants/Color";
import { Image } from "react-native";


export default function Login(){
    const navigation = useNavigation();
    const [username,setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    useEffect(()=>{
        navigation.setOptions({ headerShown: false });

    }, [])

    const login = async () =>{
        setError("")
        if(username == "" || password == ""){
            setError("Username dan password belum diisi")
            return
        }
        const formData = new FormData()
        formData.append("username", username)
        formData.append("password", password)

        try {
            const req = await fetch('http://localhost:8080/api/login',{
                method:'POST',
                body:formData,
            })
            const res = await req.json()
            if(res.status == 400){
                setError("Username atau password belum benar")
                setPassword("")
                return
            }
            router.navigate('/')
        } catch (error) {
           setError("Username atau password belum benar")
        }
    }

    return (
        <View style={{flex:1, backgroundColor:Color.blue, padding:35, justifyContent:'center', position:'relative'}}>
            <View style={{position:'absolute', top:10, marginRight:'auto', marginLeft:'auto', flexDirection:'row', alignItems:'center'}}>
                <View style={{padding:2.5, backgroundColor:'white', borderRadius:5}}>
                 <Image
                    style={{height: 25, width: 80, backgroundColor:'white',objectFit:'contain'}}
                    source={require('@/assets/images/logodisdik.png')}
                    />
                </View>
                <View style={{marginLeft:8}}>
                    <Text style={{fontFamily:'Poppins-Regular', color:'white', opacity:0.7, fontSize:11}}>Aplikasi Absensi Petugas</Text>
                    <Text style={{fontFamily:'Poppins-Regular', color:'white', fontSize:11}}>Dinas Pendidikan Kota Banjarbaru</Text>
                </View>
            </View>
            <View style={{padding:20, backgroundColor:'white',borderRadius:10, gap:15}}>
                {error != "" && (
                <View style={{backgroundColor:'#fee2e2', padding:5,borderRadius:5}}>
                    <Text style={{color:'#b91c1c', fontSize:12, textAlign:'center'}}>Username dan password belum diisi</Text>
                </View>
                )}
                <Text style={{textAlign:'center', fontFamily:'Poppins-Regular', fontWeight:'bold', fontSize:25, color: Color.blue}}>Login</Text>
                <TextInput 
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder="Masukkan Username"
                />
                <TextInput 
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="Masukkan Password"
                secureTextEntry={true}
                />
                <TouchableOpacity onPress={login} style={{backgroundColor:'#10b981',opacity: 1,  marginLeft: 'auto', marginRight:'auto', padding: 10, paddingLeft:30, paddingRight:30, borderRadius: 20}}>
                    <Text style={{fontFamily:'Poppins-Regular', color:'white', fontWeight:'bold', textAlign:'center'}}>&#128640; Masuk</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      color:'#374151',
      backgroundColor:'white',
      borderRadius:10,
      borderColor:'#374151',
      fontSize:12
    },
  });