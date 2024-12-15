import "@/styles/globals.css";

import Link from "next/link";

export default function App({ Component, pageProps }) {
    // return <Component {...pageProps} />;
    return (
        <div class="flex h-screen bg-gray-100">
            {/* Side Panel */}
            <div class="w-64 bg-gray-800 text-white flex flex-col">
                <div class="px-4 py-6">
                    <h2 class="text-2xl font-bold">Carroll Library</h2>
                </div>
                <nav class="mt-4 flex-1">
                    <ul>
                        {/* Dashboard Menu */}
                        <li>
                            <Link
                                href="/"
                                class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded"
                            >
                                Dashboard
                            </Link>
                        </li>
                        {/* Books Menu */}
                        <li>
                            <Link
                                href="/books"
                                class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded"
                            >
                                Books
                            </Link>
                        </li>
                        {/* Authors Menu */}
                        <li>
                            <Link
                                href="/authors"
                                class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded"
                            >
                                Authors
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div class="flex-1 text-black p-6">
                <Component {...pageProps} />
            </div>
        </div>
    );
}
