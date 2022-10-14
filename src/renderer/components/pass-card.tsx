import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import FingerprintSharpIcon from '@mui/icons-material/FingerprintSharp';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import ContentCopySharpIcon from '@mui/icons-material/ContentCopySharp';
import KeySharpIcon from '@mui/icons-material/KeySharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import CreateSharpIcon from '@mui/icons-material/CreateSharp';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { PasswordRecord } from 'renderer/types/password-record';
import { PasswordFormData } from 'renderer/types/password-form-data';
import { Severity } from 'renderer/types/severity';
import Constants from 'renderer/core/constants';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PassForm from './pass-form';

export default function PassCard(props: { data: PasswordRecord }) {
	const { data } = props;
	const dataAsFormData: PasswordFormData = {
		source: data.source,
		username: data.username,
		password: data.password,
	};
	// ALERT / SNACKBAR
	const [openSnackBar, setOpenSnackBar] = useState(false);
	const [snackBarMessage, setSnackBarMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState<Severity>();
	// EDIT / DELETE DIALOG
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);

	const handleSnackBarClose = (
		_event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpenSnackBar(false);
	};

	const handleEditSubmit = async (formData: PasswordFormData) => {
		const passEdited = window.electron.ipcRenderer.invoke(
			'dialog:edit-pass',
			{
				primary_key: data.primary_key,
				formData,
			}
		);

		if (passEdited) {
			window.electron.ipcRenderer.sendMessage(
				'dialog:retrieve-all-pass',
				[]
			);
			setSnackBarMessage('Password edited!');
			const successSeverity: Severity = 'success';
			setAlertSeverity(successSeverity);
			setOpenSnackBar(true);
		} else {
			setSnackBarMessage('Failed to edit password');
			const errorSeverity: Severity = 'error';
			setAlertSeverity(errorSeverity);
			setOpenSnackBar(true);
		}

		setOpenEditDialog(false);
		return passEdited as boolean;
	};

	const handleDelete = (pk: number) => {
		const passDeleted = window.electron.ipcRenderer.invoke(
			'dialog:delete-pass',
			{
				primary_key: pk,
			}
		);

		if (passDeleted) {
			window.electron.ipcRenderer.sendMessage(
				'dialog:retrieve-all-pass',
				[]
			);
			setSnackBarMessage('Password deleted!');
			const successSeverity: Severity = 'success';
			setAlertSeverity(successSeverity);
			setOpenSnackBar(true);
		} else {
			setSnackBarMessage('Failed to delete password');
			const errorSeverity: Severity = 'error';
			setAlertSeverity(errorSeverity);
			setOpenSnackBar(true);
		}

		setOpenDeleteDialog(false);
	};

	return (
		<Grid
			container
			spacing={2}
			sx={{
				mt: 2,
			}}
		>
			<Grid item xs={12} key={data.primary_key}>
				<Paper elevation={5} sx={{ padding: 1.5 }}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Grid container alignItems="center" wrap="nowrap">
								<Grid item>
									<FingerprintSharpIcon />
								</Grid>
								<Grid item ml={1} zeroMinWidth>
									<Typography variant="h6" noWrap>
										{data.source}
									</Typography>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Grid container alignItems="center" wrap="nowrap">
								<Grid item xs={1}>
									<AccountCircleSharpIcon />
								</Grid>
								<Grid item ml={1} zeroMinWidth xs={10}>
									<Typography variant="body2" noWrap>
										{data.username}
									</Typography>
								</Grid>
								<Grid item zeroMinWidth xs={1} mr={1}>
									<IconButton
										aria-label="copy username"
										onClick={() => {
											navigator.clipboard.writeText(
												data.username
											);
											setSnackBarMessage(
												'Username copied!'
											);
											setOpenSnackBar(true);
										}}
									>
										<ContentCopySharpIcon />
									</IconButton>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label="Password"
								id="password-field"
								value={Constants.dummyText}
								disabled
								type="password"
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
												aria-label="copy password"
												onClick={() => {
													navigator.clipboard.writeText(
														data.password
													);
													setSnackBarMessage(
														'Password copied!'
													);
													setOpenSnackBar(true);
												}}
											>
												<ContentCopySharpIcon />
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item xs={6} display="flex" justifyContent="start">
							<IconButton onClick={() => setOpenEditDialog(true)}>
								<CreateSharpIcon fontSize="small" />
							</IconButton>
							<Dialog
								open={openEditDialog}
								onClose={() => setOpenEditDialog(false)}
							>
								<DialogTitle>Edit password</DialogTitle>
								<DialogContent>
									<PassForm
										onSubmit={(
											formData: PasswordFormData
										) => handleEditSubmit(formData)}
										formData={dataAsFormData}
									/>
								</DialogContent>
							</Dialog>
						</Grid>
						<Grid item xs={6} display="flex" justifyContent="end">
							<IconButton
								onClick={() => {
									setOpenDeleteDialog(true);
								}}
							>
								<DeleteSharpIcon fontSize="small" />
							</IconButton>
							<Dialog
								open={openDeleteDialog}
								onClose={() => {
									setOpenDeleteDialog(false);
								}}
								aria-labelledby="alert-dialog-title"
								aria-describedby="alert-dialog-description"
							>
								<DialogTitle id="alert-dialog-title">
									Are you sure you want to delete this
									password?
								</DialogTitle>
								<DialogActions>
									<Button
										onClick={() => {
											handleDelete(data.primary_key);
										}}
									>
										DELETE
									</Button>
									<Button
										onClick={() => {
											setOpenDeleteDialog(false);
										}}
										autoFocus
									>
										CANCEL
									</Button>
								</DialogActions>
							</Dialog>
						</Grid>
					</Grid>
				</Paper>
				<Snackbar
					open={openSnackBar}
					autoHideDuration={4000}
					onClose={handleSnackBarClose}
				>
					<Alert
						onClose={handleSnackBarClose}
						severity={alertSeverity}
					>
						<strong>{snackBarMessage}</strong>
					</Alert>
				</Snackbar>
			</Grid>
		</Grid>
	);
}
