import type { Film } from 'types/FilmType';
import type { Category } from 'types/CategoryType';

export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
}

export type RegisterUser = {
  id: number;
  username: string;
  email: string;
};

export type RegisterSuccessResponse = {
  user: string;
  jwt: string;
};

export type RequestParams<ReqT> = {
  method: HTTPMethod;
  endpoint: string;
  headers: Record<string, string>;
  data: ReqT;
};

export enum StatusHTTP {
  status200 = 200,
  status201 = 201,
  status300 = 300,
  status304 = 304,
  status400 = 400,
  status401 = 401,
  status403 = 403,
  status404 = 404,
  status422 = 422,
  UNEXPECTED_ERROR = 'UNEXPECTED ERROR',
}

export type ApiResponse<SuccessT, ErrorT> =
  | {
      success: true;
      data: SuccessT;
      status: StatusHTTP;
    }
  | {
      success: false;
      data: ErrorT;
      status: StatusHTTP;
    }
  | {
      success: false;
      data: null;
      status: StatusHTTP;
    };

export type FavoriteAddResponse = {
  created_at: string;
  documentId: string;
  film: Film;
  id: number;
  locale: string;
  originalFilmId: number;
  publishedAt: string;
  updatedAt: string;
};

export type FilmDataFromResponse = {
  data: Film | Film[];
  meta: MetaFromResponse;
};

export type CategoryDataFromResponse = {
  data: Category[];
  meta: MetaFromResponse;
};

export type MetaFromResponse = {
  pagination: {
    page: number;
    pageCount: number;
    total: number;
  };
};

export type IApiStore = {
  readonly baseUrl: string;

  request<SuccessT, ErrorT = unknown, ReqT = Record<string, unknown>>(
    params: RequestParams<ReqT>
  ): Promise<ApiResponse<SuccessT, ErrorT>>;
};

export type Filters = {
  title?: { $containsi: string };
  category?: { id: { $in: number[] } };
};

export type QueryParams = {
  populate: string[];
  pagination: {
    page: number;
    pageSize: number;
  };
  filters?: Filters;
};
