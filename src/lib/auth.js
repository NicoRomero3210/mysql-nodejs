//Aca creo un objeto que me permite saber si el ususario esta logueado o no
//req.isAuthenticated es un metodo de passport que, como esta en las variables globales
//tmb lo tiene request


module.exports = {


	isLoggedIn(req,res,next){

		if(req.isAuthenticated()){

			return next();

		}

		return res.redirect('/signin');


	},

	isNotLoggedIn(req,res,next){

		if(!req.isAuthenticated()){

			return next();

		}

		return res.redirect('/profile');

	}



}









