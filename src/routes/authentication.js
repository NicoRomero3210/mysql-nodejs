const express = require('express');
const router = express.Router();
const passport = require('passport');
//Aca exporto el metodo de verificacion de logueo que cree en el archivo auth.js,
//Esto se ejecuta solo en las rutas que deseo proteger para que no se vean si no estas
//logueado
const {isLoggedIn} = require('../lib/auth');
//Este es como el inverso, esto pongo cuando estoy logueado y no quiero que acceda a alguna ruta
const {isNotLoggedIn} = require('../lib/auth');


/*ESTA ES LA FORMA DIFICIL DE HACER EL MIDDLEWARE LOCO DEL PASSPORT

router.post('/signup', (req,res) => {
	//ACA LE DIGO QUE ASI SE LLAMA EL MIDDLEWARE DE AUTENTICACION QUE DEFINI EN PASSPORT.JS
	passport.authenticate.('local.signup',{

		succesRedirect: '/profile',//A DONDE VOY SI HUBO UNA AUTENTICACION EXITOSA
		failureRedirect:'/signup',//A DONDE VOY SI FALLA LA AUTENTICACION
		failureFlash: true //ACA LE DIGO QUE LE PERMITO QUE MUESTRE MENSAJES SI ES QUE FALLA
		//LA AUTENTICACION
	});
	//console.log(req.body);
	res.send('recived');

});

*/

//ESTAS ES LA FORMA FACIL Y MAS RAPIDA, DEJO ESTA NOMAS
router.post('/signup', passport.authenticate('local.signup',{
		successRedirect: '/profile',//A DONDE VOY SI HUBO UNA AUTENTICACION EXITOSA
		failureRedirect:'/signup',//A DONDE VOY SI FALLA LA AUTENTICACION
		failureFlash: true //ACA LE DIGO QUE LE PERMITO QUE MUESTRE MENSAJES SI ES QUE FALLA
		//LA AUTENTICACION
	}));

router.post('/signin', (req,res,next)=>{

	passport.authenticate('local.signin', {

		successRedirect: '/profile',//A DONDE VOY SI HUBO UNA AUTENTICACION EXITOSA
		failureRedirect:'/signin',//A DONDE VOY SI FALLA LA AUTENTICACION
		failureFlash: true //ACA LE DIGO QUE LE PERMITO QUE MUESTRE MENSAJES SI ES QUE FALLA
		//LA AUTENTICACION

	})(req,res,next);//aca falta el next que no se porque no me deja meterlo dentro de los parametros

});

//Con el isNotLoggedIn lo que hago es decrile que si esta autenticado  y quiere acceder a
//signup no pueda y lo redirija a /profile, caso contrario que ejecute next()
router.get('/signup',isNotLoggedIn, (req,res) => {

	res.render('auth/signup');

});


router.get('/signin', isNotLoggedIn,(req,res) => {

	res.render('auth/signin');

});

//Con el segundo parametro que exporte de /lib/auth.js le digo que si no esta logueado
//no me muestre profile
router.get('/profile', isLoggedIn, (req,res)=>{

	res.render('profile');

});

//Aca le digo que cuando doy click a cerrar sesion me desloguee(mata mi sesion actual)
//y ademas me redirija hacia el formulario de iniciar sesion
router.get('/logout', isLoggedIn,(req,res) => {

	req.logOut();
	res.redirect('/signin');

});










module.exports = router;