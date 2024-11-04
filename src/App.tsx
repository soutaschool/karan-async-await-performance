import axios from "axios";
import { useState } from "react";

const TOTAL_REQUESTS = 5;

function App() {
	const [syncProgress, setSyncProgress] = useState(0);
	const [asyncProgress, setAsyncProgress] = useState(0);

	const handleSync = async () => {
		setSyncProgress(0);
		const startTime = performance.now();
		for (let i = 0; i < TOTAL_REQUESTS; i++) {
			await axios.get("http://localhost:3000/api/data");
			setSyncProgress(((i + 1) / TOTAL_REQUESTS) * 100);
		}
		const endTime = performance.now();
		alert(
			`Synchronous requests completed in ${(endTime - startTime).toFixed(2)} ms`,
		);
	};

	const handleAsync = async () => {
		setAsyncProgress(0);
		const startTime = performance.now();
		const requests = [];
		for (let i = 0; i < TOTAL_REQUESTS; i++) {
			requests.push(
				axios.get("http://localhost:3000/api/data").then(() => {
					setAsyncProgress((prev) => prev + 100 / TOTAL_REQUESTS);
				}),
			);
		}
		await Promise.all(requests);
		const endTime = performance.now();
		alert(
			`Asynchronous requests completed in ${(endTime - startTime).toFixed(2)} ms`,
		);
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-800 text-black dark:text-white">
			<h1 className="text-3xl font-bold mb-8">Async/Await Performance Demo</h1>
			<div className="flex space-x-4">
				<button
					type="button"
					onClick={handleSync}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					Run Synchronous Requests
				</button>
				<button
					type="button"
					onClick={handleAsync}
					className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
				>
					Run Asynchronous Requests
				</button>
			</div>
			<div className="w-full max-w-md mt-8">
				<h2 className="mb-2">Synchronous Progress</h2>
				<div className="w-full bg-gray-200 rounded h-4">
					<div
						className="bg-blue-500 h-4 rounded"
						style={{ width: `${syncProgress}%` }}
					/>
				</div>
				<h2 className="mb-2 mt-4">Asynchronous Progress</h2>
				<div className="w-full bg-gray-200 rounded h-4">
					<div
						className="bg-green-500 h-4 rounded"
						style={{ width: `${asyncProgress}%` }}
					/>
				</div>
			</div>
		</div>
	);
}

export default App;
