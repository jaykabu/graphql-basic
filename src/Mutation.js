import {GraphQLServer} from "graphql-yoga";
import {v4 as uuidv4} from 'uuid';


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

//Create Mutation

// Type Definitions (Schema)
const typeDefs = `
    type Query {
        posts(query: String): [Post!]!
        users(query: String): [User!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }
    
    type Mutation {
        createUser(name: String!, email: String, age: Int!): User!
        createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
        createComment(text: String, author:ID!, post:ID!): Comment!
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

	Mutation: {
		createUser: (parent, args, ctx, info) => {
			const emailTaken = users.some((user) => user.email === args.email);

			if (emailTaken) {
				throw new Error('Email taken.')
			}

			const user = {
				id: uuidv4(),
				name: args.name,
				email: args.email,
				age: args.age
			}

			users.push(user);

			return user;
		},

		createPost: (parent, args, ctx, info) => {

			const userExists = users.some((user) => {
				return user.id === args.author;
			});

			if (!userExists) {
				throw Error('User not found')
			}

			const post = {
				id: uuidv4(),
				title: args.title,
				body: args.body,
				published: args.published,
				author: args.author
			};

			posts.push((post))
			return post;
		},

		createComment: (parent, args, ctx, info) => {
			const userExists = users.some((user) => {
				return user.id === args.author;
			});

			const postExists = posts.some(post => {
				return post.id === args.post && post.published === true;
			})

			if (!userExists || !postExists) {
				throw Error('Unable to find user and post')
			}

			const comment = {
				id: uuidv4(),
				text: args.text,
				author: args.author,
				post: args.post
			}

			comments.push(comment);

			return comment;
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