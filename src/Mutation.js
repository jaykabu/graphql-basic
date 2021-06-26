import {GraphQLServer} from "graphql-yoga";
import {v4 as uuidv4} from 'uuid';
import db from './db';


// Resolvers
const resolvers = {
	Query: {
		posts: (parent, args, {db}, info) => {
			if (!args.query) {
				return db.posts;
			}

			return db.posts.filter((post) => {
				return post.title.toLowerCase().includes(args.query.toLowerCase());
			})
		},

		users: (parent, args, {db}, info) => {
			// console.log(args.query)
			if (!args.query) {
				return db.users;
			}
			return db.users.filter((user) => {
				const isTitleMatch = user.name.toLowerCase().includes(args.query.toLowerCase());
				const isBodyMatch = user.body.toLowerCase().includes(args.query.toLowerCase());

				return isTitleMatch || isBodyMatch;
			})
		},

		comments: (parent, args, {db}, info) => {
			return db.comments;
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

	Mutation: {
		createUser: (parent, args, {db}, info) => {
			const emailTaken = db.users.some((user) => user.email === args.data.email);

			if (emailTaken) {
				throw new Error('Email taken.')
			}

			const user = {
				id: uuidv4(),
				...args.data
			}

			db.users.push(user);

			return user;
		},

		deleteUser: (parent, args, {db}, info) => {
			console.log(args.id);
			const userIndex = db.users.findIndex((user) => {
				return user.id === args.id
			});

			if (userIndex === -1) {
				throw Error('User not found!')
			}

			const deleteUsers = db.users.splice(userIndex, 1);

			db.posts = db.posts.filter((post) => {
				const match = post.author === args.id;

				if (match) {
					db.comments = db.comments.filter((comment) => {
						const match = comment.post !== post.id
					})
				}
				return !match
			});

			db.comments = db.comments.filter((comment) => {
				return comment.author !== args.id
			})

			return deleteUsers[0];
		},

		createPost: (parent, args, {db}, info) => {
			const userExists = db.users.some((user) => {
				return user.id === args.data.author;
			});

			if (!userExists) {
				throw Error('User not found')
			}

			const post = {
				id: uuidv4(),
				...args.data
			};
			db.posts.push((post))
			return post;
		},

		deletePost: (parent, args, {db}, info) => {
			const postIndex = db.posts.findIndex((post) => {
				return post.id === args.id;
			});

			if (postIndex === -1) {
				throw new Error("Post not found!");
			}

			const deletePost = db.posts.splice(postIndex, 1);

			db.comments = db.comments.filter((comment) => comment.post !== args.id)

			return deletePost[0];
		},

		createComment: (parent, args, {db}, info) => {
			const userExists = db.users.some((user) => {
				return user.id === args.data.author;
			});

			const postExists = db.posts.some(post => {
				return post.id === args.data.post && post.published === true;
			})

			if (!userExists || !postExists) {
				throw Error('Unable to find user and post')
			}

			const comment = {
				id: uuidv4(),
				...args.data
			}

			db.comments.push(comment);

			return comment;
		},

		deleteComment: (parent, args, {db}, info) => {
			const commentIndex = db.comments.findIndex((comment) => comment.id === args.id);

			if (commentIndex === -1) {
				throw new Error('Comment not found!')
			}

			const deleteComment = db.comments.splice(commentIndex, 1);

			return deleteComment[0];
		}
	},

	Comment: {
		author: (parent, args, {db}, info) => {
			return db.users.find(user => {
				return user.id === parent.author;
			})
		},
		post: (parent, args, {db}, info) => {
			return db.posts.find((post) => {
				return post.id === parent.post;
			})
		}
	},

	Post: {
		author: (parent, args, {db}, info) => {
			return db.users.find((user) => {
				return user.id === parent.author;
			})
		},

		comments: (parent, args, {db}, info) => {
			return db.comments.filter((comment) => {
				return comment.post === parent.id;
			})
		}
	},

	User: {
		posts: (parent, args, {db}, info) => {
			return db.posts.filter((post) => {
				return post.author === parent.id;
			})
		},

		comments: (parent, args, {db}, info) => {
			return db.comments.filter((comment) => {
				return comment.author === parent.id;
			})
		}
	}
}

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers,
	context: {
		db
	}
});

server.start(() => {
	console.log("The server is up!")
});