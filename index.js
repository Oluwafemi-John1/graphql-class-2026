const express = require('express');
const app = express()
require('dotenv').config()
const graphqlHTTP = require('express-graphql').graphqlHTTP
const schema = require('./schema/schema')

const port = process.env.PORT

app.use('/doyin', graphqlHTTP({
    schema,
    graphiql: true
}))


app.listen(port,()=> {
    console.log(`Lift off! We have gentlemen running affairs at ${port}`);
})