import * as types from '../constants/request';
import * as utils from '../utils/server/resources/post';
import * as Post from '../schema';

export function create(newPost) {
  return {
    type: [
      types.CREATE_POST_PENDING,
      types.CREATE_POST_FULFILLED,
      types.CREATE_POST_REJECTED
    ],
    payload: {
      data: newPost,
      promise: utils.create,
      onSuccess: () => null,
      onError: () => null
    },
    meta: {
      schema: Post.schema
    }
  };
}

export function get(id) {
  return {
    type: [
      types.GET_POST_PENDING,
      types.GET_POST_FULFILLED,
      types.GET_POST_REJECTED
    ],
    payload: {
      data: id,
      promise: utils.get,
      onSuccess: () => null,
      onError: () => null
    }
  };
}
