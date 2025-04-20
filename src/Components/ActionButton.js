import React from 'react';
import actionButton from '../Styling/ActionButton.css';

/*
  This component is the button used for most other components
*/
const ActionButton = ({ label, onClick, type = 'button', id }) => {
    return (
      <button
        className="action-button"
        onClick={onClick}
        type={type}
        id={id}
      >
        {label}
      </button>
    );
  };
  
  export default ActionButton;  
