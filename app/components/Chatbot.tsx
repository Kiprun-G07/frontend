import { useState, useRef, useEffect } from "react";
import { apiFetch } from "~/lib/auth";

type Message = {
    sender: 'user' | 'bot';
    text: string;
};

export default function Chatbot() {

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    function handleSendMessage(event: React.KeyboardEvent) {
        if (event?.key === 'Enter') {
            const input = event.target as HTMLInputElement;
            const message = input.value.trim();
            if (message) {
                setMessages(prev => [...prev, { sender: 'user', text: message }]);
                input.value = '';

                apiFetch('/api/chatbot/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message })
                })
                .then(res => res.json())
                .then(data => {
                    setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
                });
            }
        }
    }

    if (!isOpen) {
    return (
        <div className="fixed bottom-4 right-4">
            <button className="bg-blue-600 text-white p-2 rounded-full" onClick={() => setIsOpen(!isOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </button>
        </div>
    );
    } else {
        return (
        <div className="fixed bottom-4 right-4 w-90 h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
            <div className="flex justify-between items-center p-2 bg-blue-600 text-white rounded-t-lg">
                <div>Chatbot</div>
                <button onClick={() => setIsOpen(!isOpen)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="flex-grow p-2 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`text-wrap mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block text-wrap px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                            {msg.text}
                        </div>
                    </div>
                    
                ))}
                <div ref={messagesEndRef}></div>
            </div>
            <div className="p-2 border-t">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full border border-gray-300 px-3 py-2 rounded"
                    onKeyDown={handleSendMessage}
                />
            </div>
        </div>
        );
    }   
}