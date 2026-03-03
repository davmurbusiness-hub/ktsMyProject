import React from 'react';
import Loader from '../Loader';
import s from './Button.module.scss';
import Text from '../Text';
import cn from 'classnames';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Состояние загрузки */
  loading?: boolean;
  /** Текст кнопки */
  children: React.ReactNode;
  outline?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  loading,
  children,
  className = '',
  disabled,
  onClick,
  outline = false,
  ...rest
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseDown = () => setIsActive(true);
  const handleMouseUp = () => setIsActive(false);

  const handleTouchStart = () => setIsActive(true);
  const handleTouchEnd = () => setIsActive(false);
  const handleTouchCancel = () => setIsActive(false); // Отмена касания
  return (
    <button
      className={cn(className, s.button, disabled && s.button_disabled, outline && s.outline)}
      disabled={disabled || loading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onClick={onClick}
      {...rest}
    >
      {loading && <Loader className={cn(outline && s[`loader_red`])} size={'s'}></Loader>}
      <Text
        view={'button'}
        weight={'normal'}
        className={cn(
          s[`text-button${outline && '-outline'}`],
          isHovered && s['text-button-white'],
          isActive && s['text-button-white']
        )}
      >
        {children}
      </Text>
    </button>
  );
};

export default Button;
