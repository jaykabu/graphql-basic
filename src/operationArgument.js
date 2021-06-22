import {GraphQLServer} from "graphql-yoga";

//operation argument => greeting():String
// Type Definitions (Schema)

const typeDefs = `
    type Query {
        value(a: Float, b: Float): String!
        greeting(name: String, position: String): String!
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
        value: (parent, args, ctx, info) => {
            const sum = args.a + args.b;
            return `Hello sum = ${sum}`;
        },
        greeting: (parent, args, ctx, info) => {
            if (args.name && args.position) {
                return `Hello, ${args.name}! You are my favorite ${args.position}`
            }

            return 'Hello'
        },
        me: () => {
            return {
                id: '123455',
                name: 'Jay',
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