import isPromise from './isPromise';

export default function promiseMiddleware() {
  return next => action => {

    /**
     * If the action does not have a promise, then
     * do not use the middleware.
     */
    if (!action.payload.promise || !isPromise(action.payload.promise)) {
      return next(action);
    }

    /**
     * Now that we know the action is using a promise, lets
     * do some setup work. We need to get the meta and types for the
     * pending, fulfilled and rejected actions.
     */
    const { type, meta } = action;
    const { promise, data, onSuccess, onError } = action.payload;

    /**
     * If the middleware is given an array of custom types,
     * then use those types. If the middleware
     * is given a string, e.g., it is given just one type,
     * then append the various statuses to that type.
     */
    if (typeof type === 'array') {

      // Use the array of custom types
      const [
        PENDING,
        FULFILLED,
        REJECTED
      ] = type;

    } else {

      // Use default types
      const PENDING = `${type}_PENDING`;
      const FULFILLED = `${type}_FULFILLED`;
      const REJECTED = `${type}_REJECTED`
    }

    let reject = function(error) {
      return next({
        type: REJECTED
        payload: error,
        error: true,
        meta
      })
    };

    let resolve = function (data) {
      return next({
        type: FULFILLED,
        payload: data,
        meta
      })
    };

    /**
     * Dispatch the first async handler. This tells the
     * reducer that an async action has been dispatched.
     * The payload should include the data from the action
     * so that we can do optimistic updates as needed.
     */
    next({
      type: PENDING,
      payload: data,
      meta
    });

    /**
     * If the user included a schema, use that
     * to check the data for the request to make
     * sure it is correct.
     */
    if (meta.schema) {
      const isDataValid = meta.schema(data);

      if (!isDataValid) {
        return reject(new Error(meta.schema.errors(data)));
      }
    }

    /**
     * Return either the fulfilled action object or the rejected
     * action object.
     */
    return promise.then(
      response => resolve(response),
      error => reject(error)
    ).catch(error => reject(error));
  };
}
