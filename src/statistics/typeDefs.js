export const statisticsTypeDef = `
type Statistic {
    id: String!
    id_restaurant: String!
    date: String!
    sold_lunches: Int!
    canceled_shifts: Int!
    av_time: Float!
    av_punctuation: Float!
    bonus_sold: Int!
    student_sold: Int!
    external_sold: Int!
}

input StatisticInput {
    id_restaurant: String!
    date: String!
    sold_lunches: Int!
    canceled_shifts: Int!
    av_time: Float!
    av_punctuation: Float!
    bonus_sold: Int!
    student_sold: Int!
    external_sold: Int!
}

type Response_GET {
    t : [Statistic]
    err: String
}

type Response_POST {
    t : Statistic
    err: String
}

type Response_DEL {
    err: String
}`;

export const statisticsQueries = `
    allStatistics: Response_GET!
    statisticByRestaurant(id_restaurant: String!): Response_GET!
`;

export const statisticsMutations = `
    createStatistic(statistic: StatisticInput!): Response_POST!
    deleteStatistic(id_statistic: String!): Response_DEL!
`; //updateStatistic(code: Int!, statistic: StatisticInput!): Statistic!

