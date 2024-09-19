import { useState, useEffect } from 'react';
import { Dropdown, Button, Checkbox, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export default function RegionDropdown({ setFilters, selectedRegions }) {
    const [checkedItems, setCheckedItems] = useState<string[]>(selectedRegions);
    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        setCheckedItems(selectedRegions.map(String));
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
                const data = await response.json();
                setOptions(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                message.error('Failed to fetch data');
            }
        };
        fetchData();
    }, []);

    const handleCheckboxChange = (option: string, checked: boolean) => {
        if (checked) {
            setCheckedItems((prev) => [...prev, option]);
        } else {
            setCheckedItems((prev) => prev.filter((item) => item !== option));
        }
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

        setFilters({ regions: checkedItems.map(Number) });
    };

    const menu = (
        <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {options.map((option: any) => (
                    <div key={option.id}>
                        <Checkbox
                            checked={checkedItems.includes(String(option.id))}
                            onChange={(e) => handleCheckboxChange(String(option.id), e.target.checked)}
                        >
                            {option.name}
                        </Checkbox>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '10px', textAlign: 'right' }}>
                <Button type="primary" onClick={handleChoose} danger>
                    არჩევა
                </Button>
            </div>
        </div>
    );

    return (
        <Dropdown overlay={menu} open={visible} onOpenChange={(flag) => setVisible(flag)} trigger={['click']}>
            <Button>
                რეგიონი <DownOutlined />
            </Button>
        </Dropdown>
    );
}
