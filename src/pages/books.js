import { gql } from "@apollo/client";
import createApolloClient from "./apollo_client";
import Image from "next/image";
import Link from "next/link";

import classnames from "classnames";
import * as Select from "@radix-ui/react-select";
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@radix-ui/react-icons";

import { useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";

const GET_BOOKS = gql`
    query Books($id: ID) {
        books(id: $id) {
            id
            title
            description
            published_date
            Authors {
                id
                name
            }
        }
    }
`;

const CREATE_BOOK = gql`
    mutation CreateBook($book: BookInput!) {
        createBook(book: $book) {
            id
            title
            description
            published_date
        }
    }
`;

const GET_AUTHOR_NAMES = gql`
    query Authors {
        authors {
            id
            name
        }
    }
`;

const DELETE_BOOK = gql`
    mutation DeleteBook($bookid: ID!) {
        deleteBook(bookid: $bookid) {
            message
        }
    }
`;

const UPDATE_BOOK = gql`
    mutation UpdateBook($book: BookInput!) {
        updateBook(book: $book) {
            message
        }
    }
`;

export const fetchBooks = async (whereObj) => {
    let books = [];

    const client = createApolloClient();
    try {
        let response = await client.query({
            query: GET_BOOKS,
            variables: whereObj,
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
    return books;
};

export const fetchAuthorNames = async (whereObj) => {
    let authors = [];

    const client = createApolloClient();
    try {
        let response = await client.query({
            query: GET_AUTHOR_NAMES,
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
    return authors;
};

const callSaveBook = async (book) => {
    const client = createApolloClient();
    try {
        await client.mutate({
            mutation: CREATE_BOOK,
            variables: {
                book: book,
            },
        });
        // console.log("save book response", response);
    } catch (err) {
        console.error("failed to save book", err);
    }
    return;
};

const callUpdateBook = async (book) => {
    const client = createApolloClient();
    try {
        await client.mutate({
            mutation: UPDATE_BOOK,
            variables: {
                book: {
                    id: book.id,
                    title: book.title,
                    description: book.description,
                    published_date: book.published_date,
                },
            },
        });
        // console.log("update book response", response);
    } catch (err) {
        console.error("failed to update book", err);
    }
    return;
};

const callDeleteBook = async (bookid) => {
    const client = createApolloClient();
    try {
        await client.mutate({
            mutation: DELETE_BOOK,
            variables: {
                bookid: bookid,
            },
        });
        // console.log("delete book response", response);
    } catch (err) {
        console.error("failed to delete book", err);
    }
    return;
};

const BooksComponent = (props) => {
    const [book, setBook] = useState({ title: "", description: "" });
    const [books, setBooks] = useState(props.books);

    const [authors, setAuthors] = useState(props.authors);

    const [dialogMode, setDialogMode] = useState("create");

    const [openDialog, setOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
    };

    const saveBook = async (event) => {
        event.preventDefault();
        await callSaveBook(book);
        setBook({});
        setOpen(false);
        let updateBooks = await fetchBooks();
        setBooks(updateBooks);
        // console.log("save book details", book);
    };

    const updateBook = async (event) => {
        event.preventDefault();
        await callUpdateBook(book);
        setBook({});
        setOpen(false);
        let updateBooks = await fetchBooks();
        setBooks(updateBooks);
        // console.log("update book details", book);
    };

    const openEditBook = async (book) => {
        let authors = await fetchAuthorNames();
        setAuthors(authors);
        setDialogMode("edit");
        setBook(book);
        setOpen(true);
    };

    const deleteBook = async (bookid) => {
        await callDeleteBook(bookid);
        let updateBooks = await fetchBooks();
        setBooks(updateBooks);
    };

    const openCreateBook = async () => {
        let authors = await fetchAuthorNames();
        setAuthors(authors);
        setDialogMode("create");
        setBook({});
        setOpen(true);
    };

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(books.length / props.itemsPerPage);

    const currentData = books.slice(
        (currentPage - 1) * props.itemsPerPage,
        currentPage * props.itemsPerPage
    );

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    // console.log("books props", props);
    return (
        <div className="p-4">
            <Dialog.Root open={openDialog} onOpenChange={setOpen}>
                <div className="mb-2 flex justify-end">
                    <Dialog.Trigger asChild>
                        <button
                            onClick={openCreateBook}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            + Create
                        </button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
                        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
                            <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
                                {dialogMode == "create"
                                    ? "Add New Book"
                                    : "Edit Book"}
                            </Dialog.Title>
                            <fieldset className="mb-[15px] flex items-center gap-5">
                                <label
                                    className="w-[90px] text-right text-[15px] text-violet11"
                                    htmlFor="title"
                                >
                                    Full Name
                                </label>
                                <input
                                    className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={book.title}
                                    onChange={handleChange}
                                />
                            </fieldset>
                            <fieldset className="mb-[15px] flex items-center gap-5">
                                <label
                                    className="w-[90px] text-right text-[15px] text-violet11"
                                    htmlFor="description"
                                >
                                    About
                                </label>
                                <input
                                    className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    type="text"
                                    id="description"
                                    name="description"
                                    value={book.description}
                                    onChange={handleChange}
                                />
                            </fieldset>
                            <fieldset className="mb-[15px] flex items-center gap-5">
                                <label
                                    className="w-[90px] text-right text-[15px] text-violet11"
                                    htmlFor="authorid"
                                >
                                    Authors
                                </label>
                                {authors ? (
                                    <select
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        id="authorid"
                                        name="authorid"
                                        value={book.authorid}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>
                                            Select an author
                                        </option>
                                        {authors.map((author) => (
                                            <option
                                                key={author.id}
                                                value={author.id}
                                            >
                                                {author.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    "failed to fetch authors"
                                )}
                            </fieldset>
                            <div className="mt-[25px] flex justify-end">
                                {dialogMode == "create" ? (
                                    <Dialog.Close asChild>
                                        <button
                                            onClick={saveBook}
                                            className="bg-green-500 text-white px-3  py-1 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        >
                                            Save
                                        </button>
                                    </Dialog.Close>
                                ) : (
                                    <Dialog.Close asChild>
                                        <button
                                            onClick={updateBook}
                                            className="bg-green-500 text-white px-3  py-1 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        >
                                            Update
                                        </button>
                                    </Dialog.Close>
                                )}
                            </div>
                            <Dialog.Close asChild>
                                <button
                                    className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
                                    aria-label="Close"
                                ></button>
                            </Dialog.Close>
                        </Dialog.Content>
                    </Dialog.Portal>
                </div>
            </Dialog.Root>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentData && currentData.length > 0 ? (
                    currentData.map((book) => (
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
                                    View
                                </Link>
                                <button
                                    onClick={() => openEditBook(book)}
                                    className="bg-green-500 text-white px-3  py-1 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteBook(book.id)}
                                    className="bg-red-500 text-white px-3 py-1  rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                                    // onClick={() => handleDelete(user.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No Books found</p>
                )}
            </div>
            <div className="flex justify-between items-center mt-6">
                {/* Previous Button */}
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${
                        currentPage === 1
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                >
                    Previous
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => goToPage(index + 1)}
                            className={`px-3 py-2 rounded ${
                                currentPage === index + 1
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded ${
                        currentPage === totalPages
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export const getServerSideProps = async (context) => {
    // let books = [];

    // const client = createApolloClient();
    // try {
    //     let response = await client.query({
    //         query: GET_BOOKS,
    //     });
    //     if (
    //         response &&
    //         response.data &&
    //         response.data.books &&
    //         Array.isArray(response.data.books)
    //     ) {
    //         books = response.data.books;
    //     }
    // } catch (err) {
    //     console.error("fetch books error", err);
    // }
    let books = await fetchBooks();
    return {
        props: {
            books: books,
            itemsPerPage: 20,
        },
    };
};

export default BooksComponent;
