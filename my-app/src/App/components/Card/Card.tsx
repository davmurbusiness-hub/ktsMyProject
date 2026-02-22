import React from 'react';
import Text from "../Text";
import s from './Card.module.scss'
import cn from "classnames";
import StarIcon from "../icons/StarIcon";
import Button from "../Button";
import {useNavigate} from "react-router-dom";


type Viewport = {
    width: string;
    height: string;
}
export type CardProps = {
    /** Дополнительный classname */
    className?: string,
    /** URL изображения */
    image: string;
    /** Слот над заголовком */
    captionSlot?: React.ReactNode;
    /** Заголовок карточки */
    title: React.ReactNode;
    /** Описание карточки */
    subtitle: React.ReactNode;
    /** Содержимое карточки (футер/боковая часть), может быть пустым */
    contentSlot?: React.ReactNode;
    /** Клик на карточку */
    onClick?: React.MouseEventHandler;
    /** Слот для действия */
    actionSlot?: React.ReactNode;
    viewPort?: Viewport
    rating: number;
    duration: number;

    releaseYear: number;
    category: string;
    ageLimit: number;
};


const Card: React.FC<CardProps> = ({
                                       className = '',
                                       image,
                                       title,
                                       subtitle,
                                       contentSlot,
                                       onClick,
                                       actionSlot,
                                       viewPort,
                                       duration,
                                       rating,
                                       releaseYear,
                                       category,
                                       ageLimit,
                                       ...rest
                                   }) => {

    const hours = Math.trunc(duration / 60);
    const minutes = duration % 60;
    const navigate = useNavigate();

    return (
        <div className={cn(className, s.card)} onClick={onClick} {...rest}>
            <div className={s.cardImage}>
                <span className={cn(s.cardImageInf, s.rating)}>
                    <Text view={"p-20"} weight={'medium'}>{rating}</Text>
                    <StarIcon iconType={"fill"} color={'yellow'}/>
                </span>
                <span className={cn(s.cardImageInf, s.duration)}>{hours}h {minutes}m</span>
                <img src={image}/>
            </div>
            <div className={s.cardContent}>
                <div className={s.cardText}>
                    <span className={s.captionSlot}>
                        <div className={s.captionSlot}>
                            <p>{releaseYear}</p>
                            <span>•</span>
                            <p>{category}</p>
                            <span>•</span>
                            <p>{ageLimit}+</p>
                        </div>
                    </span>
                    <Text className={s.title} view={"p-20"} weight={'medium'} maxLines={2}>{title}</Text>
                    <Text className={s.subtitle} color={"secondary"} view={"p-16"} maxLines={3}>{subtitle}</Text>
                </div>
                <div className={s.cardBottom}>
                    <div className={s.cardButton}>
                        <Button className={s.buttons} outline={true}>В избранное</Button>
                        <Button className={s.buttons} onClick={() => navigate(`/films/${actionSlot}`)} outline={false}>Смотреть</Button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Card;
