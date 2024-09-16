"use client";
import React, { useState, useEffect } from 'react';
import { Button, Radio, Input, Form, Col, Row, Upload, message, Select, Flex } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'
const { TextArea } = Input;

export default function CreateListing() {
    const router = useRouter()
    const [agents, setAgents] = useState([]);
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [showCitySelect, setShowCitySelect] = useState(false);
    const [form] = Form.useForm();

    const fetchData = async (endpoint: string, setData: React.Dispatch<React.SetStateAction<any[]>>, label: string) => {
        setLoading(true);
        try {
            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': 'Bearer 9d003002-efaa-402b-9094-44d3120e0fc2',
                    'Accept': 'application/json',
                },
            });
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error(`Error fetching ${label}:`, error);
            message.error(`Failed to fetch ${label}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData('https://api.real-estate-manager.redberryinternship.ge/api/agents', setAgents, 'agents');
        fetchData('https://api.real-estate-manager.redberryinternship.ge/api/regions', setRegions, 'regions');
        fetchData('https://api.real-estate-manager.redberryinternship.ge/api/cities', setCities, 'cities');
    }, []);

    const handleRegionChange = (regionId: any) => {
        setSelectedRegion(regionId);
        setShowCitySelect(true);
        const filtered = cities.filter((city: any) => city.region_id === regionId);
        setFilteredCities(filtered);
    };

    const onFinish = async (values: any) => {
        const formData = new FormData();

        // Append form data
        formData.append('is_rental', values.is_rental);
        formData.append('address', values.address);
        formData.append('zip_code', values.zip_code);
        formData.append('region_id', values.region_id);
        formData.append('city_id', values.city_id);
        formData.append('price', values.price);
        formData.append('area', values.area);
        formData.append('bedrooms', values.bedrooms);
        formData.append('description', values.description);
        formData.append('agent_id', values.agent_id);

        if (values.picture && values.picture[0]) {
            formData.append('image', values.picture[0].originFileObj);
        }

        try {
            const response = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/real-estates', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer 9d003002-efaa-402b-9094-44d3120e0fc2',
                    'Accept': 'application/json',
                },
                body: formData,
            });

            const data = await response.json();
            console.log(data);
            if (response.ok) {
                message.success('Listing created successfully!');
                console.log('Response Data:', data);
                form.resetFields();
            } else {
                message.error('Failed to create listing');
                console.error('Error Response:', data);
            }
        } catch (error) {
            console.error('Error creating listing:', error);
            message.error('Failed to create listing');
        }
    };

    return (
        <Flex justify="center">
            <Form
                form={form}
                name="nest-messages"
                layout="vertical"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
                initialValues={{ is_rental: '0' }}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="is_rental" label="გარიგების ტიპი">
                            <Radio.Group>
                                <Radio value="0"> იყიდება </Radio>
                                <Radio value="1"> ქირავდება </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="address" label="მისამართი" rules={[{ required: true, message: "გრაფა აუცილებელია" },
                        { min: 2, message: 'მინიმუმ 2 სიმბოლო' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="zip_code" label="საფოსტო ინდექსი" rules={[{ required: true, message: "გრაფა აუცილებელია" }, { pattern: /^[0-9]+$/, message: "მხოლოდ რიცხვები" }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="რეგიონი" name="region_id" rules={[{ required: true, message: "გრაფა აუცილებელია" }]}>
                            <Select onChange={handleRegionChange} loading={loading}>
                                {regions.map((region: any) => (
                                    <Select.Option key={region.id} value={region.id}>
                                        {region.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        {showCitySelect && (
                            <Form.Item label="ქალაქი" name="city_id" rules={[{ required: true, message: "გრაფა აუცილებელია" }]}>
                                <Select loading={loading}>
                                    {filteredCities.map((city: any) => (
                                        <Select.Option key={city.id} value={city.id}>
                                            {city.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        )}
                    </Col>

                    <Col span={12}>
                        <Form.Item name="price" label="ფასი" rules={[{ required: true, message: "გრაფა აუცილებელია" },
                        { pattern: /^\d+(\.\d+)?$/, message: "მხოლოდ რიცხვები" }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="area" label="ფართობი" rules={[{ required: true, message: "გრაფა აუცილებელია" },
                        { pattern: /^\d+(\.\d+)?$/, message: "მხოლოდ რიცხვები" }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="bedrooms" label="საძინებლების რაოდენობა" rules={[{ required: true, message: "გრაფა აუცილებელია" },
                        { pattern: /^[0-9]+$/, message: "მხოლოდ მთელი რიცხვები" }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="აღწერა" name="description" rules={[{ required: true, message: "გრაფა აუცილებელია" }, { min: 5, message: "მინიმუმ 5 სიმბოლო" }]}>
                            <TextArea rows={4} />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="ატვირთეთ ფოტო"
                            name="picture"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                            rules={[{ required: true, message: 'გთხოვთ ატვირთოთ სურათი' }]}
                        >
                            <Upload
                                name="picture"
                                listType="picture-card"
                                maxCount={1}
                                showUploadList={{ showPreviewIcon: false }}
                                beforeUpload={(file) => {
                                    const isImage = file.type.startsWith('image/');
                                    const notGreaterThan1MB = file.size / 1024 / 1024 <= 1;
                                    if (!isImage) {
                                        message.error('You can only upload image files!');
                                        return Upload.LIST_IGNORE;
                                    }
                                    if (!notGreaterThan1MB) {
                                        message.error('Image must be smaller than 1MB!');
                                        return Upload.LIST_IGNORE;
                                    }
                                    return isImage && notGreaterThan1MB;
                                }}
                            >
                                <div style={{ border: 0, background: 'none', color: '#000' }}>
                                    <PlusCircleOutlined />
                                </div>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="აგენტი" name="agent_id" rules={[{ required: true, message: "გრაფა აუცილებელია" }]}>
                            <Select loading={loading}>
                                {agents.map((agent: any) => (
                                    <Select.Option key={agent.id} value={agent.id}>
                                        {agent.name} {agent.surname}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item>
                            <div style={{ textAlign: 'right' }}>
                                <Button onClick={() => router.push('/')} danger style={{ marginRight: "10px" }}>
                                    გაუქმება
                                </Button>
                                <Button type="primary" htmlType="submit" danger>
                                    დაამატე აგენტი
                                </Button>
                            </div>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Flex>
    );
}
