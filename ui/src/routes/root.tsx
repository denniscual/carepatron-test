import { LoaderFunction, useLoaderData } from 'react-router-dom';

export default function Root() {
	const data = useLoaderData();
	console.log({ data });
	return <div>Root Route</div>;
}

export const loader: LoaderFunction = async () => {
	return new Promise((res) => setTimeout(() => res('hello'), 5000));
};
