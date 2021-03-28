import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native'
import { Button, Input, Image } from 'react-native-elements'
import { auth } from '../firebase';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const unSubscribe = auth.onAuthStateChanged(authUser => {
            if(authUser) {
                navigation.replace("Home")
            }
        })

        return unSubscribe
    }, [])

    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password)
            .catch(error => alert(error))
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
            <StatusBar style="light" />
            <Image  source={{
                        uri: "https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png"
                     }}
                     style={{ width: 200, height: 200 }}
            />
            <View style={styles.inputContainer}>
                <Input 
                    placeholder="Email" 
                    autofocus 
                    type="email" 
                    value={email} 
                    onChangeText={text => setEmail(text)} 
                />
                <Input 
                    placeholder="Password" 
                    secureTextEntry 
                    type="password" 
                    value={password} 
                    onChangeText={text => setPassword(text)} 
                    onSubmitEditing={signIn}
                />
            </View>
            <Button containerStyle={styles.button} onPress={signIn} title="Login" />
            <Button containerStyle={styles.button} onPress={() => navigation.navigate('Register')} title="Register" type="outline" />
            <View style={{ height: 30 }} />
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: "#fff",
    },
    inputContainer: {
        width: 300,
    },
    button: {
        width: 200,
        marginTop: 10,
    },
})