import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export const AIChat = ({ socket, room }) => {

  const [currentMessage, setCurrentMessage] = useState('');
  const [gptResponse, setGptResponse] = useState('');
  const [messageList, setMessageList] = useState([]);

  const navigate = useNavigate();
  const humanName = "You";
  const AIName = "AI Assistant";

  const generateAIMessage = (currentMessage, callback) => {
    const options = {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       model: 'gpt-3.5-turbo',
       messages: [{role: 'assistant', content: currentMessage}],
       max_tokens: 35
     })
    }
 
    fetch('https://api.openai.com/v1/chat/completions', options)
    .then(response => response.json())
    .then(data => {
      console.log(data.choices[0].message.content);
      setGptResponse(data.choices[0].message.content);
      // Call the callback function with the chatbot message
      callback(data.choices[0].message.content);
    })
    .catch(error => {
      console.log(error)
    })
 }
 
 const sendMessage = () => {
     if (currentMessage !== '') {
       let hours = new Date(Date.now()).getHours();
       let minutes = new Date(Date.now()).getMinutes();
 
       hours = hours > 12 ? hours - 12 : hours;
       minutes = minutes < 10 ? "0" + minutes : minutes;
 
       const messageData = {
         room: room, 
         name: humanName, 
         message: currentMessage,
         time: hours + ":" + minutes,
       }
       socket.emit('send_message', messageData);
       // Pass a callback function to generateAIMessage
       generateAIMessage(currentMessage, (gptResponse) => {
         // Emit the chatbot message to the socket
         const messageData = {
           room: room, 
           name: AIName, 
           message: gptResponse,
           time: hours + ":" + minutes,
         }
         socket.emit('send_message', messageData);
       });
       setCurrentMessage('');
     };
   }
 

  const leaveRoom = async () => {
    let hours = new Date(Date.now()).getHours();
    let minutes = new Date(Date.now()).getMinutes();

    hours = hours > 12 ? hours - 12 : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    const messageData = {
        room: 1, 
        name: "You", 
        status: 'has disconnected',
        time: hours + ":" + minutes,
      }
      await socket.emit('leave_room', messageData);
      navigate('/');
  }

  useMemo(() => {
    socket.on("receive_message", (data) => {
      console.log(data.message);
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className='flex flex-col h-screen'>
        <div className='bg-purple-600 text-white p-4 flex items-center justify-between'> 
          <p className='text-xl font-bold'>AI Chat</p>
          <p className='text-center pr-14'>Send a Message to Start Chatting!</p>
        </div>
        <div className='flex-1 overflow-y-auto bg-gray-100 p-4'> 
          {messageList.map((messageContent, i) => {
            return (  
              <div key={i} className={`flex flex-col mb-4 ${messageContent.name === humanName ? 'items-end' : 'items-start'}`}>
              <div className={`bg-white rounded-lg p-2 shadow-md ${messageContent.name === humanName ? 'text-right' : 'text-left'}`}>
                <p className='text-md text-gray-600'>{messageContent.time}</p>
                <p className='text-md font-bold'>{messageContent.name === humanName ? 'You' : messageContent.name}</p>
                <p className='text-md'>{messageContent.message}</p>
              </div>
            </div>
            )
          })}
        </div>
        <div className='bg-white p-4 flex items-center border-t border-gray-300'> 
          <input 
            type='text' 
            placeholder='Message...'
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            className='flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600'
          />
          <button onClick={sendMessage} className='bg-purple-600 text-white p-2 ml-4 rounded-md hover:bg-purple-700 transition duration-300 ease-in-out'>Send Message</button>
          <button onClick={leaveRoom} className='bg-purple-600 text-white p-2 ml-4 rounded-md hover:bg-purple-700 transition duration-300 ease-in-out'>Leave Chatroom</button>
        </div>
    </div>
  )
}
