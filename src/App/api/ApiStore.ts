import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { stringify } from 'qs';

import {
  type ApiResponse as ApiResponseType,
  type IApiStore,
  type RequestParams,
  HTTPMethod,
  StatusHTTP,
  type QueryParams,
  type Filters,
} from './ApiTypes';

import type {
  FilmDataFromResponse,
  CategoryDataFromResponse,
  FavoriteAddResponse,
} from './ApiTypes';

import type { Film } from 'types/FilmType';

const LIMIT = 10;

export default class ApiStore implements IApiStore {
  readonly baseUrl: string;
  private readonly api: AxiosInstance;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;

    this.api = axios.create({
      baseURL: `${baseUrl}/api`,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
  }

  // Универсальный request

  async request<SuccessT, ErrorT = unknown, ReqT = Record<string, unknown>>(
    params: RequestParams<ReqT>,
    signal?: AbortSignal
  ): Promise<ApiResponseType<SuccessT, ErrorT>> {
    try {
      const config: AxiosRequestConfig = {
        url: params.endpoint,
        method: params.method,
        headers: params.headers,
        signal,
      };

      if (params.method === HTTPMethod.GET && params.data) {
        config.params = params.data;
        config.paramsSerializer = {
          serialize: (p) => stringify(p, { encode: false }),
        };
      }

      if (params.method === HTTPMethod.POST) {
        config.data = params.data;
      }

      const response = await this.api.request<SuccessT>(config);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        return {
          success: false,
          data: (error.response?.data ?? null) as ErrorT,
          status: error.response?.status ?? StatusHTTP.UNEXPECTED_ERROR,
        };
      }

      return {
        success: false,
        data: null,
        status: StatusHTTP.UNEXPECTED_ERROR,
      };
    }
  }

  // AUTH

  async login(
    identifier: string,
    password: string
  ): Promise<{ user: unknown; jwt: string } | null> {
    if (!identifier || !password) return null;

    const response = await this.request<{ user: unknown; jwt: string }>({
      endpoint: '/auth/local',
      method: HTTPMethod.POST,
      headers: {},
      data: { identifier, password },
    });

    if (!response.success || !response.data.user || !response.data.jwt) {
      return null;
    }

    return response.data;
  }

  async register(
    username: string,
    email: string,
    password: string,
    signal?: AbortSignal
  ): Promise<{ user: unknown; jwt: string } | null> {
    if (!username || !email || !password) return null;

    const response = await this.request<{ user: unknown; jwt: string }>(
      {
        endpoint: '/auth/local/register',
        method: HTTPMethod.POST,
        headers: {},
        data: { username, email, password },
      },
      signal
    );

    if (!response.success || !response.data.user || !response.data.jwt) {
      return null;
    }

    return response.data;
  }

  // FAVORITES

  async fetchGetFavorites(token: string): Promise<FavoriteAddResponse[] | null> {
    const response = await this.request<FavoriteAddResponse[]>({
      endpoint: '/film-favorites',
      method: HTTPMethod.GET,
      headers: { Authorization: `Bearer ${token}` },
      data: {},
    });

    return response.success ? response.data : null;
  }

  async fetchAddFavorites(token: string, filmId: number) {
    const response = await this.request<FavoriteAddResponse>({
      endpoint: '/film-favorites/add',
      method: HTTPMethod.POST,
      headers: { Authorization: `Bearer ${token}` },
      data: { film: filmId },
    });

    return response.success ? response.data : null;
  }

  async fetchRemoveFavorites(token: string, filmId: number) {
    const response = await this.request<FilmDataFromResponse>({
      endpoint: '/film-favorites/remove',
      method: HTTPMethod.POST,
      headers: { Authorization: `Bearer ${token}` },
      data: { film: filmId },
    });

    return response.success ? response.data : null;
  }

  // CATEGORIES

  async fetchCategories(): Promise<CategoryDataFromResponse | null> {
    const response = await this.request<CategoryDataFromResponse>({
      endpoint: '/film-categories',
      method: HTTPMethod.GET,
      headers: {},
      data: {},
    });

    return response.success ? response.data : null;
  }

  // FILMS LIST

  async fetchData(
    page = 1,
    params?: {
      signal?: AbortSignal;
      searchValue: string;
      selectedCategories: number[];
    }
  ): Promise<FilmDataFromResponse | null> {
    const query: QueryParams = {
      populate: ['category', 'poster', 'gallery'],
      pagination: {
        page,
        pageSize: LIMIT,
      },
    };

    const filters: Filters = {};

    if (params?.searchValue.trim()) {
      filters.title = { $containsi: params.searchValue };
    }

    if (params?.selectedCategories.length) {
      filters.category = { id: { $in: params.selectedCategories } };
    }

    if (Object.keys(filters).length > 0) {
      query.filters = filters;
    }

    const response = await this.request<FilmDataFromResponse>(
      {
        endpoint: '/films',
        method: HTTPMethod.GET,
        headers: {},
        data: query,
      },
      params?.signal
    );

    return response.success ? response.data : null;
  }

  // SINGLE FILM

  async fetchFilm(documentId: string, signal?: AbortSignal): Promise<Film | null> {
    if (!documentId.trim()) return null;

    const query = {
      populate: ['category', 'poster', 'gallery'],
    };

    const response = await this.request<FilmDataFromResponse>(
      {
        endpoint: `/films/${encodeURIComponent(documentId)}`,
        method: HTTPMethod.GET,
        headers: {},
        data: query,
      },
      signal
    );

    if (!response.success) {
      return null;
    }

    const data = response.data.data;

    return Array.isArray(data) ? (data[0] ?? null) : data;
  }
}
