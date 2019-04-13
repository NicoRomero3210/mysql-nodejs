const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');

const helpers = require('../lib/helpers');

passport.use('local.signin',new LocalStrategy({

	usernameField:'username',
	passwordField:'password',
	passReqToCallback: true


}, async (req,username,password,done) => {

	const filas = await  pool.query('select * from users where username = ?',[username]);
	if(filas.length > 0){

		const user = filas[0];
		const validPassword = await helpers.matchPassword(password, user.password);
		//Eso de valid password devuelve un true o un false
		if(validPassword){

			done(null,user,req.flash('succes','Bienvenido '+user.username));

		}else(

			done(null,false,req.flash('message','Contraseña incorrecta'))

			)

	}else{
		return done(null,false,req.flash('message','El nombre de usuario no existe'));
	}

}));

passport.use('local.signup', new LocalStrategy({
	 //CAMPOS CON LOS CUALES VOY A AUTENTICAR A MIS USUARIOS,LOS CAMPOS SE IDENTIFICAN
	 //MEDIANTE EL CAMPO NAME DE LA ETIQUETA INPUT EN LA VISTA SIGNUP.HBS
	usernameField: 'username',
	passwordField: 'password',
	passReqToCallback: true

}, async (req,username,password,done) => {

	const {fullname} = req.body;

	// console.log(req.body);

	const newUser = {

		username,
		password,
		fullname

	};
	newUser.password = await helpers.encryptPassword(password);//Aca le digo que me encripte el
	//password
	const result = await pool.query('insert into users set ?', [newUser]);//Aca le digo que me
	//almacene el ussuario
	//console.log(result);
	newUser.id = result.insertId; //Como el id es autogenerado, para pasar el newUser con id, le debo
	//setear el id autogenerado que se almacena en el objeto result
	return done(null,newUser); //Aca le digo, si hay error tira null, sino ejeuta done con el
	//newUser
} ));

//Esta bosta sirve para serializar mi user y almacenar us id en una sesion
passport.serializeUser((user,done)=>{

	done(null, user.id);

});

//Esto em sirve para deserializar mi usuario, aca busca el usuario por el id en la base de datos
//y me devuelve un arreglo con el usuario
passport.deserializeUser(async (id,done)=>{

	const filas = await pool.query('select * from users where id = ?',[id]);
	done(null,filas[0]);

});















