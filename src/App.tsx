// src/App.tsx
import axios from "axios";
import { useState } from "react";

const TOTAL_REQUESTS = 50;

function App() {
	const [syncProgress, setSyncProgress] = useState(0);
	const [asyncProgress, setAsyncProgress] = useState(0);
	const [syncTime, setSyncTime] = useState<number | null>(null);
	const [asyncTime, setAsyncTime] = useState<number | null>(null);
	const [isSyncLoading, setIsSyncLoading] = useState(false);
	const [isAsyncLoading, setIsAsyncLoading] = useState(false);

	const API_URL = "http://localhost:3000/api/data";

	const handleSync = async () => {
		setSyncProgress(0);
		setSyncTime(null);
		setIsSyncLoading(true);
		const startTime = performance.now();
		for (let i = 0; i < TOTAL_REQUESTS; i++) {
			try {
				await axios.get(API_URL);
				setSyncProgress(((i + 1) / TOTAL_REQUESTS) * 100);
			} catch (error) {
				console.error("Synchronous request error:", error);
			}
		}
		const endTime = performance.now();
		const timeTaken = endTime - startTime;
		setSyncTime(timeTaken);
		setIsSyncLoading(false);
	};

	const handleAsync = async () => {
		setAsyncProgress(0);
		setAsyncTime(null);
		setIsAsyncLoading(true);
		const startTime = performance.now();
		const requests = [];
		for (let i = 0; i < TOTAL_REQUESTS; i++) {
			requests.push(
				axios
					.get(API_URL)
					.then(() => {
						setAsyncProgress((prev) => prev + 100 / TOTAL_REQUESTS);
					})
					.catch((error) => {
						console.error("Asynchronous request error:", error);
					}),
			);
		}
		await Promise.all(requests);
		const endTime = performance.now();
		const timeTaken = endTime - startTime;
		setAsyncTime(timeTaken);
		setIsAsyncLoading(false);
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white p-4">
			<h1 className="text-3xl font-bold mb-8">Async/Await Performance Demo</h1>
			<div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
				<button
					onClick={handleSync}
					disabled={isSyncLoading || isAsyncLoading}
					type="button"
					className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded disabled:opacity-50"
				>
					{isSyncLoading ? "Processing..." : "Run Synchronous Requests"}
				</button>
				<button
					onClick={handleAsync}
					disabled={isAsyncLoading || isSyncLoading}
					type="button"
					className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded disabled:opacity-50"
				>
					{isAsyncLoading ? "Processing..." : "Run Asynchronous Requests"}
				</button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
				{/* Synchronous Card */}
				<div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-4">Synchronous Requests</h2>
					<div className="relative w-full bg-gray-300 dark:bg-gray-700 h-6 rounded mb-4">
						<div
							className="bg-blue-500 h-6 rounded"
							style={{ width: `${syncProgress}%` }}
						/>
						<div className="absolute inset-0 flex justify-center items-center">
							<span className="text-black dark:text-white font-semibold">
								{Math.round(syncProgress)}%
							</span>
						</div>
					</div>
					{isSyncLoading && (
						<div className="flex items-center">
							<svg
								className="animate-spin h-5 w-5 mr-3 text-blue-500"
								viewBox="0 0 24 24"
								role="img"
								aria-label="Loading"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v8z"
								/>
							</svg>
							<span>Loading...</span>
						</div>
					)}
					{syncTime !== null && (
						<p className="mt-2">
							Time taken: <strong>{syncTime.toFixed(2)} ms</strong>
						</p>
					)}
				</div>
				{/* Asynchronous Card */}
				<div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-4">Asynchronous Requests</h2>
					<div className="relative w-full bg-gray-300 dark:bg-gray-700 h-6 rounded mb-4">
						<div
							className="bg-green-500 h-6 rounded"
							style={{ width: `${asyncProgress}%` }}
						/>
						<div className="absolute inset-0 flex justify-center items-center">
							<span className="text-black dark:text-white font-semibold">
								{Math.round(asyncProgress)}%
							</span>
						</div>
					</div>
					{isAsyncLoading && (
						<div className="flex items-center">
							<svg
								className="animate-spin h-5 w-5 mr-3 text-green-500"
								viewBox="0 0 24 24"
								role="img"
								aria-label="Loading"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v8z"
								/>
							</svg>
							<span>Loading...</span>
						</div>
					)}
					{asyncTime !== null && (
						<p className="mt-2">
							Time taken: <strong>{asyncTime.toFixed(2)} ms</strong>
						</p>
					)}
				</div>
			</div>
			{syncTime !== null && asyncTime !== null && (
				<div className="mt-8 text-center">
					<p className="text-lg font-semibold">
						Performance difference:{" "}
						<strong>{Math.abs(syncTime - asyncTime).toFixed(2)} ms</strong>
					</p>
				</div>
			)}
		</div>
	);
}

export default App;
