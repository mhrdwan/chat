import React, { useEffect, useState } from 'react';
import { ref, set, getDatabase, push } from 'firebase/database';
import NavbarComponent from '../Component/Navbar';
import { Alert, Button, DatePicker, Input, TimePicker, notification } from 'antd';
import { Col, Container, Row } from 'react-bootstrap';
import { database } from "../firebase";
import moment from 'moment';
import useUserStore from '../zustand/UserStore';
import { Navigate, useNavigate } from 'react-router-dom';
import Tables from './Table';
import Informasi from '../Component/Informasi';

function Dashboard() {
  const navigate = useNavigate()

  const setidUser = useUserStore((state) => state.idUser);
  const username = useUserStore((state) => state.username);
  const [Inputan, setInputan] = useState({
    BerapaLiter: "",
    Jamberapa: "",
    TanggalBerapa: "",
  })

  const handlechange = (key, value) => {
    setInputan(set => ({
      ...set,
      [key]: value,
    }))
  }

  function writeUserData() {
    try {
      if (!Inputan.TanggalBerapa) {
        notification.error({
          message: "Tanggal Harus Diisi"
        })
      } else if (!Inputan.Jamberapa) {
        notification.error({
          message: "Jam Harus Diisi"
        })
      } else if (!Inputan.BerapaLiter) {
        notification.error({
          message: "Liter Harus Diisi"
        })
      } else {
        const userRef = ref(database, 'DropBensin/' + setidUser);
        const stock = ref(database, 'Stock/' + "semuastock");
        push(userRef, {
          username: username,
          BerapaLiter: Inputan.BerapaLiter + "L",
          Jamberapa: Inputan.Jamberapa,
          TanggalBerapa: Inputan.TanggalBerapa
        });
        push(stock, {
          username: username,
          BerapaLiter: Inputan.BerapaLiter + "L",
          Jamberapa: Inputan.Jamberapa,
          TanggalBerapa: Inputan.TanggalBerapa
        });
        notification.success({
          message: "Data Berhasil Di Simpan"
        })
        setInputan({
          BerapaLiter: "",
          Jamberapa: "",
          TanggalBerapa: ""
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!username) {
      <Alert message="Silahkan Login Kembali" type="error" showIcon />
      navigate('/login');
    }
  }, [])

console.log(username);
  return (
    <div>
      <NavbarComponent />

      <Container>
        <Alert message={`Selamat Datang ${username}`} type="info" />
        {(username === "ridwan" || username ===  "aris" || username ===  "dewi") && (
          <Row className='mt-3'>
            <h4>Inputan Stock</h4>
            <Col sm={4}>
              <DatePicker required format={"DD-MM-YYYY"} style={{ width: "100%" }} onChange={(date) => handlechange("TanggalBerapa", date && date.format('DD-MM-YYYY'))}></DatePicker>
            </Col>
            <Col className='mt-3' sm={4}>
              <TimePicker required style={{ width: "100%" }} onChange={(momentObj) => handlechange("Jamberapa", momentObj && momentObj.format('HH:mm:ss'))} placeholder='jam berapa' />
            </Col>
            <Col className='mt-3' sm={4}>
              <Input required width={"100%"} type='number' onChange={(e) => handlechange("BerapaLiter", e.target.value)} placeholder='Berapa Liter stock'></Input>
            </Col>
            <Col className='mt-3 ' sm={4}>
              <Button className='d-flex justify-content-center' style={{ color: "white", backgroundColor: "#4A7EEE" }} onClick={writeUserData}>OK</Button>
            </Col>
          </Row>
        )}
      </Container>

      <div className='mt-4'>
        <Informasi />
      </div>
      <div className='mt-4'>
        <Tables />
      </div>
    </div>

  )
}

export default Dashboard