//const timeago = require('timeago.js');
const {format} = require('timeago.js');

//const timeagoInst = timeago(); ANTES DEL CURSO SE USABA ASI, COMO SE ACTUALIZO YA CAMBIA 
//LA FORMA D EINSTANCIAR ESTA BOSTA, MIRAR LA DOCU DE GITHUB DEL timeago.js COMO HIZO EL VAGO
//SOLO IMPORTO LA FUNCION FORMAT

const helpers = {}; // Este objeto es el que va a usar la vista handlebar, mira el index.js en donde
//defino el helpers con los layoutsDir y eso

helpers.timeago = (timestamp) => {

//	return timeagoInst.format(timestamp);
	return format(timestamp); //TODO ESTO QUE HAGO CON EL TIMEAGO Y ESO ES PARA CAMBIAR EL FORMATO
	//DE LA FECHA, ASI EN LA VISTA ME VA A MOSTRAR COMO EN FACEBOOK Y NO LA FECHA DE SUBIDA
	//ESTO SE UNE CON LA VISTA LIST.HBS
}

module.exports = helpers