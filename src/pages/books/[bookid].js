import { useState } from "react";

import Link from "next/link";

import { fetchBooks } from "../books";

const BookComponent = (props) => {
    console.log("given props", props);
    const [book, setBook] = useState(props.book);

    const [reviews, setReviews] = useState([]);

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4">Book Details</h1>
            <p>
                <strong>ID:</strong> {book.id}
            </p>
            <p>
                <strong>Title:</strong> {book.title}
            </p>
            <p>
                <strong>Description:</strong> {book.description}
            </p>
            {book.born_date ? (
                <p>
                    <strong>Date of Publishing:</strong> {book.published_date}
                </p>
            ) : (
                ""
            )}
            {book.Authors && book.Authors.length > 0 ? (
                <p>
                    <strong>Authors:</strong>
                    {book.Authors.map((author) => (
                        <Link href={"/authors/" + author.id} key={author.id}>
                            {author.name}
                        </Link>
                    ))}
                </p>
            ) : (
                ""
            )}
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Reviews</h2>
                <ul className="space-y-4">
                    {reviews && Array.isArray(reviews) && reviews.length > 0
                        ? reviews.map((review) => (
                              <li
                                  key={review.id}
                                  className="p-4 bg-gray-100 rounded shadow-md"
                              >
                                  <p>{review.content}</p>
                              </li>
                          ))
                        : "No reviews found"}
                </ul>
            </div>
        </div>
    );
};

export const getServerSideProps = async (context) => {
    const { bookid } = context.params;
    const books = await fetchBooks({
        id: bookid,
    });
    console.log("fetch book by id", bookid, books);
    let book = {};
    if (books.length > 0) {
        book = books[0];
    }
    return {
        props: {
            book: book,
        },
    };
};

export default BookComponent;
