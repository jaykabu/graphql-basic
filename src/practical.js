import {GraphQLServer} from "graphql-yoga";

// Scalar type => String, Boolean, Int, Float, ID

// Type Definitions (Schema)
const typeDefs = `
    type Query {
        title: String!
        price: Float!
        releaseYear: Int!
        rating: Float!
        inStock: Boolean!
    }    
`

// Resolvers
const resolvers = {
    Query: {
        title: () => 'chocolate',
        price: () => 12.99,
        releaseYear: () => 1992,
        rating: () => 4.3,
        inStock: () => true
    }
}

const server = new GraphQLServer({typeDefs, resolvers});

server.start(() => {
    console.log("The server is up!")
})