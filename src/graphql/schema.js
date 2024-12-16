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
        id: ID
        title: String
        description: String
        published_date: Date
        authorid: ID
    }

    input AuthorInput {
        id: ID
        name: String
        biography: String
        born_date: Date
    }

    type DeleteResponse {
        message: String!
    }

    type UpdateResponse {
        message: String!
    }

    type Mutation {
        createBook(book: BookInput!): Book
        updateBook(book: BookInput): UpdateResponse
        deleteBook(bookid: ID!): DeleteResponse

        createAuthor(author: AuthorInput!): Author
        updateAuthor(author: AuthorInput): UpdateResponse
        deleteAuthor(authorid: ID!): DeleteResponse
    }
`;
