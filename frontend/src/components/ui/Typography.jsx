import React from 'react';
import GameIcon from '../GameIcon';

// Heading Component
export const Heading = ({ 
  level = 1,
  size = 'auto',
  icon,
  iconPosition = 'left',
  align = 'left',
  color = 'inherit',
  className = '',
  style = {},
  children,
  ...props 
}) => {
  const Tag = `h${level}`;
  
  // Auto size based on heading level if not specified
  const autoSize = {
    1: '5xl',
    2: '3xl', 
    3: '2xl',
    4: 'xl',
    5: 'lg',
    6: 'base'
  };

  const actualSize = size === 'auto' ? autoSize[level] : size;

  const sizeStyles = {
    xs: { fontSize: 'var(--text-xs)', lineHeight: 'var(--leading-tight)' },
    sm: { fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-tight)' },
    base: { fontSize: 'var(--text-base)', lineHeight: 'var(--leading-tight)' },
    lg: { fontSize: 'var(--text-lg)', lineHeight: 'var(--leading-tight)' },
    xl: { fontSize: 'var(--text-xl)', lineHeight: 'var(--leading-tight)' },
    '2xl': { fontSize: 'var(--text-2xl)', lineHeight: 'var(--leading-tight)' },
    '3xl': { fontSize: 'var(--text-3xl)', lineHeight: 'var(--leading-tight)' },
    '4xl': { fontSize: 'var(--text-4xl)', lineHeight: 'var(--leading-tight)' },
    '5xl': { fontSize: 'var(--text-5xl)', lineHeight: 'var(--leading-tight)' },
    '6xl': { fontSize: 'var(--text-6xl)', lineHeight: 'var(--leading-tight)' },
  };

  const baseStyles = {
    fontFamily: 'var(--font-primary)',
    fontWeight: 'var(--font-bold)',
    margin: 0,
    marginBottom: 'var(--space-4)',
    color: color === 'inherit' ? 'inherit' : `var(--color-${color})`,
    textAlign: align,
    display: icon ? 'flex' : 'block',
    alignItems: icon ? 'center' : 'initial',
    justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
    gap: icon ? 'var(--space-3)' : 0,
    flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row',
  };

  const iconSizes = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 40,
  };

  return (
    <Tag
      style={{
        ...baseStyles,
        ...sizeStyles[actualSize],
        ...style,
      }}
      className={className}
      {...props}
    >
      {icon && (
        <GameIcon 
          icon={icon} 
          size={iconSizes[actualSize]} 
          color="currentColor" 
        />
      )}
      {children}
    </Tag>
  );
};

// Text Component
export const Text = ({ 
  size = 'base',
  weight = 'normal',
  color = 'inherit',
  align = 'left',
  className = '',
  style = {},
  children,
  ...props 
}) => {
  const sizeStyles = {
    xs: { fontSize: 'var(--text-xs)', lineHeight: 'var(--leading-normal)' },
    sm: { fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-normal)' },
    base: { fontSize: 'var(--text-base)', lineHeight: 'var(--leading-normal)' },
    lg: { fontSize: 'var(--text-lg)', lineHeight: 'var(--leading-relaxed)' },
    xl: { fontSize: 'var(--text-xl)', lineHeight: 'var(--leading-relaxed)' },
    '2xl': { fontSize: 'var(--text-2xl)', lineHeight: 'var(--leading-relaxed)' },
  };

  const weightStyles = {
    light: { fontWeight: 'var(--font-light)' },
    normal: { fontWeight: 'var(--font-normal)' },
    medium: { fontWeight: 'var(--font-medium)' },
    semibold: { fontWeight: 'var(--font-semibold)' },
    bold: { fontWeight: 'var(--font-bold)' },
    extrabold: { fontWeight: 'var(--font-extrabold)' },
  };

  const baseStyles = {
    fontFamily: 'var(--font-secondary)',
    margin: 0,
    marginBottom: 'var(--space-4)',
    color: color === 'inherit' ? 'inherit' : `var(--color-${color})`,
    textAlign: align,
  };

  return (
    <p
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...weightStyles[weight],
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </p>
  );
};

// Label Component
export const Label = ({ 
  size = 'sm',
  weight = 'semibold',
  color = 'primary-800',
  required = false,
  className = '',
  style = {},
  children,
  ...props 
}) => {
  const sizeStyles = {
    xs: { fontSize: 'var(--text-xs)' },
    sm: { fontSize: 'var(--text-sm)' },
    base: { fontSize: 'var(--text-base)' },
  };

  const weightStyles = {
    normal: { fontWeight: 'var(--font-normal)' },
    medium: { fontWeight: 'var(--font-medium)' },
    semibold: { fontWeight: 'var(--font-semibold)' },
    bold: { fontWeight: 'var(--font-bold)' },
  };

  const baseStyles = {
    fontFamily: 'var(--font-secondary)',
    display: 'block',
    margin: 0,
    marginBottom: 'var(--space-2)',
    color: `var(--color-${color})`,
    lineHeight: 'var(--leading-tight)',
  };

  return (
    <label
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...weightStyles[weight],
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
      {required && <span style={{ color: 'var(--color-error-500)', marginLeft: 'var(--space-1)' }}>*</span>}
    </label>
  );
};