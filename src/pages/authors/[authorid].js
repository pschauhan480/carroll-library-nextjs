import { gql } from "@apollo/client";

const GET_AUTHOR = gql`
    query Authors {
        authors {
            id
            name
            biography
            born_date
        }
    }
`;

const AuthorPage = () => {
    const AuthorComponent = (props) => {
        return <h1>Author Page</h1>;
    };

    return <AuthorComponent />;
};

export default AuthorPage;
