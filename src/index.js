import {GraphQLServer} from "graphql-yoga";

// Scalar type => String, Boolean, Int, Float, ID

// Type Definitions (Schema)
const typeDefs =`
    type Query {
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float!
    }
`

// Resolvers
const resolvers = {
    Query: {
        id: () => 'abc123',
        name: () => 'jay',
        age: () => 23,
        employed: () => true,
        gpa: () => 2.45
    }
}

const server = new GraphQLServer({typeDefs, resolvers});

server.start(() => {
    console.log("The server is up!")
})