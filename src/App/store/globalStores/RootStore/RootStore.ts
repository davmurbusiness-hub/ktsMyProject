import AuthStore from '../AuthStore/AuthStore';
import QueryParamsStore from '../QueryParamsStore/QueryParamsStore';

export default class RootStore {
  readonly query = new QueryParamsStore();
  readonly auth = new AuthStore();
}
