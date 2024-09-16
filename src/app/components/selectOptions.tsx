"use client";
import React, { useState, useEffect } from 'react';
import { Select, message } from 'antd';

export default function SelectOptions() {

    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/regions', {
                    headers: {
                        'Authorization': 'Bearer 9d003002-efaa-402b-9094-44d3120e0fc2',
                        'Accept': 'application/json',
                    },
                });
                const data = await response.json();
                console.log(data);
                setOptions(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                message.error('Failed to fetch data');
            }
        };
        fetchOptions();
    }, []);

    return (
        <Select>
            {options.map((option: any) => (
                <Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>
            ))}
        </Select>
    );
}