import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import { db } from '../firebase'

const CustomListItem = ({ id, chatName, enterChat }) => {
    const [chatMessages, setChatMessages] = useState([])

    useEffect(() => {
        const unsubscribe = db.collection('chats')
            .doc(id)
            .collection('messages')
            //.orderBy('timestamp', 'desc')
            .orderBy('timestamp')
            .onSnapshot(snapshot => (
                setChatMessages(snapshot.docs.map(doc => doc.data()))
            ))

        return unsubscribe
    }, [])

    return (
        <ListItem onPress={() => enterChat(id, chatName)} key={id} bottomDivider>
            <Avatar 
                rounded
                source={{
                    uri: 
                        chatMessages?.[chatMessages.length-1]?.photoURL ||
                        "https://us.123rf.com/450wm/tverdohlib/tverdohlib1711/tverdohlib171100211/88907855-barbeiro-moda-e-beleza-sentimento-e-emo%C3%A7%C3%B5es-cara-ou-homem-barbudo-no-fundo-cinza-segurar-a-m%C3%A3o-na-cabe%C3%A7a-h.jpg?ver=6"
                }}
            />
            <ListItem.Content>
                <ListItem.Title style={{ fontWeight: '800'}}>
                    {chatName}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    {chatMessages?.[chatMessages.length-1]?.displayName} : {chatMessages?.[chatMessages.length-1]?.message}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

export default CustomListItem

const styles = StyleSheet.create({})
