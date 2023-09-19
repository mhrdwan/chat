import './App.css';
import HalamanChat from './Chat/HalamanChat';
import Login from './Login';
import { BrowserRouter as Router , Routes ,Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import DNDtest from './Dashboard/TestDND';
function App() {
 
  return (
    <>
    <Router>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/chat' element={<HalamanChat/>} />
        <Route path='/dnd' element={<DNDtest/>} />
        <Route path='*' element={<Login/>}/>
      </Routes>
    </Router>
    </>
    
  );
}


export default App;
