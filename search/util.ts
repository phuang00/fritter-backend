import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Search, PopulatedSearch} from '../search/model';

// Update this if you add a property to the Search type!
type SearchResponse = {
  _id: string;
  user: string;
  dateCreated: string;
  input: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Search object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Search>} search - A search
 * @returns {SearchResponse} - The search object formatted for the frontend
 */
const constructSearchResponse = (search: HydratedDocument<Search>): SearchResponse => {
  const searchCopy: PopulatedSearch = {
    ...search.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = searchCopy.userId;
  delete searchCopy.userId;
  return {
    ...searchCopy,
    _id: searchCopy._id.toString(),
    user: username,
    dateCreated: formatDate(search.dateCreated),
  };
};

export {
  constructSearchResponse
};
