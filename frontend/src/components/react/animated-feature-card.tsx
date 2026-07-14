import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedFeatureCard = ({ 
  isDark, 
  label, 
  title, 
  description, 
  buttonText, 
  link,
  traceDelay = 0,
  scanDelay = 1.35 
}) => {
  const cardClass = isDark ? "feature-card--dark" : "feature-card--light";
  const btnClass = isDark ? "card-btn--light" : "card-btn--dark";

  const handleNavigation = () => {
    if (link) {
      window.location.href = link;
    }
  };

  return (
    <motion.div
      className={`feature-card ${cardClass}`}
      style={{ width: '100%', height: '100%', boxSizing: 'border-box' }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 2.0,
        delay: scanDelay,
        ease: [0.16, 1, 0.3, 1] // Out-cubic easing
      }}
    >
      <span className="card-label">{label}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      <button className={`card-btn ${btnClass}`} onClick={handleNavigation}>
        {buttonText} &rarr;
      </button>
    </motion.div>
  );
};
