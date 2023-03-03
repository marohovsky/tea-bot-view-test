import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import ulunPng from '../../assets/ulun.webp'
import puerPng from '../../assets/puer.webp'

import {useCallback, useEffect} from "react";

const products = [
    {id: '1', title: 'Пуер200', price: 500, description: 'твердий як член Сі Цзіньпіня', img: puerPng},
    {id: '2', title: 'Улун400', price: 1200, description: "м'який як дупка панди", img:ulunPng},
    {id: '3', title: 'Пуер300', price: 500, description: 'твердий як член Сі Цзіньпіня', img:puerPng},
    {id: '4', title: 'Улун500', price: 122, description: "м'який як дупка панди", img:ulunPng},
    {id: '5', title: 'Пуер400', price: 500, description: 'твердий як член Сі Цзіньпіня', img:puerPng},
    {id: '6', title: 'Улун600', price: 600, description: "м'який як дупка панди", img:ulunPng},
    {id: '7', title: 'Пуер500', price: 550, description: 'твердий як член Сі Цзіньпіня', img:puerPng},
    {id: '8', title: 'Улун700', price: 1200, description: "м'який як дупка панди", img:ulunPng},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://85.119.146.179:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;
