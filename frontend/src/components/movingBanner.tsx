import React from "react";

import movingBanner from "../banner-moving.jpg";
import Marquee from "react-fast-marquee";

const MovingBanner = () => {
  return (
    <Marquee gradient={false}>
      <img
        style={{ width: "100%" }}
        src={movingBanner}
        alt="Bunny Collection Banner"
      />
    </Marquee>
  );
};

export default MovingBanner;
