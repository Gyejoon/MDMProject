module.exports = {
	server_port: 3000,
	https_port: 3443,
	route_info: [
		{file : './user_add', path : '/process/useradd', method: 'user_add', type: 'post'},
		{file : './device_push', path : '/process/devicepush', method: 'device_push', type: 'post'},
		{file : './device_push', path : '/process/devicepushone', method: 'device_push_one', type: 'post'},
		{file : './device_on', path : '/process/deviceon', method: 'device_on', type: 'post'},
		{file : './device_off', path : '/process/deviceoff', method: 'device_off', type: 'post'},
		{file : './device_refresh', path : '/process/devicerefresh', method: 'device_refresh', type: 'post'},
		{file : './device_location', path : '/process/locationadd', method: 'device_location', type: 'post'},
	],
	fcm_api_key: 'AAAAEQgOYvo:APA91bHnmHGRlHrcxGkHi1hg2Ao2L9MBYxQt1jiK4TjVeWUf_o-lxexE1LZ1iS2XoKeqCpIszjIX16UaX6L3i3-zVsTmMINnp2loWb1O6wYN1ESaAgNi80o1Mwt-Fw8TfxUnbO-k6L7R'
};