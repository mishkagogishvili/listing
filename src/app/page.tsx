"use client";
import React, { useState } from 'react';
import { Flex } from "antd";
import CreateAgent from './components/createAgent';
import { useRouter } from 'next/navigation'
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';



export default function Home() {
  const router = useRouter()
  return (
    <Flex justify={"flex-end"}>
      <Button style={{ marginRight: "10px" }} type="primary" onClick={() => router.push('/listing/create')} danger>
        <PlusOutlined /> ლისტინგის დამატება
      </Button>
      <CreateAgent />
    </Flex>
  );
}
