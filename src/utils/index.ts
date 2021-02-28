import { Model } from 'mongoose';
import { RecipeDocument, IngredientDocument } from '../types';
export const paginatedQuery = async (
  model: Model<RecipeDocument | IngredientDocument>,
  limit: number,
  cursor: string
) => {
  // determines whether there is more to fetch
  let isMore = false;

  // default fetch newest recipes if no cursor passed
  let cursorQuery = {};

  // fetch recipes older (less than) cursor recipe
  if (cursor) {
    cursorQuery = { _id: { $lt: cursor } };
  }

  // fetches 1 more then limit to check if there is more
  let nodes = await model
    .find(cursorQuery)
    .sort({ _id: -1 })
    .limit(limit + 1);

  // trims the last one
  if (nodes.length > limit) {
    isMore = true;
    nodes = nodes.slice(0, -1);
  }

  const newCursor = nodes[nodes.length - 1]._id;

  return {
    nodes,
    cursor: newCursor,
    isMore,
  };
};

// export const paginatedArray = (array: [], limit: number, cursor: string) => {
//   let isMore = false;

//   function compare(a, b) {
//     return a.id - b.id;
//   }

//   console.log(array);
//   let sorted = array.sort(compare);

//   let nodes = sorted.splice(
//     sorted.map((e) => e.id).indexOf(cursor) || 0,
//     sorted.length - limit + 1
//   );

//   if (nodes.length > limit) {
//     isMore = true;
//     nodes = sortedArray.slice(0, -1);
//   }
//   console.log(sorted);
//   console.log(nodes);
//   const newCursor = nodes[nodes.length - 1]._id;

//   return {
//     nodes,
//     cursor: newCursor,
//     isMore,
//   };
// };
