import { gql } from "@apollo/client";
import createApolloClient from "./apollo_client";
import Image from "next/image";
import Link from "next/link";

const GET_AUTHORS = gql`
    query Authors {
        authors {
            id
            name
            biography
            born_date
        }
    }
`;

const AuthorsComponent = (props) => {
    console.log("authors props", props);
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {props.authors.map((author) => (
                <div
                    key={author.id}
                    className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                >
                    {author.avatar ? (
                        <Image
                            src={author.avatar}
                            alt={author.name}
                            className="w-20 h-20 rounded-full mx-auto"
                        />
                    ) : (
                        ""
                    )}
                    <h3 className="text-lg font-semibold text-start mt-4 capitalize">
                        {author.name}
                    </h3>
                    <p className="text-gray-600 text-start capitalize">
                        {author.biography}
                    </p>
                    {/* Action Buttons */}
                    <div className="mt-4 flex justify-end">
                        <Link
                            href={"/authors/" + author.id}
                            className="bg-yellow-500 text-white  px-3 py-1 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            View Details
                        </Link>
                        <button className="bg-green-500 text-white px-3  py-1 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                            Edit
                        </button>
                        <button
                            className="bg-red-500 text-white px-3 py-1  rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                            // onClick={() => handleDelete(user.id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const getServerSideProps = async (context) => {
    let authors = [];

    const client = createApolloClient();
    try {
        let response = await client.query({
            query: GET_AUTHORS,
        });
        if (
            response &&
            response.data &&
            response.data.authors &&
            Array.isArray(response.data.authors)
        ) {
            authors = response.data.authors;
        }
    } catch (err) {
        console.error("fetch authors error", err);
    }
    return {
        props: {
            authors,
        },
    };
};

export default AuthorsComponent;
