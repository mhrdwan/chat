import React, { useEffect, useState } from 'react';
import { Alert, Button, Table, Tag, message } from 'antd';
import { getDatabase, ref, onValue, off, get, update, query, orderByChild } from 'firebase/database';
import useUserStore from '../zustand/UserStore';

function Tables() {
    const [Datasemua, setDatasemua] = useState([]);
    const username = useUserStore((state) => state.username);
    const setTerbaruAmbil = useUserStore((state) => state.setTerbaruAmbil);
    useEffect(() => {
        const db = getDatabase();
        const UserStock = ref(db, 'UserAmbilBensin/');
        const sortedQuery = query(UserStock, orderByChild('TanggalBerapa'));

        const unsubscribe = onValue(sortedQuery, (snapshot) => {
            if (snapshot.exists()) {
                const rawData = snapshot.val();
                const dataArray = Object.keys(rawData).map((key) => ({
                    id: key,
                    ...rawData[key],
                }));

                // Karena Firebase mengurutkan dari kecil ke besar,
                // kita perlu membalik array untuk mendapatkan urutan dari besar ke kecil (terbaru ke terlama)
                dataArray.reverse();

                console.log(dataArray);  // Menampilkan semua data
                console.log("Data paling terbaru:", dataArray[0]);  // Menampilkan data paling terbaru
                setTerbaruAmbil(dataArray[0])
                setDatasemua(dataArray);
            } else {
                console.log("No data available");
            }
        }, (error) => {
            console.error("Error fetching data:", error);
        });


        return () => off(UserStock, unsubscribe);
    }, []);


    const columns = [
        {
            title: 'No',
            key: 'no',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Nama',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Berapa Liter',
            dataIndex: 'BerapaLiter',
            key: 'BerapaLiter',
            render: (render) => {
                return (
                    <Tag color='blue'>{render}</Tag>
                )
            }
        },
        {
            title: 'Waktu',
            key: 'JamTanggal',
            render: (text, record, index) => {
                let warna = "yellow";
                const duplicate = Datasemua.some((item, idx) =>
                    item.TanggalBerapa === record.TanggalBerapa && idx !== index
                );

                if (duplicate) {
                    warna = "orange";
                }

                return (
                    <div>
                        <Tag color={warna}>{record.TanggalBerapa} <br /> {record.Jamberapa}</Tag>
                    </div>
                );
            },
        },
        {
            title: 'Setor',
            dataIndex: 'TanggalBerapa',
            render: (setor, record) => {
                let button = ""
                if (record.Setor === "" && username === record.username) {
                    button = <Button
                        style={{ color: "white", backgroundColor: "red" }}
                        onClick={() => {
                            setorfunct(record.key)
                            console.log('data:', record);
                        }}
                    >
                        Belum Setor
                    </Button>
                } else if (record.Setor === "" && username !== record.username) {
                    button = <Button
                        disabled
                        style={{ color: "white", backgroundColor: "red" }}
                        onClick={() => {
                            setorfunct(record.key)
                            console.log('data:', record);
                        }}
                    >
                        Belum Setor
                    </Button>
                }
                else {
                    button = <Button
                        style={{ color: "white", backgroundColor: "#4a7eee" }}
                        onClick={() => {
                            console.log('data:', record);
                        }}
                    >
                        Sudah Setor
                    </Button>
                }
                return (
                    button
                )
            }
        },
    ];

    const setorfunct = (recordKey) => {
        const db = getDatabase();
        const specificRef = ref(db, `untukdiambil/diambilorang/${recordKey}`);

        // Kode untuk melakukan update. Misal, kita ingin mengubah kolom 'Setor' menjadi 'Sudah'
        update(specificRef, {
            "Setor": "Sudah"
        }).then(() => {
            console.log("Update berhasil!");
        }).catch((error) => {
            console.error("Update gagal:", error);
        });
    };


    return (
        <div style={{ overflow: 'auto' }}>
            <Table
                dataSource={Datasemua}
                columns={columns}
                pagination={{ pageSize: 5 }}
            />
        </div>

    );
}

export default Tables;
