import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

const RevealComponent = ({ children }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;

    if (element) {
      gsap.fromTo(
        element,
        { y: 100, autoAlpha: 0 },
        {
          duration: 1.25,
          y: 0,
          autoAlpha: 1,
          ease: "back",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            markers: false, // Add markers for debugging
            onEnter: () => {
              gsap.fromTo(
                element,
                { autoAlpha: 0 },
                { autoAlpha: 1, overwrite: "auto" }
              );
            },
            onLeave: () => {
              gsap.fromTo(
                element,
                { autoAlpha: 1 },
                { autoAlpha: 0, overwrite: "auto" }
              );
            },
            onEnterBack: () => {
              gsap.fromTo(
                element,
                { y: -100, autoAlpha: 0 },
                {
                  duration: 1.25,
                  y: 0,
                  autoAlpha: 1,
                  ease: "back",
                  overwrite: "auto",
                }
              );
            },
            onLeaveBack: () => {
              gsap.fromTo(
                element,
                { autoAlpha: 1 },
                { autoAlpha: 0, overwrite: "auto" }
              );
            },
          },
        }
      );
    }
  }, [children]);

  return <div ref={elementRef}>{children}</div>;
};

export default RevealComponent;
