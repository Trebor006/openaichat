import React, {useEffect, useState} from 'react';
import './css/chat.css';
import axios from 'axios';

interface Message {
    id: number;
    content: string;
    isResponse: boolean;
}

const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newRequest, setNewRequest] = useState(false);
    const [newMessage, setNewMessage] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(event.target.value);
    };

    const handleSend = () => {
        if (newMessage.trim() === '') return;

        const newId = messages.length === 0 ? 0 : messages[messages.length - 1].id + 1;
        const newMessages = [...messages, {id: newId, content: newMessage, isResponse: false}];

        setMessages(newMessages);
        setNewRequest(true);
    };

    const callEndpoint = async (messageToRequest: string) => {

        const request = {
            message: messageToRequest,
        };

        try {
            const response = await axios.post('http://localhost:3002/chats/', request);
            const responseString = response.data;
            const result = responseString.toString();
            console.log(result);
            return result;
        } catch (error) {
            console.error(error);
        }
    }

    const updateMessages = async () => {
        const requestValue = newMessage;
        setNewMessage('');

        const result = await callEndpoint(requestValue);

        const newId = messages.length === 0 ? 1 : messages[messages.length - 1].id + 1;
        const newMessages = [...messages, {id: newId, content: result, isResponse: true}];

        setMessages(newMessages);
        setNewRequest(false);
    }
    useEffect(() => {
        if (newRequest) {
            updateMessages();
        }

    }, [newRequest]);

    return (
        <div className="chat">
            <div className="chat-header">
                <h1>ChatGPTcito</h1>
            </div>
            <div className="chat-body">
                {messages.map(message => (
                    <div key={message.id} className="chat-message">
                        <p className={`chat-message-content ${message.isResponse ? 'chat-message-content-response' : ''}`}>
                            {message.content}
                        </p>
                    </div>
                ))}
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    placeholder="Escribe aquí tu mensaje"
                    value={newMessage}
                    onChange={handleInputChange}
                    className="chat-input"
                />
                <button onClick={handleSend} className="chat-send-button">
                    Enviar
                </button>
            </div>
        </div>
    );
};

export default Chat;
