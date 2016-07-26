var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var db=require("mysql_orm");
var fs=require('fs');
var nombreAvatar;
var settings={
	host:"localhost",
	user:"root",
	password:"",
	database:"ejemplosistema",
	port:""
}
var query=db.mysql(settings);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Servicio Departamental De Caminos Potosi' });
});
router.get('/EncargadoResidencia', function(req, res, next) {
  res.render('EncargadoResidencia');
});
router.post('/EncargadoResidencia', function(req, res) {
	var dirImagen='';
	var f = new Date().toString();
	var fechaa='';
	for(var i=0;i<f.length-43;i++){
		if(f[i]!=' '&&f[i]!=':'){
			fechaa=fechaa+f[i];
		} 
	}
	var form = new formidable.IncomingForm();
	form.parse(req);
	form.on('fileBegin', function (name, file){
		var DirRouter=__dirname;
		var DirRout='';
		for(var i=0;i<DirRouter.length-7;i++){
			DirRout=DirRout+DirRouter[i];
		}
		console.log
		file.path = DirRout+'/public/images/Upload/'+fechaa + file.name;
		dirImagen = 'images/Upload/'+ fechaa + file.name;
	});
	form.on('file', function (name, file){
		console.log('Uploaded ' + file.name);
		res.render('EncargadoResidencia',{ title: 'residente', dirImagen:dirImagen});
	});
});
router.get('/EncargadoSAE', function(req, res, next) {
  res.render('EncargadoSAE');
});
router.post('/EncargadoSAE', function(req, res) {
	var dirImagen='';
	var f = new Date().toString();
	var fechaa='';
	for(var i=0;i<f.length-43;i++){
		if(f[i]!=' '&&f[i]!=':'){
			fechaa=fechaa+f[i];
		} 
	}
	var form = new formidable.IncomingForm();
	form.parse(req);
	form.on('fileBegin', function (name, file){
		var DirRouter=__dirname;
		var DirRout='';
		for(var i=0;i<DirRouter.length-7;i++){
			DirRout=DirRout+DirRouter[i];
		}
		console.log
		file.path = DirRout+'/public/images/Upload/'+fechaa + file.name;
		dirImagen = 'images/Upload/'+ fechaa + file.name;
	});
	form.on('file', function (name, file){
		console.log('Uploaded ' + file.name);
		res.render('EncargadoSAE',{ title: 'encargadoSAE', dirImagen:dirImagen});
	});
});
router.get('/EQUIPOS',function(req ,res){
	query.get("equipos").execute(function(v){
		var lista1=[];var lista2=[];var lista3=[];var lista4=[];
		//console.log('esto', v.result.length);
		for(var i=0; i<v.result.length; i++){
			lista1.push(v.result[i].codEquipo);lista2.push(v.result[i].nombre);lista3.push(v.result[i].estado);
			lista4.push(v.result[i].observaciones);
			console.log('listaaa', lista1);
		}
		res.render('EQUIPOS',{ title: 'encargadoSAE', codE:lista1, 
														nombres:lista2,
														estados:lista3,
														observaciones:lista4,});
	});
});
router.get('/REGISTRAR_EQUIPOS',function(req ,res){
	res.render('REGISTRAR_EQUIPOS',{ title: 'encargadoSAE'});
});
router.get('/SAM', function(req, res){
	//res.render('SAM',{ title: 'encargadoSAE'});
	query.get("sam").execute(function(v){
		var lista1=[];var lista2=[];var lista3=[];var lista4=[];var lista5=[];
		//console.log('esto', v.result.length);
		for(var i=0; i<v.result.length; i++){
			lista1.push(v.result[i].idSAM);lista2.push(v.result[i].codSam);lista3.push(v.result[i].actividad);
			lista4.push(v.result[i].unidad);lista5.push(v.result[i].presUnit);
		}
		res.render('SAM',{ title: 'encargadoSAE', idS:lista1, 
														codS:lista2,
														actividades:lista3,
														unidad:lista4,
														precio:lista5,});
	});
})
router.get('/REGISTRAR_SAM',function(req ,res){
	res.render('REGISTRAR_SAM',{ title: 'encargadoSAE'});
});
router.get('/RecursosHumanos',function(req ,res){
	query.get("usuariosresidencia").execute(function(v){
		var nombres=[];
		if(v.result.length>0){
			for(var i=0; i<v.result.length; i++){
				nombres.push(v.result[i].nombres);
			}
			console.log('__________',nombres);
			res.render('RecursosHumanos',{ title: 'EncargadoResidencia', nombres:nombres});
			
		}
		res.render('RecursosHumanos',{ title: 'EncargadoResidencia',nombres:nombres});
	});
});
router.get('/ServiciosNoBasicos',function(req ,res){
	query.get("serviciosnobasicos").execute(function(v){
		var lista1=[];var lista2=[];var lista3=[];var lista4=[];var lista5=[];var lista6=[];var lista7=[];var lista8=[];
		//console.log('esto', v.result.length);
		for(var i=0; i<v.result.length; i++){
			lista1.push(v.result[i].Servicios);lista2.push(v.result[i].cantidad);lista3.push(v.result[i].fechaInicio);
			lista4.push(v.result[i].fechaFin);lista5.push(v.result[i].precioUnitario);lista6.push(v.result[i].monto);lista7.push(v.result[i].partidaPresupuesto);
			lista8.push(v.result[i].idServiciosNoBasicos);
		}
		res.render('ServiciosNoBasicos',{ title: 'EncargadoResidencia', servicios:lista1, 
																		cantidad:lista2,
																		fechaIn:lista3,
																		fechaFi:lista4,
																		precioUni:lista5,
																		monto:lista6,
																		partidaPres:lista7,
																		idSe:lista8});
	});
});

