import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Header from 'renderer/components/header';
import { PasswordRecord } from 'renderer/types/password-record';
import PassCard from 'renderer/components/pass-card';

export default function PassList() {
	const [passwords, setPasswords] = useState<PasswordRecord[]>([]);
	const [allPasswords, setAllPasswords] = useState<PasswordRecord[]>([]);

	const [isLoading, setLoading] = useState(true);

	const handleSearch = (value: string) => {
		const matchedPasswords: PasswordRecord[] = [];
		if (value) {
			allPasswords.forEach((obj) => {
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
		const retrievedPasswords: PasswordRecord[] = arg as PasswordRecord[];
		setAllPasswords(retrievedPasswords);
		setPasswords(retrievedPasswords);
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
				{passwords.map((record: PasswordRecord) => {
					return (
						<Grid item xs={4}>
							<PassCard data={record} />
						</Grid>
					);
				})}
			</Grid>
		</Container>
	);
}
