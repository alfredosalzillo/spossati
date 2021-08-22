import {
  StringParam, useQueryParams,
} from 'use-query-params';

// eslint-disable-next-line import/prefer-default-export
export const useSearchParams = () => useQueryParams({
  q: StringParam,
  place_id: StringParam,
});