router.get('/registrarServiciosNoBasicos',function(req ,res){
	res.render('registrarServiciosNoBasicos',{ title: 'EncargadoResidencia'});
});

router.get('/MaterialesSuministros',function(req ,res){
	query.get("materialesysuministros").execute(function(v){
		var lista1=[];var lista2=[];var lista3=[];var lista4=[];var lista5=[];var lista6=[];var lista7=[];var lista8=[];var lista9=[];
		//console.log('esto', v.result.length);
		for(var i=0; i<v.result.length; i++){
			lista1.push(v.result[i].descripcion);lista2.push(v.result[i].unidaddemedida);lista3.push(v.result[i].cantRequerida);
			lista4.push(v.result[i].cantExistente);lista5.push(v.result[i].cantSolicitada);lista6.push(v.result[i].precioUnit);lista7.push(v.result[i].MontoM);
			lista8.push(v.result[i].partPresupuesto);lista9.push(v.result[i].idmaterialesysuministros);
		}
		res.render('MaterialesSuministros',{ title: 'EncargadoResidencia', descripcion:lista1, 
																		unidadMedida:lista2,
																		cantReq:lista3,
																		cantExi:lista4,
																		cantSol:lista5,
																		presUnit:lista6,
																		montoMa:lista7,
																		partidaPres:lista8,
																		idMa:lista9});
	});
});
router.get('/registrarMaterialesySuministros',function(req ,res){
	res.render('registrarMaterialesySuministros',{ title: 'EncargadoResidencia'});
});

router.get('/JefeOperacion', function(req, res, next) {
  res.render('JefeOperacion');
});
router.get('/ResAcasio',function(req ,res){
	res.render('ResAcasio',{ title: 'EncargadoSae'});
	/*query.get("equipos").where({'idResidencia':1}).execute(function(v){
		var lista1=[];
		for(var i=0; i<v.result.length; i++){
			lista1.push(v.result[i].nombre);
			//console.log('listaaa', lista1);
		}
		res.render('ResAcasio',{ title: 'EncargadoSae', nombres:lista1,});
	});*/
});
router.get('/diesel',function(req ,res){
	res.render('diesel',{ title: 'EncargadoSae'});
});
router.get('/gasolina',function(req ,res){
	res.render('gasolina',{ title: 'EncargadoSae'});
});
router.get('/AceiteLubricantes',function(req ,res){
	res.render('AceiteLubricantes',{ title: 'EncargadoSae'});
});
router.get('/EquiposAcasio',function(req ,res){
	//res.render('EquiposAcasio',{ title: 'ResidenciaAcasio'});
	query.get("equipos").where({'idResidencia':1}).execute(function(v){
		var lista1=[]; var lista2=[]; var lista3=[];
		for(var i=0; i<v.result.length; i++){
			lista1.push(v.result[i].codEquipo);lista2.push(v.result[i].nombre);lista3.push(v.result[i].estado);
			console.log('listaaa', lista2);
		}
		res.render('EquiposAcasio',{ title: 'ResidenciaAcasio', codEquipo:lista1,nombres:lista2,estado:lista3,});
	});
});
router.get('/PartesDiarios',function(req ,res){
	res.render('PartesDiarios',{ title: 'ResidenciaAcasio'});
});
router.get('/tramos',function(req ,res){
	query.get("tramos").execute(function(v){
		var lista1=[];var lista2=[];var lista3=[];var lista4=[];
		//console.log('esto', v.result.length);
		for(var i=0; i<v.result.length; i++){
			lista1.push(v.result[i].idTramos);lista2.push(v.result[i].Descripcion);lista3.push(v.result[i].Longitud);lista4.push(v.result[i].Costo_total);
		}
		res.render('tramos',{ title: 'ResidenciaAcasio', idT:lista1,
														descripcionT:lista2, 
														longitudT:lista3,
														costoTotalT:lista4,});
	});
});
router.get('/registrarTramos',function(req ,res){
	res.render('registrarTramos',{ title: 'EncargadoResidencia'});
});
router.get('/programacion15',function(req ,res){
	res.render('programacion15',{ title: 'EncargadoResidencia'});
});
router.get('/obrasResidencia',function(req ,res){
	res.render('obrasResidencia',{ title: 'EncargadoResidencia'});
});
router.get('/plaObras',function(req ,res){
	res.render('plaObras',{ title: 'EncargadoResidencia'});
});
//LOGEAR USUARIOS
router.post('/', function(req, res) {
	var nick=req.body.nombre;
	nombreAvatar=nick;
	console.log(nombreAvatar);
	var pass=req.body.contraseña;
	console.log(nick, pass);
	query.get("usuarios").where({"nick":nick,"pass":pass}).execute(function(v){
		if(v.result.length==1){
			var aux=v.result[0].cargo;
			console.log(v.result[0].cargo);
			if(aux=='residente')
				res.render('EncargadoResidencia',{ title: 'residente', nombre: nick });
			else{
				if(aux=='SAE')
					res.render('EncargadoSAE',{ title: 'SAE', nombre: nick });
				else
					res.render('JefeOperacion');
			}
		}
		else{
			res.render('index', { error:'ERROR: Verifique sus datos'});
		}
	});
});
/*router.get('/Usuarios', function(req, res) {
	query.get("usuarios").execute(function(todoslosusuarios){
	 var aux='';
	 for(var i=0;i<todoslosusuarios.result.length;i++){
		aux=todoslosusuarios.result[0].ci;
		console.log(todoslosusuarios.result.length);
	 }
	 res.render('Usuarios',{nombres:'todos',ci:aux,password:'todoslosusuario'});
	});
});
*/

module.exports = router;