import React, { useState, useRef, useEffect, useMemo } from 'react';
import Input from '../Input';
import s from './MultiDropdown.module.scss';
import cn from 'classnames';
import ArrowDownIcon from '../icons/ArrowDownIcon';

export type Option = {
  /** Ключ варианта, используется для отправки на бек/использования в коде */
  key: string;
  /** Значение варианта, отображается пользователю */
  value: string;
};

/** Пропсы, которые принимает компонент Dropdown */
export type MultiDropdownProps = {
  className?: string;
  /** Массив возможных вариантов для выбора */
  options: Option[];
  /** Текущие выбранные значения поля, может быть пустым */
  value: Option[];
  /** Callback, вызываемый при выборе варианта */
  onChange: (value: Option[]) => void;
  /** Заблокирован ли дропдаун */
  disabled?: boolean;
  /** Возвращает строку которая будет выводится в инпуте. В случае если опции не выбраны, строка должна отображаться как placeholder. */
  getTitle: (value: Option[]) => string;
};

const MultiDropdown: React.FC<MultiDropdownProps> = ({
  className,
  options,
  value,
  onChange,
  disabled = false,
  getTitle,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchText('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchText) return options;
    const lowerSearch = searchText.toLowerCase();
    return options.filter((option) => option.value.toLowerCase().includes(lowerSearch));
  }, [options, searchText]);

  const handleInputChange = (text: string) => {
    if (disabled) return;
    setSearchText(text);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleOptionClick = (option: Option) => {
    if (disabled) return;
    const isSelected = value.some((v) => v.key === option.key);
    const newValue = isSelected ? value.filter((v) => v.key !== option.key) : [...value, option];
    onChange(newValue);
  };

  const handleFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  // Получаем текст для placeholder, когда ничего не выбрано
  const placeholderText = getTitle([]);

  // Значение для инпута зависит от состояния
  const inputValue = isOpen ? searchText : value.length ? getTitle(value) : '';

  return (
    <div ref={wrapperRef} className={cn(className, s.multiDropdown)}>
      <Input
        value={inputValue}
        placeholder={placeholderText}
        onChange={handleInputChange}
        disabled={disabled}
        onFocus={handleFocus}
        afterSlot={<ArrowDownIcon className={s.arrow} />}
        {...rest}
      />
      {!disabled && isOpen && (
        <div className={s.options}>
          {filteredOptions.map((option) => {
            const selected = value.some((v) => v.key === option.key);
            return (
              <div
                key={option.key}
                className={cn(s.option, selected && s.selected)}
                onClick={() => handleOptionClick(option)}
              >
                <p style={{ pointerEvents: 'none' }}>{option.value}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiDropdown;
