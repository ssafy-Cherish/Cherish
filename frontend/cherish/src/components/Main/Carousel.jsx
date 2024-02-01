import React from "react";
import Slider from "react-slick";
import "./CarouselSlick.css"
import "./CarouselSlickTheme.css"
import test from "../../assets/test.png"

export default function Carousel() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 5000,
    autoplaySpeed: 100,
    cssEase: "linear",
    pauseOnHover: true
    
  };

  return (
    <div className="border-2 rounded-[20px] px-[1.2vw] shadow-md">
      <Slider {...settings}>
        <div>
        <img src={test} alt="" />
        </div>
        <div>
          <img src={test} alt="" />
        </div>
        <div>
        <img src={test} alt="" />
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
      </Slider>
    </div>
  );
}
