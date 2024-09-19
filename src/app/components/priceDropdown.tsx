import { useState, useEffect } from 'react';
import { Dropdown, Button, Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export default function PriceDropdown({ setFilters, selectedPriceRange }) {
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (selectedPriceRange) {
            setMinPrice(selectedPriceRange.minPrice || '');
            setMaxPrice(selectedPriceRange.maxPrice || '');
        }
    }, [selectedPriceRange]);

    const handleChoose = () => {
        setVisible(false);

        const newUrl = new URL(window.location.href);

        if (minPrice) {
            newUrl.searchParams.set('minPrice', minPrice);
        } else {
            newUrl.searchParams.delete('minPrice');
        }

        if (maxPrice) {
            newUrl.searchParams.set('maxPrice', maxPrice);
        } else {
            newUrl.searchParams.delete('maxPrice');
        }

        window.history.pushState({}, '', newUrl.toString());

        setFilters((prevFilters) => ({
            ...prevFilters,
            minPrice: minPrice || null,
            maxPrice: maxPrice || null
        }));
    };

    const menu = (
        <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px', width: '200px' }}>
            <div>
                <Input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />
                <Input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />
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
                ფასი <DownOutlined />
            </Button>
        </Dropdown>
    );
}
