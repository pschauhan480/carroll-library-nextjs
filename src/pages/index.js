import { gql } from "@apollo/client";
import createApolloClient from "../_apollo_client";
import Link from "next/link";

const DASHBOARD_SUMMARY = gql`
    query Dashboard {
        dashboard {
            books
            authors
        }
    }
`;

const HomeComponent = (props) => {
    console.log("dashboard props", props);
    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                {/* Author Card */}
                <Link href="/authors">
                    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">
                            Authors
                        </h2>
                        <p className="text-gray-600 mt-2 text-4xl font-bold">
                            {props.summary.authors}
                        </p>
                    </div>
                </Link>
                {/* Book Card */}
                <Link href="/books">
                    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">
                            Books
                        </h2>
                        <p className="text-gray-600 mt-2 text-4xl font-bold">
                            {props.summary.books}
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export const getServerSideProps = async (context) => {
    let summary = {
        books: 0,
        authors: 0,
    };

    const client = createApolloClient();
    try {
        let response = await client.query({
            query: DASHBOARD_SUMMARY,
        });
        if (response && response.data && response.data.dashboard) {
            summary = response.data.dashboard;
        }
    } catch (err) {
        console.error("fetch dashboard summary error", err);
    }
    return {
        props: {
            summary,
        },
    };
};

export default HomeComponent;
