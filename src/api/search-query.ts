import { StringParam, useQueryParam, withDefault } from 'use-query-params';

// eslint-disable-next-line import/prefer-default-export
export const useSearchQuery = () => useQueryParam('q', withDefault(StringParam, ''));
