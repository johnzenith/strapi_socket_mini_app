'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */

 module.exports = async () => {
    const io  = require('socket.io')(strapi.server);
    let users = [];

    io.on('connection', socket => {
        socket.user_id = (Math.random() * 100000000000000); // not so secure

        users.push(socket); // save the socket to use it later

        socket.on('disconnect', () => {
            users.forEach((user, i) => {
                // delete saved user when they disconnect
                if(user.user_id === socket.user_id) users.splice(i, 1);
            });
        });
      });

    // register socket io inside strapi main object to use it globally anywhere
    strapi.io = io;

    // send to all users connected (notify users on food creation)
    strapi.emitToAllUsers = food => io.emit('food_ready', food);
  };