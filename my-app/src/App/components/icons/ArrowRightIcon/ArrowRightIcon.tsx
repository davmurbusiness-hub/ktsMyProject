import * as React from 'react'
import Icon, {type IconProps} from '../Icon';

const ArrowRightIcon: React.FC<IconProps> = (props) => {
    return (
        <Icon {...props} iconType={"stroke"} viewBox={"0 0 24 24"}>
                <path d="M8.90997 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.90997 4.07999"
                      stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"
                      stroke-linecap="round" stroke-linejoin="round"/>
        </Icon>

    )


}


export default ArrowRightIcon;
