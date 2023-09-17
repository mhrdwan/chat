import React, { useState } from 'react';
import { Input, Button, Col, Row } from 'antd';
import './style.css';

function HalamanChat() {
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    // Logic untuk mengirim pesan
    console.log('Mengirim pesan:', message);
    setMessage(''); // Kosongkan input setelah mengirim
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {/* Tampilan chat akan berada di sini */}
      </div>
      <Row gutter={8} className="chat-input">
        <Col span={18}>
          <Input 
            placeholder="Ketik pesan..." 
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
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
