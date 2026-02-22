import * as React from 'react'
import styles from './Icon.module.scss'
import cn from 'classnames'

export type IconProps = React.SVGAttributes<SVGElement> & {
    className?: string;
    color?: 'primary' | 'secondary' | 'accent' | 'yellow' | 'disabled';
    iconType?: 'fill' | 'stroke';
};

const Icon: React.FC<React.PropsWithChildren<IconProps>> = ({
                                                                className,
                                                                color,
                                                                children,
                                                                width = 24,
                                                                height = 24,
                                                                iconType = 'fill',
                                                                ...props
                                                            }) => {


    return (
        <svg
            {...props}
            width={width}
            height={height}
            fill={iconType === 'fill' ? "currentColor" : "none"}
            stroke={iconType === 'stroke' ? "currentColor" : "none"}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            className={cn(styles.icon, color && styles[`icon_color_${color}`], className)}
        >
            {children}
        </svg>
    );


}


export default Icon;
