const graphql = require('graphql')
const { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } = graphql
const _ = require('lodash')
const bookModel = require('../models/bookModel')
const authorModel = require('../models/authorModel')

const books = [
    { id: '1', name: 'The Great Gatsby', genre: 'Fiction', authorId: '1' },
    { id: '2', name: 'To Kill a Mockingbird', genre: 'Fiction', authorId: '2' },
    { id: '3', name: '1984', genre: 'Dystopian', authorId: '3' },
    { id: '4', name: 'Animal Farm', genre: 'Satire', authorId: '3' },
    { id: '5', name: 'Brave New World', genre: 'Dystopian', authorId: '4' },
]

const authors = [
    { id: '1', name: 'F. Scott Fitzgerald', age: 44, gender: 'Male' },
    { id: '2', name: 'Harper Lee', age: 89, gender: 'Female' },
    { id: '3', name: 'George Orwell', age: 46, gender: 'Male' },
    { id: '4', name: 'Gina Orwelly', age: 64, gender: 'Female' },
]


const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        authorId: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args) {
                console.log(parent);
                return _.find(authors, { id: parent.authorId })
                // return authorModel.findById(parent.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        gender: {type: GraphQLString},
        book: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                console.log(parent);
                return _.filter(books, { authorId: parent.id })
                // return bookModel.find({authorId: parent.id})
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                gender: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                try {
                    let author = new authorModel({
                        name: args.name,
                        age: args.age,
                        gender: args.gender
                    });
                    console.log('author saved');
                    return await author.save();
                } catch (err) {
                    console.log(err);
                }
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(parent, args) {
                const { name, genre, authorId } = args;
                try {
                    let book = new bookModel({name, genre, authorId});
                    return await book.save();
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }
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
                // return bookModel.findById(args.id)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return GraphQLList(books);
                // console.log(books);
                return books;
                // return bookModel.find({})
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(authors, { id: args.id })
                // return authorModel.findById(args.id)
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors
                // return authorModel.find({})
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})