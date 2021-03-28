import React, { useState, useLayoutEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native'
import { Button, Input, Text } from 'react-native-elements'
import { auth } from '../firebase';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [imageUrl, setImageUrl] = useState('')

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Login",
        })
    }, [navigation])

    const register = () => {
        auth.createUserWithEmailAndPassword(email, password)
            .then(authUser => {
                authUser.user.updateProfile({
                    displayName: name,
                    photoURL: imageUrl || "https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-4.png"
                })
            }).catch(error => alert(error.message))
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
            <StatusBar style="light" />
            <Text h3 style={{ marginBottom: 50 }}>
                Create a Signal account
            </Text>
            
            <View style={styles.inputContainer}>
                <Input 
                    placeholder="Full Name" 
                    autofocus 
                    type="text" 
                    value={name} 
                    onChangeText={text => setName(text)} 
                />
                <Input 
                    placeholder="Email"  
                    type="text" 
                    value={email} 
                    onChangeText={text => setEmail(text)} 
                />
                <Input 
                    placeholder="Password" 
                    type="password"
                    secureTextEntry 
                    value={password} 
                    onChangeText={text => setPassword(text)} 
                />
                <Input 
                    placeholder="Profile Picture URL (optional)" 
                    type="text" 
                    value={imageUrl} 
                    onChangeText={text => setImageUrl(text)}
                    onSubmitEditing={register} 
                />  
            </View>
            
            <Button 
                containerStyle={styles.button} 
                onPress={register} 
                title="Register"
                raised 
            />

            <View style={{ height: 30 }} />
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

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