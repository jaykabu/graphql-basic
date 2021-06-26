const Query = {
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
}

export {Query as default};