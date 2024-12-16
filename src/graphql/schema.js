import gql from "graphql-tag";

export const typeDefs = gql`
    scalar Date

    type Book {
        id: ID
        title: String
        description: String
        published_date: Date
    }

    type Author {
        id: ID
        name: String
        biography: String
        born_date: Date
    }

    type BookReview {
        id: ID
        bookid: ID
        rating: String
        review: String
    }

    type DashboardSummary {
        books: Int
        authors: Int
    }

    type Query {
        books(
            id: ID
            title: String
            authorid: ID
            page: Int
            limit: Int
        ): [Book]
        authors(id: ID, name: String, page: Int, limit: Int): [Author]
        dashboard: DashboardSummary
        bookreviews(bookid: ID!): [BookReview]
    }

    input BookInput {
        title: String!
        description: String!
        published_date: Date
    }

    input AuthorInput {
        name: String!
        biography: String!
        born_date: Date
    }

    type Mutation {
        createBook(book: BookInput!): Book
        updateBook(book: BookInput): Book
        deleteBook(bookid: ID!): Book

        createAuthor(author: AuthorInput!): Author
        updateAuthor(author: AuthorInput): Author
        deleteAuthor(authorid: ID!): Author
    }
`;
