import React from 'react';
import { Card, Tag } from 'antd';

function Harga() {
    return (
        <Card
            bordered={true}
            style={{ width: 300, textAlign: 'center', margin: '20px auto', border: "1px solid" }}
        >
            <div style={{ borderBottom: '1px solid black' , marginBottom : "10px" , fontWeight :"bold"}}>Informasi Harga Bensin</div>
            <b style={{}}>Pendapatan Harga Per 1L</b>
            <br />
            <Tag color="green" style={{ fontSize: '18px' }}>Rp 1,250</Tag>
        </Card>
    );
}

export default Harga;
