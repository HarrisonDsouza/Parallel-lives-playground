import React from 'react';
import GameIcon from '../GameIcon';

const Button = ({ 
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    fontFamily: 'var(--font-primary)',
    fontWeight: 'var(--font-bold)',
    textDecoration: 'none',
    border: 'none',
    borderRadius: 'var(--radius-2xl)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all var(--transition-base)',
    position: 'relative',
    overflow: 'hidden',
    width: fullWidth ? '100%' : 'auto',
    ...(disabled && {
      opacity: 0.6,
      pointerEvents: 'none'
    })
  };

  // Size variants
  const sizeStyles = {
    sm: {
      height: 'var(--button-height-sm)',
      paddingLeft: 'var(--button-padding-x-sm)',
      paddingRight: 'var(--button-padding-x-sm)',
      fontSize: 'var(--text-xs)',
    },
    md: {
      height: 'var(--button-height-md)',
      paddingLeft: 'var(--button-padding-x-md)',
      paddingRight: 'var(--button-padding-x-md)',
      fontSize: 'var(--text-sm)',
    },
    lg: {
      height: 'var(--button-height-lg)',
      paddingLeft: 'var(--button-padding-x-lg)',
      paddingRight: 'var(--button-padding-x-lg)',
      fontSize: 'var(--text-base)',
    }
  };

  // Color variants
  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-800) 100%)',
      color: 'var(--color-white)',
      boxShadow: 'var(--shadow-gaming)',
      '&:hover': {
        background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-700) 100%)',
        boxShadow: 'var(--shadow-gaming-hover)',
        transform: 'translateY(-2px)',
      }
    },
    secondary: {
      background: 'var(--color-primary-300)',
      color: 'var(--color-primary-800)',
      border: '2px solid var(--color-primary-700)',
      boxShadow: 'var(--shadow-base)',
      '&:hover': {
        background: 'var(--color-primary-200)',
        transform: 'translateY(-1px)',
        boxShadow: 'var(--shadow-md)',
      }
    },
    success: {
      background: 'linear-gradient(135deg, var(--color-success-600) 0%, var(--color-success-500) 100%)',
      color: 'var(--color-white)',
      boxShadow: 'var(--shadow-base)',
      '&:hover': {
        background: 'linear-gradient(135deg, var(--color-success-700) 0%, var(--color-success-600) 100%)',
        transform: 'translateY(-2px)',
        boxShadow: 'var(--shadow-lg)',
      }
    },
    warning: {
      background: 'linear-gradient(135deg, var(--color-warning-600) 0%, var(--color-warning-500) 100%)',
      color: 'var(--color-white)',
      boxShadow: 'var(--shadow-base)',
      '&:hover': {
        background: 'linear-gradient(135deg, var(--color-warning-700) 0%, var(--color-warning-600) 100%)',
        transform: 'translateY(-2px)',
        boxShadow: 'var(--shadow-lg)',
      }
    }
  };

  const iconSize = {
    sm: 14,
    md: 16,
    lg: 18
  };

  const handleMouseEnter = (e) => {
    if (disabled || loading) return;
    const hoverStyles = variantStyles[variant]['&:hover'];
    if (hoverStyles) {
      Object.assign(e.target.style, hoverStyles);
    }
  };

  const handleMouseLeave = (e) => {
    if (disabled || loading) return;
    // Reset to base variant styles
    Object.assign(e.target.style, {
      ...variantStyles[variant],
      transform: 'translateY(0)',
    });
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant]
      }}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div style={{
          width: iconSize[size],
          height: iconSize[size],
          border: '2px solid currentColor',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <GameIcon 
          icon={icon} 
          size={iconSize[size]} 
          color="currentColor" 
        />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <GameIcon 
          icon={icon} 
          size={iconSize[size]} 
          color="currentColor" 
        />
      )}
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};

export default Button;