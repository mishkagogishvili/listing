import { useState, useEffect } from 'react';
import { Dropdown, Button, Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { FiltersType } from '../types';

interface PriceDropdownProps {
    setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
    selectedPriceRange: {
        minPrice: number | null;
        maxPrice: number | null;
    };
}

export default function PriceDropdown({ setFilters, selectedPriceRange }: PriceDropdownProps) {
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (selectedPriceRange) {
            setMinPrice(selectedPriceRange.minPrice !== null ? selectedPriceRange.minPrice.toString() : '');
            setMaxPrice(selectedPriceRange.maxPrice !== null ? selectedPriceRange.maxPrice.toString() : '');
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
            minPrice: minPrice ? parseFloat(minPrice) : null,
            maxPrice: maxPrice ? parseFloat(maxPrice) : null
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
                    Choose
                </Button>
            </div>
        </div>
    );

    return (
        <Dropdown overlay={menu} open={visible} onOpenChange={(flag) => setVisible(flag)} trigger={['click']}>
            <Button>
                Price <DownOutlined />
            </Button>
        </Dropdown>
    );
}
