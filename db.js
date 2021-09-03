const mongoose = require('mongoose');

module.exports = () => {
    let database;

    if (process.env.NODE_ENV == 'development') {
        database = process.env.DATABASE_URL_LOCALHOST
    } else {
        database = process.env.DATABASE_URL;
        database = database.replace('<USERNAME>', process.env.DATABASE_USERNAME);
        database = database.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
    }

    mongoose.connect(database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        .then((connected) => {
            console.log('Database connected')
        });
}