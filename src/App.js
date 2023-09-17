import { useEffect } from 'react';
import './App.css';
import HalamanChat from './HalamanChat';
import Login from './Login';
import { BrowserRouter as Router , Routes ,Route } from 'react-router-dom';
import { requestMessagingPermission } from './firebase';
function App() {
  useEffect(()=>{
    requestMessagingPermission()
  },[])
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/chat' element={<HalamanChat/>} />
        <Route path='/chats' element={<HalamanChat/>} />
        <Route path='*' element={<Login/>}/>
      </Routes>
    </Router>
    </>
    
  );
}


export default App;
