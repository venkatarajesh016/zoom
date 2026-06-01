import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createContext, useContext } from "react";
export const AuthContext = React.createContext();
import server from "../environment";
const client = axios.create({
    baseURL: `${server.url}/api/users`,
    withCredentials: true,
});

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const router = useNavigate();
    const handleLogin = async(username, password) => {
        try {
        const response = await client.post("/login", { username, password });
        setUserData(response.data.user);
        if(response.status === 200){
            localStorage.setItem("token", response.data.user.token);
            router("/home");
        }
        return response.data;

        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    };

    const handleRegister = async(name, username, password) => {
        try {
        const response = await client.post("/register", { name, username, password });
        return response.data.message;
        } catch (error) {
            console.error("Error registering user:", error);
            throw error;
        }
    };
    
    const addToUserHistory = async(meetingCode) => {
        try {
            const token = localStorage.getItem("token");
            const response = await client.post("/add_to_activity", { token, meetingCode });
            return response.data;
        } catch (error) {
            console.error("Error adding to user history:", error);
            throw error;
        }
    };

    const getUserHistory = async() => {
        try {
            const token = localStorage.getItem("token");
            const response = await client.get("/get_activities", { params: { token } });
            return response.data.meetings;
        } catch (error) {
            console.error("Error fetching user history:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ userData, handleLogin, handleRegister, addToUserHistory, getUserHistory }}>
            {children}
        </AuthContext.Provider>
    );
};