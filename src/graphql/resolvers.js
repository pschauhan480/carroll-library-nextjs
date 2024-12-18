import { GraphQLError } from "graphql";
import { GraphQLScalarType, Kind } from "graphql";

import { Book, Author } from "@/db/pg_operations.js";

import { BookReviewsModel, InitMongoConnection } from "@/db/mongo_operations";

export const resolvers = {
    Query: {
        books: async (_, req) => {
            if (Book && Author) {
                let includeModel = null;
                let where = {};
                if (req.id !== null && req.id != undefined) {
                    where.id = req.id;
                    includeModel = Author;
                }
                if (req.title !== null && req.title != undefined) {
                    where.title = req.title;
                }
                if (Object.keys(where).length > 0) {
                    return Book.findAll({
                        where: where,
                        include: includeModel,
                    });
                } else {
                    return Book.findAll();
                }
            } else {
                throw new GraphQLError("Book model is not initialized", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500,
                        },
                    },
                });
            }
        },
        authors: async (_, req) => {
            if (Author && Book) {
                let includeModel = null;
                let where = {};
                if (req.id !== null && req.id != undefined) {
                    where.id = req.id;
                    includeModel = Book;
                }
                if (req.name !== null && req.name != undefined) {
                    where.name = req.name;
                }
                if (Object.keys(where).length > 0) {
                    return Author.findAll({
                        where: where,
                        include: includeModel,
                    });
                } else {
                    console.log("response id", req);
                    return Author.findAll();
                }
            } else {
                throw new GraphQLError("Author model is not initialized", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500,
                        },
                    },
                });
            }
        },
        dashboard: async (_, req) => {
            if (Author && Book) {
                return {
                    books: Book.count(),
                    authors: Author.count(),
                };
            } else {
                throw new GraphQLError(
                    "Author or Book model is not initialized",
                    {
                        extensions: {
                            code: "INTERNAL_SERVER_ERROR",
                            http: {
                                status: 500,
                            },
                        },
                    }
                );
            }
        },
        bookreviews: async (_, req) => {
            if (BookReviewsModel) {
                console.log("book reviews model");
                return BookReviewsModel.find({ bookid: req.bookid });
            } else {
                throw new GraphQLError("Book review model is not initialized", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500,
                        },
                    },
                });
            }
        },
    },
    Mutation: {
        createBook: async (_, req) => {
            if (Book && Author) {
                // console.log("create book request", req.book);
                let author;
                if (
                    req.book.authorid != null &&
                    req.book.authorid != undefined
                ) {
                    author = await Author.findByPk(req.book.authorid);
                    if (!author) {
                        throw new GraphQLError(
                            "Author not found with the given id",
                            {
                                extensions: {
                                    code: "BAD_REQUEST",
                                    http: {
                                        status: 400,
                                    },
                                },
                            }
                        );
                    }
                    delete req.book.authorid;
                }
                const newBook = Book.build(req.book);
                await newBook.save();
                if (author) {
                    await newBook.addAuthor(author, {
                        through: { selfGranted: false },
                    });
                    console.log("author added to the book");
                }
                // console.log(newBook instanceof Book);
                // console.log(newBook.name);
                return newBook;
            } else {
                throw new GraphQLError("Book model is not initialized", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500,
                        },
                    },
                });
            }
        },
        createReview: async (_, req) => {
            console.log("book reviews model", req);
            if (BookReviewsModel) {
                const review = new BookReviewsModel(req.review);
                await review.save();
                return review;
            } else {
                throw new GraphQLError(
                    "Book reviews model is not initialized",
                    {
                        extensions: {
                            code: "INTERNAL_SERVER_ERROR",
                            http: {
                                status: 500,
                            },
                        },
                    }
                );
            }
        },
        updateBook: async (_, req) => {
            if (Book) {
                console.log("update book request", req.book);
                await Book.update(
                    {
                        title: req.book.title,
                        description: req.book.description,
                        published_date: req.book.published_date,
                    },
                    {
                        where: {
                            id: req.book.id,
                        },
                    }
                );
                // console.log(newBook instanceof Book);
                // console.log(newBook.name);
                return {
                    message: "book updated successfully",
                };
            } else {
                throw new GraphQLError("Book model is not initialized", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500,
                        },
                    },
                });
            }
        },
        deleteBook: async (_, req) => {
            if (Book) {
                console.log("delete book request", req.bookid);
                await Book.destroy({
                    where: {
                        id: req.bookid,
                    },
                });
                return {
                    message: "book deleted successfully",
                };
            } else {
                throw new GraphQLError("Book model is not initialized", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500,
                        },
                    },
                });
            }
        },
        createAuthor: async (_, req) => {
            if (Author) {
                console.log("create author request", req.author);
                const newAuthor = Author.build(req.author);
                // console.log(newAuthor instanceof Author);
                // console.log(newAuthor.name);
                await newAuthor.save();
                return newAuthor;
            } else {
                throw new GraphQLError("Author model is not initialized", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500,
                        },
                    },
                });
            }
        },
        updateAuthor: async (_, req) => {
            if (Author) {
                console.log("update author request", req.author);
                await Author.update(
                    {
                        name: req.author.name,
                        biography: req.author.biography,
                        born_date: req.author.born_date,
                    },
                    {
                        where: {
                            id: req.author.id,
                        },
                    }
                );
                // console.log(newAuthor instanceof Author);
                // console.log(newAuthor.name);
                return {
                    message: "author updated successfully",
                };
            } else {
                throw new GraphQLError("Author model is not initialized", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500,
                        },
                    },
                });
            }
        },
        deleteAuthor: async (_, req) => {
            if (Author) {
                console.log("delete author request", req.authorid);
                await Author.destroy({
                    where: {
                        id: req.authorid,
                    },
                });
                return {
                    message: "author deleted successfully",
                };
            } else {
                throw new GraphQLError("Author model is not initialized", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500,
                        },
                    },
                });
            }
        },
    },
    Date: new GraphQLScalarType({
        name: "Date",
        description: "Date custom scalar type",
        parseValue(value) {
            return new Date(value);
        },
        serialize(value) {
            return value.getTime();
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10);
            }
            return null;
        },
    }),
};
