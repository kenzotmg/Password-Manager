import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import Header from 'renderer/header/header';
import FingerprintSharpIcon from '@mui/icons-material/FingerprintSharp';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import KeySharpIcon from '@mui/icons-material/KeySharp';
import ContentCopySharpIcon from '@mui/icons-material/ContentCopySharp';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import Constants from 'renderer/constants';

export default function PassList() {
	const [passwords, setPasswords] = useState<unknown>([]);
	const [allPasswords, setAllPasswords] = useState<unknown>([]);

	const [isLoading, setLoading] = useState(true);
	const [openSnackBar, setOpenSnackBar] = useState(false);
	const [snackBarMessage, setSnackBarMessage] = useState('');

	const handleSnackBarClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpenSnackBar(false);
	};

	const handleSearch = (value: string) => {
		const matchedPasswords: unknown = [];
		if (value) {
			// eslint-disable-next-line array-callback-return
			allPasswords.map((obj) => {
				if (obj.source.toLowerCase().includes(value.toLowerCase())) {
					matchedPasswords.push(obj);
				}
			});
			setPasswords(matchedPasswords);
		} else {
			setPasswords(allPasswords);
		}
	};

	window.electron.ipcRenderer.on('dialog:retrieve-all-pass', (arg) => {
		setAllPasswords(arg);
		setPasswords(arg);
		setLoading(false);
	});

	useEffect(() => {
		window.electron.ipcRenderer.sendMessage('dialog:retrieve-all-pass', []);
	}, []);

	if (isLoading) {
		return (
			<Container maxWidth="lg">
				<Header />
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<CircularProgress />
				</Box>
			</Container>
		);
	}
	return (
		<Container component="main" maxWidth="lg">
			<Header />
			<Snackbar
				open={openSnackBar}
				autoHideDuration={4000}
				onClose={handleSnackBarClose}
			>
				<Alert onClose={handleSnackBarClose} severity="success">
					<strong>{snackBarMessage}</strong>
				</Alert>
			</Snackbar>
			<Grid
				container
				spacing={2}
				sx={{
					mt: 2,
				}}
			>
				<Grid item xs={12} display="flex" justifyContent="center">
					<TextField
						id="outlined-search"
						label="Search by source"
						type="search"
						style={{ width: '50%' }}
						onChange={(e) => handleSearch(e.target.value)}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<SearchIcon />
								</InputAdornment>
							),
						}}
					/>
				</Grid>
				{passwords
					? passwords.map((data: unknown) => {
							return (
								<Grid item xs={4} key={data.primary_key}>
									<Paper elevation={5} sx={{ padding: 1.5 }}>
										<Grid container spacing={3}>
											<Grid item xs={12}>
												<Grid
													container
													alignItems="center"
													wrap="nowrap"
												>
													<Grid item>
														<FingerprintSharpIcon />
													</Grid>
													<Grid
														item
														ml={1}
														zeroMinWidth
													>
														<Typography
															variant="h6"
															noWrap
														>
															{data.source}
														</Typography>
													</Grid>
												</Grid>
											</Grid>
											<Grid item xs={12}>
												<Grid
													container
													alignItems="center"
													wrap="nowrap"
												>
													<Grid item xs={1}>
														<AccountCircleSharpIcon />
													</Grid>
													<Grid
														item
														ml={1}
														zeroMinWidth
														xs={10}
													>
														<Typography
															variant="body2"
															noWrap
														>
															{data.username}
														</Typography>
													</Grid>
													<Grid
														item
														zeroMinWidth
														xs={1}
														mr={1}
													>
														<IconButton
															aria-label="copy username"
															onClick={(e) => {
																navigator.clipboard.writeText(
																	data.username
																);
																setSnackBarMessage(
																	'Username copied!'
																);
																setOpenSnackBar(
																	true
																);
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
																	onClick={(
																		e
																	) => {
																		navigator.clipboard.writeText(
																			data.password
																		);
																		setSnackBarMessage(
																			'Password copied!'
																		);
																		setOpenSnackBar(
																			true
																		);
																	}}
																>
																	<ContentCopySharpIcon />
																</IconButton>
															</InputAdornment>
														),
													}}
												/>
											</Grid>
										</Grid>
									</Paper>
								</Grid>
							);
					  })
					: 'None'}
			</Grid>
		</Container>
	);
}
