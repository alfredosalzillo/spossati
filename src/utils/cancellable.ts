export type Cancellable<T> = T & {
  cancel(): void,
};
export const cancellable = <T extends Function>(callback: T): Cancellable<T> => {
  let active = true;
  const fn = (...args: any[]) => {
    if (!active) return undefined;
    if (typeof callback === 'function') return callback(...args);
    return callback;
  };
  fn.cancel = () => {
    active = false;
  };
  return fn as unknown as Cancellable<T>;
};

export default cancellable;
