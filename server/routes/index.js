module.exports = function (app) {
    app.use('/example1', require('./example1'));
    app.use('/example2', require('./example2'));
    app.use('/example3', require('./example3'));
};
