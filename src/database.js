const mysql = require('mysql');
//Mediante esto, ahora puedo hacer consultas mediante promesas y no solo mediante callbacks
const {promisify} = require('util');
const {database} = require('./keys.js');

const pool = mysql.createPool(database);

pool.getConnection((err, connection)=>{

	if(err){

		if(err.code === 'PROTOCOL_CONNECTION_LOST'){

			console.error('Conexion cerrada');

		}
		if(err.code === 'ER_CON_COUNT_ERROR'){

		console.log('La base de datos tiene muchas conexiones');

		}
		if(err.code === 'ECONNREFUSED'){

		console.log('La conexion a la base de datos fue rechazada');

		}
	}
	if(connection) {
		connection.release();
		console.log('La base de datos esta conectada');
		return;
	}

});


//Promisify Pool Querys, con esto puedo hacer consultas mediante promesas
pool.query = promisify(pool.query);


module.exports = pool;




















