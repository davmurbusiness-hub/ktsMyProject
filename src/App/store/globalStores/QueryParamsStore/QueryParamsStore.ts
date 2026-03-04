import { action, computed, makeObservable, observable } from 'mobx';
import qs from 'qs';

type PrivateFields = '_params';

export default class QueryParamsStore {
  private _params: qs.ParsedQs = {};

  constructor() {
    makeObservable<QueryParamsStore, PrivateFields>(this, {
      _params: observable.ref,

      search: computed,
      categories: computed,
      queryString: computed,

      setSearch: action,
      setParams: action,
    });
  }

  get search(): string {
    const value = this._params.search;
    return typeof value === 'string' ? value : '';
  }

  get categories(): string[] {
    const value = this._params.categories;

    if (Array.isArray(value)) {
      return value.map(String);
    }

    if (typeof value === 'string') {
      return [value];
    }

    return [];
  }

  get queryString(): string {
    return qs.stringify(this._params, {
      encode: false,
      skipNulls: true,
      arrayFormat: 'repeat',
    });
  }

  setParams(next: Record<string, unknown>): void {
    const merged = { ...this._params, ...next };

    const cleaned = Object.fromEntries(
      Object.entries(merged).filter(([value]) => {
        if (typeof value === 'string' && value.trim() === '') return false;
        return !(Array.isArray(value) && value.length === 0);
      })
    ) as qs.ParsedQs;

    const newQuery = qs.stringify(cleaned, {
      encode: false,
      skipNulls: true,
      arrayFormat: 'repeat',
    });

    const currentQuery = this.queryString;

    if (newQuery !== currentQuery) {
      this._params = cleaned;
      window.history.pushState(null, '', newQuery ? `?${newQuery}` : window.location.pathname);
    }
  }

  setSearch(search: string): void {
    const normalized = search.startsWith('?') ? search.slice(1) : search;

    this._params = qs.parse(normalized, {
      ignoreQueryPrefix: false,
    });
  }
}
