import { gql } from "@apollo/client";
import createApolloClient from "../_apollo_client";
import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";

const GET_AUTHORS = gql`
    query Authors($id: ID) {
        authors(id: $id) {
            id
            name
            biography
            born_date
            Books {
                id
                title
            }
        }
    }
`;

const CREATE_AUTHOR = gql`
    mutation CreateAuthor($author: AuthorInput!) {
        createAuthor(author: $author) {
            id
            name
            biography
            born_date
        }
    }
`;

const DELETE_AUTHOR = gql`
    mutation DeleteAuthor($authorid: ID!) {
        deleteAuthor(authorid: $authorid) {
            message
        }
    }
`;

const UPDATE_AUTHOR = gql`
    mutation UpdateAuthor($author: AuthorInput!) {
        updateAuthor(author: $author) {
            message
        }
    }
`;

export const fetchAuthors = async (whereObj) => {
    let authors = [];

    const client = createApolloClient();
    try {
        let response = await client.query({
            query: GET_AUTHORS,
            variables: whereObj,
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

const callSaveAuthor = async (author) => {
    const client = createApolloClient();
    try {
        await client.mutate({
            mutation: CREATE_AUTHOR,
            variables: {
                author: author,
            },
        });
        // console.log("save author response", response);
    } catch (err) {
        console.error("failed to save author", err);
    }
    return;
};

const callUpdateAuthor = async (author) => {
    const client = createApolloClient();
    try {
        await client.mutate({
            mutation: UPDATE_AUTHOR,
            variables: {
                author: {
                    id: author.id,
                    name: author.name,
                    biography: author.biography,
                    born_date: author.born_date,
                },
            },
        });
        // console.log("update author response", response);
    } catch (err) {
        console.error("failed to update author", err);
    }
    return;
};

const callDeleteAuthor = async (authorid) => {
    const client = createApolloClient();
    try {
        await client.mutate({
            mutation: DELETE_AUTHOR,
            variables: {
                authorid: authorid,
            },
        });
        // console.log("delete author response", response);
    } catch (err) {
        console.error("failed to delete author", err);
    }
    return;
};

const AuthorsComponent = (props) => {
    const [author, setAuthor] = useState({ name: "", biography: "" });
    const [authors, setAuthors] = useState(props.authors);

    const [dialogMode, setDialogMode] = useState("create");

    const [openDialog, setOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAuthor({ ...author, [name]: value });
    };

    const saveAuthor = async (event) => {
        event.preventDefault();
        await callSaveAuthor(author);
        setAuthor({});
        setOpen(false);
        let updateAuthors = await fetchAuthors();
        setAuthors(updateAuthors);
        // console.log("save author details", author);
    };

    const updateAuthor = async (event) => {
        event.preventDefault();
        await callUpdateAuthor(author);
        setAuthor({});
        setOpen(false);
        let updateAuthors = await fetchAuthors();
        setAuthors(updateAuthors);
        // console.log("update author details", author);
    };

    const openEditAuthor = (author) => {
        setDialogMode("edit");
        setAuthor(author);
        setOpen(true);
    };

    const deleteAuthor = async (authorid) => {
        await callDeleteAuthor(authorid);
        let updateAuthors = await fetchAuthors();
        setAuthors(updateAuthors);
    };

    const openCreateAuthor = () => {
        setDialogMode("create");
        setAuthor({});
        setOpen(true);
    };

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(authors.length / props.itemsPerPage);

    const currentData = authors.slice(
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

    // console.log("authors props", props);
    return (
        <div className="p-4">
            <Dialog.Root open={openDialog} onOpenChange={setOpen}>
                <div className="mb-2 flex justify-end">
                    <Dialog.Trigger asChild>
                        <button
                            onClick={openCreateAuthor}
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
                                    ? "Add New Author"
                                    : "Edit Author"}
                            </Dialog.Title>
                            <fieldset className="mb-[15px] flex items-center gap-5">
                                <label
                                    className="w-[90px] text-right text-[15px] text-violet11"
                                    htmlFor="name"
                                >
                                    Full Name
                                </label>
                                <input
                                    className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={author.name}
                                    onChange={handleChange}
                                />
                            </fieldset>
                            <fieldset className="mb-[15px] flex items-center gap-5">
                                <label
                                    className="w-[90px] text-right text-[15px] text-violet11"
                                    htmlFor="biography"
                                >
                                    About
                                </label>
                                <input
                                    className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    type="text"
                                    id="biography"
                                    name="biography"
                                    value={author.biography}
                                    onChange={handleChange}
                                />
                            </fieldset>
                            <div className="mt-[25px] flex justify-end">
                                {dialogMode == "create" ? (
                                    <Dialog.Close asChild>
                                        <button
                                            onClick={saveAuthor}
                                            className="bg-green-500 text-white px-3  py-1 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        >
                                            Save
                                        </button>
                                    </Dialog.Close>
                                ) : (
                                    <Dialog.Close asChild>
                                        <button
                                            onClick={updateAuthor}
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
                    currentData.map((author) => (
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
                                    View
                                </Link>
                                <button
                                    onClick={() => openEditAuthor(author)}
                                    className="bg-green-500 text-white px-3  py-1 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteAuthor(author.id)}
                                    className="bg-red-500 text-white px-3 py-1  rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No Authors found</p>
                )}
            </div>
            {currentData && currentData.length > 0 ? (
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
            ) : (
                <p>No Books found</p>
            )}
        </div>
    );
};

export const getServerSideProps = async (context) => {
    let authors = await fetchAuthors();
    return {
        props: {
            authors,
            itemsPerPage: 20,
        },
    };
};

export default AuthorsComponent;
