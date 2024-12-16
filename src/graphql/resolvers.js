import { GraphQLError } from "graphql";
import { GraphQLScalarType, Kind } from "graphql";

import { Book, Author } from "@/db/pg_operations.js";

export const resolvers = {
    Query: {
        books: async (_, req) => {
            if (Book) {
                return Book.findAll();
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
            if (Author) {
                return Author.findAll();
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
            return {
                books: Book.count(),
                authors: Author.count(),
            };
        },
    },
    Mutation: {
        createBook: async (_, req) => {
            if (Book) {
                console.log("create book request", req.book);
                const newBook = Book.build(req.book);
                // console.log(newBook instanceof Book);
                // console.log(newBook.name);
                await newBook.save();
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
