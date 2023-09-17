import { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, addDoc, onSnapshot, orderBy } from "firebase/firestore";
import "./style.css"
import { Button, Col, Input, Row } from 'antd';
import useUserStore from '../zustand/UserStore';
import { useNavigate } from 'react-router-dom';
function HalamanChat({ }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const username = useUserStore((state) => state.username);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    const q = query
      (collection(db, "messages"),
        orderBy(`createdAt`),
      );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id })
        setMessages(messages);
        console.log(messages);
      });
      if (username === null) {
        return navigate('/login');
      }
    });
  }, [])

  const navigate = useNavigate()

  const handleSend = async () => {
    try {
      if (!message) {
        alert("Pesan Tidak Boleh Kosong")
      } else {
        const docRef = await addDoc(collection(db, "messages"), {
          name: username,
          text: message,
          createdAt: new Date().toISOString()
        });


      }
    } catch (error) {

    }
    setMessage('');
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  return (
    <div className="chat-container">
      <div className="status-bar" style={{ backgroundColor: '#1DFBC6', color: 'white', height: 40, textAlign: 'center', lineHeight: '40px' }}>
        Test Live Chat
      </div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.name === username ? 'own-message' : ''}`}>
            <div className="chat-content" style={{ backgroundColor: msg.name === username ? '#D1F5D3' : '#F1F1F1' }}>
              <span className="chat-sender" style={{ color: msg.name === username ? 'green' : 'blue' }}>{msg.name.toLowerCase()}</span>
              <span className="chat-text" key={msg.id}>{msg.text}</span>
              <span className="time-stamp" style={{ fontSize: 'small', color: 'rgba(0, 0, 0, 0.5)' }} key={msg.id}>
                {formatTime(msg.createdAt)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <Row gutter={8} className="chat-input">
        <Col span={18}>
          <Input
            placeholder="Ketik pesan..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Col>
        <Col span={6}>
          <Button type="primary" onClick={handleSend}>
            Kirim
          </Button>
        </Col>
      </Row>
    </div>
  );


}

export default HalamanChat;
