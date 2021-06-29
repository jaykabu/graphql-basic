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

const db = {
  users,
  posts,
  comments
}

export { db as default };