import Navbar from "../../components/Navbar";
import {useFetching} from "../../hooks/useFetching.ts";
import FetchData from "../../api/FetchData.ts";
import {useEffect, useState, type Key} from "react";
import type {Film} from "../../api/ApiTypes.ts";
import Text from "../../components/Text";
import {useNavigate, useParams} from "react-router-dom";
import Loader from "../../components/Loader";
import ArrowRightIcon from "../../components/icons/ArrowRightIcon";
import s from './FilmPage.module.scss'
import StarIcon from "../../components/icons/StarIcon";
import cn from "classnames";

const FilmPage = (props: any) => {

    const [film, setFilm] = useState<Film>();
    const {documentId} = useParams();
    const navigate = useNavigate();


    const [fetch, loading, errors] = useFetching(async () => {
        const tmpFilm = await FetchData.fetchFilm(documentId)
        if (tmpFilm) {
            setFilm(tmpFilm)
        }
    });


    useEffect(() => {
        fetch()
    }, [])


    return (
        <div {...props}>

            <Navbar actualPage={"films"}/>

            <div className={s.back} onClick={() => {
                navigate(-1)
            }}>
                <ArrowRightIcon width={32} height={32} className={s.icon}/>
                <Text view={"p-20"}>Назад</Text>
            </div>


            {loading ? (<Loader/>) :
                <div className={s.content}>
                    <div className={s.film}>
                        <video controls width="800" height="450">
                            <source src={film?.trailerUrl} type="video/mp4"/>
                            Your browser does not support the video tag.
                        </video>
                        <div className={s.info}>
                            <div className={s.title}>
                                <Text tag={"h2"}>{film?.title}</Text>
                                <span className={cn(s.cardImageInf, s.rating)}>
                                    <Text view={"p-20"} weight={'medium'}>{film?.rating}</Text>
                                    <StarIcon iconType={"fill"} color={'yellow'}/>
                                </span>
                            </div>
                            <div className={s.captionSlot}>
                                <p>{film?.releaseYear}</p>
                                <span>•</span>
                                <p>{film?.category.title}</p>
                                <span>•</span>
                                <p>{film?.ageLimit}+</p>
                                <span>•</span>
                                <span>{film && Math.trunc(film?.duration / 60)}ч {film && film?.duration % 60}</span>
                            </div>
                            <Text className={s.decriprion}>{film?.description}</Text>
                        </div>
                    </div>
                    <div className={s.gallery}>
                        <Text view={"title"}>Изображения</Text>
                        <div>
                            {film?.gallery?.map((item: { formats: { thumbnail: { url: string | undefined; }; }; id: Key | null | undefined; }) => (
                                <img src={item.formats.thumbnail.url} key={item.id} alt="" />
                            ))}
                        </div>

                    </div>
                </div>}
            {errors && <>{errors}</>}
        </div>
    )
}

export default FilmPage