import * as React from 'react'
import Icon, {type IconProps} from "../Icon";

const StarIcon: React.FC<IconProps> = (props) => {
    return (
        <Icon {...props} viewBox="0 0 24 24">
                <path d="M10.75 0.75L13.84 7.01L20.75 8.02L15.75 12.89L16.93 19.77L10.75
                16.52L4.57 19.77L5.75 12.89L0.75 8.02L7.66 7.01L10.75 0.75Z"
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </Icon>
    )
}


export default StarIcon;


