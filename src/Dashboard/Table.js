import React, { useEffect, useState } from 'react';
import { Button, Table, Tag } from 'antd';
import { getDatabase, ref, onValue, off } from 'firebase/database';

function Tables() {
    const [Datasemua, setDatasemua] = useState([]);

    useEffect(() => {
        const db = getDatabase();
        const dropBensinRef = ref(db, 'DropBensin');

        const listener = onValue(dropBensinRef, (snapshot) => {
            if (snapshot.exists()) {
                const allData = snapshot.val();
                const flattenedData = [];

                allData.filter(Boolean).forEach((subArray) => {
                    Object.keys(subArray).forEach((key) => {
                        flattenedData.push({
                            ...subArray[key],
                            key,
                        });
                    });
                });

                const sortedData = flattenedData.sort((a, b) => {
                    const dateA = a.TanggalBerapa;
                    const timeA = a.Jamberapa;
                    const dateB = b.TanggalBerapa;
                    const timeB = b.Jamberapa;
                    return `${dateB} ${timeB}`.localeCompare(`${dateA} ${timeA}`);
                });

                setDatasemua(sortedData);
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
            render: (setor) => {
                return <Button style={{ color: "white", backgroundColor: "#4a7eee" }}>Setor</Button>
            }
        },
    ];

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
