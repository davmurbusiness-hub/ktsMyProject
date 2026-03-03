import qs from "qs";
import axios, {type AxiosResponse} from "axios";
import type {ApiResponse, Film} from "./ApiTypes.ts";

const STRAPI_BASE_URL = 'https://front-school-strapi.ktsdev.ru';
const STRAPI_URL = `${STRAPI_BASE_URL}/api`;


export default class FetchData {
    static async fetchData(limit = 10, page = 1): Promise<[Film[], AxiosResponse<ApiResponse> | null]> {
        try {
            let filmsList: Film[] = [];

            const query = qs.stringify(
                {
                    populate: ['category', 'poster', 'gallery'],
                    pagination: {
                        page: page,
                        pageSize: limit,
                    }
                },
                { encode: false }
            );

            const response: AxiosResponse<ApiResponse> = await axios.get<ApiResponse>(
                `${STRAPI_URL}/films?${query}`,
            );

            if (response === null) {
                return [[], null];
            }

            for (const film of response.data?.data) {
                filmsList.push(film);
            }

            return [filmsList, response];

        } catch (e) {
            console.error(e);
            return [[], null];
        }
    }

    static async fetchFilm(documentId: string = ''): Promise<Film | null> {
        try {
            const query = qs.stringify(
                {
                    populate: ['category', 'poster', 'gallery'],

                },
                { encode: false }
            );
            const response: AxiosResponse<ApiResponse> = await axios.get<ApiResponse>(
                `${STRAPI_URL}/films/${documentId}?${query}`,
            );

            return response.data.data
        }catch (e){
            console.error(e);
            return null;
        }
    }
}