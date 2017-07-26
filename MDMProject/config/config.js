module.exports = {
	server_port: 3000,
	https_port: 3443,
	route_info: [
		{file : './user_add', path : '/process/useradd', method: 'user_add', type: 'post'},
		{file : './device_add', path : '/process/deviceadd', method: 'device_add', type: 'post'},
		{file : './device_push_all', path : '/process/devicepushall', method: 'device_push_all', type: 'post'},
		{file : './device_push_one', path : '/process/devicepushone', method: 'device_push_one', type: 'post'},
		{file : './application_add', path : '/process/applicationadd', method: 'application_add', type: 'post'}
	],
	fcm_api_key: 'AAAAEQgOYvo:APA91bHnmHGRlHrcxGkHi1hg2Ao2L9MBYxQt1jiK4TjVeWUf_o-lxexE1LZ1iS2XoKeqCpIszjIX16UaX6L3i3-zVsTmMINnp2loWb1O6wYN1ESaAgNi80o1Mwt-Fw8TfxUnbO-k6L7R'
};