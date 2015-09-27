import schema from 'js-schema';
import { PropTypes } from 'react';

/*
 * @function create
 * @description Creates the valid object structure sent to the server
 * to create a post. This function accepts an array because the JSON
 * API standard uses arrays in the request body. However, in most
 * cases your array will usually have a length of one since
 * you are just creating one post.
 * @param posts {array} The data to be sent in the request
 * @returns {object} The valid request body
 */
export function create(posts) {
  return {
    data: posts.map(post => {
      return {
        type: 'posts',
        attributes: {
          text: post.text,
          type: post.type,
          location: post.location
        }
      };
    })
  };
}

/*
 * @function validate
 * @descriptions Validates that all properties are the correct type.
 * @returns {boolean}
 */
export function validate() {
  return schema({
    text: String,
    type: ['text', 'photo'],
    location: String,
    segment_id: String
  });
}

/*
 * @function propTypes
 * @description The React prop types for a post.
 */
export function propTypes() {
  return PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.oneOf(['posts']),
    attributes: PropTypes.shape({
      created_at: PropTypes.string,
      location: PropTypes.string,
      post_id: PropTypes.string,
      segment_id: PropTypes.string,
      text: PropTypes.string,
      updated_at: PropTypes.string,
      poster_id: PropTypes.string
    })
  });
}
