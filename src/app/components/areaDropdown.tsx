import { useState, useEffect } from 'react';
import { Dropdown, Button, Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export default function AreaDropdown({ setFilters, selectedAreaRange }) {
    const [minArea, setMinArea] = useState<string>('');
    const [maxArea, setMaxArea] = useState<string>('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (selectedAreaRange) {
            setMinArea(selectedAreaRange.minArea || '');
            setMaxArea(selectedAreaRange.maxArea || '');
        }
    }, [selectedAreaRange]);

    const handleChoose = () => {
        setVisible(false);

        const newUrl = new URL(window.location.href);

        if (minArea) {
            newUrl.searchParams.set('minArea', minArea);
        } else {
            newUrl.searchParams.delete('minArea');
        }

        if (maxArea) {
            newUrl.searchParams.set('maxArea', maxArea);
        } else {
            newUrl.searchParams.delete('maxArea');
        }

        window.history.pushState({}, '', newUrl.toString());

        setFilters((prevFilters) => ({
            ...prevFilters,
            minArea: minArea || null,
            maxArea: maxArea || null
        }));
    };

    const menu = (
        <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px', width: '200px' }}>
            <div>
                <Input
                    type="number"
                    placeholder="Min Area"
                    value={minArea}
                    onChange={(e) => setMinArea(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />
                <Input
                    type="number"
                    placeholder="Max Area"
                    value={maxArea}
                    onChange={(e) => setMaxArea(e.target.value)}
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
                ფართობი <DownOutlined />
            </Button>
        </Dropdown>
    );
}
