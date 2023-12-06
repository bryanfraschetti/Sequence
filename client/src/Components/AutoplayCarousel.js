import React from "react";
import "./autoplaycarousel.scss";
import { cardDetails } from "./carousel-config";
import CarouselItem from "./CarouselItem";

export default function AutoplayCarousel() {
  return (
    <div className="carousel-container">
      <div className="carousel-track">
        {Object.keys(cardDetails).map((detailKey) => {
          return (
            <CarouselItem
              imgUrl={cardDetails[detailKey].imgUrl}
              imgTitle={cardDetails[detailKey].title}
              text={cardDetails[detailKey].text}
              destination={cardDetails[detailKey].destination}
              ></CarouselItem>
          );
        })}
        {Object.keys(cardDetails).map((detailKey) => {
          return (
            <CarouselItem
              imgUrl={cardDetails[detailKey].imgUrl}
              imgTitle={cardDetails[detailKey].title}
              text={cardDetails[detailKey].text}
              destination={cardDetails[detailKey].destination}
            ></CarouselItem>
          );
        })}
      </div>
    </div>
  );
}