import React, { useEffect, useState } from 'react';
import { Button, Table, Tag } from 'antd';
import { getDatabase, ref, onValue, off, get, update } from 'firebase/database';
import useUserStore from '../zustand/UserStore';

function Tables() {
    const [Datasemua, setDatasemua] = useState([]);
    const setNamaPengambilBensin = useUserStore((state) => state.setNamaPengambilBensin);
    const setjamPengambilBensin = useUserStore((state) => state.setjamPengambilBensin);
    const username = useUserStore((state) => state.username);

    useEffect(() => {
        const db = getDatabase();
        const dropBensinRef = ref(db, 'untukdiambil/diambilorang'); // Update lokasi ref sesuai dengan struktur data
        const listener = onValue(dropBensinRef, (snapshot) => {
            if (snapshot.exists()) {
                const allData = snapshot.val();
                const flattenedData = Object.keys(allData).map((key) => {
                    return {
                        ...allData[key],
                        key, // Firebase key sebagai unique key untuk setiap row
                    };
                });
                // setDatasemua(allData)
                // Lakukan sorting
                const sortedData = flattenedData.sort((a, b) => {
                    const dateA = a.TanggalBerapa.split('-').reverse().join('-'); // Mengubah dari format dd-mm-yyyy menjadi yyyy-mm-dd
                    const dateB = b.TanggalBerapa.split('-').reverse().join('-'); // Sama seperti di atas
                    const timeA = a.Jamberapa;
                    const timeB = b.Jamberapa;

                    return `${dateB} ${timeB}`.localeCompare(`${dateA} ${timeA}`); // Sort secara descending
                });

                setDatasemua(sortedData);
                setNamaPengambilBensin(sortedData[0]?.username)
                setjamPengambilBensin(sortedData[0]?.Jamberapa);
            } else {
                console.log('No data available');
            }
        }, (error) => {
            console.error(error);
        });

        return () => off(dropBensinRef, listener);
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
                    warna = "red";
                }

                return (
                    <div>
                        <Tag color={warna}>{record.TanggalBerapa}</Tag>
                        <div>{record.Jamberapa}</div>
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
        <div>
            <Table
                dataSource={Datasemua}
                columns={columns}
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
}

export default Tables;
