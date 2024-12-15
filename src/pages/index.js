export default function Home() {
    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                {/* Author Card */}
                <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Authors</h2>
                    <p className="text-gray-600 mt-2 text-4xl font-bold">45</p>
                </div>
                {/* Book Card */}
                <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Books</h2>
                    <p className="text-gray-600 mt-2 text-4xl font-bold">120</p>
                </div>
            </div>
        </div>
    );
}
