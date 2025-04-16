import React from 'react';
import gradientBackground from '../Styling/GradientBackground.css';

const GradientBackground = ({ children }) => {
  return <div className="gradient-background">{children}</div>;
};

export default GradientBackground;
