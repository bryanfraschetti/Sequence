import React from "react";

export default function CarouselItem({ imgUrl, imgTitle, text, destination }) {
  return (
    <a href={destination} target="_blank" rel="noreferrer" className="carousel-card">
      <img src={imgUrl} alt={imgTitle}></img>
      <p className="carouselText">{text}</p>
    </a>
  );
}
