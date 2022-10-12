import Header from 'renderer/header/header';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import FingerprintSharpIcon from '@mui/icons-material/FingerprintSharp';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import KeySharpIcon from '@mui/icons-material/KeySharp';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import AutorenewSharpIcon from '@mui/icons-material/AutorenewSharp';
import Box from '@mui/material/Box';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import Alert from '@mui/material/Alert';

export default function Add() {
	// INPUT FIELDS
	const [source, setSource] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	// TOGGLE PASSWORD FIELD VISIBILITY
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleMouseDownPassword = () => setShowPassword(!showPassword);

	// PASSWORD SETTINGS
	const [passwordLength, setPasswordLength] = useState(20);
	const [hasUpperCase, setHasUpperCase] = useState(true);
	const [hasLowerCase, setHasLowerCase] = useState(true);
	const [allowDigits, setAllowDigits] = useState(true);
	const [allowSymbols, setAllowSymbols] = useState(true);

	// SAVE PASSWORD BUTTON
	const [disableSavePasswordButton, setDisableSavePasswordButton] =
		useState(false);

	// ALERT MESSAGE
	const [showAlertMessage, setShowAlertMessage] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	type Severity = 'error' | 'success' | 'info' | 'warning' | undefined;
	let tempSeverity: Severity;
	const [alertSeverity, setAlertSeverity] = useState(tempSeverity);

	const passwordLengthMarks = [
		{
			value: 5,
			label: '5',
		},
		{
			value: 40,
			label: '40',
		},
	];

	function clearAllFields() {
		setSource('');
		setUsername('');
		setPassword('');
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setDisableSavePasswordButton(true);
		const hasPassSaved = await window.electron.ipcRenderer.invoke(
			'dialog:save-pass',
			{
				source,
				username,
				password,
			}
		);
		if (hasPassSaved) {
			setShowAlertMessage(true);
			setAlertMessage('Password saved!');
			const successSeverity: Severity = 'success';
			setAlertSeverity(successSeverity);
			setDisableSavePasswordButton(false);
			clearAllFields();
		} else {
			setShowAlertMessage(true);
			setAlertMessage('Failed to save password!');
			const errorSeverity: Severity = 'error';
			setAlertSeverity(errorSeverity);
			setDisableSavePasswordButton(false);
		}
	}

	async function generatePassword(e) {
		e.preventDefault();
		if (hasUpperCase || hasLowerCase || allowDigits || allowSymbols) {
			const generatedPassword = await window.electron.ipcRenderer.invoke(
				'dialog:gen-pass',
				{
					length: passwordLength,
					uppercase: hasUpperCase,
					lowercase: hasLowerCase,
					numbers: allowDigits,
					symbols: allowSymbols,
				}
			);

			setPassword(generatedPassword as string);
		} else {
			setShowAlertMessage(true);
			setAlertMessage('At least one of the options must be checked!');
			const errorSeverity: Severity = 'error';
			setAlertSeverity(errorSeverity);
		}
	}

	return (
		<Container component="main" maxWidth="lg">
			<Header />
			<Grid
				container
				component="form"
				spacing={3}
				onSubmit={(e) => handleSubmit(e)}
				sx={{
					justifyContent: 'center',
					mt: 2,
				}}
			>
				<Grid item xs={7}>
					<TextField
						label="Source"
						id="source-field"
						value={source}
						onChange={(e) => setSource(e.target.value)}
						required
						fullWidth
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<FingerprintSharpIcon />
								</InputAdornment>
							),
						}}
					/>
				</Grid>
				<Grid item xs={7}>
					<TextField
						label="Username/Email"
						id="username-field"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						fullWidth
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<AccountCircleSharpIcon />
								</InputAdornment>
							),
						}}
					/>
				</Grid>
				<Grid item xs={8}>
					<TextField
						label="Password"
						id="password-field"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						type={showPassword ? 'text' : 'password'}
						fullWidth
						required
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<KeySharpIcon />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="generate new password"
										onClick={(e) => generatePassword(e)}
									>
										<AutorenewSharpIcon />
									</IconButton>
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
				</Grid>
				<Grid item xs={7}>
					<Grid container spacing={5}>
						<Grid item xs={6}>
							<Typography variant="overline" gutterBottom>
								Password length
							</Typography>
							<Slider
								value={passwordLength}
								min={5}
								max={40}
								onChange={(e) =>
									setPasswordLength(
										parseInt(
											(e.target as HTMLInputElement)
												.value,
											10
										)
									)
								}
								aria-label="Default"
								name="password-length-slider"
								marks={passwordLengthMarks}
								valueLabelDisplay="auto"
							/>
						</Grid>
						<Grid item xs={6}>
							<FormControlLabel
								control={
									<Checkbox
										checked={hasUpperCase}
										onChange={(e) =>
											setHasUpperCase(e.target.checked)
										}
									/>
								}
								label="Uppercase letters"
								name="uppercase-checkbox"
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={hasLowerCase}
										onChange={(e) =>
											setHasLowerCase(e.target.checked)
										}
									/>
								}
								label="Lowercase letters"
								name="lowercase-checkbox"
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={allowDigits}
										onChange={(e) =>
											setAllowDigits(e.target.checked)
										}
									/>
								}
								label="Allow digits"
								name="allow-digits-checkbox"
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={allowSymbols}
										onChange={(e) =>
											setAllowSymbols(e.target.checked)
										}
									/>
								}
								label="Allow symbols"
								name="allow-symbols-checkbox"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={6}>
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						mt={1}
					>
						<Button
							type="submit"
							variant="contained"
							disabled={disableSavePasswordButton}
							startIcon={<AddCircleOutlineSharpIcon />}
							size="small"
						>
							Save Password
						</Button>
					</Box>
				</Grid>
				<Grid
					item
					xs={7}
					sx={{ display: showAlertMessage ? 'block' : 'none' }}
				>
					<Alert
						severity={alertSeverity}
						onClose={() => setShowAlertMessage(false)}
					>
						<strong>{alertMessage}</strong>
					</Alert>
				</Grid>
			</Grid>
		</Container>
	);
}
