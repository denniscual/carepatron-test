import './App.css';
// import DataProvider from './store/DataProvider';
// import Clients from './pages/Clients';
import Router from './routes';

export default function App() {
	return (
		<div className='App'>
			<Router />
		</div>
	);
}

// export default function App() {
// 	return (
// 		<div className='App'>
// 			<DataProvider>
// 				<Routes>
// 					<Route path='/' element={<Clients />} />
// 					<Route path='/Clients' element={<Clients />} />
// 				</Routes>
// 			</DataProvider>
// 		</div>
// 	);
// }
