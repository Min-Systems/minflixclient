import React from 'react';
import './ActionButton.css';

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
