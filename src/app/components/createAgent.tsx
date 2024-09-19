"use client";
import React, { useState } from 'react';
import { Button, Modal, Input, Form, Col, Row, Upload, UploadFile, message } from 'antd';
import { PlusOutlined, PlusCircleOutlined } from '@ant-design/icons';

interface Values {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    picture?: UploadFile[];
}

export default function CreateAgent() {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onCreate = async (values: Values) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', values.first_name!);
        formData.append('surname', values.last_name!);
        formData.append('email', values.email!);
        formData.append('phone', values.phone!);

        if (values.picture && values.picture.length > 0) {
            formData.append('avatar', values.picture[0].originFileObj as Blob);
        }

        try {
            const response = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/agents', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer 9d003002-efaa-402b-9094-44d3120e0fc2',
                    'Accept': 'application/json',
                },
                body: formData,
            });
            console.log(response);
            if (response.ok) {
                message.success('Agent added successfully!');
                setOpen(false);
                form.resetFields();
            } else {
                const errorData = await response.json();
                message.error(`Failed to add agent: ${errorData.message || 'Error'}`);
            }
        } catch (error) {
            message.error('There was an error with the request.');
        } finally {
            setLoading(false);
        }
    };

    const validateEmail = (_: any, value: string) => {
        if (value && !value.endsWith('@redberry.ge')) {
            return Promise.reject(new Error('Email must end with @redberry.ge'));
        }
        return Promise.resolve();
    };

    return (
        <>
            <Button onClick={() => setOpen(true)} danger>
                <PlusOutlined /> აგენტის დამატება
            </Button>
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                width={800}
                okButtonProps={{ autoFocus: true, htmlType: 'submit', loading, danger: true }}
                cancelButtonProps={{ danger: true }}
                destroyOnClose
                modalRender={(dom) => (
                    <Form
                        layout="vertical"
                        form={form}
                        name="form_in_modal"
                        onFinish={onCreate}
                    >
                        {dom}
                    </Form>
                )}
            >
                <h3 style={{ textAlign: 'center', marginBottom: 20 }}>აგენტის დამატება</h3>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="სახელი"
                            name="first_name"
                            rules={[{ required: true, message: 'Please enter first name!' }, { min: 2, message: 'Min 2 symbol' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="გვარი"
                            name="last_name"
                            rules={[{ required: true, message: 'Please enter last name!' }, { min: 2, message: 'Min 2 symbol' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="ელ.ფოსტა"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }, { validator: validateEmail }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="ტელეფონი"
                            name="phone"
                            rules={[{ required: true, message: 'Please enter your phone number!' }, {
                                pattern: /^5\d{8}$/,
                                message: 'Phone number must start with 5 and be followed by 8 digits (e.g., 5xxxxxxxx)',
                            }]}
                        >
                            <Input onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="ატვირთეთ ფოტო"
                            name="picture"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                            rules={[{ required: true, message: 'Please upload a photo!' }]}
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
                                        message.error('Image must not be greater than 1MB!');
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
                </Row>
            </Modal>
        </>
    );
}
