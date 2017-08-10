function terminal_insert(database, Id, type, history){
	database.getConnection(function(err, connection){
		if(err){
			throw err;
		}
		
		connection.query("call terminal_history(?,?,?);", [
			Id, type, history
		], function(err){
			if(err){
				throw err;
			}
		});
	});
}

module.exports = terminal_insert;