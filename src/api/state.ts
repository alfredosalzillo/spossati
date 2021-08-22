import { createDispatcher } from 'lego';

type State = {
  year: number,
  month: number
};
const reducer = () => ({
  year: () => Promise.resolve(1),
  month: (n: number) => Promise.resolve(n),
});

const dispatch = createDispatcher(reducer);

dispatch('year');
dispatch('month', 1);
