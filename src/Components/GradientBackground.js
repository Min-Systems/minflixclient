import React from 'react';
import gradientBackground from '../Styling/GradientBackground.css';

/*
  This is the component that creates a gradient background style
*/
const GradientBackground = ({ children }) => {
  return <div className="gradient-background">{children}</div>;
};

export default GradientBackground;
