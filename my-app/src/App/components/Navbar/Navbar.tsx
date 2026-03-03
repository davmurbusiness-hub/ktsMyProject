import logo from "../../../assets/img.png";
import s from './Navbar.module.scss'
import BookmarkIcon from "../icons/BookmarkIcon";
import UserIcon from "../icons/UserIcon";
import cn from "classnames";
import {useNavigate} from "react-router-dom";


export type NavbarProps = {
    actualPage: string;
}

const pages = [
    {name: 'films', value: 'Фильмы'},
    {name: 'trends', value: 'Новинки'},
    {name: 'collections', value: 'Подборки'},
]



const Navbar: React.FC<NavbarProps> = ({actualPage, ...props}) => {
    const size = 30
    const navigate = useNavigate();

    return (
        <div className={s.navbar} {...props}>
            <img className={s.image} onClick={() => {navigate('/') }} src={logo} alt={'logo'}/>
            <div className={s.pages}>
                {pages.map((page) => (
                    <p key={page.name} className={cn(s.page, actualPage === page.name ? s.selected : undefined)}>{page.value}</p>
                ))}

            </div>
            <div className={s.icons}>
                <BookmarkIcon iconType={'stroke'} className={s.icon} width={size} height={size} />
                <UserIcon className={s.icon} width={size} height={size} />
            </div>
        </div>
    )
}

export default Navbar;