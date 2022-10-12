const constants = {
	paths: {
		addPassword: '/add-password',
		login: '/login',
		passwordList: '/password-list',
	},
	dummyText:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vitae suscipit elit, non tristique mi. Vivamus pellentesque purus id arcu.',
	quickGuide:
		'If this is your first time using this program, the credentials you fill now will be used for future uses.',
	importantMessage:
		'REMEMBER: There is no way to recover your username or password, if you forget your credentials, you are going to lose access to your DATABASE file!',
} as const;

export { constants as default };
