const Pool = require('pg').Pool
const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432,
})

/* 
Now in queries.js, we'll create endpoints that will :
display all users, 
display a single user, 
create a new user, 
update an existing user, 
and delete a user.
*/

// 1. Make endpoint for GET request for Display All Users
const getUsers = (request, response) => {
    // put raw SQL that will touch the api database
    // select all users & order by Id
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

// 2. GET a single user by ID
const getUserById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM users WHERE id = $1',
      [id], (error, results) => {
          if (error) {
              throw error
          }
          response.status(200).json(results.rows)
      })
}

// 3. POST a new user
/*
will be adding new user by extracting
name and email properties from the
request body and INSERTing the values
*/
const createUser = (request, response) => {
    // extract name & email
    const { name, email } = request.body
    // insert extracted values
    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)',
      [name, email], (error, results) => {
          if (error) {
              throw error
          }
          response.status(201).send(`User added with ID: ${result.insertId}`)
      })
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body
  
    pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3',
      [name, email, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
  }
  
  const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
  }

  /* In order to access these functions from index.js, we’ll need to 
  export them. We can do this with module.exports, creating an object of 
  functions. Since we’re using ES6 syntax, we can write getUsers instead 
  of getUsers:getUsers, and so on.*/

  module.exports = {
      getUsers,
      getUserById,
      createUser,
      updateUser,
      deleteUser,
  }