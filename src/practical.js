// import {GraphQLServer} from "graphql-yoga";
//
// // Scalar type => String, Boolean, Int, Float, ID
//
// // Type Definitions (Schema)
// const typeDefs = `
//     type Query {
//         title: String!
//         price: Float!
//         releaseYear: Int!
//         rating: Float!
//         inStock: Boolean!
//     }
// `
//
// // Resolvers
// const resolvers = {
//     Query: {
//         title: () => 'chocolate',
//         price: () => 12.99,
//         releaseYear: () => 1992,
//         rating: () => 4.3,
//         inStock: () => true
//     }
// }
//
// const server = new GraphQLServer({typeDefs, resolvers});
//
// server.start(() => {
//     console.log("The server is up!")
// })

import {GraphQLServer} from "graphql-yoga";

//demo user data
const users = [
    {
        id: '1',
        name: 'John',
        email: 'john.doe@gmail.com',
        age: 25
    },
    {
        id: '2',
        name: 'Doe',
        email: 'Doe@gmail.com'
    },
    {
        id: '3',
        name: 'Jay',
        email: 'jay@gmail.com',
        age: 23
    }
];

const posts = [
    {
        id: '001',
        title: 'JavaScript',
        body: 'create javaScript project',
        published: true,
        author: '3'
    },
    {
        id: '002',
        title: 'React JS',
        body: 'create reactJs project',
        published: true,
        author: '3'
    },
    {
        id: '003',
        title: 'NodeJs',
        body: 'create NodeJs project',
        published: false,
        author: '1'
    },
]

const comments = [
    {
        id: '101',
        text: 'hello',
        author: '1',
        post: '001'
    },
    {
        id: '102',
        text: 'good',
        author: '2',
        post: '002'
    },
    {
        id: '103',
        text: 'nice',
        author: '3',
        post: '003'
    },
    {
        id: '104',
        text: 'very good',
        author: '3',
        post: '003'
    }
];

// Type Definitions (Schema)
const typeDefs = `
    type Query {
        posts(query: String): [Post!]!
        users(query: String): [User!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
    
    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
    
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// Resolvers
const resolvers = {
    Query: {
        posts: (parent, args, ctx, info) => {
            if (!args.query) {
                return posts
            }

            return posts.filter((post) => {
                return post.title.toLowerCase().includes(args.query.toLowerCase());
            })
        },

        users: (parent, args, ctx, info) => {
            // console.log(args.query)
            if (!args.query) {
                return users
            }
            return users.filter((user) => {
                const isTitleMatch = user.name.toLowerCase().includes(args.query.toLowerCase());
                const isBodyMatch = user.body.toLowerCase().includes(args.query.toLowerCase());

                return isTitleMatch || isBodyMatch;
            })
        },

        me: () => {
            return {
                id: '123455',
                name: 'Jay',
                email: 'jay@gmail.com',
                age: 23
            }
        },

        post: () => {
            return {
                id: '087',
                title: 'Graph Ql',
                body: 'create api',
                published: true
            }
        },

        comments: (parent, args, ctx, info) => {
            return comments
        }
    },

    Comment: {
        author: (parent, args, ctx, info) => {
            return users.find(user => {
                return user.id === parent.author;
            })
        },
        post: (parent, args, ctx, info) => {
            return posts.find((post) => {
                return post.id === parent.post;
            })
        }
    },

    Post: {
        author: (parent, args, ctx, info) => {
            return users.find((user) => {
                return user.id === parent.author;
            })
        },

        comments: (parent, args, ctx, info) => {
            return comments.filter((comment) => {
                return comment.post === parent.id;
            })
        }
    },

    User: {
        posts: (parent, args, ctx, info) => {
            return posts.filter((post) => {
                return post.author === parent.id;
            })
        },

        comments: (parent, args, ctx, info) => {
            return comments.filter((comment) => {
                return comment.author === parent.id;
            })
        }
    }
}

const server = new GraphQLServer({typeDefs, resolvers});

server.start(() => {
    console.log("The server is up!")
});

// sudo fuser -k port/tcp
// server froce stop