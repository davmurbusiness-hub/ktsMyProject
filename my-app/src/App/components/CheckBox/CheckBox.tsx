import React, {useState} from 'react';
import CheckIcon from "../icons/CheckIcon";
import s from './CheckBox.module.scss'
import cn from "classnames";

export type CheckBoxProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange'
> & {
    /** Вызывается при клике на чекбокс, передаёт новое состояние */
    onChange: (checked: boolean) => void;
};

export const CheckBox: React.FC<CheckBoxProps> = ({className, onChange, checked, disabled, ...rest}) => {
    const [check, setCheck] = useState(checked)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);
        setCheck(!check)
    };


    return (
        <div style={{position: 'relative'}}>
            <input className={cn(className, s.checkBox)} type="checkbox" checked={check}
                   disabled={disabled}
                   onChange={handleChange} {...rest} style={{}}/>

            {check && <CheckIcon
              width={40}
              height={40}
              color={disabled ? 'disabled' : 'accent'}
              style={{
                  position: "absolute",
                  pointerEvents: "none",

              }}/>}
        </div>
    )
};

export default CheckBox;