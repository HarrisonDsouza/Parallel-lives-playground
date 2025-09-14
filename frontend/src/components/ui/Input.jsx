import React from 'react';
import GameIcon from '../GameIcon';
import { Label } from './Typography';

const Input = ({ 
  type = 'text',
  size = 'md',
  variant = 'default',
  icon,
  iconPosition = 'left',
  label,
  required = false,
  error,
  helperText,
  fullWidth = false,
  className = '',
  style = {},
  ...props 
}) => {
  const baseStyles = {
    fontFamily: 'var(--font-secondary)',
    fontSize: 'var(--text-base)',
    lineHeight: 'var(--leading-normal)',
    borderRadius: 'var(--radius-lg)',
    border: error ? '2px solid var(--color-error-500)' : '2px solid var(--color-primary-600)',
    backgroundColor: 'var(--color-white)',
    color: 'var(--color-primary-800)',
    transition: 'all var(--transition-base)',
    outline: 'none',
    width: fullWidth ? '100%' : 'auto',
    position: 'relative',
  };

  const sizeStyles = {
    sm: {
      height: 'var(--space-8)',
      paddingLeft: icon && iconPosition === 'left' ? 'var(--space-10)' : 'var(--space-3)',
      paddingRight: icon && iconPosition === 'right' ? 'var(--space-10)' : 'var(--space-3)',
      fontSize: 'var(--text-sm)',
    },
    md: {
      height: 'var(--space-12)',
      paddingLeft: icon && iconPosition === 'left' ? 'var(--space-12)' : 'var(--space-4)',
      paddingRight: icon && iconPosition === 'right' ? 'var(--space-12)' : 'var(--space-4)',
      fontSize: 'var(--text-base)',
    },
    lg: {
      height: 'var(--space-16)',
      paddingLeft: icon && iconPosition === 'left' ? 'var(--space-16)' : 'var(--space-6)',
      paddingRight: icon && iconPosition === 'right' ? 'var(--space-16)' : 'var(--space-6)',
      fontSize: 'var(--text-lg)',
    }
  };

  const variantStyles = {
    default: {
      '&:focus': {
        borderColor: 'var(--color-primary-700)',
        boxShadow: '0 0 0 3px rgba(139, 69, 19, 0.1)',
      },
      '&:hover': {
        borderColor: 'var(--color-primary-700)',
      }
    },
    success: {
      borderColor: 'var(--color-success-500)',
      '&:focus': {
        borderColor: 'var(--color-success-600)',
        boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.1)',
      }
    }
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  const containerStyle = {
    position: 'relative',
    display: 'inline-block',
    width: fullWidth ? '100%' : 'auto',
  };

  const iconContainerStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    [iconPosition === 'left' ? 'left' : 'right']: 'var(--space-3)',
    pointerEvents: 'none',
    zIndex: 'var(--z-10)',
  };

  const handleFocus = (e) => {
    const focusStyles = variantStyles[variant]['&:focus'];
    if (focusStyles) {
      Object.assign(e.target.style, focusStyles);
    }
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    // Reset to default styles
    e.target.style.borderColor = error ? 'var(--color-error-500)' : 'var(--color-primary-600)';
    e.target.style.boxShadow = 'none';
    if (props.onBlur) props.onBlur(e);
  };

  const handleMouseEnter = (e) => {
    if (document.activeElement !== e.target) {
      const hoverStyles = variantStyles[variant]['&:hover'];
      if (hoverStyles) {
        Object.assign(e.target.style, hoverStyles);
      }
    }
  };

  const handleMouseLeave = (e) => {
    if (document.activeElement !== e.target) {
      e.target.style.borderColor = error ? 'var(--color-error-500)' : 'var(--color-primary-600)';
    }
  };

  return (
    <div style={containerStyle}>
      {label && (
        <Label required={required} style={{ marginBottom: 'var(--space-2)' }}>
          {label}
        </Label>
      )}
      
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          style={{
            ...baseStyles,
            ...sizeStyles[size],
            ...style,
          }}
          className={className}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...props}
        />
        
        {icon && (
          <div style={iconContainerStyle}>
            <GameIcon 
              icon={icon} 
              size={iconSizes[size]} 
              color="var(--color-primary-600)" 
            />
          </div>
        )}
      </div>
      
      {error && (
        <div style={{
          color: 'var(--color-error-500)',
          fontSize: 'var(--text-sm)',
          marginTop: 'var(--space-1)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-1)',
        }}>
          <GameIcon icon="zap" size={14} color="var(--color-error-500)" />
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div style={{
          color: 'var(--color-neutral-600)',
          fontSize: 'var(--text-sm)',
          marginTop: 'var(--space-1)',
        }}>
          {helperText}
        </div>
      )}
    </div>
  );
};

// Textarea Component
export const Textarea = ({ 
  size = 'md',
  rows = 4,
  resize = 'vertical',
  label,
  required = false,
  error,
  helperText,
  fullWidth = false,
  className = '',
  style = {},
  ...props 
}) => {
  const baseStyles = {
    fontFamily: 'var(--font-secondary)',
    fontSize: 'var(--text-base)',
    lineHeight: 'var(--leading-normal)',
    borderRadius: 'var(--radius-lg)',
    border: error ? '2px solid var(--color-error-500)' : '2px solid var(--color-primary-600)',
    backgroundColor: 'var(--color-white)',
    color: 'var(--color-primary-800)',
    transition: 'all var(--transition-base)',
    outline: 'none',
    width: fullWidth ? '100%' : 'auto',
    resize: resize,
    minHeight: `${rows * 1.5}rem`,
  };

  const sizeStyles = {
    sm: {
      padding: 'var(--space-3)',
      fontSize: 'var(--text-sm)',
    },
    md: {
      padding: 'var(--space-4)',
      fontSize: 'var(--text-base)',
    },
    lg: {
      padding: 'var(--space-6)',
      fontSize: 'var(--text-lg)',
    }
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = 'var(--color-primary-700)';
    e.target.style.boxShadow = '0 0 0 3px rgba(139, 69, 19, 0.1)';
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = error ? 'var(--color-error-500)' : 'var(--color-primary-600)';
    e.target.style.boxShadow = 'none';
    if (props.onBlur) props.onBlur(e);
  };

  return (
    <div style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <Label required={required} style={{ marginBottom: 'var(--space-2)' }}>
          {label}
        </Label>
      )}
      
      <textarea
        rows={rows}
        style={{
          ...baseStyles,
          ...sizeStyles[size],
          ...style,
        }}
        className={className}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      
      {error && (
        <div style={{
          color: 'var(--color-error-500)',
          fontSize: 'var(--text-sm)',
          marginTop: 'var(--space-1)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-1)',
        }}>
          <GameIcon icon="zap" size={14} color="var(--color-error-500)" />
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div style={{
          color: 'var(--color-neutral-600)',
          fontSize: 'var(--text-sm)',
          marginTop: 'var(--space-1)',
        }}>
          {helperText}
        </div>
      )}
    </div>
  );
};

export default Input;