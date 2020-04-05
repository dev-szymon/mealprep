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
    user: User!
    mon: [Meal]!
    tue: [Meal]!
    wed: [Meal]!
    thu: [Meal]!
    fri: [Meal]!
    sat: [Meal]!
    sun: [Meal]!
  }

  type Meal {
    id: ID!
    week: ID
    day: String
    recipe: Recipe
    label: String
  }
`;
