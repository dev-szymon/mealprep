const { gql } = require('apollo-server-express');

module.exports = dayplan = gql`
  extend type Query {
    getDay(id: ID!): Day
    getMeal(id: ID!): Meal
  }

  extend type Mutation {
    newDay(loggedIn: ID!, weekDay: String!): Day
    swapDays(loggedIn: ID!, oldWeekday: String!, newWeekday: String!): Day
    addMeal(dayID: ID!, recipe: ID!, label: String!): Day
    removeMeal(dayID: ID!, mealID: ID!): Day
    swapLabels(mealID: ID!, oldLabel: String!, newLabel: String!): Meal
  }

  type Day {
    id: ID!
    createdBy: User!
    weekDay: String!
    meals: [Meal]!
  }

  type Meal {
    id: ID!
    dayID: ID!
    recipe: Recipe!
    label: String!
  }
`;
