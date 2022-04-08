//server framework used to build JSON APIs
const express = require('express');
//middleware used to parse JSON, buffer, string and URL encoded data submitted using HTTP POST request
const bodyParser = require('body-parser');
//library used to hash passwords
const bcrypt = require('bcrypt');
//node.js package used to enable CORS in various options
const cors = require('cors');
//Easy to use SQL query builder for PostgreSQL
const knex = require('knex');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const PORT = process.env.PORT || 4001;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
//connection to heroku database
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});
//test - selects all the users from the users database and logs the data to the console
db.select('*')
  .from('users')
  .then((data) => {
    console.log(data);
  });
//default API path responds with statement
app.get('/', (req, res) => {
  res.send('bug tracker api this is working');
});

//Register and Login paths
app.post('/register', (req, res) => {
  //register path requires email, name, password, role from body request
  const { email, name, password, role } = req.body;
  //saltRounds refers to the work factor or the number of rounds the data is processed for. More rounds leads to more secured hash but slower/expensive process
  const saltRounds = 5;
  //the password from body is put into a hash password through bcrypt
  const hash = bcrypt.hashSync(password, saltRounds);
  //Knex uses transaction to run the entire set of queries as a single unit of work
  db.transaction((trx) => {
    trx
      //inserts the hash password and email into the login table then returns the email
      .insert({
        hash: hash,
        email: email,
      })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        //another transaction is created that takes the email returned from the previous transaction
        //the name and role received from the body request
        //and the joined date which is created by using the new Date() function
        return (
          trx('users')
            .returning('*')
            .insert({
              name: name,
              email: loginEmail[0],
              joined: new Date(),
              role: role,
            })
            //server responds with the new users profile data
            .then((user) => {
              res.json(user[0]);
            })
        );
      })
      //trx.commit and trx.rollback are used to make sure the transaction connection does not hang
      .then(trx.commit)
      .catch(trx.rollback);
    //if a error is encountered during this process then the server will respond with a 400 internal server error
  }).catch((err) => res.status(400).json(err));
});

app.post('/login', (req, res) => {
  //server finds the email and hash password within the login table
  db.select('email', 'hash')
    //the server first compares the email from the database to the email provided in the body request
    .from('login')
    .where('email', '=', req.body.email)
    .then((data) => {
      //if the emails match then the hash password is decrypted using bcrypt then compared to the password provided in the body request
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        //server finds the user's profile by matching the email provided in the body request then responds with the users profile
        return (
          db
            .select('*')
            .from('users')
            .where('email', '=', req.body.email)
            .then((user) => {
              res.json(user[0]);
            })
            //if a error is encountered during this process then the server will respond with a 400 internal server error
            .catch((err) => res.status(400).json('unable to get user'))
        );
      } else {
        res.status(400).json('wrong credentials');
      }
    })
    .catch((err) => res.status(400).json('wrong credentials'));
});

//Bugs table - (POST, GET, DELETE, PUT)
app.post('/bugs', cors(), (req, res) => {
  //server post name, details, type, priority, assigned, status, creator, and project to the bugs table
  const { name, details, type, priority, assigned, status, creator, project } =
    req.body;
  db('bugs')
    .returning('*')
    .insert({
      name: name,
      details: details,
      type: type,
      priority: priority,
      assigned: assigned,
      status: status,
      creator: creator,
      project: project,
      created: new Date(),
    })
    .then((bug) => {
      res.json(bug);
    })
    .catch((err) => res.status(400).json('unable to create bug'));
});

app.get('/bugs', (req, res) => {
  //server responds with all the bugs from the bugs table
  db('bugs')
    .returning('*')
    .then((bugs) => {
      res.json(bugs);
    })
    .catch((err) => res.status(400).json('unable to get bug'));
});

app.delete('/bugs', (req, res) => {
  //server takes the id from the body request and matches it with the id inside the bugs table
  //the matching row is then deleted from the database and the server responds letting the user know the bug was deleted
  const { id } = req.body;
  db('bugs')
    .where('id', id)
    .del()
    .then(() => {
      res.json(`${id} has been deleted`);
    })
    .catch((err) => res.status(err));
});

