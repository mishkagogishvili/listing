"use client";
import { useState, useEffect } from 'react';
import { Button, Card, Col, Row, message } from 'antd';
import { PlusOutlined, EnvironmentOutlined } from '@ant-design/icons';
import RegionDropdown from './components/regionDropdown';
import PriceDropdown from './components/priceDropdown';
import AreaDropdown from './components/areaDropdown';
import BedroomDropdown from './components/bedroomDropdown';
import { useSearchParams, useRouter } from 'next/navigation';
import CreateAgent from './components/createAgent';
import { FiltersType } from './types'; // Import FiltersType

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [filters, setFilters] = useState<FiltersType>({
    regions: [],
    minPrice: null,
    maxPrice: null,
    minArea: null,
    maxArea: null,
    bedrooms: null
  });
  const searchParams = useSearchParams();

  useEffect(() => {
    const regionParam = searchParams.get('region');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const minAreaParam = searchParams.get('minArea');
    const maxAreaParam = searchParams.get('maxArea');
    const bedroomsParam = searchParams.get('bedrooms');

    setFilters({
      regions: regionParam ? regionParam.split(',').map(Number) : [],
      minPrice: minPriceParam ? parseFloat(minPriceParam) : null,
      maxPrice: maxPriceParam ? parseFloat(maxPriceParam) : null,
      minArea: minAreaParam ? parseFloat(minAreaParam) : null,
      maxArea: maxAreaParam ? parseFloat(maxAreaParam) : null,
      bedrooms: bedroomsParam ? parseInt(bedroomsParam) : null,
    });

    const fetchData = async () => {
      try {
        const response = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/real-estates', {
          headers: {
            'Authorization': 'Bearer 9d003002-efaa-402b-9094-44d3120e0fc2',
            'Accept': 'application/json',
          },
        });
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Failed to fetch data');
      }
    };
    fetchData();
  }, [searchParams]);

  const filteredData = data.filter((listing: any) => {
    const matchesRegion = filters.regions && filters.regions.length
      ? filters.regions.includes(listing.city.region_id)
      : true;

    const minPrice = filters.minPrice;
    const maxPrice = filters.maxPrice;

    const matchesMinPrice = minPrice !== null ? listing.price >= minPrice : true;
    const matchesMaxPrice = maxPrice !== null ? listing.price <= maxPrice : true;

    const minArea = filters.minArea;
    const maxArea = filters.maxArea;

    const matchesMinArea = minArea !== null ? listing.area >= minArea : true;
    const matchesMaxArea = maxArea !== null ? listing.area <= maxArea : true;

    const bedrooms = filters.bedrooms;
    const matchesBedrooms = bedrooms !== null ? listing.bedrooms === bedrooms : true;

    return matchesRegion && matchesMinPrice && matchesMaxPrice && matchesMinArea && matchesMaxArea && matchesBedrooms;
  });

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: "10px" }}>
        <div>
          <RegionDropdown setFilters={setFilters} selectedRegions={filters.regions} />
          <PriceDropdown
            setFilters={setFilters}
            selectedPriceRange={{ minPrice: filters.minPrice, maxPrice: filters.maxPrice }}
          />
          <AreaDropdown
            setFilters={setFilters}
            selectedAreaRange={{ minArea: filters.minArea, maxArea: filters.maxArea }}
          />
          <BedroomDropdown setFilters={setFilters} selectedBedrooms={filters.bedrooms} />
        </div>
        <div>
          <Button type="primary" danger style={{ marginRight: "10px" }} onClick={() => router.push('/listing/create')}>
            <PlusOutlined /> Add Listing
          </Button>
          <CreateAgent />
        </div>
      </div>

      <div className="site-card-wrapper">
        <Row gutter={[8, 8]}>
          {filteredData.map((listing: any) => (
            <Col key={listing.id} span={6}>
              <Card cover={<img alt="example" src={listing.image} />}>
                <h3>{listing.price + "₾"}</h3>
                <p>
                  <EnvironmentOutlined /> {listing.city.name + ", " + listing.address}
                </p>
                <p>
                  <span style={{ marginRight: "10px" }}>საწოლები: {listing.bedrooms}</span>
                  <span style={{ marginRight: "10px" }}>ფართობი: {listing.area} მ<sup>2</sup></span>
                  <span>zip: {listing.zip_code}</span>
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}
