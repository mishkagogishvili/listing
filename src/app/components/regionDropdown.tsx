// src/app/components/regionDropdown.tsx
import { useState, useEffect } from 'react';
import { Dropdown, Button, Checkbox, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { FiltersType } from '../types'; // Adjust the import path as needed

interface RegionDropdownProps {
    setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
    selectedRegions: number[];
}

interface RegionOption {
    id: number;
    name: string;
}

export default function RegionDropdown({ setFilters, selectedRegions }: RegionDropdownProps) {
    const [checkedItems, setCheckedItems] = useState<number[]>(selectedRegions);
    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState<RegionOption[]>([]);

    useEffect(() => {
        setCheckedItems(selectedRegions);
    }, [selectedRegions]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/regions', {
                    headers: {
                        'Authorization': 'Bearer 9d003002-efaa-402b-9094-44d3120e0fc2',
                        'Accept': 'application/json',
                    },
                });
                const data: RegionOption[] = await response.json();
                setOptions(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                message.error('Failed to fetch data');
            }
        };
        fetchData();
    }, []);

    const handleCheckboxChange = (optionId: number, checked: boolean) => {
        setCheckedItems((prev) => {
            if (checked) {
                return [...prev, optionId];
            } else {
                return prev.filter((item) => item !== optionId);
            }
        });
    };

    const handleChoose = () => {
        setVisible(false);

        const newUrl = new URL(window.location.href);

        if (checkedItems.length > 0) {
            newUrl.searchParams.set('region', checkedItems.join(','));
        } else {
            newUrl.searchParams.delete('region');
        }

        window.history.pushState({}, '', newUrl.toString());

        setFilters((prevFilters) => ({
            ...prevFilters,
            regions: checkedItems
        }));
    };

    const menu = (
        <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {options.map((option) => (
                    <div key={option.id}>
                        <Checkbox
                            checked={checkedItems.includes(option.id)}
                            onChange={(e) => handleCheckboxChange(option.id, e.target.checked)}
                        >
                            {option.name}
                        </Checkbox>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '10px', textAlign: 'right' }}>
                <Button type="primary" onClick={handleChoose} danger>
                    Choose
                </Button>
            </div>
        </div>
    );

    return (
        <Dropdown overlay={menu} open={visible} onOpenChange={(flag) => setVisible(flag)} trigger={['click']}>
            <Button>
                Region <DownOutlined />
            </Button>
        </Dropdown>
    );
}
