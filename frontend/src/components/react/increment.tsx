import React, { useState, useEffect, useRef } from 'react';

const Increment = ({ number }: { number: number }) => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = number;
    if (start === end) return;

    const incrementTime = Math.abs(Math.floor(1500 / (end - start)));

    const timer = setInterval(() => {
      start += 1;
      setCurrentNumber(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, number]);

  return (
    <span ref={elementRef} className="font-insrument-serif">
      {currentNumber}
    </span>
  );
};

export default Increment;
