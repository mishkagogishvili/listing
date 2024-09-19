import { useState, useEffect } from 'react';
import { Dropdown, Button, Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { FiltersType } from '../types';

interface BedroomDropdownProps {
    setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
    selectedBedrooms: number | null;
}

export default function BedroomDropdown({ setFilters, selectedBedrooms }: BedroomDropdownProps) {
    const [bedrooms, setBedrooms] = useState<string>('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Update state when selectedBedrooms changes
        setBedrooms(selectedBedrooms !== null ? selectedBedrooms.toString() : '');
    }, [selectedBedrooms]);

    const handleChoose = () => {
        setVisible(false);

        const newUrl = new URL(window.location.href);

        if (bedrooms) {
            newUrl.searchParams.set('bedrooms', bedrooms);
        } else {
            newUrl.searchParams.delete('bedrooms');
        }

        window.history.pushState({}, '', newUrl.toString());

        setFilters((prevFilters) => ({
            ...prevFilters,
            bedrooms: bedrooms ? parseInt(bedrooms, 10) : null
        }));
    };

    const menu = (
        <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px', width: '200px' }}>
            <div>
                <Input
                    type="number"
                    placeholder="Bedrooms"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
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
                Bedrooms <DownOutlined />
            </Button>
        </Dropdown>
    );
}
