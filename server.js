const app = require('./app')
const PORT = process.env.PORT || 3000;

process.on('uncaughtException', (err) => {
    console.log('Uncaught exception', err.message);
});

process.on('unhandledRejection', (err) => {
    console.log('Unhandled rejection', err.message);
});

app.listen(PORT, (req, res) => {
    console.log('Listening on port ', PORT);
});