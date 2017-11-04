module.exports = {
	server_port: 3000,
	https_port: 3443,
	mysql : {
		connectionLimit: 5000,
		host: '58.141.234.126',
		port: '55336',
		user: 'root',
		database: 'terriordb',
		password: 'kit2017'
	},
	route_info: [
		{file : './device_push', path : '/process/devicepush', method: 'device_push', type: 'get'},
		{file : './device_push', path : '/process/devicepushgroup', method: 'device_push_group', type: 'get'},
		{file : './device_on', path : '/process/deviceon', method: 'device_on', type: 'post'},
		{file : './device_on', path : '/process/arduinoonoff', method: 'arduino_on', type: 'post'},
		{file : './device_off', path : '/process/deviceoff', method: 'device_off', type: 'post'},
		{file : './device_location', path : '/process/locationadd', method: 'device_location', type: 'post'},
		{file : './device_manage', path : '/process/device_manage', method: 'device_manage', type: 'post'},
		{file : './app_manage', path : '/process/appmanage', method: 'app_manage', type: 'post'},
		{file : './app_update', path : '/process/appupdate', method: 'app_update', type: 'post'},
	],
	fcm_api_key: 'AAAAEQgOYvo:APA91bHnmHGRlHrcxGkHi1hg2Ao2L9MBYxQt1jiK4TjVeWUf_o-lxexE1LZ1iS2XoKeqCpIszjIX16UaX6L3i3-zVsTmMINnp2loWb1O6wYN1ESaAgNi80o1Mwt-Fw8TfxUnbO-k6L7R'
};