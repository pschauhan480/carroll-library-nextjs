import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { resolvers } from "@/graphql/resolvers";
import { typeDefs } from "@/graphql/schema";

import { InitPGConnection } from "@/db/pg_operations.js";
import { InitMongoConnection } from "@/db/mongo_operations.js";

import * as dotenv from "dotenv";

dotenv.config();

const pgDbUser = process.env.PG_DATABASE_USER;
const pgDbName = process.env.PG_DATABASE_NAME;
const pgDbPassword = process.env.PG_DATABASE_PASSWORD;
const pgDbHost = process.env.PG_DATABASE_HOST;
const pgDbPort = process.env.PG_DATABASE_PORT;

const dbSyncForce = process.env.DATABASE_SYNC_FORCE;

// const mongoDbUser = process.env.MONGO_DATABASE_USER;
const mongoDbName = process.env.MONGO_DATABASE_NAME;
// const mongoDbPassword = process.env.MONGO_DATABASE_PASSWORD;
const mongoDbHost = process.env.MONGO_DATABASE_HOST;
const mongoDbPort = process.env.MONGO_DATABASE_PORT;

const server = new ApolloServer({
    resolvers,
    typeDefs,
});

const handler = startServerAndCreateNextHandler(server);

const allowCors = (fn) => async (req, res) => {
    res.setHeader("Allow", "POST");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method == "OPTIONS") {
        res.status(200).end();
    }

    return await fn(req, res);
};

const connectPGDB = (fn) => async (req, res) => {
    const pgURL = `postgres://${pgDbUser}:${pgDbPassword}@${pgDbHost}:${pgDbPort}/${pgDbName}`;

    await InitPGConnection(pgURL, dbSyncForce);
    return await fn(req, res);
};

const connectMongoDB = (fn) => async (req, res) => {
    const mongoURL = `mongodb://${mongoDbHost}:${mongoDbPort}/${mongoDbName}`;

    await InitMongoConnection(mongoURL);
    return await fn(req, res);
};

export default connectPGDB(connectMongoDB(allowCors(handler)));
