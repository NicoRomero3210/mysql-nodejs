const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async (password) => {

	const salt = await bcrypt.genSalt(10); //Esto genera una cadena aleatoria, el 10 es el
	//indicador de cuantas veces ejecutara el metodo, mientras mas ejecute mas segura la cadena
	const hash = await bcrypt.hash(password,salt); //este metodo relacion el password con la
	//cadena generada arriba y la cifra
	return hash;

}

helpers.matchPassword= async (password,savedPassword) => {

	try{
		
		return await bcrypt.compare(password,savedPassword);

	}catch(e){
		console.log(e);
	}

}


module.exports = helpers;