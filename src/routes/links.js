const express = require('express');
const router = express.Router();

//esto hace referencia a la conexion a la base de datos
const pool_db = require('../database.js');
//Aca importo el metodo para decir que si no esta autenticado no me muestre nada de esto
const {isLoggedIn} = require('../lib/auth');
const {isNotLoggedIn} = require('../lib/auth');



router.get('/add',isLoggedIn,(req,res)=>{

	res.render('links/add');

})

router.post('/add',isLoggedIn,async (req,res)=>{
	const {title,url,description} = req.body //Almaceno el contenido de req.body en el objeto macheando propiedad a propiedad

	const newLink = {

		title,
		url,
		description,
		user_id: req.user.id

	}; //Almaceno el objeto de arriba en el objeto newLink

	await pool_db.query('insert into links set ?',[newLink]);//Aca le paso un arreglo con el objeto a almacenar,
	//el simbolo ? significa que en vez de poner los parametros manualmente, los valores van dentro del objeto del arreglo
	//para que ande esto podria usar callbacks o promises, pero uso la funcion await que le dice a la app
	//que espere a que termine de insertar en la bd para seguir con le codigo, por esto pongo asyn en 
	//la funcion arrow principal

	//console.log(newLink);

	//console.log(req.body);
	//res.send('Recibido');
	req.flash('success','guardado de enlace exitoso');
	res.redirect('/links');

});


router.get('/', isLoggedIn,async (req,res)=>{


	const links = await pool_db.query('select * from links where user_id = ?',[req.user.id]);
	//console.log(links);
	//res.render('links/list', {links: links});//Aca le digo que renderice o muestre en pantalla esta vista
	res.render('links/list', {links}); //Esta es la forma mas optima de pasarle el objeto links
	//pero tmb se puede hacer como el que comente.

});

router.get('/delete/:id', isLoggedIn, async (req,res)=>{
	const {id} = req.params //Aca le dijo que extraiga el id de los parametros del reques
	//
	await pool_db.query('delete from links where id=?',[id]); //Aca hago el query para borrar
	//el dato
	//console.log(req.params.id);
	//res.send('eliminado');
	req.flash('success','eliminacion de enlace exitoso');
	res.redirect('/links');

});


//Dede Aca empieza la matufia para la actualizacion de datos

router.get('/edit/:id', isLoggedIn, async (req,res)=>{
	const {id} = req.params;
	//console.log(id);
	//res.send('recibido');
	const links = await pool_db.query('select * from links where id = ?',[id]);
	console.log(links[0]);
	res.render('links/edit',{enlace:links[0]});//Aca le estoy diiendo que del arrego que me devolvio
		//como respuesta d e la query, me de el objeto(el unico que hay) que esta en la posicion
		//0 del array respuesta(links)
	console.log(links);

});

router.post('/edit/:id',isLoggedIn,async (req,res)=>{

	const {id} = req.params;
	const {title,description,url} = req.body;
	const newLink = {

		title,
		description,
		url

	};//ESTE OBJETO EN REALIDAD NO ES NECESARIO, SE PUEDE PASAR DIRECTAMENTE EL req.body

	await pool_db.query('update links set ? where id = ?', [newLink,id]);//ACA LE ESTOY DICIENDO
	//ACTUALIZA LINKSa con los valores que te paso en newLink DONDE EL id sea igual al id que
	//te estoy pasando como segundo elemento del arreglo

	console.log(newLink);

	//res.send('Actualizado');
	req.flash('success','actualizacion de enlace exitoso');
	res.redirect('/links');

});

//Aca termina la matufia para la actualizacion de datos

module.exports = router;