import React, { useEffect, useState } from 'react';
import { ref, set, getDatabase, push, onValue, off, update, get } from 'firebase/database';
import NavbarComponent from '../Component/Navbar';
import { Alert, Button, DatePicker, Input, TimePicker, notification } from 'antd';
import { Col, Container, Row } from 'react-bootstrap';
import { database } from "../firebase";
import moment from 'moment';
import useUserStore from '../zustand/UserStore';
import { useNavigate } from 'react-router-dom';
import Tables from './Table';
import Informasi from '../Component/Informasi';
import Harga from './Harga';

function Dashboard() {
  const navigate = useNavigate()
  const [hide, sethide] = useState(false)
  const [hide1, sethide1] = useState(false)
  const setidUser = useUserStore((state) => state.idUser);
  const username = useUserStore((state) => state.username);
  const [Inputan, setInputan] = useState({
    BerapaLiter: "",
    Jamberapa: "",
    TanggalBerapa: "",
  })
  const [InputanAmbilBensin, setInputanAmbilBensin] = useState({
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
  const handlechangeAmbilBensin = (key, value) => {
    setInputanAmbilBensin(set => ({
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
        const stockharian = ref(database, 'StockharianAyah/' + "Stockharianayah");
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
        push(stockharian, {
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








  // Function untuk update jumlah liter
  function updateliterdanambil() {
    const db = getDatabase();
    const SemuaStock = ref(db, 'Stock');
    get(SemuaStock).then((snapshot) => {
      if (snapshot.exists()) {
        const allData = snapshot.val();
        for (const userIdx in allData) {
          if (allData[userIdx] !== null) {
            const keys = Object.keys(allData[userIdx]).sort();
            const lastKey = keys[keys.length - 1];
            const latest = allData[userIdx][lastKey];
            if (latest?.BerapaLiter && InputanAmbilBensin.BerapaLiter) {
              const updatedBerapaLiter = parseInt(latest.BerapaLiter, 10) - parseInt(InputanAmbilBensin.BerapaLiter, 10);
              const updatePath = `Stock/${userIdx}/${lastKey}`;
              update(ref(db, updatePath), {
                BerapaLiter: updatedBerapaLiter + 'L',
                Jamberapa: InputanAmbilBensin?.Jamberapa,
                TanggalBerapa: InputanAmbilBensin?.TanggalBerapa,
                username: username,
                Setor: ""
              })
              const stockharian = ref(database, 'untukdiambil/' + "diambilorang");
              push(stockharian, {
                BerapaLiter: updatedBerapaLiter + 'L',
                username: username,
                BerapaLiter: InputanAmbilBensin.BerapaLiter + "L",
                Jamberapa: InputanAmbilBensin.Jamberapa,
                TanggalBerapa: InputanAmbilBensin.TanggalBerapa,
                Setor: ""
              })
                .then(() => {
                  notification.success({
                    message: "Data Berhasil Di Simpan"
                  })
                })
                .catch((error) => {
                  console.error("Data could not be updated", error);
                  notification.error({
                    message: "Data Tidak Berhasil Di Simpan"
                  })
                });
            }
          }
        }
      }
    }).catch((error) => {
      console.error("Data could not be fetched", error);
    });
  }


  return (
    <div>
      <NavbarComponent />

      <Container>
        <Alert message={`Selamat Datang ${username}`} type="info" />
        {(username === "ridwan" || username === "aris" || username === "dewi") && (
          <Row className='mt-3'>
            <h4 className='d-flex justify-content-center'>Menu Update Stock</h4>
            <Col className='d-flex justify-content-center' sm={4}>
              {hide1 === true ?
                <Button onClick={() => sethide1(false)} style={{ color: "white", backgroundColor: "#4A7EEE" }}>Tutup Menu Stock Open</Button>

                : <Button onClick={() => sethide1(true)} style={{ color: "white", backgroundColor: "#4A7EEE" }}>Buka Menu Update Stock</Button>}
            </Col>
            {(hide1 === true) && <>
              <Col className='d-flex justify-content-center mt-3' sm={4}>
              </Col>
              <Col sm={4}>
                <DatePicker placeholder='Tanggal Berapa' required format={"DD-MM-YYYY"} style={{ width: "100%" }} onChange={(date) => handlechange("TanggalBerapa", date && date.format('DD-MM-YYYY'))}></DatePicker>
              </Col>
              <Col className='mt-3' sm={4}>
                <TimePicker required style={{ width: "100%" }} onChange={(momentObj) => handlechange("Jamberapa", momentObj && momentObj.format('HH:mm:ss'))} placeholder='Jam berapa' />
              </Col>
              <Col className='mt-3' sm={4}>
                <Input required width={"100%"} type='number' onChange={(e) => handlechange("BerapaLiter", e.target.value)} placeholder='Berapa Liter stock'></Input>
              </Col>
              <Col className='mt-3 ' sm={4}>
                <Button className='d-flex justify-content-center' style={{ color: "white", backgroundColor: "red" }} onClick={writeUserData}>Update Stock</Button>
              </Col>
            </>}

          </Row>
        )}
        <div className='mt-4'>
          <Harga />
        </div>
        <div className='mt-4'>
          <Informasi />
        </div>

        <div >
          <Row>
          <h4 className='mt-4 d-flex justify-content-center'>Menu Update Stock</h4>
            <Col className='mt-1 d-flex justify-content-center'>
              {hide === true ? (
                <div className='d-flex justify-content-center'>
                  <Button onClick={() => sethide(false)} style={{ color: "white", backgroundColor: "#4A7EEE" }}>Tutup Menu Ambil Bensin</Button>
                </div>
              ) : (
                <Button onClick={() => sethide(true)} style={{ color: "white", backgroundColor: "#4A7EEE" }}>Buka Menu Ambil Bensin</Button>
              )}
            </Col>

            {(hide === true) && (
              <div className='AmbilBensin mt-3'>
                <Col sm={4}>
                  <DatePicker placeholder='Tanggal Berapa' required format={"DD-MM-YYYY"} style={{ width: "100%" }} onChange={(date) => handlechangeAmbilBensin("TanggalBerapa", date && date.format('DD-MM-YYYY'))}></DatePicker>
                </Col>
                <Col className='mt-3' sm={4}>
                  <TimePicker required style={{ width: "100%" }} onChange={(momentObj) => handlechangeAmbilBensin("Jamberapa", momentObj && momentObj.format('HH:mm:ss'))} placeholder='jam berapa' />
                </Col>
                <Col className='mt-3' sm={4}>
                  <Input required width={"100%"} type='number' onChange={(e) => handlechangeAmbilBensin("BerapaLiter", e.target.value)} placeholder='Berapa Liter Diambil'></Input>
                </Col>
                <Col className='mt-3 ' sm={4}>
                  <Button className='d-flex justify-content-center' style={{ color: "white", backgroundColor: "red" }} onClick={updateliterdanambil}>Ambil Bensin</Button>
                </Col>
              </div>
            )}
          </Row>
        </div>

        <div className='mt-4'>
          <Tables />
        </div>
      </Container>


    </div>

  )
}

export default Dashboard