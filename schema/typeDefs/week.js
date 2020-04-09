const { gql } = require('apollo-server-express');

module.exports = dayplan = gql`
  extend type Query {
    getWeek(id: ID!): Week
    getMeal(id: ID!): Meal
  }

  extend type Mutation {
    addMeal(week: ID!, day: String!, recipe: ID!, label: String!): Meal
    removeMeal(meal: ID!): Meal
  }

  type Week {
    id: ID!
    owner: User!
    days: [Day]!
  }

  type Day {
    id: ID!
    inWeek: Week!
    meals: [Meal]!
    date: String!
  }

  type Meal {
    id: ID!
    day: ID
    recipe: Recipe
    label: String
  }
`;
