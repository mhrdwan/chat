import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, off, push } from 'firebase/database';
import "./Informasi.css"
import { Alert, Tag } from 'antd';
import useUserStore from '../zustand/UserStore';
function App() {
    const [latestData, setLatestData] = useState([]);
    const [TerakhirAmbil, setTerakhirAmbil] = useState({
        nama: null,
        BerapaLiter: null,
        Jamberapa: null,
        TanggalBerapa: null,
    });
    const NamaPengambilBensin = useUserStore((state) => state.NamaPengambilBensin);
    const jamPengambilBensin = useUserStore((state) => state.jamPengambilBensin);
    useEffect(() => {
        const db = getDatabase();
        const SemuaStock = ref(db, 'Stock');
        const connectedRef = ref(db, ".info/connected");
        onValue(connectedRef, (snap) => {
            if (snap.val() === true) {
            } else {
                alert("Tidak Ada Koneksi Internet");
            }
        });
        const listener = onValue(SemuaStock, (snapshot) => {
            if (snapshot.exists()) {
                const allData = snapshot.val();
                // console.log(`allData`, allData);

                let newLatestData = [];

                for (const userIdx in allData) {
                    if (allData[userIdx] !== null) {
                        const keys = Object.keys(allData[userIdx]).sort();
                        const lastKey = keys[keys.length - 1];

                        // console.log(`Latest data for user index ${userIdx}:`);
                        const latest = allData[userIdx][lastKey];
                        // console.log(latest);

                        newLatestData.push(latest);
                    }
                }

                setLatestData(newLatestData);
            }
        }, (error) => {
            console.error(error);
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

    console.log(`TerakhirAmbil`, TerakhirAmbil);


    return (
        <div className='d-flex justify-content-center'>
            {TerakhirAmbil.nama && (
                <div className="informasi-container">
                    <div className="informasi-box">
                        <h5>Jumlah Liter Tersisa</h5>
                        <div className='mt-auto'>
                            <Tag color='red'>{TerakhirAmbil.BerapaLiter === "0L" ? "Stock Habis" : TerakhirAmbil.BerapaLiter}</Tag>
                        </div>
                    </div>
                    <div className="informasi-box">
                        <h5>Terakhir Di isi Stock</h5>
                        <div className='mt-auto'>
                            <Tag color='green'>{TerakhirAmbil.nama}</Tag>
                            <Tag className='mt-2' color='orange'>{TerakhirAmbil.TanggalBerapa} <br /> {TerakhirAmbil.Jamberapa}</Tag>
                        </div>
                    </div>
                    <div className="informasi-box">
                        <h5>Terakhir Diambil Oleh</h5>
                        <div className='mt-auto'>
                            <Tag color='blue'>{NamaPengambilBensin}</Tag>
                            <Tag className='mt-2' color='red'>{jamPengambilBensin}</Tag>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
