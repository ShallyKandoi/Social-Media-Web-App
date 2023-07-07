import React, { useEffect, useRef, useState } from 'react'
import {getUser} from '../../api/UserRequest';
import {getMessages, addMessage} from '../../api/MessageRequest';
import './ChatBox.css'
import InputEmoji from 'react-input-emoji'
import {format} from 'timeago.js'

const ChatBox = ({chat,currentUserId,setSendMessage,receiveMessage}) => {
    const [userData, setUserData] = useState(null); 
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const scroll = useRef(); // to scroll to the bottom of the chat

    // receiving the message from socket server
    useEffect(() => {
        if(receiveMessage && receiveMessage.chatId === chat._id){
            // console.log("Data received in child ChatBox: ", receiveMessage);
            setMessages([...messages, receiveMessage]);
        }
    }, [receiveMessage]);

    // fetching the user data of the other user for header
    useEffect(() => {
        const userId = chat?.members?.find((id) => id !== currentUserId);
        const getUserData = async () => {
            try {
                const {data} = await getUser(userId);
                setUserData(data);
                // console.log(data);
            }
            catch (error) {
                console.log(error);
            }
        }
        if(chat) getUserData();
    }, [chat, currentUserId]);

    // fetching the messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const {data} = await getMessages(chat?._id);
                console.log(data);
                setMessages(data);
            } catch (error) {
                console.log(error);
            }
        }
        if(chat) fetchMessages();
    }, [chat]);

    const handleChange = (newMessage) => {
        setNewMessage(newMessage);
    }

    const handleSend = async (e) => {
        e.preventDefault();
        const message = {
            senderId: currentUserId,
            message: newMessage,
            chatId: chat._id
        }

        // sending the message to the database
        try{
            const {data} = await addMessage(message);
            setMessages([...messages, data]);
            setNewMessage('');
        } catch (error) {
            console.log(error);
        }

        // sending the message to the socket
        const receiverId = chat.members.find((id) => id !== currentUserId);
        setSendMessage({...message, receiverId});
    }

    // scrolling to the bottom of the chat
    useEffect(() => {
        scroll.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);

  return (
    <>
        <div className='ChatBox'>
            {chat? (
                <>
                    <div className="chatHeader">
                        <div className="follower">
                            <div>
                                <img src={userData?.profilePicture? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePictur : process.env.REACT_APP_PUBLIC_FOLDER + 'defaultProfile.png'} alt="" className='userImg' style={{width: '60px', height:'60px'}}/>
                                <div className="userName" style={{fontSize: '1.1rem', fontWeight: 'bold'}}>
                                    <span>{userData?.firstname} {userData?.lastname}</span>
                                </div>
                            </div>
                        </div>
                        <hr style={{width: '85%', border: '0.1px solid #ececec'}}/>
                    </div>

                    {/* chats */}
                    <div className="chatBody">
                        {messages.map((message) => (
                            <>
                                <div ref={scroll} className={message.senderId === currentUserId? 'msg own' : 'msg'}>
                                    <span>{message.message}</span>
                                    <span>{format(message.createdAt)}</span>
                                </div>
                            </>
                        ))}
                    </div>
                    <div className="send">
                        <div>+</div>
                        <InputEmoji value={newMessage} onChange={handleChange}/>
                        <div className="s-button button" onClick={handleSend}>Send</div>
                    </div>
                </>
            ) : (
                <span className='noConvo'>Open a conversation to start a chat...</span>
            )}
            
        </div>
    </>
  )
}

export default ChatBox
