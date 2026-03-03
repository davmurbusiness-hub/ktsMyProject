import Navbar from "../../components/Navbar";
import Text from "../../components/Text";
import s from "./FilmsList.module.scss"
import MultiDropdown, {type Option} from "../../components/MultiDropdown";
import Input from "../../components/Input";
import {useEffect, useRef, useState} from "react";
import Button from "../../components/Button";
import Card from "../../components/Card";
import {useFetching} from "../../hooks/useFetching.ts";
import FetchData from "../../api/FetchData.ts";
import type {Film} from "../../api/ApiTypes.ts";
import Loader from "../../components/Loader";
import {useObserver} from "../../hooks/useObserver.ts";


const FilmsList = (props: any) => {

    const [films, setFilms] = useState<Film[] | []>([])
    const [totalFilms, setTotalFilms] = useState<number>(0)
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limitChanged, setLimitChanged] = useState(false);
    const lastElement = useRef<HTMLDivElement>(null);
    const [infScrollTrigger, setInfScrollTrigger] = useState(false);


    const [fetchFilms, isDataLoading, loadError] = useFetching(async (limit, page) => {
            const [newFilms, response] = await FetchData.fetchData(limit, page)
            if (response === null) {
                return
            }
            setFilms([...films, ...newFilms]);
            setTotalPages(response.data.meta.pagination.pageCount);
            setTotalFilms(response.data.meta.pagination.total)
        }
    )


    useEffect(() => {
        setFilms([])
        setPage(1)
        setLimitChanged(true)
    }, [limit]);


    useEffect(() => {
        if (infScrollTrigger || limitChanged) {
            fetchFilms(limit, page);
            setLimitChanged(false);
        }
        setInfScrollTrigger(false);

    }, [page, limitChanged]);


    useObserver(lastElement, !limitChanged && page < totalPages, isDataLoading, () => {
        setPage(prev => prev + 1);
        setInfScrollTrigger(true)
    })


    const [selectedValues, setSelectedValues] = useState<Option[]>([]);


    const getDropdownTitle = (value: Option[]): string => {
        if (value.length === 0) {
            return "Select options"; // or your placeholder text
        }
        return value.map(v => v.value).join(', '); // or any format you prefer
    };


    return (
        <div className={s.page} {...props}>

            <Navbar actualPage={"films"}/>
            <div className={s.container}>
                <div className={s.frameText}>
                    <Text tag={"h1"}>Cinema</Text>
                    <Text view={"p-20"} color={"secondary"}>Подборка для вечера уже здесь: фильмы, сериалы и
                        новинки. <br/>
                        Найди что посмотреть — за пару секунд.</Text>
                </div>

                <div className={s.searchSection}>
                    <div className={s.paramsSection}>
                        <div className={s.search}>
                            <Input
                                width={800}
                                placeholder={"Искать фильм"}
                                value={""}
                                onChange={() => {
                                }}/>
                            <Button className={s.findButton}>Найти</Button>
                        </div>
                        <MultiDropdown
                            value={selectedValues}
                            onChange={() => {
                            }}
                            options={[]}
                            getTitle={getDropdownTitle}
                        />
                    </div>
                    <div className={s.paginationSection}>
                        <div className={s.allFilms}>
                            <p style={{fontWeight: 'bold', fontSize: 32}}>Все фильмы</p>
                            {!isDataLoading && <Text color={'accent'} view={'p-20'}>{totalFilms}</Text>}
                        </div>
                        <div>
                            <Input value={limit.toString()} onChange={value => {
                                setLimit(Number(value))
                            }}/>
                        </div>
                    </div>


                    <div className={s.listOfFilms}>
                        {films.map((film) => (
                            <Card
                                key={film.documentId}
                                title={film.title}
                                subtitle={film.shortDescription}
                                image={film.gallery[0].url}
                                rating={film.rating}
                                releaseYear={film.releaseYear}
                                ageLimit={film.ageLimit}
                                category={film.category.title}
                                duration={film.duration}
                                actionSlot={film.documentId}
                            />
                        ))}
                    </div>
                    {isDataLoading && <Loader className={s.loader}/>}
                    <div ref={lastElement} style={{color: "red", width: '20px', height: "20px"}}/>

                </div>
                {/*<Outlet/>*/}
            </div>
        </div>
    )
}

export default FilmsList