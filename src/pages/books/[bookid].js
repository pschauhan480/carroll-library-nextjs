import { useState } from "react";

import { fetchBooks } from "../books";

const BookComponent = (props) => {
    console.log("given props", props);
    const [book, setBook] = useState(props.book);
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
                        <span key={author.id}>{author.name}</span>
                    ))}
                </p>
            ) : (
                ""
            )}
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
