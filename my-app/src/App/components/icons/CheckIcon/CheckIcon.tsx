import * as React from 'react'
import Icon, {type IconProps} from "../Icon";

const CheckIcon: React.FC<IconProps> = (props) => {
    return (
        <Icon {...props} iconType={'stroke'} viewBox="0 0 24 24">
            <path d="M0.73584 5.29006L6.61339 11.6772L16.7358 0.677155"
                  stroke="currentColor" stroke-width="2"/>

        </Icon>
    )
}


export default CheckIcon;


