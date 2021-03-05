module.exports = app => {
    const graphqlController = require('../controllers/graphqlController')

    app.use('/graphql', graphqlController.graphql)
}