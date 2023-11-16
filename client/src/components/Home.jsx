import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Home = ({ socket }) => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const navigate = useNavigate();

    const joinRoom = (e) => {
        e.preventDefault();
        if(name !== '' && room !== '') {
            let hours = new Date(Date.now()).getHours();
            let minutes = new Date(Date.now()).getMinutes();
  
            hours = hours > 12 ? hours - 12 : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;

            const messageData = {
                room: room, 
                name: name, 
                status: 'has connected',
                time: hours + ":" + minutes,
            }
            socket.emit('join_room', messageData);
            navigate('/chat', { state: { room, name } });
        }
    }

    const joinAIRoom = (e) => {
        e.preventDefault();

        let hours = new Date(Date.now()).getHours();
        let minutes = new Date(Date.now()).getMinutes();

        hours = hours > 12 ? hours - 12 : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        const messageData = {
            room: 1001, 
            name: "You", 
            status: 'has connected',
            time: hours + ":" + minutes,
        }
        socket.emit('join_room', messageData);
        navigate('/ai-chat')
    };

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'>
        <div>
            <div className='rounded-md bg-purple-600 text-white p-5 flex-col items-center justify-center'> 
                <p className='text-center text-4xl font-bold'>Live Chat</p>
                <button 
                    onClick={joinAIRoom}
                    className='text-center justify-center text-sm pl-14 pt-3'
                > Chat with AI? 
                </button>
            </div>
            <form 
                className='flex flex-col bg-white p-8 rounded-lg shadow-lg'
                onSubmit={joinRoom}>
                <input 
                    type="text"
                    value={name}
                    placeholder="Name..."
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    required
                    className='border border-gray-300 p-2 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600'
                />
                <input 
                    type='text'
                    value={room}
                    placeholder="Room Number..."
                    onChange={(e) => {
                        setRoom(e.target.value);
                    }}
                    required
                    className='border border-gray-300 p-2 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600'
                />
                <button type='submit' 
                    className='bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 transition duration-300 ease-in-out'> 
                    Enter Room
                </button>
            </form>
        </div>
    </div>
  )
}
