export const microservicesTypeDef = `
type Statistic {
    id: String!
    id_restaurant: Lunchroom!
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
type Statistic_GET {
    t : [Statistic]
    err: String
}
type Statistic_POST {
    t : Statistic
    err: String
}
type Statistic_DEL {
    err: String
}

type Lunchroom{
    id: String!
    name: String!
    numlunch: Int!
    openTime: String!
    closeTime: String!
    building: String!
}
type Lunchroom_GET{
    total: Int!
    list: [Lunchroom]
}
input LunchroomInput{
    name: String!
    numlunch: Int!
    openTime: String!
    closeTime: String!
    building: String!
}`;


export const microservicesQueries = `
    allStatistics: Statistic_GET!
    statisticByRestaurant(id_restaurant: String!): Statistic_GET!

    allLunchrooms: Lunchroom_GET!
    lunchroomById(id_lunchroom: String!): Lunchroom!
`;


export const microservicesMutations = `
    createStatistic(statistic: StatisticInput!): Statistic_POST!
    deleteStatistic(id_statistic: String!): Statistic_DEL!

    updateLunchroom(id_lunchroom: String!, lunchroom: LunchroomInput!): String
    createLunchroom(lunchroom: LunchroomInput!): String
    deleteLunchroom(id_lunchroom: String!): String
`; 


