import gql from "graphql-tag";
import { useState } from "react";
import createApolloClient from "../apollo_client";

import Link from "next/link";

import { fetchBooks } from "../books";
import * as Dialog from "@radix-ui/react-dialog";

const CREATE_BOOK_REVIEW = gql`
    mutation CreateReview($review: BookReviewInput) {
        createReview(review: $review) {
            id
            bookid
            rating
            review
        }
    }
`;

const GET_BOOK_REVIEWS = gql`
    query Bookreviews($bookid: ID!) {
        bookreviews(bookid: $bookid) {
            id
            rating
            review
        }
    }
`;

const callSaveBookReview = async (review) => {
    const client = createApolloClient();
    try {
        await client.mutate({
            mutation: CREATE_BOOK_REVIEW,
            variables: {
                review: review,
            },
        });
        // console.log("save book review response", response);
    } catch (err) {
        console.error("failed to save book review", err);
    }
    return;
};

const callGetBookReviews = async (bookid) => {
    let reviews = [];

    const client = createApolloClient();
    try {
        let response = await client.query({
            query: GET_BOOK_REVIEWS,
            variables: {
                bookid: bookid,
            },
        });
        if (
            response &&
            response.data &&
            response.data.bookreviews &&
            Array.isArray(response.data.bookreviews)
        ) {
            reviews = response.data.bookreviews;
        }
    } catch (err) {
        console.error("fetch book reviews error", err);
    }
    return reviews;
};

const BookComponent = (props) => {
    // console.log("given props", props);
    const [book, setBook] = useState(props.book);
    const [review, setReview] = useState({ rating: 1, review: "" });

    const [openDialog, setOpen] = useState(false);
    const [reviews, setReviews] = useState(props.reviews);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReview({ ...review, [name]: value });
    };

    const openCreateReview = () => {};

    const saveReview = async (event) => {
        event.preventDefault();
        review.bookid = book.id;
        // console.log("review model", review);
        await callSaveBookReview(review);
        setReview({});
        setOpen(false);
        let updateBooksReviews = await callGetBookReviews(book.id);
        setReviews(updateBooksReviews);
    };

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
                <Dialog.Root open={openDialog} onOpenChange={setOpen}>
                    <div className="mb-2 flex justify-end">
                        <Dialog.Trigger asChild>
                            <button
                                onClick={openCreateReview}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                + Create
                            </button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
                            <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
                                <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
                                    Add New Review
                                </Dialog.Title>
                                <fieldset className="mb-[15px] flex items-center gap-5">
                                    <label
                                        className="w-[90px] text-right text-[15px] text-violet11"
                                        htmlFor="rating"
                                    >
                                        Rating
                                    </label>
                                    <input
                                        className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                        id="rating"
                                        min={1}
                                        max={5}
                                        type="number"
                                        name="rating"
                                        value={review.rating}
                                        onChange={handleChange}
                                    />
                                </fieldset>
                                <fieldset className="mb-[15px] flex items-center gap-5">
                                    <label
                                        className="w-[90px] text-right text-[15px] text-violet11"
                                        htmlFor="review"
                                    >
                                        Review
                                    </label>
                                    <input
                                        className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                        type="text"
                                        id="review"
                                        name="review"
                                        value={review.review}
                                        onChange={handleChange}
                                    />
                                </fieldset>
                                <div className="mt-[25px] flex justify-end">
                                    <Dialog.Close asChild>
                                        <button
                                            onClick={saveReview}
                                            className="bg-green-500 text-white px-3  py-1 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        >
                                            Save
                                        </button>
                                    </Dialog.Close>
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
                <ul className="space-y-4">
                    {reviews && Array.isArray(reviews) && reviews.length > 0
                        ? reviews.map((review) => (
                              <div
                                  key={review.id}
                                  className="p-4 bg-gray-100 rounded shadow-md"
                              >
                                  <div className="flex items-center mb-2">
                                      <span className="text-lg font-semibold">
                                          Rating:
                                      </span>
                                      <div className="flex ml-2">
                                          {[...Array(5)].map((_, index) => (
                                              <svg
                                                  key={index}
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill={
                                                      index < review.rating
                                                          ? "gold"
                                                          : "none"
                                                  }
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                                  className={`w-5 h-5 ${
                                                      index < review.rating
                                                          ? "text-yellow-400"
                                                          : "text-gray-300"
                                                  }`}
                                              >
                                                  <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth="2"
                                                      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                                  />
                                              </svg>
                                          ))}
                                      </div>
                                  </div>
                                  <p className="text-gray-700">
                                      {review.review}
                                  </p>
                              </div>
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
    const reviews = await callGetBookReviews(bookid);
    return {
        props: {
            book: book,
            reviews: reviews,
        },
    };
};

export default BookComponent;
