import React, { useEffect, useRef, useState } from 'react'
import './Chat.css'
import LogoSearch from '../../components/LogoSearch/LogoSearch'
import {useSelector} from 'react-redux'
import { userChats } from '../../api/ChatRequest'
import Conversation from '../../components/Conversation/Conversation'
import { Link } from 'react-router-dom'
import Home from '../../img/home.png'
import Noti from '../../img/noti.png'
import Comment from '../../img/comment.png'
import {UilSetting} from '@iconscout/react-unicons'
import ChatBox from '../../components/ChatBox/ChatBox'
import { io } from 'socket.io-client'

const Chat = () => {
    const {user} = useSelector((state) => state.authReducer.authData);
    // console.log(user);

    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [sendMessage, setSendMessage] = useState(null);
    const [receiveMessage, setReceiveMessage] = useState(null);

    const socket = useRef(); //to use socket all around our chat application

    // sending the message to socket server
    useEffect(() => {
        if(sendMessage){
            socket.current.emit("send-message", sendMessage);
            setSendMessage(null);
        }
    }, [sendMessage]);

    // initializing the socket
    useEffect(() => {
        socket.current = io("http://localhost:8800");
        socket.current.emit("add-user", user._id);
        socket.current.on("get-users", (users) => {
            setOnlineUsers(users);
            // console.log(onlineUsers);
        });
    }, [user]);

    // receiving the message from socket server
    useEffect(() => {
        socket.current.on("receive-message", (data) => {
            setReceiveMessage(data);
        });
    }, []);

    useEffect(() => {
        const getChats = async () => {
            try {
                const {data} = await userChats(user._id);
                setChats(data);
                // console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
        getChats(); // calling this function everytime the user changes
    }, [user]);

    const checkOnlineStatus = (chat) => {
        const chatMember = chat.members.find((member) => member !== user._id);
        const isOnline = onlineUsers.find((user) => user.userId === chatMember);
        return isOnline? true : false;
    }

  return (
    <div className="Chat">
        <div className="leftSide">
            {/* <div className="searchBar"> */}
                <LogoSearch />
            {/* </div> */}
            <div className="Chats">
                <h2>Chats</h2>
                <div className="ChatList">
                    {chats.map((chat) => (
                        <div onClick={()=>setCurrentChat(chat)}>
                            <Conversation data={chat} currentUserId={user._id} online={checkOnlineStatus(chat)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="rightSide">
            <div style={{width: '20rem', alignSelf: 'flex-end'}}>
                <div className='navIcons'>
                    <Link to = '../home'><img src={Home} alt="" /></Link>
                    <UilSetting width='1.7rem' height='1.6rem' cursor='pointer'/>
                    <img src={Noti} alt="" />
                    <Link to = '../chat'><img src={Comment} alt="" /></Link>    
                </div>
            </div>
            {/* chat body */}
            <ChatBox chat ={currentChat} currentUserId={user._id} setSendMessage={setSendMessage} receiveMessage={receiveMessage}/>
        </div>
    </div>
  )
}

export default Chat
