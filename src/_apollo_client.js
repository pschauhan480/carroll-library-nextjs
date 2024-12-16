import { ApolloClient, InMemoryCache } from "@apollo/client";

import * as dotenv from "dotenv";
dotenv.config();

const apiURL = process.env.NEXT_PUBLIC_API_URL + "/api/graphql";

const createApolloClient = () => {
    return new ApolloClient({
        uri: apiURL,
        cache: new InMemoryCache(),
    });
};

export default createApolloClient;
