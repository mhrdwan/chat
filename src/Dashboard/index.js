import React, { useEffect, useState } from 'react';
import { ref, set, getDatabase, push, onValue, off, update, get, orderByKey, limitToLast, query } from 'firebase/database';
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
        const MasterStock = ref(database, 'MasterStock/');
        const UserStock = ref(database, 'MasterUserStock/');
        const MasterDisplayStock = ref(database, 'MasterDisplayStock/');
        const stockharian = ref(database, 'StockharianAyah/Stockharianayah');
        const latestDataQuery = query(stockharian, orderByKey(), limitToLast(1));
        get(latestDataQuery)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const allData = snapshot.val();
              const latestData = Object.values(allData)[0];
              const berapaLiter = latestData.BerapaLiter;
              console.log('BerapaLiter:', berapaLiter);
            } else {
              console.log("No data available");
            }
          })
          .catch((error) => {
            console.error("Error getting data:", error);
          });
        push(MasterStock, {
          username: username,
          BerapaLiter: Inputan.BerapaLiter + "L",
          Jamberapa: Inputan.Jamberapa,
          TanggalBerapa: Inputan.TanggalBerapa
        });
        push(UserStock, {
          username: username,
          BerapaLiter: Inputan.BerapaLiter + "L",
          Jamberapa: Inputan.Jamberapa,
          TanggalBerapa: Inputan.TanggalBerapa
        });
        set(MasterDisplayStock, {
          BerapaLiter: Inputan.BerapaLiter + "L",
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


  const [displaynumberliter, setdisplaynumberliter] = useState("")
  useEffect(() => {
    if (!username) {
      navigate('/login');
    }
    const MasterDisplayUserStock = ref(database, 'MasterDisplayStock/');

    const handleDataChange = (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const berapaLiter = data.BerapaLiter;
        setdisplaynumberliter(berapaLiter);
        console.log("BerapaLiter:", berapaLiter);
      } else {
        console.log("No data available");
      }
    };
    const unsubscribe = onValue(MasterDisplayUserStock, handleDataChange);

    return () => {
      unsubscribe();
    };
  }, []);


  console.log(`sadasd`, displaynumberliter);






  // Function untuk update jumlah liter input ke database
  function updateliterdanambil() {
    const db = getDatabase();
    const userambilbensin = ref(database, 'UserAmbilBensin/');
    push(userambilbensin, {
      username: username,
      BerapaLiter: InputanAmbilBensin.BerapaLiter + "L",
      Jamberapa: InputanAmbilBensin.Jamberapa,
      TanggalBerapa: InputanAmbilBensin.TanggalBerapa,
      Status: ""
    });
    const MasterDisplayUserStock = ref(database, 'MasterDisplayStock/');
    const updatedBerapaLiter = parseInt(displaynumberliter) - parseInt(InputanAmbilBensin.BerapaLiter);
    update(MasterDisplayUserStock, {
      BerapaLiter: updatedBerapaLiter,
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
        <Row>
          <Col>
            <div className='mt-4'>
              <Informasi />
            </div>
          </Col>
        </Row>

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