app.put('/bugs', (req, res) => {
  //server matches the id from the body request with the id within the bugs table
  //the server then updates the corresponding row with the remaining data provided in the body request
  //the server then responds with the updated row
  const { id, details, assigned, priority, creator, status, type, project } =
    req.body;
  db('bugs')
    .where('id', id)
    .update({
      details: details,
      assigned: assigned,
      priority: priority,
      status: status,
      type: type,
      project: project,
      creator: creator,
    })
    .then((bug) => {
      res.json(bug);
    })
    .catch((err) => res.status(400).json('unable to edit bug'));
});

//Users table - (GET request for user profile and users PUT request for users)
app.get('/users', (req, res) => {
  //server responds with all the users from the users table
  db('users')
    .returning('*')
    .then((users) => {
      res.json(users);
    });
});
app.put('/users', (req, res) => {
  //server matches the id from the body request with the id from the users table
  //the server then updates the users role with the role provided in the body request
  const { id, role } = req.body;
  db('users')
    .where('id', id)
    .update({
      role: role,
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => res.status(400).json('unable to assign user role'));
});
app.get('/users/:id', (req, res) => {
  //server takes the id provided in the URL param and matches it with the id found in the users table
  //the server then responds with all the data from that row
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({
      id: id,
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json(err, 'User not found'));
});

//Bug edit timestamp table - (GET and POST requests)
app.post('/bugTimeStamp', (req, res) => {
  //server inserts editor, bugId, oldValues, and newValues into the bugEdits table
  //along with the the time stamp created by using the new Date() function
  const { editor, bugId, oldValues, newValues } = req.body;
  db('bugEdits')
    .returning('*')
    .insert({
      editor: editor,
      bugId: bugId,
      oldvalue: oldValues,
      newvalue: newValues,
      time: new Date(),
    })
    .then((bugEdit) => {
      res.json(bugEdit);
    })
    .catch((err) => res.status(400).json('unable to log bug edit time'));
});

app.get('/bugTimeStamp/:bugId', (req, res) => {
  //server takes the bug id provided in the URL param and matches it with the bug id found in the bugEdits table
  //the server then responds with the row from the bugEdits table associated with the bug id
  const { bugId } = req.params;
  db.select('*')
    .from('bugEdits')
    .where({
      bugId: bugId,
    })
    .then((bug) => {
      res.json(bug);
    })
    .catch((err) => res.status(400).json('No ticket history found'));
});

//Comment table - (GET and POST request)
app.get('/comments/:bugId', (req, res) => {
  //server takes the bug id provided in the URL param and matches it with the bug id found in the comments table
  //the server then responds with the row from the comments table associated with the bug id
  const { bugId } = req.params;
  db.select('*')
    .from('comments')
    .where({
      bugId: bugId,
    })
    .then((comment) => {
      res.json(comment);
    })
    .catch((err) => res.status(400).json('Comments not found'));
});

app.post('/comments', (req, res) => {
  //server post the commenter, bugId, and message into the comments table
  //along with the the time stamp created by using the new Date() function
  //server responds with the newly created comment
  const { commenter, bugId, message } = req.body;
  db('comments')
    .returning('*')
    .insert({
      commenter: commenter,
      bugId: bugId,
      message: message,
      created: new Date(),
    })
    .then((comment) => {
      res.json(comment);
    })
    .catch((err) => res.status(400).json('unable to add comment'));
});

//Projects table - (GET, POST, PUT)
app.post('/projects', (req, res) => {
  //server post the name, description, and userIds into the projects table
  //along with the the time stamp created by using the new Date() function
  //server responds with the newly created project
  const { name, description, userIds } = req.body;
  db('projects')
    .returning('*')
    .insert({
      name: name,
      description: description,
      userIds: userIds,
      created: new Date(),
    })
    .then((project) => {
      res.json(project);
    })
    .catch((err) => res.status(400).json('unable to create project'));
});

app.get('/projects', (req, res) => {
  //server responds with all the projects from the projects table
  db.select('*')
    .from('projects')
    .then((project) => {
      res.json(project);
    })
    .catch((err) => res.status(400).json('Cannot get projects from database'));
});

app.put('/projects', (req, res) => {
  //server matches the id from the body request with the id from the projects table
  //the server then updates the user ids with the data pulled from the body request
  const { id, userIds } = req.body;
  db('projects')
    .where('id', id)
    .update({
      userIds: userIds,
    })
    .then((project) => {
      res.json(project);
    })
    .catch((err) => res.status(400).json('unable to edit project users'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
