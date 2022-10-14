import {
	MemoryRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import Login from '../pages/login';
import Add from '../pages/add';
import PassList from '../pages/pass-list';
import './App.css';
import Constants from './constants';

export default function App() {
	const loggedIn = false;
	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						loggedIn ? (
							<Navigate to={Constants.paths.addPassword} />
						) : (
							<Navigate to={Constants.paths.login} />
						)
					}
				/>
				<Route path={Constants.paths.addPassword} element={<Add />} />
				<Route path={Constants.paths.login} element={<Login />} />
				<Route
					path={Constants.paths.passwordList}
					element={<PassList />}
				/>
			</Routes>
		</Router>
	);
}
