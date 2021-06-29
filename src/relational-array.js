import { GraphQLServer } from "graphql-yoga";

// Relation data with array =>

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
    author: '2'
  },
]

// Type Definitions (Schema)
const typeDefs = `
    type Query {
        posts(query: String): [Post!]!
        users(query: String): [User!]!
        me: User!
        post: Post!
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
    }
    
    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
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
    }
  },

  // Resolvers function
  Post: {
    author: (parent, args, ctx, info) => {
      return users.find((user) => {
        return user.id === parent.author
      })
    }
  },

  User: {
    posts: (parent, args, ctx, info) => {
      return posts.filter(post => {
        return post.author === parent.id
      })
    }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log("The server is up!")
});


// "'Source Code Pro','Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace,"