import React, { useLayoutEffect, useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import { SafeAreaView, View, StyleSheet, ScrollView } from 'react-native'
import { Avatar } from 'react-native-elements'
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons'
import CustomListItem from '../components/CustomListItem'
import { auth, db } from '../firebase'

const HomeScreen = ({ navigation }) => {
    const [chats, setChats] = useState([])

    const signOut = () => {
        auth.signOut().then(() => {
            navigation.replace('Login')
        })
    }

    useEffect(() => {
        const unsubscribe = db.collection('chats').onSnapshot(snapshot => {
            const chats = snapshot.docs.map((doc) => {
                const id = doc.id
                const chatName = doc.data().chatName
                return {id, chatName}
            })
 
            setChats(chats)
        })

        return unsubscribe
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Signal",
            headerStyle: { backgroundColor: "#fff" },
            headerTitleStyle: { color: "#000" },
            headerTintColor: "#fff",
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={signOut} >
                        <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }}/>
                    </TouchableOpacity> 
                </View>
            ),
            headerRight: () => (
                <View style={{
                    flexDirection: 'row',
                    justifyContent:"space-between",
                    width: 80,
                    marginRight: 20,
                }}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <AntDesign name='camerao' size={24} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('AddChat')}
                        activeOpacity={0.5}>
                        <SimpleLineIcons name='pencil' size={24} color="#000" />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation])

    const enterChat = (id, chatName) => {
        navigation.navigate("Chat", { id, chatName })
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                { chats.map(chat => (
                    <CustomListItem 
                        key={chat.id} 
                        id={chat.id} 
                        chatName={chat.chatName}
                        enterChat={enterChat}
                    />
                )) }
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        height: '100%',
    }
})
