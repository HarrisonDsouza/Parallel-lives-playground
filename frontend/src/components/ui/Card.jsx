import React from 'react';

const Card = ({ 
  variant = 'primary',
  padding = 'default',
  className = '',
  style = {},
  children,
  ...props 
}) => {
  const baseStyles = {
    borderRadius: 'var(--card-radius)',
    boxShadow: 'var(--shadow-gaming)',
    transition: 'all var(--transition-base)',
    position: 'relative',
    overflow: 'hidden',
  };

  const variantStyles = {
    primary: {
      background: 'var(--color-primary-300)',
      border: '4px solid var(--color-primary-700)',
      color: 'var(--color-primary-800)',
    },
    secondary: {
      background: 'var(--color-white)',
      border: '3px solid var(--color-primary-600)',
      color: 'var(--color-primary-800)',
    },
    elevated: {
      background: 'var(--color-primary-300)',
      border: '4px solid var(--color-primary-700)',
      boxShadow: 'var(--shadow-2xl)',
      color: 'var(--color-primary-800)',
    },
    transparent: {
      background: 'rgba(245, 222, 179, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '2px solid var(--color-primary-600)',
      color: 'var(--color-primary-800)',
    }
  };

  const paddingStyles = {
    none: { padding: 0 },
    sm: { padding: 'var(--space-4)' },
    default: { padding: 'var(--card-padding)' },
    lg: { padding: 'var(--space-8)' },
    xl: { padding: 'var(--space-12)' },
  };

  return (
    <div
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...paddingStyles[padding],
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;