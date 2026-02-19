import React from 'react';
import { useButtonLogic } from './useLogic';
import './styles.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  icon
}) => {
  const { handleClick } = useButtonLogic(onClick);

  return (
    <button 
      type={type} 
      className={`custom-button button-${variant}`} 
      onClick={handleClick}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </button>
  );
};
