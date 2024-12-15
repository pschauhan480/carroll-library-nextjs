import { gql } from "@apollo/client";
import createApolloClient from "./apollo_client";
import Image from "next/image";
import Link from "next/link";

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
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {props.books.map((book) => (
                <div
                    key={book.id}
                    className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                >
                    {book.cover ? (
                        <Image
                            src={book.cover}
                            alt={book.title}
                            className="w-20 h-20 rounded-full mx-auto"
                        />
                    ) : (
                        ""
                    )}
                    <h3 className="text-lg font-semibold text-start mt-4 capitalize">
                        {book.title}
                    </h3>
                    <p className="text-gray-600 text-start capitalize">
                        {book.description}
                    </p>
                    {/* Action Buttons */}
                    <div className="mt-4 flex justify-end">
                        <Link
                            href={"/books/" + book.id}
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
