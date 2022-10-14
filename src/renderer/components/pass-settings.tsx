import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { PasswordSettings } from '../types/password-settings';

export default function PassSettings(prop: {
	onLoaded: (data: PasswordSettings) => void;
}) {
	// PASSWORD SETTINGS
	const [passwordLength, setPasswordLength] = useState(20);
	const [hasUpperCase, setHasUpperCase] = useState(true);
	const [hasLowerCase, setHasLowerCase] = useState(true);
	const [allowDigits, setAllowDigits] = useState(true);
	const [allowSymbols, setAllowSymbols] = useState(true);

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

	const onLoadedRef = useRef((passSettings: PasswordSettings) => {
		const { onLoaded } = prop;
		onLoaded(passSettings);
	});

	useEffect(() => {
		const currentSettings: PasswordSettings = {
			passwordLength,
			hasUpperCase,
			hasLowerCase,
			allowDigits,
			allowSymbols,
		};
		onLoadedRef.current(currentSettings);
	}, [passwordLength, hasUpperCase, hasLowerCase, allowDigits, allowSymbols]);

	return (
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
							parseInt((e.target as HTMLInputElement).value, 10)
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
							onChange={(e) => setHasUpperCase(e.target.checked)}
						/>
					}
					label="Uppercase letters"
					name="uppercase-checkbox"
				/>
				<FormControlLabel
					control={
						<Checkbox
							checked={hasLowerCase}
							onChange={(e) => setHasLowerCase(e.target.checked)}
						/>
					}
					label="Lowercase letters"
					name="lowercase-checkbox"
				/>
				<FormControlLabel
					control={
						<Checkbox
							checked={allowDigits}
							onChange={(e) => setAllowDigits(e.target.checked)}
						/>
					}
					label="Allow digits"
					name="allow-digits-checkbox"
				/>
				<FormControlLabel
					control={
						<Checkbox
							checked={allowSymbols}
							onChange={(e) => setAllowSymbols(e.target.checked)}
						/>
					}
					label="Allow symbols"
					name="allow-symbols-checkbox"
				/>
			</Grid>
		</Grid>
	);
}
