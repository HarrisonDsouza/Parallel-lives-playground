import React from 'react';

const Container = ({ 
  size = 'lg',
  padding = 'default',
  className = '',
  style = {},
  children,
  ...props 
}) => {
  const sizeStyles = {
    sm: { maxWidth: 'var(--container-sm)' },
    md: { maxWidth: 'var(--container-md)' },
    lg: { maxWidth: 'var(--container-lg)' },
    xl: { maxWidth: 'var(--container-xl)' },
    '2xl': { maxWidth: 'var(--container-2xl)' },
    full: { maxWidth: '100%' },
  };

  const paddingStyles = {
    none: { padding: 0 },
    sm: { padding: 'var(--space-4)' },
    default: { padding: 'var(--space-5)' },
    lg: { padding: 'var(--space-8)' },
    xl: { padding: 'var(--space-12)' },
  };

  const baseStyles = {
    width: '100%',
    margin: '0 auto',
    position: 'relative',
  };

  return (
    <div
      style={{
        ...baseStyles,
        ...sizeStyles[size],
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

export default Container;