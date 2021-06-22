import {GraphQLServer} from "graphql-yoga";

// Type Definitions (Schema)
const typeDefs =`
    type Query {
        me: User!
        product: Product!
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
    
    type Product{
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
        me: () => {
            return {
                id: '123455',
                name:'Jay',
                email: 'jay@gmail.com',
                age: 23
            }
        },
        product: () => {
            return {
                title: 'chocolate',
                price: 22,
                releaseYear: 2000,
                rating: 5,
                inStock: true
            }
        }
    }
}

const server = new GraphQLServer({typeDefs, resolvers});

server.start(() => {
    console.log("The server is up!")
})