import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, push, get, remove, update, set } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import logo from './pictures/logo.png';
import './POS.css';

const MenuItemCard = ({ item, addToCart, navigate, deletemenu, getCartItemQuantity }) => {
    return (
        <div className="card">
            <div className="card-body">
                <h3 className="card-title">{item.Name}</h3>
                <p className="card-text">
                    Size: {item.Size} | Price: {item.Price} | Stock: {item.Stock - getCartItemQuantity(item.menuId)}
                </p>
                <button className="btn btn-primary mr-2" onClick={() => addToCart(item)}>Add to Cart</button>
                <button className="btn btn-warning mr-2" onClick={() => navigate(`/POS5/${item.menuId}`)}>UPDATE</button>
                <button className="btn btn-danger" onClick={() => deletemenu(item.menuId)}>DELETE</button>
            </div>
        </div>
    );
};

const Finishing = () => {
    const [inputValue1, setInputValue1] = useState("");
    const [inputValue2, setInputValue2] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [inputValue4, setInputValue4] = useState("");
    const [categoryArray, setCategoryArray] = useState([]);
    const [inputPrice, setInputPrice] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const saveData = async () => {
        const newDocRef = push(ref(db, "menu"));
        const newData = {
            Category: inputValue1,
            Name: inputValue2,
            Size: selectedSize,
            Price: inputPrice,
            Stock: parseInt(inputValue4)
        };

        try {
            await set(newDocRef, newData);
            alert("Data saved successfully");
            setInputValue1("");
            setInputValue2("");
            setSelectedSize("");
            setInputPrice("");
            setInputValue4("");
            fetchData();
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    const fetchData = async () => {
        const dbRef = ref(db, "menu");
        try {
            const snapshot = await get(dbRef);
            if (snapshot.exists()) {
                const menuItems = Object.entries(snapshot.val()).map(([key, value]) => ({
                    menuId: key,
                    ...value
                }));
                setCategoryArray(menuItems);
            } else {
                alert("No data available");
            }
        } catch (error) {
            alert("Error fetching data: " + error.message);
        }
    };

    const deletemenu = async (menuId) => {
        try {
            const dbRef = ref(db, `menu/${menuId}`);
            await remove(dbRef);
            setCategoryArray(prevArray =>
                prevArray.filter(item => item.menuId !== menuId)
            );
            console.log("Data deleted successfully");
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    const addToCart = (item) => {
        const newItem = {
            ...item,
            quantity: 1
        };

        const updatedStock = item.Stock - 1;
        const dbRef = ref(db, `menu/${item.menuId}`);
        
        // Update stock in Firebase
        update(dbRef, { Stock: updatedStock }).then(() => {
            console.log("Stock updated successfully");
        }).catch((error) => {
            console.error("Error updating stock:", error);
        });

        // Update cart items state
        const existingItem = cartItems.find(cartItem => cartItem.menuId === item.menuId);
        if (existingItem) {
            const updatedItems = cartItems.map(cartItem =>
                cartItem.menuId === item.menuId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
            );
            setCartItems(updatedItems);
        } else {
            setCartItems([...cartItems, newItem]);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, cartItem) => total + (cartItem.Price * cartItem.quantity), 0);
    };

    const increaseQuantity = (menuId) => {
        const updatedItems = cartItems.map(cartItem =>
            cartItem.menuId === menuId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
        setCartItems(updatedItems);
    };
    
    const decreaseQuantity = (menuId) => {
        const updatedItems = cartItems.map(cartItem =>
            cartItem.menuId === menuId ? { ...cartItem, quantity: Math.max(1, cartItem.quantity - 1) } : cartItem
        );
        setCartItems(updatedItems);
    };

    const removeFromCart = (menuId) => {
        const updatedItems = cartItems.filter(cartItem => cartItem.menuId !== menuId);
        setCartItems(updatedItems);
    };

    const getCartItemQuantity = (menuId) => {
        const cartItem = cartItems.find(item => item.menuId === menuId);
        return cartItem ? cartItem.quantity : 0;
    };

    const groupByCategory = (menuItems) => {
        return menuItems.reduce((acc, currentItem) => {
            const category = currentItem.Category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(currentItem);
            return acc;
        }, {});
    };

    const groupedMenuItems = groupByCategory(categoryArray);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    return (
        <>
            <div className="container1">
                <div className="container2">
                    <img src={logo} className="logo1" alt="Logo"/> 
                </div>

                <div className="AddMenu">
                    <div className="addtomenu">Add to Menu:</div>
                    <input className="AddMenu1" type='text' placeholder="Category" value={inputValue1} onChange={(e) => setInputValue1(e.target.value)} />
                    <input className="AddMenu1" type='text' placeholder="Name" value={inputValue2} onChange={(e) => setInputValue2(e.target.value)} />

                    <select className="AddMenu1" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                        <option value="">Select Size</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                    </select>

                    <input className="AddMenu1"
                        type='text'
                        placeholder="Price"
                        value={inputPrice}
                        onChange={(e) => setInputPrice(e.target.value)}
                    />

                    <input className="AddMenu1"
                        type='text'
                        placeholder="Total Amount of Stock"
                        value={inputValue4}
                        onChange={(e) => setInputValue4(e.target.value)}
                    />

                    <button onClick={saveData}>SAVE DATA</button>
                </div>
            </div>
            
            <div className="Category7">
            <div className="Category6">
                <div className="Category5"> 
                    <div className="Menu">Menu:</div>
                    {Object.keys(groupedMenuItems).map((category, index) => (
                        <div key={index}>
                            <button onClick={() => handleCategoryClick(category)}>{category}</button>
                        </div>
                    ))}
                </div>
                <div className="Category2">
                    {selectedCategory && groupedMenuItems[selectedCategory] && (
                        <>
                            <h1 className="Category3">{selectedCategory}</h1>
                            <div className="Category4">
                                {groupedMenuItems[selectedCategory].map((item, idx) => (
                                    <MenuItemCard
                                        key={idx}
                                        item={item}
                                        addToCart={addToCart}
                                        navigate={navigate}
                                        deletemenu={deletemenu}
                                        getCartItemQuantity={getCartItemQuantity}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="Cart1">
                <h2>Cart</h2>
                <ul>
                    {cartItems.map((cartItem, index) => (
                        <li key={index}>
                            {cartItem.Name} | {cartItem.Size} | Quantity: {cartItem.quantity} | Price: {cartItem.Price * cartItem.quantity}
                            <br/>
                            <button onClick={() => increaseQuantity(cartItem.menuId)}>Add Quantity</button>
                            <button onClick={() => decreaseQuantity(cartItem.menuId)}>Minus Quantity</button>
                            <button onClick={() => removeFromCart(cartItem.menuId)}>Remove Order</button>
                        </li>
                    ))}
                </ul>

                <p>Total: {calculateTotal()}</p>
                <button>Check Out</button>
            </div>
            </div>
        </>
    );
};

export default Finishing;
