import React, { useLayoutEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    SafeAreaView, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView, 
    TextInput, 
    TouchableWithoutFeedback, 
    Keyboard } from 'react-native'
import { Avatar } from 'react-native-elements'
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons'
import { auth, db } from '../firebase'
import firebase from 'firebase'

const ChatScreen = ({ navigation, route}) => {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chat',
            headerBackTitleVisible: false,
            headerTitleAlign: "left",
            headerTitle: () => (
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Avatar 
                        rounded 
                        source={{
                            uri: 
                                messages[0]?.data.photoURL || 
                                "https://us.123rf.com/450wm/tverdohlib/tverdohlib1711/tverdohlib171100211/88907855-barbeiro-moda-e-beleza-sentimento-e-emo%C3%A7%C3%B5es-cara-ou-homem-barbudo-no-fundo-cinza-segurar-a-m%C3%A3o-na-cabe%C3%A7a-h.jpg?ver=6",
                        }}
                    />
                    <Text style={{ color: "#fff", marginLeft: 10, fontWeight: '700' }}>
                        {route.params.chatName}
                    </Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={navigation.goBack}
                >
                    <AntDesign name="arrowleft" size={24} color="#fff" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: 75,
                        marginRight: 20,
                    }}
                >
                    <TouchableOpacity>
                        <FontAwesome name="video-camera" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="call" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation, messages])

    const sendMessage = () => {
        Keyboard.dismiss()
        db.collection('chats')
          .doc(route.params.id)
          .collection('messages')
          .add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL,
          })

        setInput('')
    }

    useLayoutEffect(() => {
        const unsubscribe = db.collection('chats')
            .doc(route.params.id)
            .collection('messages')
            .orderBy('timestamp')
            .onSnapshot(snapshot => setMessages(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            ))
        
        return unsubscribe
    }, [route])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                        <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
                            {messages.map(({id, data}) => (
                                data.email === auth.currentUser.email ? (
                                    <View key={id} style={styles.receiver}>
                                        <Avatar
                                            rounded
                                            position="absolute"
                                            bottom={-15}
                                            right={-5} 
                                            size={30}
                                            //*** Web ****************
                                            containerStyle={{
                                                position: "absolute",
                                                bottom: -15,
                                                right: -5,
                                            }}
                                            //************************ 
                                            source={{
                                                uri: data.photoURL,
                                            }}
                                        />
                                        <Text style={styles.receiverText}>
                                            {data.message}
                                        </Text>
                                    </View>
                                ) : (
                                    <View key={id} style={styles.sender}>
                                        <Avatar 
                                            rounded
                                            position="absolute"
                                            bottom={-15}
                                            right={-5} 
                                            size={30}
                                            //*** Web ****************
                                            containerStyle={{
                                                position: "absolute",
                                                bottom: -15,
                                                right: -5,
                                            }}
                                            //************************ 
                                            source={{
                                                uri: data.photoURL,
                                            }}
                                        />
                                        <Text style={styles.senderText}>{data.message}</Text>
                                        <Text style={styles.senderName}>{data.displayName}</Text>
                                    </View>
                                )
                            ))}
                        </ScrollView>
                        <View style={styles.footer}>
                            <TextInput 
                                placeholder="Signal message"
                                style={styles.textInput} 
                                value={input}
                                onChangeText={text => setInput(text)}
                                onSubmitEditing={sendMessage}
                            />
                            <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                                <Ionicons name="send" size={24} color="#2B68E6" />
                            </TouchableOpacity>
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    receiver: {
        padding: 15,
        backgroundColor: "#ECECEC",
        alignSelf: "flex-end",
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative',
    },
    sender: {
        padding: 15,
        backgroundColor: "#2B68E6",
        alignSelf: "flex-start",
        borderRadius: 20,
        margin: 15,
        maxWidth: '80%',
        position: 'relative',
    },
    senderText: {
        color: "#fff",
        fontWeight: '500',
        marginLeft: 10,
        marginBottom: 15,
    },
    receiverText: {
        color: "#000",
        fontWeight: '500',
        marginLeft: 10,
    },
    senderName: {
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: "#fff",
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 15,
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        backgroundColor: "#ECECEC",
        padding: 10,
        color: "grey",
        borderRadius: 30,
    }
})
