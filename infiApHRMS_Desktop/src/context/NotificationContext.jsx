import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { token, user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!token || !user) return;

        // Initialize Socket.io connection to backend
        const newSocket = io('http://localhost:3000', {
            auth: { token },
            transports: ['websocket']
        });

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket');
            setConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from WebSocket');
            setConnected(false);
        });

        newSocket.on('notification', (data) => {
            setNotifications(prev => [data, ...prev]);
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, [token, user]);

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        if (socket) {
            socket.emit('markAsRead', { notificationId: id });
        }
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider value={{ socket, notifications, connected, markAsRead, clearNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
