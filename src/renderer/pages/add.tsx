import Header from 'renderer/components/header';
import { useState } from 'react';
import Container from '@mui/material/Container';
import PassForm from 'renderer/components/pass-form';
import { PasswordFormData } from 'renderer/types/password-form-data';
import { Severity } from 'renderer/types/severity';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Add() {
	const [openSnackBar, setOpenSnackBar] = useState(false);
	const [alertSeverity, setAlertSeverity] = useState<Severity>();
	const [alertMessage, setAlertMessage] = useState('');

	const handleSnackBarClose = (
		_event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpenSnackBar(false);
	};

	const handleSubmit = async (data: PasswordFormData) => {
		const passwordSaved = await window.electron.ipcRenderer.invoke(
			'dialog:save-pass',
			{
				source: data.source,
				username: data.username,
				password: data.password,
			}
		);
		if (passwordSaved) {
			const successSeverity: Severity = 'success';
			setAlertSeverity(successSeverity);
			setAlertMessage('Password saved!');
			setOpenSnackBar(true);
		} else {
			const errorSeverity: Severity = 'error';
			setAlertSeverity(errorSeverity);
			setAlertMessage('Failed to save password!');
			setOpenSnackBar(true);
		}
		return passwordSaved as boolean;
	};

	return (
		<Container component="main" maxWidth="lg">
			<Header />
			<PassForm
				onSubmit={(data: PasswordFormData) => handleSubmit(data)}
			/>
			<Snackbar
				open={openSnackBar}
				autoHideDuration={5000}
				onClose={handleSnackBarClose}
			>
				<Alert onClose={handleSnackBarClose} severity={alertSeverity}>
					<strong>{alertMessage}</strong>
				</Alert>
			</Snackbar>
		</Container>
	);
}
