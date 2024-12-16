import { ApolloClient, InMemoryCache } from "@apollo/client";

import * as dotenv from "dotenv";
dotenv.config();

const apiURL = process.env.API_URL;

const createApolloClient = () => {
    return new ApolloClient({
        uri: `${apiURL}/api/graphql`,
        cache: new InMemoryCache(),
    });
};

export default createApolloClient;
