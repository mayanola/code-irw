import React, { useState } from 'react';
import './Chatbot.css'; // Create this CSS file for styling the chatbot

const Chatbot = ({ onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (input.trim() === "") return;

        // Add user message to chat
        const newMessages = [...messages, { sender: "user", text: input }];
        setMessages(newMessages);
        setInput("");

        try {
            // Replace this URL with your actual API endpoint
            // const response = await fetch("https://api.yourchatbot.com/chat", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify({ message: input })
            // });
            // const data = await response.json();

            // Add bot response to chat
            setMessages([...newMessages, { sender: "bot", text: "response here"}]);
            // response.data
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };


    const handleInputChange = (e) => setInput(e.target.value);
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h4>Chat with Us</h4>
                <button onClick={onClose}>X</button>
            </div>
            <div className="chatbot-body">
                {messages.map((message, index) => (
                    <div key={index} className={`chatbot-message ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
            </div>
            <div className="chatbot-footer">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chatbot;