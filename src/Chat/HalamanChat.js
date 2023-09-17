import { useEffect, useState } from 'react';
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
      // console.log("Current cities in CA: ", ci ties.join(", "));
    });
  }, [])

 const navigate = useNavigate()

  const handleSend = async () => {
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        name: username,
        text: message,
        createdAt: new Date().toISOString()
      });
    } catch (error) {

    }
    setMessage('');
  };
if (username === "") {
  return   navigate('/login');
}
  return (
    <div className="chat-container">
    <div className="chat-box">
      {messages.map((msg, index) => (
        <div key={index} className={`chat-message ${msg.name === username ? 'own-message' : ''}`}>
          <div className="chat-content">
            <span className="chat-sender">{msg.name}</span>
            <span className="chat-text" key={msg.id}>{msg.text}</span>
          </div>
        </div>
      ))}
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
