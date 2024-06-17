import React from "react";
import { db } from "./firebase";
import { getDatabase, ref, set, get } from "firebase/database";
import { useState, useEffect } from "react";
import { uid } from "uid";
import { Router, useNavigate, useParams } from 'react-router-dom';

const Menu5 = () => {
    let [inputValue1, setInputValue1] = useState("");
    let [inputValue2, setInputValue2] = useState("");
    let [selectedSize, setSelectedSize] = useState("");
    let [inputValue4, setInputValue4] = useState("");

    const navigate = useNavigate();
    const {firebaseId} = useParams();

    useEffect (() => {
        const fetchData = async () => {
            const dbRef = ref(db, "menu/" + firebaseId); // Correct reference path
            const snapshot = await get(dbRef);
            if (snapshot.exists()) {
                const targetObject = snapshot.val();
                setInputValue1(targetObject.Category);
                setInputValue2(targetObject.Name);
                setSelectedSize(targetObject.Size);
                setInputValue4(targetObject.Price); // Correct property name
            } else {
                alert("error");
            }
        }
        fetchData();
    }, [firebaseId]);
    
    const overwriteData = async () => {
        const newDocRef = ref(db, "menu/" + firebaseId); // Correct reference path
        try {
            await set(newDocRef, {
                Category: inputValue1,
                Name: inputValue2,
                Size: selectedSize,
                Price: inputValue4 // Correct property name
            });
            alert("Data saved successfully");
        } catch (error) {
            alert("Error: " + error.message);
        }
        window.location.href = "/"


    };
    const sizeOptions = ['Small','Medium','Large'];

        return (
            <div>
            <h1>UPDATE</h1>
                <input type='text' value={inputValue1}
                onChange={(e) => setInputValue1(e.target.value)}/>

                <input type='text' value={inputValue2}
                onChange={(e) => setInputValue2(e.target.value)}/> 

                <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                <option value="">Select Size</option>
                {sizeOptions.map((size, index) => (
                    <option key={index} value={size}>{size}</option>
                ))}
            </select>
                <input type='text' placeholder="Price" value={inputValue4}
                onChange={(e) => setInputValue4(e.target.value)}/>   

                <button onClick={overwriteData}>SAVE</button>
                <br />
                <br />
                <br />

            </div>
        )
    }

export default Menu5
