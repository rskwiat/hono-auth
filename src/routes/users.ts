import { Hono } from 'hono';
import { getUsers, createUser, deleteUser, getUserById, loginUser } from '../handlers/users';
const users = new Hono();

users.get('/', getUsers) // get all users
// GET User by MongoId
users.get('/:id', getUserById);
// POST /users/register
users.post('/register', createUser);
// POST /users/remove Delete User
users.post('/remove', deleteUser);

// POST /users/login, get JWT back
users.post('/login', loginUser);



export default users;
