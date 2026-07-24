import React from 'react';

export const AnimatedFeatureCard = ({ 
  isDark, 
  label, 
  title, 
  description, 
  buttonText, 
  link,
  traceDelay = 0,
  scanDelay = 1.1 
}) => {
  const cardClass = isDark ? "feature-card--dark" : "feature-card--light";
  const btnClass = isDark ? "card-btn--light" : "card-btn--dark";

  const handleNavigation = () => {
    if (link) {
      window.location.href = link;
    }
  };

  return (
    <div
      className={`feature-card ${cardClass}`}
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        animationDelay: `${scanDelay}s`
      }}
    >
      <span className="card-label">{label}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      <button className={`card-btn ${btnClass}`} onClick={handleNavigation}>
        {buttonText} &rarr;
      </button>
    </div>
  );
};
