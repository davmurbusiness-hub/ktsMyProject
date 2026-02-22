import React from 'react';
import styles from './Input.module.scss';
import cn from "classnames";

export type InputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value'
> & {
    /** Значение поля */
    value: string;
    /** Callback, вызываемый при вводе данных в поле */
    onChange: (value: string) => void;
    /** Слот для иконки справа */
    afterSlot?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ value, onChange, width = 300, height = 52, afterSlot, disabled, className, ...rest }, ref) => {

        const [isFocused, setIsFocused] = React.useState(false);


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

        return (
            <div style={{width: `${width}px`, height: `${height}px`}} className={cn(styles.container, className, disabled && styles.disabled, isFocused && styles.focus)}>
                <input
                    className={styles.input}
                    style={{width: `${typeof width === "number" ?  (width - 20) : 280}px`}}
                    type="text"
                    disabled={disabled}
                    {...rest}
                    ref={ref}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={rest.placeholder}
                />
                {afterSlot && <span className={styles.afterSlot}>{afterSlot}</span>}
            </div>
        );
    }
);

export default Input;