import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useNavigate, useLocation } from 'react-router-dom';
import FormatListBulletedSharpIcon from '@mui/icons-material/FormatListBulletedSharp';
import LockSharpIcon from '@mui/icons-material/LockSharp';
import Constants from 'renderer/core/constants';

export default function Header() {
	const navigate = useNavigate();
	const location = useLocation();
	return (
		<Stack
			direction="row"
			spacing={3}
			sx={{
				justifyContent: 'space-evenly',
				margin: 2,
			}}
		>
			<Button
				variant="contained"
				disabled={location.pathname === Constants.paths.addPassword}
				startIcon={<LockSharpIcon />}
				onClick={() => navigate(Constants.paths.addPassword)}
				size="medium"
			>
				Add password
			</Button>
			<Button
				variant="contained"
				disabled={location.pathname === Constants.paths.passwordList}
				startIcon={<FormatListBulletedSharpIcon />}
				onClick={() => navigate(Constants.paths.passwordList)}
				size="medium"
			>
				Password list
			</Button>
		</Stack>
	);
}
