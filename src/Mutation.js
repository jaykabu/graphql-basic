import {GraphQLServer} from "graphql-yoga";
import {v4 as uuidv4} from 'uuid';


//demo user data
let users = [
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

let posts = [
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

let comments = [
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
        createUser(data: CreateUserInput): User!
        deleteUser(id:ID!):User!
        createPost(data: CreatePostInput): Post!
        deletePost(id:ID!):Post!
        createComment(data: CreateCommentInput): Comment!
        deleteComment(id:ID!):Comment!
    }
    
    input CreateUserInput {
    	name: String!,
    	email: String!
    	age: Int!
    }
    
    input CreatePostInput {
    	title: String!, 
    	body: String!, 
    	published: Boolean!, 
    	author: ID!
    }
    
    input CreateCommentInput {
    	text: String, 
    	author:ID!, 
    	post:ID!
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
			const emailTaken = users.some((user) => user.email === args.data.email);

			if (emailTaken) {
				throw new Error('Email taken.')
			}

			const user = {
				id: uuidv4(),
				...args.data
			}

			users.push(user);

			return user;
		},

		deleteUser: (parent, args, ctx, info) => {
			console.log(args.id);
			const userIndex = users.findIndex((user) => {
				return user.id === args.id
			});

			if (userIndex === -1) {
				throw Error('User not found!')
			}

			const deleteUsers = users.splice(userIndex, 1);

			posts = posts.filter((post) => {
				const match = post.author === args.id;

				if (match) {
					comments = comments.filter((comment) => {
						const match = comment.post !== post.id
					})
				}
				return !match
			});

			comments = comments.filter((comment) => {
				return comment.author !== args.id
			})

			return deleteUsers[0];
		},

		createPost: (parent, args, ctx, info) => {
			const userExists = users.some((user) => {
				return user.id === args.data.author;
			});

			if (!userExists) {
				throw Error('User not found')
			}

			const post = {
				id: uuidv4(),
				...args.data
			};
			posts.push((post))
			return post;
		},

		deletePost: (parent, args, ctx, info) => {
			const postIndex = posts.findIndex((post) => {
				return post.id === args.id;
			});

			if (postIndex === -1) {
				throw new Error("Post not found!");
			}

			const deletePost = posts.splice(postIndex, 1);

			comments = comments.filter((comment) => comment.post !== args.id)

			return deletePost[0];
		},

		createComment: (parent, args, ctx, info) => {
			const userExists = users.some((user) => {
				return user.id === args.data.author;
			});

			const postExists = posts.some(post => {
				return post.id === args.data.post && post.published === true;
			})

			if (!userExists || !postExists) {
				throw Error('Unable to find user and post')
			}

			const comment = {
				id: uuidv4(),
				...args.data
			}

			comments.push(comment);

			return comment;
		},

		deleteComment: (parent, args, ctx, info) => {
			const commentIndex = comments.findIndex((comment) => comment.id === args.id);

			if (commentIndex === -1) {
				throw new Error('Comment not found!')
			}

			const deleteComment = comments.splice(commentIndex, 1);

			return deleteComment[0];
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