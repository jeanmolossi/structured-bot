import { createConnection } from 'typeorm';

createConnection()
  .then(async connection => {
    const user = {
      id: 1,
    };
    const users = ['Jean', 'Jean 2'];
    console.log('Inserting a new user into the database...');

    console.log(`Saved a new user with id: ${user.id}`);

    console.log('Loading users from the database...');
    console.log('Loaded users: ', users);

    console.log('Here you can setup and run express/koa/any other framework.');
  })
  .catch(error => console.log(error));
