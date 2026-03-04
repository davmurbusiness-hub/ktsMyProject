import React from 'react';
import styles from './Input.module.scss';
import cn from 'classnames';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  /** Значение поля */
  value: string;
  /** Callback, вызываемый при вводе данных в поле */
  onChange: (value: string) => void;
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, afterSlot, disabled, className, ...rest }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      rest.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      rest.onBlur?.(e);
    };

    // Обработчик клика по иконке
    const handleSlotClick = () => {
      if (!disabled && inputRef.current) {
        inputRef.current.focus();
      }
    };

    return (
      <div
        className={cn(
          className ? className : styles.defaultWidth,
          styles.container,
          disabled && styles.disabled,
          isFocused && styles.focus
        )}
      >
        <input
          className={styles.input}
          type="text"
          disabled={disabled}
          {...rest}
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={rest.placeholder}
        />
        {afterSlot && (
          <span className={styles.afterSlot} onClick={handleSlotClick}>
            {afterSlot}
          </span>
        )}
      </div>
    );
  }
);

export default Input;
