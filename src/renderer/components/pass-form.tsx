import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import FingerprintSharpIcon from '@mui/icons-material/FingerprintSharp';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PassSettings from 'renderer/components/pass-settings';
import Alert from '@mui/material/Alert';
import AutorenewSharpIcon from '@mui/icons-material/AutorenewSharp';
import KeySharpIcon from '@mui/icons-material/KeySharp';
import { useEffect, useState } from 'react';
import { PasswordSettings } from 'renderer/types/password-settings';
import { PasswordFormData } from 'renderer/types/password-form-data';
import { Severity } from 'renderer/types/severity';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function PassForm(prop: {
	onSubmit: (data: PasswordFormData) => Promise<boolean>;
	formData?: PasswordFormData;
}) {
	const { onSubmit, formData } = prop;
	// INPUT FIELDS
	const [source, setSource] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	// TOGGLE PASSWORD FIELD VISIBILITY
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleMouseDownPassword = () => setShowPassword(!showPassword);

	// ALERT MESSAGE / SNACKBAR
	const [showAlertMessage, setShowAlertMessage] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState<Severity>();

	// SAVE PASSWORD BUTTON
	const [disableSavePasswordButton, setDisableSavePasswordButton] =
		useState(false);

	// PASSWORD SETTINGS
	const [passwordSettings, setPasswordSettings] =
		useState<PasswordSettings>();

	useEffect(() => {
		if (formData) {
			setSource(formData.source);
			setUsername(formData.username);
			setPassword(formData.password);
		}
	}, [formData]);

	async function generatePassword(e?: React.SyntheticEvent | Event) {
		if (!passwordSettings || !e) {
			return;
		}
		e.preventDefault();
		if (
			passwordSettings.hasUpperCase ||
			passwordSettings.hasLowerCase ||
			passwordSettings.allowDigits ||
			passwordSettings.allowSymbols
		) {
			const generatedPassword = await window.electron.ipcRenderer.invoke(
				'dialog:gen-pass',
				{
					length: passwordSettings.passwordLength,
					uppercase: passwordSettings.hasUpperCase,
					lowercase: passwordSettings.hasLowerCase,
					numbers: passwordSettings.allowDigits,
					symbols: passwordSettings.allowSymbols,
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

	function clearAllFields() {
		setSource('');
		setUsername('');
		setPassword('');
	}

	return (
		<Grid
			container
			component="form"
			spacing={3}
			onSubmit={async (e: React.SyntheticEvent | Event) => {
				e.preventDefault();
				setDisableSavePasswordButton(true);
				const currentFormData: PasswordFormData = {
					source,
					username,
					password,
				};
				if (await onSubmit(currentFormData)) {
					clearAllFields();
				}
				setDisableSavePasswordButton(false);
			}}
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
			<Grid item xs={7}>
				<PassSettings
					onLoaded={(data: PasswordSettings) => {
						setPasswordSettings(data);
					}}
				/>
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
	);
}
