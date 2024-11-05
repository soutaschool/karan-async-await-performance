import axios from "axios";
import { useState } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const API_URL = "http://localhost:3000/api/data";
const MAX_REQUESTS = 15;
const STEP = 5;

interface PerformanceData {
	requestCount: number;
	synchronousTime: number;
	asynchronousTime: number;
}

function App() {
	const [data, setData] = useState<PerformanceData[]>([]);
	const [syncProgress, setSyncProgress] = useState(0);
	const [syncTime, setSyncTime] = useState<number | null>(null);
	const [isSyncLoading, setIsSyncLoading] = useState(false);
	const [asyncProgress, setAsyncProgress] = useState(0);
	const [asyncTime, setAsyncTime] = useState<number | null>(null);
	const [isAsyncLoading, setIsAsyncLoading] = useState(false);

	// 5...10...15
	const requestCounts = Array.from(
		{ length: MAX_REQUESTS / STEP },
		(_, i) => (i + 1) * STEP,
	);

	const measureSynchronous = async (count: number): Promise<number> => {
		const startTime = performance.now();
		setSyncProgress(0);
		for (let i = 0; i < count; i++) {
			try {
				await axios.get(API_URL);
				setSyncProgress(((i + 1) / count) * 100);
			} catch (error) {
				console.error(`Synchronous request ${i + 1} error:`, error);
			}
		}
		const endTime = performance.now();
		return endTime - startTime;
	};

	const measureAsynchronous = async (count: number): Promise<number> => {
		const startTime = performance.now();
		setAsyncProgress(0);
		const promises = [];
		for (let i = 0; i < count; i++) {
			promises.push(
				axios
					.get(API_URL)
					.then(() => {
						setAsyncProgress((prev) => Math.min(prev + 100 / count, 100));
					})
					.catch((error) => {
						console.error(`Asynchronous request ${i + 1} error:`, error);
					}),
			);
		}
		await Promise.all(promises);
		const endTime = performance.now();
		return endTime - startTime;
	};

	const runTests = async () => {
		setIsSyncLoading(true);
		setIsAsyncLoading(true);
		const testData: PerformanceData[] = [];

		for (const count of requestCounts) {
			const [syncDuration, asyncDuration] = await Promise.all([
				measureSynchronous(count),
				measureAsynchronous(count),
			]);

			setSyncTime(syncDuration);
			setAsyncTime(asyncDuration);

			testData.push({
				requestCount: count,
				synchronousTime: Number.parseFloat(syncDuration.toFixed(2)),
				asynchronousTime: Number.parseFloat(asyncDuration.toFixed(2)),
			});

			setData([...testData]);
		}

		setIsSyncLoading(false);
		setIsAsyncLoading(false);
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white p-4">
			<h1 className="text-3xl font-bold mb-8">Async/Await Performance Demo</h1>

			<button
				onClick={runTests}
				disabled={isSyncLoading || isAsyncLoading}
				type="button"
				className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded disabled:opacity-50 mb-8"
			>
				{isSyncLoading || isAsyncLoading
					? "Running Tests..."
					: "Run Performance Tests"}
			</button>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-8">
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

			{data.length > 0 && (
				<div className="w-full max-w-4xl">
					<ResponsiveContainer width="100%" height={400}>
						<LineChart
							data={data}
							margin={{
								top: 20,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis
								dataKey="requestCount"
								label={{
									value: "Number of Requests",
									position: "insideBottomRight",
									offset: 0,
								}}
							/>
							<YAxis
								label={{
									value: "Time Taken (ms)",
									angle: -90,
									position: "insideLeft",
								}}
							/>
							<Tooltip />
							<Legend verticalAlign="top" height={36} />
							<Line
								type="monotone"
								dataKey="synchronousTime"
								stroke="#8884d8"
								name="Synchronous Processing"
								activeDot={{ r: 8 }}
							/>
							<Line
								type="monotone"
								dataKey="asynchronousTime"
								stroke="#82ca9d"
								name="Asynchronous Processing"
								activeDot={{ r: 8 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			)}

			{data.length > 0 && (
				<div className="mt-8 text-center">
					<p className="text-lg font-semibold">
						The line chart above visualizes the time taken for synchronous and
						asynchronous processing based on the number of requests.
					</p>
				</div>
			)}
		</div>
	);
}

export default App;
