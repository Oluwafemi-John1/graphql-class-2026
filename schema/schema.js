const graphql = require('graphql')
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } = graphql
const _ = require('lodash')

const books = [
    { id: '1', name: 'The Great Gatsby', genre: 'Fiction' },
    { id: '2', name: 'To Kill a Mockingbird', genre: 'Fiction' },
    { id: '3', name: '1984', genre: 'Dystopian' }
]


const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        genre: {type: GraphQLString}
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        gender: {type: GraphQLString},
        // authorId: {type: GraphQLString}
    })
})



const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {id:{type: GraphQLString}},
            resolve(parent, args) {
                // console.log(args);
                return _.find(books, {id: args.id})
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return GraphQLList(books);
                // console.log(books);
                return books
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery
})