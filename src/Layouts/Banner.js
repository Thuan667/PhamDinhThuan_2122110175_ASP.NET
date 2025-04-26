import React from 'react';
import { Carousel } from 'react-bootstrap';
import '../Layouts/css/Banner.css'; 

const Banner = () => {
  return (
    <Carousel>
      <Carousel.Item interval={2000}>
        <img
          className="d-block w-100"
          src={`/img/slider_3.webp`}
          alt="First slide"
        />
      
      </Carousel.Item>

      <Carousel.Item interval={2000}>
        <img
          className="d-block w-100"
          src={`/img/slider_1.webp`}
          alt="Second slide"
        />
       
      </Carousel.Item>

      <Carousel.Item interval={2000}>
        <img
          className="d-block w-100"
          src={(`/img/slider_5.webp`)}
          alt="Third slide"
        />
        
      </Carousel.Item>
    </Carousel>
  );
};

export default Banner;
