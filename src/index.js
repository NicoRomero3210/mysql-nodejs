const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');	
const path = require('path'); //Esto sirve para unir direcciones o rutas
const flash = require('connect-flash');//middleware que me permite tirar mensajes
const session = require('express-session');//Esto lo importo para que ande flash y para guardar sessiones de mysql
const mySqlStore = require('express-mysql-session');//Esto complementa al de arriba para flash y para mysql
const passport = require('passport');

const {database} = require('./keys'); //Aca traigo del documento keys el objeto database nada mas y se lo
//paso a mySqlStore para que almacene la sesion ahi en esa databes

//INICIALIZACIONES

const app = express();
require('./lib/passport'); //INICIAIZACION DEL PASSPORT MIO QUE ESTA EN ESA RUTA


//SETTINGS

app.set('port', process.env.port||4000);//Aca le digo agarra lo que tenga la variable de entorno
//PORT y si no tiene nada metele al puerto 4000

//__dirname es una constante de nodejs que contiene la direccion de la ruta del archivo global del js
//con el que estoy trabajando actualmente, eso l concateno 'views' mediante el metodo 
//path.join() y ahi establezco la ruta de la carpeta views en app
app.set('views',path.join(__dirname,'views')); //Aca establezco la ruta de la carpeta views
app.engine('.hbs',exphbs({

	defaultLayout: 'main', //aca le digo cual es la plantilla principal
	layoutsDir: path.join(app.get('views'),'layout'), //Defino la ruta de lacapeta layout
	partialsDir:path.join(app.get('views'),'partials'), //defino la direccion de la carpeta partials
	extname: '.hbs', //defino la extension de las plantillas
	helpers: require('./lib/handlebars')

})); //aca configuro el motor de plantillas

app.set('view engine','.hbs'); //Aca establezco el motor de plantillas


//MIDDLEWARES
app.use(session({

	secret:'nicoromero3210',
	resave: false,
	saveUninitialized: false,
	store: new mySqlStore(database)

})); //Aca configuro la sesion, resave significa que no me reinicie la sesion a cada rato
	//store me diice que la va a guardar en db que le paso a mySqlStore
app.use(flash());//Esto tiene que ir si o si aca abajo de session para que funquen los mensajes

app.use(morgan('dev'));

app.use(express.urlencoded({extended:false})); //aca le digo que solo puedo recibir Strings sencillos
//nada de imagenes y eso

app.use(express.json()); //Aca le digo que tmb reciba jsons.

app.use(passport.initialize()); //INICIALIZA EL PASSPORT

app.use(passport.session()); //MIDDLEWARE DE PASSPORT

app.use((req,res,next)=>{

	next();

});



//VARIABLES GLOBALES

app.use((req,res,next)=>{

	app.locals.success = req.flash('success'); //Asi almaceno el connect-flash creado en links.js
	//para poder mostrarlo en todas las vistas
	app.locals.success = req.flash('message');
	app.locals.user = req.user; //Aca habilito el usuario en session para cualquier vista
	next();

}); //Aca configuro la Variable Global para que ande lo de los mensajes flash

//ROUTES

app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));//Aca importo los archivos de routes tanto de autenticacion
//y lo de links, e la importacion de links, le pongo '/links' para dar a entender que si quiero operar
//con links debo anteponer /links/algo en la url para hacer el get,put,post,delete que quiera hacer



//ARCHIVOS PUBLICOS

app.use(express.static(path.join(__dirname,'public')));//Con esto le digo que todo lo relacionado 
//al frontend esta almacenado en public, los css los js y esas bostas

//STARTING SERVER

app.listen(app.get('port'),()=>{

	console.log('Servidor en el puerto',app.get('port'));

});

