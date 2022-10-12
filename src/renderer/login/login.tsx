import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import KeySharpIcon from '@mui/icons-material/KeySharp';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Constants from 'renderer/constants';
import Avatar from '@mui/material/Avatar';
import AlertTitle from '@mui/material/AlertTitle';
import HelpOutlineSharpIcon from '@mui/icons-material/HelpOutlineSharp';
import ErrorSharpIcon from '@mui/icons-material/ErrorSharp';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Zoom from '@mui/material/Zoom';
import logo from '../../../assets/logo.png';

export default function Login() {
	const [isValidUsername, setValidUsername] = useState(true);
	const [isValidPassword, setValidPassword] = useState(true);

	const [errorMessage, setErrorMessage] = useState('');
	const [hasAuthenticatedFailed, sethasAuthenticatedFailed] = useState(false);

	const [usernameHelperText, setUsernameHelperText] = useState('');
	const [passwordHelperText, setPasswordHelperText] = useState('');

	// TOGGLE PASSWORD FIELD VISIBILITY
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleMouseDownPassword = () => setShowPassword(!showPassword);

	const [disableSignInButton, setDisableSignInButton] = useState(false);

	const navigate = useNavigate();

	const LogoComponent = () => {
		return (
			<Avatar
				alt="password manager logo"
				src={logo}
				sx={{ width: 200, height: 200, mb: 8, mt: 2 }}
			/>
		);
	};

	function loginSuccessfull() {
		navigate(Constants.paths.addPassword);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setDisableSignInButton(true);
		const data = new FormData(e.currentTarget);
		const username = data.get('uname');
		const password = data.get('password');
		const authenticated = await window.electron.ipcRenderer.invoke(
			'dialog:login',
			{
				username,
				password,
			}
		);
		if (authenticated) {
			setDisableSignInButton(false);
			loginSuccessfull();
		} else {
			sethasAuthenticatedFailed(true);
			setErrorMessage('Wrong credentials for given file');
			setDisableSignInButton(false);
		}
	}

	function validateUsername(value: string) {
		if (value.length >= 4) {
			setValidUsername(true);
			setUsernameHelperText('');
		} else {
			setValidUsername(false);
			setUsernameHelperText('Username needs at least 4 characters');
		}
	}

	function validatePassword(value: string) {
		if (value.length >= 8) {
			setValidPassword(true);
			setPasswordHelperText('');
		} else {
			setValidPassword(false);
			setPasswordHelperText('Password needs at least 8 characters');
		}
	}

	const AlertMessage = () => {
		return (
			<Alert
				sx={{
					display: hasAuthenticatedFailed ? 'flex' : 'none',
					mt: 3,
				}}
				onClose={(e) => sethasAuthenticatedFailed(false)}
				severity="error"
			>
				<AlertTitle>
					<strong>Login failed!</strong>
				</AlertTitle>
				{errorMessage}
			</Alert>
		);
	};

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 1,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<LogoComponent />
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<Box
					component="form"
					onSubmit={(e) => handleSubmit(e)}
					sx={{ mt: 1 }}
				>
					<TextField
						name="uname"
						label="Username"
						variant="filled"
						error={!isValidUsername}
						helperText={usernameHelperText}
						fullWidth
						required
						autoFocus
						onChange={(e) => validateUsername(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<AccountCircleSharpIcon />
								</InputAdornment>
							),
						}}
					/>
					<TextField
						name="password"
						label="Password"
						type={showPassword ? 'text' : 'password'}
						variant="filled"
						error={!isValidPassword}
						helperText={passwordHelperText}
						fullWidth
						required
						onChange={(e) => validatePassword(e.target.value)}
						sx={{ mt: 1 }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<KeySharpIcon />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
									>
										{showPassword ? (
											<Visibility />
										) : (
											<VisibilityOff />
										)}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					<Grid container>
						<Grid item xs>
							<Tooltip
								title={Constants.quickGuide}
								placement="left-start"
								TransitionComponent={Zoom}
							>
								<HelpOutlineSharpIcon sx={{ mt: 2 }} />
							</Tooltip>
						</Grid>
						<Grid
							item
							xs
							sx={{
								display: 'flex',
								justifyContent: 'end',
							}}
						>
							<Tooltip
								title={Constants.importantMessage}
								placement="left-start"
								TransitionComponent={Zoom}
							>
								<ErrorSharpIcon sx={{ mt: 2 }} />
							</Tooltip>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 2, mb: 1 }}
						disabled={disableSignInButton}
					>
						Sign In
					</Button>
					<AlertMessage />
				</Box>
			</Box>
		</Container>
	);
}
