import type {HydratedDocument} from 'mongoose';
import { Highlight, PopulatedHighlight } from '../highlight/model';

// Update this if you add a property to the Freet type!
type HighlightResponse = {
  _id: string;
  freetId: string;
  highlighted: boolean;
};

/**
 * Transform a raw Highlight object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Highlight>} highlight - A freet
 * @returns {HighlightResponse} - The freet object formatted for the frontend
 */
const constructHighlightResponse = (highlight: HydratedDocument<Highlight>): HighlightResponse => {
  const highlightCopy: PopulatedHighlight = {
    ...highlight.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {_id} = highlightCopy.freetId;
  delete highlightCopy.freetId;
  return {
    ...highlightCopy,
    _id: highlightCopy._id.toString(),
    freetId: _id.toString(),
  };
};

export {
  constructHighlightResponse
};
