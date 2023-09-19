import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import "./Informasi.css"
import { Tag } from 'antd';
function App() {
    const [latestData, setLatestData] = useState([]);
    const [TerakhirAmbil, setTerakhirAmbil] = useState({
        nama: null,
        BerapaLiter: null,
        Jamberapa: null,
        TanggalBerapa: null,
    });

    useEffect(() => {
        const db = getDatabase();
        const SemuaStock = ref(db, 'Stock');

        const listener = onValue(SemuaStock, (snapshot) => {
            if (snapshot.exists()) {
                const allData = snapshot.val();
                console.log(`allData`, allData);

                let newLatestData = [];

                for (const userIdx in allData) {
                    if (allData[userIdx] !== null) {
                        const keys = Object.keys(allData[userIdx]).sort();
                        const lastKey = keys[keys.length - 1];

                        console.log(`Latest data for user index ${userIdx}:`);
                        const latest = allData[userIdx][lastKey];
                        console.log(latest);

                        newLatestData.push(latest);
                    }
                }

                setLatestData(newLatestData);  // Update state dengan data terbaru
            }
        }, (error) => {
            console.error(error);
        });

        return () => off(SemuaStock, listener);
    }, []);

    useEffect(() => {
        // Logic untuk mengambil data terakhir dari array `latestData`
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
        <div>
            {/* Tampilkan data terakhir */}
            {TerakhirAmbil.nama && (
                <div className="informasi-container">
                    <div className="informasi-box">
                        <h5>Jumlah Liter Tersisa</h5>
                        <Tag color='red'>{TerakhirAmbil.BerapaLiter}</Tag>

                    </div>
                    <div className="informasi-box">
                        <h5>Terakhir Di isi di Rumah</h5>
                        <Tag color='green'>{TerakhirAmbil.nama}</Tag>
                        <div>{TerakhirAmbil.TanggalBerapa}</div>
                        <div>{TerakhirAmbil.Jamberapa}</div>
                    </div>
                    <div className="informasi-box">
                        <h5>Terakhir Diambil Oleh</h5>
                    </div>
                </div>
            )}

        </div>
    );
}

export default App;
