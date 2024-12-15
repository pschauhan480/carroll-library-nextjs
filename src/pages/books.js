import { gql } from "@apollo/client";
import createApolloClient from "./apollo_client";

const GET_BOOKS = gql`
    query Books {
        books {
            id
            title
            description
            published_date
        }
    }
`;

const BooksComponent = (props) => {
    console.log("books props", props);
    return <h1>Books Page</h1>;
};

export const getServerSideProps = async (context) => {
    let books = [];

    const client = createApolloClient();
    try {
        let response = await client.query({
            query: GET_BOOKS,
        });
        if (
            response &&
            response.data &&
            response.data.books &&
            Array.isArray(response.data.books)
        ) {
            books = response.data.books;
        }
    } catch (err) {
        console.error("fetch books error", err);
    }
    return {
        props: {
            books,
        },
    };
};

export default BooksComponent;
