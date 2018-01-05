module.exports = function (app) {
    app.use('/', require('./home'));
    app.use('/example1', require('./example1'));
    app.use('/example2', require('./example2'));
    app.use('/example3', require('./example3'));
    app.use('/example4', require('./example4'));
    app.use('/example5', require('./example5'));
    app.use('/example6', require('./example6'));
    app.use('/example7', require('./example7'));
    app.use('/example8', require('./example8'));
    app.use('/example9', require('./example9'));
    app.use('/example10', require('./example10'));
    app.use('/example11', require('./example11'));
    app.use('/example12', require('./example12'));
    app.use('/example13', require('./example13'));
};
