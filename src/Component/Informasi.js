import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, off, push, orderByKey, query, limitToLast } from 'firebase/database';
import "./Informasi.css"
import { Alert, Tag } from 'antd';
import useUserStore from '../zustand/UserStore';
function App() {
    const [latestData, setLatestData] = useState([]);
    const [Display, setDisplay] = useState("");
    const [TerakhirAmbil, setTerakhirAmbil] = useState({
        nama: null,
        BerapaLiter: null,
        Jamberapa: null,
        TanggalBerapa: null,
    });
    const setDisplayzutand = useUserStore((state) => state.setDisplayzutand);
    const NamaPengambilBensin = useUserStore((state) => state.NamaPengambilBensin);
    const jamPengambilBensin = useUserStore((state) => state.jamPengambilBensin);
    const TerbaruAmbil = useUserStore((state) => state.TerbaruAmbil);
    console.log(`TerbaruAmbil`,TerbaruAmbil);
    const setHitungBerapaLiter = useUserStore((state) => state.setHitungBerapaLiter);
    useEffect(() => {
        const db = getDatabase();
        const SemuaStock = ref(db, 'MasterUserStock');
        const MasterDisplayStock = ref(db, 'MasterDisplayStock');
        const latestDataQuersy = query(MasterDisplayStock, orderByKey(), limitToLast(1));
        const listeners = onValue(latestDataQuersy, (snapshot) => {
            if (snapshot.exists()) {
                const allData = snapshot.val();
                // Jika Anda hanya memerlukan 1 data terbaru
                const latestDatas = Object.values(allData)[0];
                console.log(`display`, allData.BerapaLiter);
                setDisplayzutand(allData.BerapaLiter)
                setDisplay(allData.BerapaLiter)
                // console.log('Latest Data:', latestDatas);
            } else {
                console.log("No data available");
            }
        });

        const latestDataQuery = query(SemuaStock, orderByKey(), limitToLast(1));
        const listener = onValue(latestDataQuery, (snapshot) => {
            if (snapshot.exists()) {
                const allData = snapshot.val();
                // Jika Anda hanya memerlukan 1 data terbaru
                const latestDatas = Object.values(allData)[0];

                // console.log('Latest Data:', latestDatas);
                setTerakhirAmbil(latestDatas)
                setHitungBerapaLiter(latestDatas.BerapaLiter)
            } else {
                console.log("No data available");
            }
        });

        return () => off(SemuaStock, listener);
    }, []);

    useEffect(() => {
        if (latestData.length > 0) {
            const lastEntry = latestData[latestData.length - 1];
            setTerakhirAmbil({
                nama: lastEntry.username,
                BerapaLiter: lastEntry.BerapaLiter,
                Jamberapa: lastEntry.Jamberapa,
                TanggalBerapa: lastEntry.TanggalBerapa,
            });

        }
    }, [latestData]);

    return (
        <div className='d-flex justify-content-center'>
            {TerakhirAmbil && (
                <div className="informasi-container">
                    <div className="informasi-box">
                        <h5>Jumlah Liter Tersisa</h5>
                        <div className='mt-auto'>
                            {/* <Tag color='red'>{TerakhirAmbil.BerapaLiter === "0L" ? "Stock Habis" : TerakhirAmbil.BerapaLiter}</Tag> */}
                            <Tag color='red'>{Display === "0L" ? "Stock Habis" : Display}</Tag>
                        </div>
                    </div>
                    <div className="informasi-box">
                        <h5>Terakhir Di isi Stock</h5>
                        <div className='mt-auto'>
                            <Tag color='green'>{TerakhirAmbil.username}</Tag>
                            <Tag className='mt-2' color='orange'>{TerakhirAmbil.TanggalBerapa} <br /> {TerakhirAmbil.Jamberapa}</Tag>
                        </div>
                    </div>
                    <div className="informasi-box">
                        <h5>Terakhir Diambil Oleh</h5>
                        <div className='mt-auto'>
                            <Tag color='blue'>{TerbaruAmbil?.username}</Tag>
                            <Tag className='mt-2' color='orange'>{TerbaruAmbil?.BerapaLiter}</Tag>
                            <Tag className='mt-2' color='red'>{TerbaruAmbil?.Jamberapa}</Tag>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
