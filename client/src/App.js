import './styles/tailwind.css'
import { Home } from './components/Home.jsx'
import { Chatroom } from './components/Chatroom.jsx'
import { AIChat } from './components/AIChat.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import io from 'socket.io-client'

const App = () => {

  const socket = io.connect('http://localhost:3001')

  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home socket={socket}/>} />
          <Route path='/chat' element={<Chatroom socket={socket}/>} />
          <Route path='/ai-chat' element={<AIChat socket={socket} room={1001} />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
