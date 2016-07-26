var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var socket=require("socket.io");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var db=require("mysql_orm");
var fs=require('fs');
var formidable = require('formidable');
var app = express();

/*app.get('/', function (req, res){
    res.sendFile(__dirname + '/index.jade');
});*/

app.post('/', function (req, res){
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploads/' + file.name;
        console.log('rrr', file.path);
    });

    form.on('file', function (name, file){
        //console.log('Uploaded ' + file.name);
    });

    //res.sendFile(__dirname + '/index.jade');
    res.render('index');
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});
var settings={
	host:"localhost",
	user:"root",
	password:"",
	database:"ejemplosistema",
	port:""
}
var query2=db.mysql(settings);
var PORT =5000;
var http=app.listen(PORT,function(){
	console.log("servidor corriendo en el puerto: "+PORT);
});
var io=socket(http);
io.on('connection',function(socket){
	socket.on('RegistrarEquipo',function(valor){
		console.log('valorrr', valor);

		var datosS=Object();
		datosS.codEquipo=valor.codigo;
		datosS.nombre=valor.nombre;
		datosS.estado=valor.estado;
		datosS.observaciones=valor.observaciones;
		query2.save("equipos",datosS,(function(resultado){
			console.log('resulll', resultado);
			if(resultado.affectedRows==1){
				var estado='true';
				socket.emit('RespuestaRegistroE',estado);
			}else{
				var estado='false';
				socket.emit('RespuestaRegistroE',estado);
			}
		}));
	});
	socket.on('RegistrarSam',function(valor){
		var datosS=Object();
		datosS.codSam=valor.codigo;
		datosS.actividad=valor.actividad;
		datosS.unidad=valor.unidad;
		datosS.presUnit=valor.preciounitario;
		query2.save("sam",datosS,(function(resultado){
			if(resultado.affectedRows==1){
				var estado='true';
				socket.emit('RespuestaRegistroS',estado);
			}else{
				var estado='false';
				socket.emit('RespuestaRegistroS',estado);
			}
		}));
	});
	socket.on('RegistrarTramo',function(valor){
		//console.log('valorrr', valor);
		var datosT=Object();
		datosT.Descripcion=valor.descripcion;
		datosT.Longitud=valor.longitud;
		datosT.Costo_total=valor.costoTotal;
		query2.save("tramos",datosT,(function(resultado){
			//console.log('resulll', resultado);
			if(resultado.affectedRows==1){
				var estado='true';
				socket.emit('RespuestaRegistroT',estado);
			}else{
				var estado='false';
				socket.emit('RespuestaRegistroT',estado);
			}
		}));
	});

	socket.on('registroPersonalResidencia',function(valor){
		var datosS=Object();
		var aux=valor.ci.length;
		console.log(valor);
		console.log(aux);
		var aux2=0;
		for(var i=0;i<aux;i++){
			datosS.idusuario=valor.ci[i];
			datosS.idresidencia=valor.residencia;
			datosS.nombres=valor.nombres[i];
			datosS.ocupacion=valor.ocupacionTotal[i];

			console.log('ocu',datosS.ocupacion );
			query2.save("usuariosresidencia",datosS,(function(row){
				aux2=aux2+1;
				//console.log(aux,i);
				if(aux==i){
					if(aux2==9){
						//console.log('iiiiiiiii',aux);
						var estado='true';
						socket.emit('RespuestaRegistroUsuarios',estado);
					}
				}
			}));
		}
	});
	socket.on('ActualizarPersonalResidencia',function(valor){
		var datosS=Object();
		var aux=valor.ci.length;
		console.log(valor);
		console.log(aux);
		var aux2=0;
		for(var i=0;i<aux;i++){
			datosS.idusuario=valor.ci[i];
			datosS.nombres=valor.nombres[i];
			datosS.ocupacion=valor.ocupacionTotal[i];
			console.log(valor.ci[i]);
			if(valor.ci[i]!=''){
				
				query2.update("usuariosresidencia",datosS).where({"idUsuariosResidencia":i+1}).execute(function(row){
					aux2=aux2+1;
					if(aux2==9){
							//console.log('iiiiiiiii',aux);
						var estado='true';
						socket.emit('RespuestaRegistroUsuarios',estado);
					}
				});
			}
			else{
				aux2=aux2+1;
					if(aux2==9){
							var estado='true';
							socket.emit('RespuestaRegistroUsuarios',estado);
						}
			}
		}
	});
	
	socket.on('enviandoCI',function(CI){
		console.log('entro el ci:',CI);
		var TotalTramos=[];var totalEquipos=[]; var nombreEquipos=[];
		query2.get("usuariosresidencia").where({'idusuario':CI}).execute(function(v){
			console.log('tttt', v);
			var idRess=v.result[0].idresidencia;
			var nomRes=v.result[0].nombre;
			var ocupacion=v.result[0].ocupacion;
			query2.get("tramos").where({'idResidencia':idRess}).execute(function(tramo){
				for(var i=0;i<tramo.result.length;i++){
						TotalTramos.push(tramo.result[i].Descripcion);
				}
				query2.get("equipos").where({'idresidencia':idRess}).execute(function(equi){
					
					for(var i=0;i<equi.result.length;i++){
						totalEquipos.push(equi.result[i].codEquipo);
						nombreEquipos.push(equi.result[i].nombre);
						console.log('nomequipos', nombreEquipos);
					}
					query2.get("residencia").where({'idresidencia':idRess}).execute(function(residencia){
						//console.log('tttt', equi);
						var nomRes=residencia.result[0].nombre;
						//console.log('si',nomRes);
						socket.emit('RespuestaDatosPD',{idRes:idRess,nomRes:nomRes,ocupacion:ocupacion,tramos:TotalTramos,equipos:totalEquipos,nombreEquipos:nombreEquipos});
					});
					
				});
			});
		});
	});
	///jimenaaa
	socket.on('ListarTrabajadores',function(){
		console.log('entro el alguien');
		var cis=[];var ocupacion=[]; 
		query2.get("usuariosresidencia").execute(function(v){
			for(var i=1;i<v.result.length;i++){
					cis.push(v.result[i].idusuario);ocupacion.push(v.result[i].ocupacion);
			}
			socket.emit('respuestaTrabajadores', {cis:cis,ocupacion:ocupacion});
		});
	});
	socket.on('RegistrarServicios',function(valor){
		//console.log('valorrr', valor);
		var datosServ=Object();
		datosServ.Servicios=valor.servicios;
		datosServ.cantidad=valor.cantidad;
		datosServ.fechaInicio=valor.fechaInicio;
		datosServ.fechaFin=valor.fechaFin;
		datosServ.precioUnitario=valor.precioUnitario;
		datosServ.monto=valor.monto;
		datosServ.partidaPresupuesto=valor.partidaPresupuesto;
		query2.save("serviciosnobasicos",datosServ,(function(resultado){
			//console.log('resulll', resultado);
			if(resultado.affectedRows==1){
				var estado='true';
				socket.emit('RespuestaRegistroservicios',estado);
			}else{
				var estado='false';
				socket.emit('RespuestaRegistroservicios',estado);
			}
		}));
	});
	socket.on('RegistrarMateriales',function(valor){
		console.log('valorrr', valor);
		var datosMate=Object();
		datosMate.descripcion=valor.descripcionActivos;
		datosMate.unidaddemedida=valor.unidadMedida;
		datosMate.cantRequerida=valor.cantRequerida;
		datosMate.cantExistente=valor.cantExistente;
		datosMate.cantSolicitada=valor.cantSolicitada;
		datosMate.precioUnit=valor.precioUnita;
		datosMate.MontoM=valor.monto;
		datosMate.partPresupuesto=valor.partidaPresupuesto;
		query2.save("materialesysuministros",datosMate,(function(resultado){
			//console.log('resulll', resultado);
			if(resultado.affectedRows==1){
				var estado='true';
				socket.emit('RespuestaRegistromateriales',estado);
			}else{
				var estado='false';
				socket.emit('RespuestaRegistromateriales',estado);
			}
		}));
	});


});

module.exports = app;
