import isPromise from './isPromise'

const defaultTypes = [ 'PENDING', 'FULFILLED', 'REJECTED' ]

export default function promiseMiddleware(config = {}) {
  const promiseTypeSuffixes = config.promiseTypeSuffixes || defaultTypes

  return (_ref) => {
    const dispatch = _ref.dispatch

    return (next) => (action) => {
      // continue onto other middleware if not a promise
      if (!isPromise(action.payload)) {
        return next(action)
      }

      const { type, payload, meta } = action
      const { promise, data } = payload
      // allow configuring of action type suffixes
      const [ PENDING, FULFILLED, REJECTED ] = (meta || {}).promiseTypeSuffixes || promiseTypeSuffixes

      /**
       * Dispatch the first async handler. This tells the
       * reducer that an async action has been dispatched.
       */
      next({
        type: `${type}_${PENDING}`,
        ...!!data && { payload: data },
        ...!!meta && { meta },
      })

      const isThunk = (resolved) => typeof resolved === 'function'
      const getResolvedPartialAction = (isError) => ({
        type: `${type}_${isError ? REJECTED : FULFILLED}`,
        ...!!meta && { meta },
        ...!!isError && { error: true },
      })

      /**
       * Re-dispatch one of:
       *  1. a resolve/rejected action with the resolve/rejected object as a payload
       *  2. a thunk, bound to a resolved/rejected object containing ?meta and type
       */
      promise.then(
        (resolved = {}) => {
          const partialFulfilledAction = getResolvedPartialAction()
          dispatch(
            isThunk(resolved)
              // make a thunk with a partial action
              ? resolved.bind(null, partialFulfilledAction)
              // merge the partial action with the resolved payload if it exists
              : { ...partialFulfilledAction, ...!!resolved && { payload: resolved } }
          )
        },
        (rejected = {}) => {
          const partialRejectAction = getResolvedPartialAction(true)
          dispatch(
            isThunk(rejected)
              // make a thunk with a partial action
              ? rejected.bind(null, partialRejectAction)
              // merge the partial action with the resolved payload if it exists
              : { ...partialRejectAction, ...!!rejected && { payload: rejected } }
          )
        },
      )

      return promise
    }
  }
}
