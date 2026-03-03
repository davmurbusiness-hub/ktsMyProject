import * as React from 'react';
import s from './Text.module.scss';
import cn from 'classnames';

export type TextProps = {
  /** Дополнительный класс */
  className?: string;
  /** Стиль отображения */
  view?: 'title' | 'button' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
  /** Html-тег */
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
  /** Начертание шрифта */
  weight?: 'normal' | 'medium' | 'bold';
  /** Контент */
  children: React.ReactNode;
  /** Цвет */
  color?: 'primary' | 'secondary' | 'accent';
  /** Максимальное кол-во строк */
  maxLines?: number;
};
const Text: React.FC<TextProps> = ({
  className = '',
  view,
  tag = 'p',
  weight,
  color,
  maxLines,
  children,
}) => {
  const Element = tag;

  const style: React.CSSProperties = {};
  if (weight) {
    style.fontWeight = weight;
    if (weight === 'medium') {
      style.fontWeight = '500';
    }
  }
  if (maxLines) {
    style.WebkitLineClamp = maxLines;
  }

  return (
    <Element
      style={style}
      className={cn(s.clamp, view && s[view], className, color && s[`color_${color}`])}
    >
      {children}
    </Element>
  );
};

export default Text;
