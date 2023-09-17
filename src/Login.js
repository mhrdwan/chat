import React, { useEffect, useState } from 'react'
// import { requestMessagingPermission } from "./firebase.js"
import { Button, Col, Input, notification } from 'antd'
import { useNavigate } from 'react-router-dom';
import { requestMessagingPermission } from './firebase';
import HalamanChat from './Chat/HalamanChat';
import useUserStore from './zustand/UserStore';

function Login({ token }) {
    const setUsername = useUserStore((state) => state.setUsername);
    const [username, setusername] = useState("")
    useEffect(() => {
        requestMessagingPermission()
    }, [])

    const [dataUser, setDataUser] = useState({
        username: null,
        password: null,
    })
    const user = [
        {
            id: 1,
            username: "ridwan",
            password: "ridwan174",
        },
        {
            id: 2,
            username: "iman",
            password: "iman123",
        },
        {
            id: 2,
            username: "ana",
            password: "ana",
        },
    ]

    const handleInputChange = (key, value) => {
        setDataUser(asw => ({
            ...asw,
            [key]: value,
        }));
    };

    const navigate = useNavigate();

    const login = () => {
        const matchedUser = user.find(u =>
            u.username === dataUser.username &&
            u.password === dataUser.password
        );

        if (matchedUser) {
            setUsername(matchedUser.username); 
            notification.success({
                message: "Login Success"
            });
            navigate('/chat');
        } else {
            notification.error({
                message: "Login Gagal"
            })
        }
    };



    return (
        <>
            <div className="App">

                <Col>
                    <div>
                        <Input
                            type='text'
                            placeholder='Masukkan Username'
                            onChange={(e) => handleInputChange("username", e.target.value)}
                        />
                    </div>
                </Col>
                <Col>
                    <div>
                        <Input
                            type='password'
                            style={{ marginTop: 20 }}
                            placeholder='Masukkan Password'
                            onChange={(e) => handleInputChange("password", e.target.value)}
                        />
                    </div>
                </Col>
                <div style={{ marginTop: 15 }}>
                    <Button onClick={login}>Login</Button>
                </div>
            </div>
        </>

    )
}

export default Login;
