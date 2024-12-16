import { useState } from "react";

import { fetchAuthors } from "../authors";
import Link from "next/link";

const AuthorComponent = (props) => {
    console.log("given props", props);
    const [author, setAuthor] = useState(props.author);
    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4">Author Details</h1>
            <p>
                <strong>ID:</strong> {author.id}
            </p>
            <p>
                <strong>Name:</strong> {author.name}
            </p>
            <p>
                <strong>Biography:</strong> {author.biography}
            </p>
            {author.born_date ? (
                <p>
                    <strong>Date of Birth:</strong> {author.born_date}
                </p>
            ) : (
                ""
            )}
            {author.Books && author.Books.length > 0 ? (
                <p>
                    <strong>Books:</strong>
                    {author.Books.map((book) => (
                        <Link href={"/books/" + book.id} key={book.id}>
                            {book.title}
                        </Link>
                    ))}
                </p>
            ) : (
                ""
            )}
        </div>
    );
};

export const getServerSideProps = async (context) => {
    const { authorid } = context.params;
    const authors = await fetchAuthors({
        id: authorid,
    });
    console.log("fetch author by id", authorid, authors);
    let author = {};
    if (authors.length > 0) {
        author = authors[0];
    }
    return {
        props: {
            author: author,
        },
    };
};

export default AuthorComponent;
