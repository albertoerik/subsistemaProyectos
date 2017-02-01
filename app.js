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
		file.path = __dirname + '/public/pdfs/' + file.name;
		console.log('rrr', file.path);
	});

	form.on('file', function (name, file){
		//console.log('Uploaded ' + file.name);
	});

	//res.sendFile(__dirname + '/index.jade');
	res.render('MenuPrincipal');
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
  database:"sistemasedecauatf",
  port:""
}
/*var settings={
  host:"localhost",
  user:"root",
  password:"",
  database:"SubsistemaProyectos",
  port:""
}
var settings1={
  host:"localhost",
  user:"root",
  password:"",
  database:"SubsistemaLocalizacion",
  port:""
}
var settings2={
  host:"localhost",
  user:"root",
  password:"",
  database:"SubsistemaResidencias",
  port:""
}*/

/*var settings={
  host:"localhost",
  user:"root",
  password:"",
  database:"subsistemaproyectos",
  port:""
}
var settings1={
  host:"192.168.43.175",
  user:"sistemas",
  password:"12345",
  database:"subsistemalocalizacion",
  port:""
}
var settings2={
  host:"192.168.43.135",
  user:"sistemas",
  password:"12345",
  database:"subsistemaresidencias",
  port:""
}*/

var query=db.mysql(settings);
//var query1=db.mysql(settings1);
//var query2=db.mysql(settings2);
var PORT =5000;
var http=app.listen(PORT,function(){
	console.log("servidor corriendo en el puerto: "+PORT);
});
var io=socket(http);
io.on('connection',function(socket){	
//.................reportes...........................//
	socket.on('reporte', function(valor){
		console.log('lego',valor);
		var reporte=Object();
		reporte.idusuario=valor.idusuario;
		reporte.idresidencia=valor.idresidencia;
		reporte.categoria=valor.categoria;
		reporte.descripcion='planilla.pdf';
		reporte.fecha=valor.fecha;
		reporte.accion='ver reporte';
		reporte.hora=valor.hora;
		query.save("reportes",reporte,(function(r){
			if(r.affectedRows==1){
					console.log('llego reporte!!!');
					//socket.emit('respuestaregistroporquincenal',true);
			}else{
			  //socket.emit('respuestaregistroporquincenal',false);
			}
		}))
	})
//........ ...........................actividades a tramos..............//
	socket.on('listarActividades', function(){
			var idsam=[]; var codsam=[]; var categoria=[]; var descripcion=[]; var unidad=[];
			//var codigoSam=[]; var actividades=[]; var Unidad=[]; var PresioUnitario=[];
			query.get("codificacionsam").execute(function(s){
				for(var i=0;i<s.result.length;i++){
					idsam.push(s.result[i].idsam);codsam.push(s.result[i].codsam);descripcion.push(s.result[i].descripcion);
					unidad.push(s.result[i].unidad);
				}
				socket.emit('respActividadesSam',{idsam:idsam, codsam:codsam,descripcion:descripcion, unidad:unidad});
			})
	})

	socket.on('NuevaActividad',function(valor){
		//console.log('bbbbbbbb', valor);

		var datosActividades=Object();
		datosActividades.idtramo=valor.idtramo;
		datosActividades.idsam=valor.actividades;
		datosActividades.cantidad=valor.cantidad;
		datosActividades.preciounitario=valor.preciounitario;
		query.save("actividadestramos",datosActividades,(function(resultado){
			if(resultado.affectedRows==1){
				socket.emit('RespuestaRegistroactividadestra',true);
			}else{
				socket.emit('RespuestaRegistroactividadestra',false);
			}
		}));
	});
	

	socket.on('listartramos',function(aux){
		var idresidencia=aux;
		query.get("tramos").where({'idresidencia':idresidencia}).execute(function(tramo){
			var tramos=[];
			if(tramo.result.length>0){
			  query.get("actividadestramos").execute(function(actividad){
					query.get("codificacionmaterial").execute(function(materiales){
						query.get("materialparaactividad").execute(function(materialactividad){
							query.get("codificacionsam").execute(function(sam){
								for(var i=0; i<tramo.result.length; i++){ //tramo  //tramo =rio salado id=1
								  var tramo1=[],tramo2=[],tramo3=[],tramo4=[],tramo5=[]; var cantidad=[];var preciounitario=[];
								  var actividad1=[],actividad2=[],actividad3=[],actividad4=[],contador=0;
								  for(var j=0; j<actividad.result.length; j++){ //actividad
										if(tramo.result[i].idtramos==actividad.result[j].idtramo){
										  contador++;
										  for(var k=0; k<sam.result.length; k++){
												if(actividad.result[j].idsam==sam.result[k].idsam){
												  actividad1.push(sam.result[k].idsam);actividad2.push(sam.result[k].codsam);actividad3.push(sam.result[k].descripcion);actividad4.push(sam.result[k].unidad);cantidad.push(actividad.result[j].cantidad);preciounitario.push(actividad.result[j].preciounitario);
												}
										  }
										  if(materialactividad.result.length>0){
											  var material1=[],material2=[],material=[];
											  for(var l=0; l<materialactividad.result.length; l++){
													//console.log('tam:',actividad.result[j].idsam);
													//console.log('tam1:',materialactividad.result[l].idsam);
													if(actividad.result[j].idsam==materialactividad.result[l].idsam){
														for(var m=0; m<materiales.result.length; m++){
															if(materiales.result[m].idmaterialessam==materialactividad.result[l].idmaterialsam){
															  material1.push(materiales.result[m].idmaterialessam);material2.push(materiales.result[m].descripcion);
															}
														}
													}
											  }
											  material.push({'idmateriales':material1,'descripciones':material2});
											  //console.log('los materiales::',material);
										  }else{
										  		console.log('no existe materiales en residencia');
												vehiculo.push({'estado':false});
										  }
										}
								  }
								  tramo1.push(tramo.result[i].idtramos);tramo2.push(tramo.result[i].descripcion);
								  if(contador>0){
										tramos.push({"idtramo":tramo1,"descripcion":tramo2,'estadoactividad':true,'idsam':actividad1,'codsam':actividad2,'descripcionactividad':actividad3,'unidadactividad':actividad4,'cantidadtrab':cantidad,'materiales':material,'preciounitario':preciounitario});
								  }
								  else{
										tramos.push({"idtramo":tramo1,"descripcion":tramo2,'estadoactividad':false});
								  } 
								}
								query.get("asignacionvehiculos").where({'idresidencia':idresidencia}).execute(function(asignacionvehiculos){
									//console.log('vehiculos de la residencia',asignacionvehiculos);
									query.get('asignacionusuarios').where({'idresidencia':idresidencia}).execute(function(usuarioresidencia){
										query.get("vehiculos").execute(function(vehiculos){
											query.get('usuarios').execute(function(usuario){
												var vehiculo=[];
												if(asignacionvehiculos.result.length>0){
													var lista1=[],lista2=[], lista3=[];
													for(var l=0; l<asignacionvehiculos.result.length; l++){
														for(var i=0; i<vehiculos.result.length; i++){
															if(asignacionvehiculos.result[l].idequipo==vehiculos.result[i].idequipos){
																lista1.push(vehiculos.result[i].idequipos); lista2.push(vehiculos.result[i].codinterno);lista3.push(vehiculos.result[i].tipo);
															}
														}
													}
													vehiculo.push({'estado':true,'idequipos':lista1,'codinterno':lista2,'tipo':lista3});
												}else{
													console.log('no existe vehiculos en residencia');
													vehiculo.push({'estado':false});
												}
												var nombres_apellidos=[];var idusuario=[]; var perfil=[];var estado=[];var codequipos=[];var codinterno=[]; var tipo=[];
												for(var j=0;j<usuarioresidencia.result.length;j++){
													  idusuario.push(usuarioresidencia.result[j].idusuario);perfil.push(usuarioresidencia.result[j].perfil);estado.push(usuarioresidencia.result[j].estado);
												  for(var k=0;k<usuario.result.length;k++){
													if(idusuario[j]==usuario.result[k].idusuario){
													  nombres_apellidos.push(usuario.result[k].nombres_apellidos);
													  //console.log('namesss', nombres_apellidos);
													}
												  }  
												}
												//console.log('uno....',nombres_apellidos);
												socket.emit('respuestatramos', {'estadotramo':true,tramos:tramos,vehiculos:vehiculo,nombres_apellidos:nombres_apellidos,idusuario:idusuario});
											});
										});
									});	
								});
							});
						});
					});
				});
			}else{
				socket.emit('respuestatramos', {'estadotramo':false,tramos:tramos,vehiculos:vehiculos,nombres_apellidos:nombres_apellidos,idusuario:idusuario});
			}
		});
	});

//...........................planilla de avance...............................//
	socket.on('listarplanilla',function(aux){
		var idresidencia=aux;
		//console.log('lass',idresidencia);
		query.get("tramos").where({'idresidencia':idresidencia}).execute(function(tramo){
			//console.log('tramos:',tramo);
			var tramos=[];
			if(tramo.result.length>0){
			  query.get("actividadestramos").execute(function(actividad){
					query.get("codificacionsam").execute(function(sam){
						for(var i=0; i<tramo.result.length; i++){ //tramo  //tramo =rio salado id=1
						  var tramo1=[],tramo2=[],tramo3=[],tramo4=[],tramo5=[]; var cantidad=[];var preciounitario=[];
						  var actividad1=[],actividad2=[],actividad3=[],actividad4=[],contador=0;
						  for(var j=0; j<actividad.result.length; j++){ //actividad
								if(tramo.result[i].idtramos==actividad.result[j].idtramo){
								  contador++;
								  for(var k=0; k<sam.result.length; k++){
										if(actividad.result[j].idsam==sam.result[k].idsam){
										  actividad1.push(sam.result[k].idsam);actividad2.push(sam.result[k].codsam);actividad3.push(sam.result[k].descripcion);actividad4.push(sam.result[k].unidad);cantidad.push(actividad.result[j].cantidad);preciounitario.push(actividad.result[j].preciounitario);
										}
								  }
								}
						  }
						  tramo1.push(tramo.result[i].idtramos);tramo2.push(tramo.result[i].descripcion);
						  if(contador>0){
								tramos.push({"idtramo":tramo1,"descripcion":tramo2,'estadoactividad':true,'idsam':actividad1,'codsam':actividad2,'descripcionactividad':actividad3,'unidadactividad':actividad4,'cantidadtrab':cantidad,'preciounitario':preciounitario});
								//console.log('bnbnb',tramos);
						  }
						  else{
								tramos.push({"idtramo":tramo1,"descripcion":tramo2,'estadoactividad':false});
						  } 
						}

						query.get('quincenal').execute(function(proquincenal){
							query.get("volumenestrabajo").execute(function(volumen){
								if(proquincenal.result.length>0){
									if(proquincenal.result.length==1){
										console.log('solo existe un registro');
										var ultimo;
										var penultimo;
										var ultimomes;
										var penultimomes;
										ultimo=proquincenal.result.length-1;//1
										penultimo=proquincenal.result.length-2;//0
										var ultimomes=proquincenal.result[ultimo].mes;
										var penultimomes=proquincenal.result[penultimo].mes;
									}else{
										var ultimo;
										var penultimo; var ultimomesanterio,penultimomesanterior;
										var ultimomes;
										var penultimomes;
										ultimo=proquincenal.result.length-1;//1
										penultimo=proquincenal.result.length-2;//0
										
										var ultimomes=proquincenal.result[ultimo].mes;
										var penultimomes=proquincenal.result[penultimo].mes;
										//console.log('kkll',penultimo);
										if(ultimomes==penultimomes){
											ultimomesanterio=proquincenal.result.length-(proquincenal.result.length-1);
											penultimomesanterior=proquincenal.result.length-(proquincenal.result.length);
											var ultimoanteriormes=proquincenal.result[ultimomesanterio].mes;
											var penultimoanteriormes=proquincenal.result[penultimomesanterior].mes;

											var idprograquincenal1quincena=proquincenal.result[penultimomesanterior].idprogramacionquincenal;
											var idprograquincenal2quincena=proquincenal.result[ultimomesanterio].idprogramacionquincenal;
											
											var idsdeprogramacionquincenal=[];
											idsdeprogramacionquincenal.push(idprograquincenal1quincena,idprograquincenal2quincena);
											//console.log('habereres',idsdeprogramacionquincenal);


											//console.log('existen las dos quincenas');
											var cantidades=[];var idproquincena=[];var mes=[];var cantidadesmesanterior=[];var mesanterior=[];
											for(var j=0;j<volumen.result.length;j++){
												for(var t=0;t<idsdeprogramacionquincenal.length;t++){
													//console.log('tamañoooo',volumen.result[j].idproquincena);
													if(idsdeprogramacionquincenal[t]==volumen.result[j].idproquincena){
														cantidadesmesanterior.push(volumen.result[j].cantidades);
													}else{
														if(volumen.result.length==0){
															console.log('no existe volumenes del mes anterior');
														}
													}
												}
												for(var i=penultimo;i<proquincenal.result.length;i++){
													//console.log('los volumenes:',proquincenal.result[i].idprogramacionquincenal);
													if(proquincenal.result[i].idprogramacionquincenal==volumen.result[j].idproquincena){
														mes.push(proquincenal.result[i].mes);cantidades.push(volumen.result[j].cantidades);
														//idproquincena.push(volumen.result[j].idproquincena);
													}else{
														if(volumen.result.length==0){
															console.log('no esxiste volumenes del mes actual');
														}
													}
												}

											}
											console.log('volumenes de mes anterior',cantidadesmesanterior,penultimoanteriormes);
											console.log('volumenes de mes actual',cantidades, penultimomes);
										}else{
											console.log('no hay las dos quincenas');

										}
									}
								}
								/*var cantidades=[];var idproquincena=[];var mes=[];
								for(var j=0;j<volumen.result.length;j++){
									for(var i=0;i<proquincenal.result.length;i++){
										//console.log('los volumenes:',idproquincena);
										if(proquincenal.result[i].idprogramacionquincenal==volumen.result[j].idproquincena){
											mes.push(proquincenal.result[i].mes);cantidades.push(volumen.result[j].cantidades);
											
										}
									}

								}
								console.log('los meses',cantidades, mes);*/
								
								
								query.get("asignacionvehiculos").where({'idresidencia':idresidencia}).execute(function(asignacionvehiculos){
									query.get('asignacionusuarios').where({'idresidencia':idresidencia}).execute(function(usuarioresidencia){
										query.get("vehiculos").execute(function(vehiculos){
											query.get('usuarios').execute(function(usuario){
												if(asignacionvehiculos.result.length>0){
													var lista1=[],lista2=[], lista3=[],vehiculo=[];
													for(var l=0; l<asignacionvehiculos.result.length; l++){
														for(var i=0; i<vehiculos.result.length; i++){
															if(asignacionvehiculos.result[l].idequipo==vehiculos.result[i].idequipos){
																lista1.push(vehiculos.result[i].idequipos); lista2.push(vehiculos.result[i].codinterno);lista3.push(vehiculos.result[i].tipo);
															}
														}
													}
													vehiculo.push({'estado':true,'idequipos':lista1,'codinterno':lista2,'tipo':lista3});
												}else{
													vehiculo.push({'estado':false});
												}
												var nombres_apellidos=[];var idusuario=[]; var perfil=[];var estado=[];var codequipos=[];var codinterno=[]; var tipo=[];
												for(var j=0;j<usuarioresidencia.result.length;j++){
													  idusuario.push(usuarioresidencia.result[j].idusuario);perfil.push(usuarioresidencia.result[j].perfil);estado.push(usuarioresidencia.result[j].estado);
												  for(var k=0;k<usuario.result.length;k++){
													if(idusuario[j]==usuario.result[k].idusuario){
													  nombres_apellidos.push(usuario.result[k].nombres_apellidos);
													  //console.log('namesss', nombres_apellidos);
													}
												  }  
												}
												//console.log('bu',cantidadesmesanterior);
												//console.log('uno....',nombres_apellidos);
												socket.emit('respuestaplanilla', {'estadotramo':true,tramos:tramos,vehiculos:vehiculo,nombres_apellidos:nombres_apellidos,idusuario:idusuario,cantidades:cantidades,penultimomes:penultimomes,cantidadesmesanterior:cantidadesmesanterior,penultimoanteriormes:penultimoanteriormes});
											});
										});
									});	
								});
							});
						})
					});
				});
			}else{
				socket.emit('respuestaplanilla', {'estadotramo':false});
			}
		});
	});
//..........................control de estados PQ.........................................//
	socket.on('manipulacionestados',function(){
		query.get('quincenal').execute(function(resultado){
			//console.log('jjj',resultado.result.length);
			var mes=[];
			var ultimo;
			var penultimo;
			var ultimomes;
			var penultimomes;
			ultimo=resultado.result.length-1;
			penultimo=resultado.result.length-2;
			
			if(resultado.result.length>0){
				if(resultado.result.length==1){
					console.log('solo existe un registro');
					ultimomes=resultado.result[ultimo].mes;
					estado=1;
					datos={estado:estado,ultimomes:ultimomes};
					//console.log('ggggg',datos);
					socket.emit('estadodeprogquincenal', datos);
				}else{
					ultimo=resultado.result.length-1;
					penultimo=resultado.result.length-2;
					ultimomes=resultado.result[ultimo].mes;
					penultimomes=resultado.result[penultimo].mes; var datos; var estado;
					//console.log('el ultimo messs:',ultimomes);
					//console.log('el penultimo messs:',penultimomes);
					for(var k=0;k<resultado.result.length;k++){
						mes.push(resultado.result[k].mes);
					}
					if(ultimomes==penultimomes){
						console.log('se programo las dos quincenas del mes');
						estado=2;
						datos={estado:estado,ultimomes:ultimomes};
						socket.emit('estadodeprogquincenal',datos);
					}
					else{
						console.log('solo se programo la 1° quincena del mes');
						estado=1;
						datos={estado:estado,ultimomes:ultimomes};
						socket.emit('estadodeprogquincenal', datos);
					}	
				}
				
			}else{
				estado=false;
				datos={estado:estado,ultimomes:ultimomes};
				socket.emit('estadodeprogquincenal', datos);
				//no existe ninguna programacion quincenal
			}
		})
	})
//...........................programacion quincenal..........................................//

	socket.on('llenarprogramacionquincenal',function(valor){
		console.log('llegooo', valor);
		var dato0=Object();
		var ci=valor.ci;
		var res=valor.idResidencia;            
		dato0.mes=valor.textomes;              
		dato0.idusuario=valor.ci;
		//dato0.fechapreparacion=valor.fechapreparacion;
		//dato0.fechade=valor.fechade;
		//dato0.fechahasta=valor.fechahasta;
		dato0.ruta=valor.idruta;
		dato0.observaciones=valor.observaciones;
		//dato0.idresidencia=valor.idResidencia;
		console.log('el dato0:',dato0);
		query.save("quincenal",dato0,(function(resultado){
			console.log('ccccc',resultado);
			if(resultado.affectedRows==1){
				query.get("quincenal").where({'idusuario':ci}).execute(function(a){
				
					var ultimo=a.result.length-1;
					var pdID=a.result[ultimo].idprogramacionquincenal;
					var dato1=Object();
					for(var i=0;i<valor.idsamm.length;i++){
					  console.log('tamaño sam:',valor.idsamm.length);
					  dato1.idproquincena=pdID;
					  dato1.idsam=valor.idsamm[i];
					  dato1.progresivade=valor.progresivade[i];
					  dato1.progresivahasta=valor.progresivahasta[i];
					  dato1.cantidadtrabajoprog=valor.cantidadtrabajoprog[i];
					  dato1.tickeo=valor.checks[i];
					  //dato1.idequipos=valor.idvehiculos[i];
					  dato1.seccion=valor.seccion[i];
					  //console.log('dato1', dato1);
					  query.save("detallequincenal",dato1,(function(resultado){
							console.log('registro tabla1');
						   
						}));
					} 
					if(resultado.affectedRows==1){
							var dato2=Object();
							for(var i=0;i<valor.idequiposs.length;i++){
								//console.log('tamaño idvehiculos:',valor.idvehiculos.length);
							  dato2.idproquincenal=pdID;
							  dato2.idequipo=valor.idequiposs[i];
							  dato2.litroshora=valor.litross[i];
							  //console.log('datos de equipos',dato2);
							  query.save("equiposquincenal",dato2,(function(resultado){
									//console.log('registro tabla2');
									if(resultado.affectedRows==1){
										console.log('registro tabla3!!!');
										socket.emit('respuestaregistroporquincenal',true);
								   }else{
										socket.emit('respuestaregistroporquincenal',false);
								   }
								}));
							}
					}
					if(resultado.affectedRows==1){
						var dato3=Object();
						for(var i=0;i<valor.materiales.length;i++){
							dato3.idprogramacionquincenal=pdID;
							dato3.idmaterial=valor.materiales[i];
							dato3.cantidad=valor.cantidad[i];
							dato3.precio=valor.precio[i];
							//console.log('datos de materiales',dato3);
							query.save("materialquincenal",dato3,(function(resultado){
							  if(resultado.affectedRows==1){
									console.log('registro tabla3!!!');
									socket.emit('respuestaregistroporquincenal',true);
							  }else{
									socket.emit('respuestaregistroporquincenal',false);
							  }
							}));
						}
					}
				});
			}
		}));
	});
//..................listar PQ en menuproquin...............................//
	socket.on('listarPQ',function(){
	  	query.get('quincenal').execute(function(quincenal){
	  		query.get('tramos').execute(function(tramos){
			   if(quincenal.result.length>0){
			    	var fepreparacion=[]; var mesquincenal=[], numero=[], tramo=[], nomtramo=[];
			    	for(var i=0;i<quincenal.result.length;i++){
			    		fepreparacion.push(quincenal.result[i].fechapreparacion);mesquincenal.push(quincenal.result[i].mes);numero.push(quincenal.result[i].idprogramacionquincenal);tramo.push(quincenal.result[i].ruta);
			    		for(var o=0;o<tramos.result.length;o++){
							if(tramo[i]==tramos.result[o].idtramos){
			      			nomtramo.push(tramos.result[o].descripcion);
			      		}
			      	}
			    	}
			    	//console.log('test',numero);
			    	socket.emit('resplistarPQ', {'estado':true, 'fecha':fepreparacion, 'mesquincenal':mesquincenal, 'numero':numero, 'nomtramo':nomtramo});
			   }else{
			   	socket.emit('resplistarPQ', {'estado':false});
			   	console.log('no hay nigun quincenal');
			   }
			})
	  	})
	})

//............................ver programacion quincenal ............................................//
	socket.on('verPQ',function(valor){
		var estadoquince;
		query.get('quincenal').execute(function(resultado){
			var mes=[];
			var ultimo;
			var penultimo;
			var ultimomes;
			var penultimomes;
			ultimo=resultado.result.length-1;
			penultimo=resultado.result.length-2;
			if(resultado.result.length==1){
				console.log('solo existe un registro');//primera quincena
				ultimomes=resultado.result[ultimo].mes;
				estadoquince=1;
				
				query.get('quincenal').where({'idprogramacionquincenal':valor}).execute(function(quin){
					//console.log('llega',quin);
					var listarprogramacionesquincenales=[];var codisam=[];var unidad=[];var descripcion=[];var codigointerno=[];var descripmaterial=[];
					query.get('detallequincenal').where({'idproquincena':valor}).execute(function(detallequin){
						query.get('equiposquincenal').where({'idproquincenal':valor}).execute(function(equipquin){
							query.get('materialquincenal').where({'idprogramacionquincenal':valor}).execute(function(materialquin){
								query.get('codificacionsam').execute(function(samm){
									query.get('tramos').execute(function(tramo){
										query.get('vehiculos').execute(function(vehi){
											query.get('codificacionmaterial').execute(function(material){
												var idprogramacionquincenal=[];var fechapreparacion=[];var fechade=[];var fechahasta=[]; var ruta=[]; var observaciones=[];var mesquin=[];
												var idsam=[];var progresivade=[];var progresivahasta=[];var cantidadtrabajoprog=[];var tickeo=[];var idequipo=[];var seccion=[];
						              		var idequipos=[];var litroshora=[];
						              		var idmaterial=[];var cantidad=[];var precio=[];
						              		var idtram=[];var descrip=[];
												for(var i=0; i<quin.result.length; i++){
													idprogramacionquincenal.push(quin.result[i].idprogramacionquincenal);fechapreparacion.push(quin.result[i].fechapreparacion);fechade.push(quin.result[i].fechade);fechahasta.push(quin.result[i].fechahasta);ruta.push(quin.result[i].ruta);observaciones.push(quin.result[i].observaciones);mesquin.push(quin.result[i].mes);
													for(var o=0;o<tramo.result.length;o++){
														if(ruta[i]==tramo.result[o].idtramos){
															idtram.push(tramo.result[o].idtrbamos);descrip.push(tramo.result[o].descripcion);
														}
													}
													
												}
												for(var j=0; j<detallequin.result.length; j++){
								               idsam.push(detallequin.result[j].idsam);progresivade.push(detallequin.result[j].progresivade);progresivahasta.push(detallequin.result[j].progresivahasta);cantidadtrabajoprog.push(detallequin.result[j].cantidadtrabajoprog);tickeo.push(detallequin.result[j].tickeo);idequipo.push(detallequin.result[j].idequipo);seccion.push(detallequin.result[j].seccion); 
								               //console.log('el equipo:',detalleproquincenal.result[j].idequipo);
								            	for(var z=0;z<samm.result.length;z++){
							                  	if(idsam[j]==samm.result[z].idsam){
							                     	codisam.push(samm.result[z].codsam); descripcion.push(samm.result[z].descripcion);unidad.push(samm.result[z].unidad);
							                  	}
						               		}
								            }
								            for(var k=0; k<equipquin.result.length; k++){
								               idequipos.push(equipquin.result[k].idequipo);litroshora.push(equipquin.result[k].litroshora);
								               for(var v=0;v<vehi.result.length;v++){
								               	if(idequipos[k]==vehi.result[v].idequipos){
								               		codigointerno.push(vehi.result[v].codinterno);
								               	}
								               }
								            }
								            for(var l=0; l<materialquin.result.length; l++){
								               idmaterial.push(materialquin.result[l].idmaterial);cantidad.push(materialquin.result[l].cantidad);precio.push(materialquin.result[l].precio);
								            	for(var m=0;m<material.result.length;m++){
								            		if(idmaterial[l]==material.result[m].idmaterialessam){
								            			descripmaterial.push(material.result[m].descripcion);
								            		}
								            	}
								            }
								            listarprogramacionesquincenales.push({'estado':true,'codisam':codisam,'descripcion':descripcion,'unidad':unidad,'descriptramo':descrip,'idprogramacionquincenal':idprogramacionquincenal,'fechapreparacion':fechapreparacion,'fechade':fechade,'fechahasta':fechahasta,'ruta':ruta,'observaciones':observaciones,'mesquin':mesquin,'idsam':idsam,'progresivade':progresivade,'progresivahasta':progresivahasta,'cantidadtrabajoprog':cantidadtrabajoprog,'tickeo':tickeo,'seccion':seccion,'codigointerno':codigointerno,'litroshora':litroshora, 'descripmaterial':descripmaterial,'cantidad':cantidad,'precio':precio,});
												console.log('la programacion para listar:',listarprogramacionesquincenales);
												socket.emit('respverPQ',{'listarprogramacionesquincenales':listarprogramacionesquincenales,'estadoquince':estadoquince});
											})
										})
									})
								})
							})
						})
					})
				})
			}else{
				if(resultado.result.length>1){
					var ultimo;
					var penultimo;
					var ultimomes;
					var penultimomes;
					ultimo=resultado.result.length-1;
					penultimo=resultado.result.length-2;

					ultimomes=resultado.result[ultimo].mes;
					penultimomes=resultado.result[penultimo].mes;
					console.log('viendoo',ultimomes, penultimomes);
					if(ultimomes!=penultimomes){
						console.log('solo se programo la 1° quincena del mes estito');
						estadoquince=1;
						query.get('quincenal').where({'idprogramacionquincenal':valor}).execute(function(quin){
							//console.log('llega',quin);
							var listarprogramacionesquincenales=[];var codisam=[];var unidad=[];var descripcion=[];var codigointerno=[];var descripmaterial=[];
							query.get('detallequincenal').where({'idproquincena':valor}).execute(function(detallequin){
								query.get('equiposquincenal').where({'idproquincenal':valor}).execute(function(equipquin){
									query.get('materialquincenal').where({'idprogramacionquincenal':valor}).execute(function(materialquin){
										query.get('codificacionsam').execute(function(samm){
											query.get('tramos').execute(function(tramo){
												query.get('vehiculos').execute(function(vehi){
													query.get('codificacionmaterial').execute(function(material){
														var idprogramacionquincenal=[];var fechapreparacion=[];var fechade=[];var fechahasta=[]; var ruta=[]; var observaciones=[];var mesquin=[];
														var idsam=[];var progresivade=[];var progresivahasta=[];var cantidadtrabajoprog=[];var tickeo=[];var idequipo=[];var seccion=[];
								              		var idequipos=[];var litroshora=[];
								              		var idmaterial=[];var cantidad=[];var precio=[];
								              		var idtram=[];var descrip=[];
														for(var i=0; i<quin.result.length; i++){
															idprogramacionquincenal.push(quin.result[i].idprogramacionquincenal);fechapreparacion.push(quin.result[i].fechapreparacion);fechade.push(quin.result[i].fechade);fechahasta.push(quin.result[i].fechahasta);ruta.push(quin.result[i].ruta);observaciones.push(quin.result[i].observaciones);mesquin.push(quin.result[i].mes);
															for(var o=0;o<tramo.result.length;o++){
																if(ruta[i]==tramo.result[o].idtramos){
																	idtram.push(tramo.result[o].idtrbamos);descrip.push(tramo.result[o].descripcion);
																}
															}
															
														}
														for(var j=0; j<detallequin.result.length; j++){
										               idsam.push(detallequin.result[j].idsam);progresivade.push(detallequin.result[j].progresivade);progresivahasta.push(detallequin.result[j].progresivahasta);cantidadtrabajoprog.push(detallequin.result[j].cantidadtrabajoprog);tickeo.push(detallequin.result[j].tickeo);idequipo.push(detallequin.result[j].idequipo);seccion.push(detallequin.result[j].seccion); 
										               //console.log('el equipo:',detalleproquincenal.result[j].idequipo);
										            	for(var z=0;z<samm.result.length;z++){
									                  	if(idsam[j]==samm.result[z].idsam){
									                     	codisam.push(samm.result[z].codsam); descripcion.push(samm.result[z].descripcion);unidad.push(samm.result[z].unidad);
									                  	}
								               		}
										            }
										            for(var k=0; k<equipquin.result.length; k++){
										               idequipos.push(equipquin.result[k].idequipo);litroshora.push(equipquin.result[k].litroshora);
										               for(var v=0;v<vehi.result.length;v++){
										               	if(idequipos[k]==vehi.result[v].idequipos){
										               		codigointerno.push(vehi.result[v].codinterno);
										               	}
										               }
										            }
										            for(var l=0; l<materialquin.result.length; l++){
										               idmaterial.push(materialquin.result[l].idmaterial);cantidad.push(materialquin.result[l].cantidad);precio.push(materialquin.result[l].precio);
										            	for(var m=0;m<material.result.length;m++){
										            		if(idmaterial[l]==material.result[m].idmaterialessam){
										            			descripmaterial.push(material.result[m].descripcion);
										            		}
										            	}
										            }
										            listarprogramacionesquincenales.push({'estado':true,'codisam':codisam,'descripcion':descripcion,'unidad':unidad,'descriptramo':descrip,'idprogramacionquincenal':idprogramacionquincenal,'fechapreparacion':fechapreparacion,'fechade':fechade,'fechahasta':fechahasta,'ruta':ruta,'observaciones':observaciones,'mesquin':mesquin,'idsam':idsam,'progresivade':progresivade,'progresivahasta':progresivahasta,'cantidadtrabajoprog':cantidadtrabajoprog,'tickeo':tickeo,'seccion':seccion,'codigointerno':codigointerno,'litroshora':litroshora, 'descripmaterial':descripmaterial,'cantidad':cantidad,'precio':precio,});
														console.log('la programacion para listar:',listarprogramacionesquincenales);
														socket.emit('respverPQ',{'listarprogramacionesquincenales':listarprogramacionesquincenales,'estadoquince':estadoquince});
													})
												})
											})
										})
									})
								})
							})
						})
						ultimo;
						penultimo;
					}else{
						ultimo=resultado.result.length-1;
						penultimo=resultado.result.length-2;
						ultimomes=resultado.result[ultimo].mes;
						penultimomes=resultado.result[penultimo].mes;
						console.log('el ultimo messs:',ultimomes);
						console.log('el penultimo messs:',penultimomes);
						if(ultimomes==penultimomes){
							console.log('se programo las dos quincenas del mes');//segunda quincena
							estadoquince=2;
							query.get('quincenal').where({'idprogramacionquincenal':valor}).execute(function(quin){
								//console.log('llega',quin);
								var listarprogramacionesquincenales=[];var codisam=[];var unidad=[];var descripcion=[];var codigointerno=[];var descripmaterial=[];
								query.get('detallequincenal').where({'idproquincena':valor}).execute(function(detallequin){
									query.get('equiposquincenal').where({'idproquincenal':valor}).execute(function(equipquin){
										query.get('materialquincenal').where({'idprogramacionquincenal':valor}).execute(function(materialquin){
											query.get('codificacionsam').execute(function(samm){
												query.get('tramos').execute(function(tramo){
													query.get('vehiculos').execute(function(vehi){
														query.get('codificacionmaterial').execute(function(material){
															var idprogramacionquincenal=[];var fechapreparacion=[];var fechade=[];var fechahasta=[]; var ruta=[]; var observaciones=[];var mesquin=[];
															var idsam=[];var progresivade=[];var progresivahasta=[];var cantidadtrabajoprog=[];var tickeo=[];var idequipo=[];var seccion=[];
									              		var idequipos=[];var litroshora=[];
									              		var idmaterial=[];var cantidad=[];var precio=[];
									              		var idtram=[];var descrip=[];
															for(var i=0; i<quin.result.length; i++){
																idprogramacionquincenal.push(quin.result[i].idprogramacionquincenal);fechapreparacion.push(quin.result[i].fechapreparacion);fechade.push(quin.result[i].fechade);fechahasta.push(quin.result[i].fechahasta);ruta.push(quin.result[i].ruta);observaciones.push(quin.result[i].observaciones);mesquin.push(quin.result[i].mes);
																for(var o=0;o<tramo.result.length;o++){
																	if(ruta[i]==tramo.result[o].idtramos){
																		idtram.push(tramo.result[o].idtrbamos);descrip.push(tramo.result[o].descripcion);
																	}
																}
																
															}
															for(var j=0; j<detallequin.result.length; j++){
											               idsam.push(detallequin.result[j].idsam);progresivade.push(detallequin.result[j].progresivade);progresivahasta.push(detallequin.result[j].progresivahasta);cantidadtrabajoprog.push(detallequin.result[j].cantidadtrabajoprog);tickeo.push(detallequin.result[j].tickeo);idequipo.push(detallequin.result[j].idequipo);seccion.push(detallequin.result[j].seccion); 
											               //console.log('el equipo:',detalleproquincenal.result[j].idequipo);
											            	for(var z=0;z<samm.result.length;z++){
										                  	if(idsam[j]==samm.result[z].idsam){
										                     	codisam.push(samm.result[z].codsam); descripcion.push(samm.result[z].descripcion);unidad.push(samm.result[z].unidad);
										                  	}
									               		}
											            }
											            for(var k=0; k<equipquin.result.length; k++){
											               idequipos.push(equipquin.result[k].idequipo);litroshora.push(equipquin.result[k].litroshora);
											               for(var v=0;v<vehi.result.length;v++){
											               	if(idequipos[k]==vehi.result[v].idequipos){
											               		codigointerno.push(vehi.result[v].codinterno);
											               	}
											               }
											            }
											            for(var l=0; l<materialquin.result.length; l++){
											               idmaterial.push(materialquin.result[l].idmaterial);cantidad.push(materialquin.result[l].cantidad);precio.push(materialquin.result[l].precio);
											            	for(var m=0;m<material.result.length;m++){
											            		if(idmaterial[l]==material.result[m].idmaterialessam){
											            			descripmaterial.push(material.result[m].descripcion);
											            		}
											            	}
											            }
											            listarprogramacionesquincenales.push({'estado':true,'codisam':codisam,'descripcion':descripcion,'unidad':unidad,'descriptramo':descrip,'idprogramacionquincenal':idprogramacionquincenal,'fechapreparacion':fechapreparacion,'fechade':fechade,'fechahasta':fechahasta,'ruta':ruta,'observaciones':observaciones,'mesquin':mesquin,'idsam':idsam,'progresivade':progresivade,'progresivahasta':progresivahasta,'cantidadtrabajoprog':cantidadtrabajoprog,'tickeo':tickeo,'seccion':seccion,'codigointerno':codigointerno,'litroshora':litroshora, 'descripmaterial':descripmaterial,'cantidad':cantidad,'precio':precio,});
															console.log('la programacion para listar:',listarprogramacionesquincenales);
															socket.emit('respverPQ',{'listarprogramacionesquincenales':listarprogramacionesquincenales,'estadoquince':estadoquince});
														})
													})
												})
											})
										})
									})
								})
							})
						}
					}
				}	
			}
		})
	});
//..............................modificar programacion quincenal................................//
	socket.on('modificarPQ',function(valor){
		var estadoquince;
		query.get('quincenal').execute(function(resultado){
			var mes=[];
			var ultimo;
			var penultimo;
			var ultimomes;
			var penultimomes;
			ultimo=resultado.result.length-1;
			penultimo=resultado.result.length-2;
			if(resultado.result.length==1){
				console.log('solo existe un registro');//primera quincena
				ultimomes=resultado.result[ultimo].mes;
				estadoquince=1;
				query.get('quincenal').where({'idprogramacionquincenal':valor}).execute(function(quin){
					//console.log('modificar:',quin);
					var listarprogramacionesquincenales=[];var codisam=[];var unidad=[];var descripcion=[];var codigointerno=[];var descripmaterial=[];
					query.get('detallequincenal').where({'idproquincena':valor}).execute(function(detallequin){
						query.get('equiposquincenal').where({'idproquincenal':valor}).execute(function(equipquin){
							query.get('materialquincenal').where({'idprogramacionquincenal':valor}).execute(function(materialquin){
								query.get('codificacionsam').execute(function(samm){
									query.get('tramos').execute(function(tramo){
										query.get('vehiculos').execute(function(vehi){
											query.get('codificacionmaterial').execute(function(material){
												var idprogramacionquincenal=[];var fechapreparacion=[];var fechade=[];var fechahasta=[]; var ruta=[]; var observaciones=[];var mesquin=[];
												var idsam=[];var progresivade=[];var progresivahasta=[];var cantidadtrabajoprog=[];var tickeo=[];var idequipo=[];var seccion=[];
						              		var idequipos=[];var litroshora=[];
						              		var idmaterial=[];var cantidad=[];var precio=[];
						              		var idtram=[];var descrip=[];
												for(var i=0; i<quin.result.length; i++){
													idprogramacionquincenal.push(quin.result[i].idprogramacionquincenal);fechapreparacion.push(quin.result[i].fechapreparacion);fechade.push(quin.result[i].fechade);fechahasta.push(quin.result[i].fechahasta);ruta.push(quin.result[i].ruta);observaciones.push(quin.result[i].observaciones);mesquin.push(quin.result[i].mes);
													for(var o=0;o<tramo.result.length;o++){
														if(ruta[i]==tramo.result[o].idtramos){
															idtram.push(tramo.result[o].idtrbamos);descrip.push(tramo.result[o].descripcion);
														}
													}
													
												}
												for(var j=0; j<detallequin.result.length; j++){
								               idsam.push(detallequin.result[j].idsam);progresivade.push(detallequin.result[j].progresivade);progresivahasta.push(detallequin.result[j].progresivahasta);cantidadtrabajoprog.push(detallequin.result[j].cantidadtrabajoprog);tickeo.push(detallequin.result[j].tickeo);idequipo.push(detallequin.result[j].idequipo);seccion.push(detallequin.result[j].seccion); 
								               //console.log('el equipo:',detalleproquincenal.result[j].idequipo);
								            	for(var z=0;z<samm.result.length;z++){
							                  	if(idsam[j]==samm.result[z].idsam){
							                     	codisam.push(samm.result[z].codsam); descripcion.push(samm.result[z].descripcion);unidad.push(samm.result[z].unidad);
							                  	}
						               		}
								            }
								            for(var k=0; k<equipquin.result.length; k++){
								               idequipos.push(equipquin.result[k].idequipo);litroshora.push(equipquin.result[k].litroshora);
								               for(var v=0;v<vehi.result.length;v++){
								               	if(idequipos[k]==vehi.result[v].idequipos){
								               		codigointerno.push(vehi.result[v].codinterno);
								               	}
								               }
								            }
								            for(var l=0; l<materialquin.result.length; l++){
								               idmaterial.push(materialquin.result[l].idmaterial);cantidad.push(materialquin.result[l].cantidad);precio.push(materialquin.result[l].precio);
								            	for(var m=0;m<material.result.length;m++){
								            		if(idmaterial[l]==material.result[m].idmaterialessam){
								            			descripmaterial.push(material.result[m].descripcion);
								            		}
								            	}
								            }
								            listarprogramacionesquincenales.push({'estado':true,'codisam':codisam,'descripcion':descripcion,'unidad':unidad,'descriptramo':descrip,'idprogramacionquincenal':idprogramacionquincenal,'fechapreparacion':fechapreparacion,'fechade':fechade,'fechahasta':fechahasta,'ruta':ruta,'observaciones':observaciones, 'mesquin':mesquin,'idsam':idsam,'progresivade':progresivade,'progresivahasta':progresivahasta,'cantidadtrabajoprog':cantidadtrabajoprog,'tickeo':tickeo,'seccion':seccion,'idequipos':idequipos, 'idequipos':idequipos, 'codigointerno':codigointerno,'litroshora':litroshora, 'descripmaterial':descripmaterial,'cantidad':cantidad,'precio':precio,});
												console.log('la programacion para listar:',listarprogramacionesquincenales);
												socket.emit('respmodificarPQ',{'listarprogramacionesquincenales':listarprogramacionesquincenales,'estadoquince':estadoquince});
											})
										})
									})
								})
							})
						})
					})
				})
				ultimo;
				penultimo;
			}else{
				ultimo=resultado.result.length-2;
				penultimo=resultado.result.length-3;
				ultimomes=resultado.result[ultimo].mes;
				penultimomes=resultado.result[penultimo].mes;
				console.log('el ultimo messs:',ultimomes);
				console.log('el penultimo messs:',penultimomes);
				if(ultimomes==penultimomes){
					console.log('se programo las dos quincenas del mes');//segunda quincena
					estadoquince=2;
					query.get('quincenal').where({'idprogramacionquincenal':valor}).execute(function(quin){
						//console.log('modificar:',quin);
						var listarprogramacionesquincenales=[];var codisam=[];var unidad=[];var descripcion=[];var codigointerno=[];var descripmaterial=[];
						query.get('detallequincenal').where({'idproquincena':valor}).execute(function(detallequin){
							query.get('equiposquincenal').where({'idproquincenal':valor}).execute(function(equipquin){
								query.get('materialquincenal').where({'idprogramacionquincenal':valor}).execute(function(materialquin){
									query.get('codificacionsam').execute(function(samm){
										query.get('tramos').execute(function(tramo){
											query.get('vehiculos').execute(function(vehi){
												query.get('codificacionmaterial').execute(function(material){
													var idprogramacionquincenal=[];var fechapreparacion=[];var fechade=[];var fechahasta=[]; var ruta=[]; var observaciones=[];var mesquin=[];
													var idsam=[];var progresivade=[];var progresivahasta=[];var cantidadtrabajoprog=[];var tickeo=[];var idequipo=[];var seccion=[];
							              		var idequipos=[];var litroshora=[];
							              		var idmaterial=[];var cantidad=[];var precio=[];
							              		var idtram=[];var descrip=[];
													for(var i=0; i<quin.result.length; i++){
														idprogramacionquincenal.push(quin.result[i].idprogramacionquincenal);fechapreparacion.push(quin.result[i].fechapreparacion);fechade.push(quin.result[i].fechade);fechahasta.push(quin.result[i].fechahasta);ruta.push(quin.result[i].ruta);observaciones.push(quin.result[i].observaciones);mesquin.push(quin.result[i].mes);
														for(var o=0;o<tramo.result.length;o++){
															if(ruta[i]==tramo.result[o].idtramos){
																idtram.push(tramo.result[o].idtrbamos);descrip.push(tramo.result[o].descripcion);
															}
														}
														
													}
													for(var j=0; j<detallequin.result.length; j++){
									               idsam.push(detallequin.result[j].idsam);progresivade.push(detallequin.result[j].progresivade);progresivahasta.push(detallequin.result[j].progresivahasta);cantidadtrabajoprog.push(detallequin.result[j].cantidadtrabajoprog);tickeo.push(detallequin.result[j].tickeo);idequipo.push(detallequin.result[j].idequipo);seccion.push(detallequin.result[j].seccion); 
									               //console.log('el equipo:',detalleproquincenal.result[j].idequipo);
									            	for(var z=0;z<samm.result.length;z++){
								                  	if(idsam[j]==samm.result[z].idsam){
								                     	codisam.push(samm.result[z].codsam); descripcion.push(samm.result[z].descripcion);unidad.push(samm.result[z].unidad);
								                  	}
							               		}
									            }
									            for(var k=0; k<equipquin.result.length; k++){
									               idequipos.push(equipquin.result[k].idequipo);litroshora.push(equipquin.result[k].litroshora);
									               for(var v=0;v<vehi.result.length;v++){
									               	if(idequipos[k]==vehi.result[v].idequipos){
									               		codigointerno.push(vehi.result[v].codinterno);
									               	}
									               }
									            }
									            for(var l=0; l<materialquin.result.length; l++){
									               idmaterial.push(materialquin.result[l].idmaterial);cantidad.push(materialquin.result[l].cantidad);precio.push(materialquin.result[l].precio);
									            	for(var m=0;m<material.result.length;m++){
									            		if(idmaterial[l]==material.result[m].idmaterialessam){
									            			descripmaterial.push(material.result[m].descripcion);
									            		}
									            	}
									            }
									            listarprogramacionesquincenales.push({'estado':true,'codisam':codisam,'descripcion':descripcion,'unidad':unidad,'descriptramo':descrip,'idprogramacionquincenal':idprogramacionquincenal,'fechapreparacion':fechapreparacion,'fechade':fechade,'fechahasta':fechahasta,'ruta':ruta,'observaciones':observaciones, 'mesquin':mesquin,'idsam':idsam,'progresivade':progresivade,'progresivahasta':progresivahasta,'cantidadtrabajoprog':cantidadtrabajoprog,'tickeo':tickeo,'seccion':seccion, 'idequipos':idequipos, 'codigointerno':codigointerno,'litroshora':litroshora, 'descripmaterial':descripmaterial,'cantidad':cantidad,'precio':precio,});
													console.log('la programacion para listar:',listarprogramacionesquincenales);
													socket.emit('respmodificarPQ',{'listarprogramacionesquincenales':listarprogramacionesquincenales,'estadoquince':estadoquince});
												})
											})
										})
									})
								})
							})
						})
					})
				}
			}	
		})
	});
	
//............................update programacion quincenal............................................//
	socket.on('modificardatos',function(valor){
		console.log('llego los datos modificados', valor);
		var dato0=Object();
		dato0.observaciones=valor.observaciones[0];
		query.update('quincenal',dato0).where({'idprogramacionquincenal':valor.idQuncenal}).execute(function(resultado){
			if(resultado.affectedRows==1){
				var dato1=Object(); var iddetquince=[];
				query.get('detallequincenal').where({'idproquincena':valor.idQuncenal}).execute(function(respdet){
					console.log('consulta a detalleeee',respdet);
					for(var d=0;d<respdet.result.length;d++){
						iddetquince.push(respdet.result[d].iddetalleproquincenal);
					}
					for(var k=0;k<valor.idsamm.length;k++){
						dato1.idsam=valor.idsamm[k];
						dato1.progresivade=valor.progresivade[k];
						dato1.progresivahasta=valor.progresivahasta[k];
						dato1.cantidadtrabajoprog=valor.cantidadtrabajoprog[k];
						dato1.tickeo=valor.checks[k];
						dato1.seccion=valor.seccion[k];
						query.update("detallequincenal",dato1).where({"iddetalleproquincenal":iddetquince[k]}).execute(function(resultado){
							if(resultado.affectedRows==1){
								console.log('se modifico detalle quincenal',resultado);
								socket.emit('respuestaupdateproquincenal',true);
							}else{
								socket.emit('respuestaupdateproquincenal',false);
							}
						})
					}
					if(resultado.affectedRows==1){
						var dato2=Object();var ideqquince=[];
						query.get('equiposquincenal').where({'idproquincenal':valor.idQuncenal}).execute(function(resp){
							for(var j=0; j<resp.result.length; j++){
								ideqquince.push(resp.result[j].idrequerimientounidadobra);
							}
							for(var i=0;i<valor.litross.length;i++){
								dato2.litroshora=valor.litross[i];
								query.update("equiposquincenal",dato2).where({"idrequerimientounidadobra":ideqquince[i]}).execute(function(res){
									if(res.affectedRows==1){
										console.log('modifico tabla equipos!!!');
										socket.emit('respuestaupdateproquincenal',true);
									}else{
										socket.emit('respuestaupdateproquincenal',false);
									}
								});
							}
							if(resultado.affectedRows==1){
								var dato3=Object();var idmatquince=[];
								query.get('materialquincenal').where({'idprogramacionquincenal':valor.idQuncenal}).execute(function(respmat){
									for(var m=0;m<respmat.result.length;m++){
										idmatquince.push(respmat.result[m].idrequerimientomaterialquincenal);
									}
									for(var i=0;i<valor.cantidad.length;i++){
										dato3.cantidad=valor.cantidad[i];
										dato3.precio=valor.precio[i];
										console.log('datos de materiales',dato3);
										query.update("materialquincenal",dato3).where({"idrequerimientomaterialquincenal":idmatquince[i]}).execute(function(resultado){
											if(resultado.affectedRows==1){
												console.log('registro tabla materiales!!!');
												socket.emit('respuestaupdateproquincenal',true);
											}else{
												socket.emit('respuestaupdateproquincenal',false);
											}
										});
									}
								})
							}
						})
					}
				})
			}
			//socket.emit('respuestaupdateproquincenal',true);			
		})
	})

//............................personallll de residencia para asignacion de actividades......................//
	socket.on('usuariosparamiresidencia',function(aux){
		var idresidencia=aux;
		//console.log('lass4',idresidencia.idresidencia);
		query.get("asignacionvehiculos").where({'idresidencia':idresidencia.idresidencia}).execute(function(asignacionvehiculos){
			//console.log('vehiculos de la residencia',asignacionvehiculos);
			query.get('asignacionusuarios').where({'idresidencia':idresidencia.idresidencia}).execute(function(usuarioresidencia){
				query.get("vehiculos").execute(function(vehiculos){
					query.get('usuarios').execute(function(usuario){
						var vehiculo=[];
						if(asignacionvehiculos.result.length>0){
							var lista1=[],lista2=[], lista3=[];
							for(var l=0; l<asignacionvehiculos.result.length; l++){
								for(var i=0; i<vehiculos.result.length; i++){
									if(asignacionvehiculos.result[l].idequipo==vehiculos.result[i].idequipos){
										lista1.push(vehiculos.result[i].idequipos); lista2.push(vehiculos.result[i].codinterno);lista3.push(vehiculos.result[i].tipo);
									}
								}
							}
							vehiculo.push({'estado':true,'idequipos':lista1,'codinterno':lista2,'tipo':lista3});
						}else{
							console.log('no existe vehiculos en residencia');
							vehiculo.push({'estado':false});
						}
						var nombres_apellidos=[];var idusuario=[]; var perfil=[];var estado=[];var codequipos=[];var codinterno=[]; var tipo=[];
						
						for(var j=0;j<usuarioresidencia.result.length;j++){
							idusuario.push(usuarioresidencia.result[j].idusuario);perfil.push(usuarioresidencia.result[j].perfil);estado.push(usuarioresidencia.result[j].estado);
							for(var k=0;k<usuario.result.length;k++){
								if(idusuario[j]==usuario.result[k].idusuario){
									nombres_apellidos.push(usuario.result[k].nombres_apellidos);
									//console.log('namesss', nombres_apellidos);
								}
							}
						}
						//console.log('uno....',nombres_apellidos);
						socket.emit('respuestausuariosparamiresidencia', {vehiculos:vehiculo,nombres_apellidos:nombres_apellidos,idusuario:idusuario});
					});
				});
			});	
		});
	})

	//................asignar actividades a trabajadores........................//
	socket.on('programacionactividadespersonal',function(aux){
		console.log('jojoj',aux);
		var idproquincenal;
		var idproquincenal2;
		var asignartotal=[];
		query.get("codificacionsam").execute(function(sam){
		  query.get("quincenaldias").where({'idresidencia':aux.idresidencia,'mes':aux.mes}).execute(function(asignardias){
	
			if(asignardias.result.length>0){
			  query.get("quincenaltareasper").execute(function(usertareas){
				query.get("usuarios").execute(function(users){
				  for(var i=0; i<asignardias.result.length; i++){
					var usuarios=[],dias=asignardias.result[i].dia,samcod;
					for(var j=0; j<usertareas.result.length; j++){
					  if(asignardias.result[i].idasignaciondiasquincenal==usertareas.result[j].idasignaciondias){
						for(var k=0; k<users.result.length; k++){
						  if(users.result[k].idusuario==usertareas.result[j].idusuario){
							usuarios.push(users.result[k].nombres_apellidos);
						  }
						}
						for(var l=0; l<sam.result.length; l++){
						  if(asignardias.result[i].idsam==sam.result[l].idsam){
							samcod=sam.result[i].descripcion;
						  }
						}
					  }
					}
					asignartotal.push({'dias':dias,'nombres':usuarios,'sam':samcod});
				  }
				  socket.emit('respondeprogramacionactividadespersonal',{'estado':true,'asignaciontotal':asignartotal});
				});
			  });
			}else{
			  query.get("quincenal").where({'mes':aux.mes}).execute(function(quincenal){
				if(quincenal.result.length>0){
				  idproquincenal=quincenal.result[0].idprogramacionquincenal;
				  idproquincenal2=quincenal.result[0].idprogramacionquincenal;
				  if(quincenal.result.length>1){
					idproquincenal2=quincenal.result[1].idprogramacionquincenal;
					var totaltickes=[],totaltickes1=[];
					query.get("detallequincenal").where_or({'idproquincena':idproquincenal}).execute(function(detallequincenal){
					  query.get("detallequincenal").where_or({'idproquincena':idproquincenal2}).execute(function(detallequincenal2){
						query.get("quincenaltareasper").execute(function(usertareas){
							query.get('asignacionusuarios').where({'idresidencia':aux.idresidencia}).execute(function(usuarioresidencia){
								query.get('usuarios').execute(function(usuario){
								  for(var i=0; i<detallequincenal.result.length; i++){
									var samcod,tickeo,idsam;
									for(var j=0; j<sam.result.length; j++){
									  if(detallequincenal.result[i].idsam==sam.result[j].idsam){
										idsam=detallequincenal.result[i].idsam;
										tickeo=detallequincenal.result[i].tickeo;
										samcod=sam.result[i].descripcion;
									  }
									}
									totaltickes.push({'idsam':idsam,'tickeo':tickeo,'sam':samcod})
								  }
								  for(var i=0; i<detallequincenal2.result.length; i++){
									var samcod1,tickeo1,idsam1;
									for(var j=0; j<sam.result.length; j++){
									  if(detallequincenal2.result[i].idsam==sam.result[j].idsam){
										idsam1=detallequincenal2.result[i].idsam;
										tickeo1=detallequincenal2.result[i].tickeo;
										samcod1=sam.result[i].descripcion;
									  }
									}
									totaltickes1.push({'idsam':idsam1,'tickeo':tickeo1,'sam':samcod1})
								  }
								  var nombres_apellidos=[];var idusuario=[]; var perfil=[];var estado=[];var codequipos=[];var codinterno=[]; var tipo=[];
								  for(var j=0;j<usuarioresidencia.result.length;j++){
									  idusuario.push(usuarioresidencia.result[j].idusuario);perfil.push(usuarioresidencia.result[j].perfil);estado.push(usuarioresidencia.result[j].estado);
									for(var k=0;k<usuario.result.length;k++){
									  if(idusuario[j]==usuario.result[k].idusuario){
										nombres_apellidos.push(usuario.result[k].nombres_apellidos);
										
									  }
									}
								  }
								  console.log('hey',totaltickes);
								  console.log('hoy',totaltickes1);
								  socket.emit('respondeprogramacionactividadespersonal',{'estado':false,'estadoquincena':true,'totalsemanas':true,'totalticket':totaltickes,'totalticket1':totaltickes1,'nombres_apellidos':nombres_apellidos,'idusuario':idusuario,});
								});
							});
						});
					  });
					});
				  }
				  else{
					var totaltickes=[];
					query.get("detallequincenal").where_or({'idproquincena':idproquincenal}).execute(function(detallequincenal){
					  console.log('ñññññ',detallequincenal);
					  query.get("quincenaltareasper").execute(function(usertareas){
						for(var i=0; i<detallequincenal.result.length; i++){
						  var samcod=[],tickeo=[],idsam=[];
						  for(var j=0; j<sam.result.length; j++){
							if(detallequincenal.result[i].idsam==sam.result[j].idsam){
							  idsam.push(detallequincenal.result[i].idsam);
							  tickeo.push(detallequincenal.result[i].tickeo);
							  samcod.push(sam.result[i].descripcion);
							}
						  }
						  totaltickes.push({'idsam':idsam,'tickeo':tickeo,'sam':samcod})
						}
						socket.emit('respondeprogramacionactividadespersonal',{'estado':false,'estadoquincena':true,'totalsemanas':false,'totalticket':totaltickes});
					  });
					});
				  }
				}
				else{
				  socket.emit('respondeprogramacionactividadespersonal',{'estado':false,'estadoquincena':false});
				  //no hay programacion quincenal en ese mes
				}
			  });
			}
		  });
		});
	});
	
//........registrar actividades trabajador.................//
	socket.on('registrarasignaciontrab',function(valor){
		var aux=0;
		console.log('llegoooooooooooo',valor);
		var dato0=Object();
		for(var i=0;i<valor.actividadd.length;i++){
			dato0.idresidencia=valor.idresidencia;
			dato0.mes=valor.mes;
			dato0.dia=valor.diass[i];
			dato0.idsam=valor.actividadd[i];
			query.save("quincenaldias",dato0,(function(resultado){
				if(resultado.affectedRows==1){
					aux=aux+1;
					console.log('aux',aux);
					if(aux==i){
						console.log('entro if',aux);
						query.get("quincenaldias").execute(function(volumen){
							console.log('asignacion de dias:',volumen);
							var ultimo=(volumen.result.length)-(valor.diass.length);
							console.log('ultimo:',ultimo);
							var volid=volumen.result[ultimo].idasignaciondiasquincenal;
							console.log('su iddd:',volid);
							socket.emit('responderegistrarasignaciontrab',{'estado':true,'idvolumen':volid});
						});
					}
				}
			}));
		}
	});
	socket.on('llenarasignacionusuarios',function(valor){
	  console.log('llegoooooooooooo',valor);
	  var dato0=Object();
	  for(var i=0;i<valor.userids.length;i++){
		dato0.idasignaciondias=valor.volumenes[i];
		dato0.idusuario=valor.userids[i];
		dato0.estadoparte='vacio';
		query.save("quincenaltareasper",dato0,(function(resultado){
		  if(resultado.affectedRows==1){
			socket.emit('respondellenarasignacionusuarios',true);
		  }else{
			socket.emit('respondellenarasignacionusuarios',false);
		  }
		}));
	  }
	});
   //...................asignacion chofer a vehiculo............................//

	socket.on('asignacionchoferavehiculo',function(val){
		console.log('yyyy',val);
		query.get("asignacionvehiculos").where({'idresidencia':val.idresidencia}).execute(function(asignacionvehiculos){
			query.get('asignacionusuarios').where({'idresidencia':val.idresidencia}).execute(function(usuarioresidencia){
				query.get("vehiculos").execute(function(vehiculos){
					query.get('usuarios').execute(function(usuario){
						query.get('codificacionpersonal').execute(function(cargosam){
							var descripcion=[];
							for(var u=0; u<usuarioresidencia.result.length; u++){
								for(var q=0; q<cargosam.result.length; q++){
									//console.log('loslos',asignacionvehiculos.result[l].idequipo);
									if(usuarioresidencia.result[u].perfil==cargosam.result[q].codigo){
										descripcion.push(cargosam.result[q].descripcion);
										console.log('ssss',descripcion);
									}
								}
							}
						
							var lista1=[],lista2=[], lista3=[],vehiculo=[];
							for(var l=0; l<asignacionvehiculos.result.length; l++){
								for(var i=0; i<vehiculos.result.length; i++){
									//console.log('loslos',asignacionvehiculos.result[l].idequipo);
									if(asignacionvehiculos.result[l].idequipo==vehiculos.result[i].idequipos){
										lista1.push(vehiculos.result[i].idequipos); lista2.push(vehiculos.result[i].codinterno);lista3.push(vehiculos.result[i].tipo);
										//console.log('ssss',lista1);
									}
								}
							}
							vehiculo.push({'estado':true,'idequipos':lista1,'codinterno':lista2,'tipo':lista3});
							//console.log('qweqwe',vehiculo);
							var usuarioss=[];
							var nombres_apellidos=[];var idusuario=[]; var perfil=[];var estado=[];var codequipos=[];var codinterno=[]; var tipo=[];
							for(var j=0;j<usuarioresidencia.result.length;j++){
								idusuario.push(usuarioresidencia.result[j].idusuario);perfil.push(usuarioresidencia.result[j].perfil);estado.push(usuarioresidencia.result[j].estado);
								//console.log('perfil:',perfil);
								for(var k=0;k<usuario.result.length;k++){
									if(idusuario[j]==usuario.result[k].idusuario){
										nombres_apellidos.push(usuario.result[k].nombres_apellidos);
										//console.log('namesss', nombres_apellidos);
									}
								}
							}
							usuarioss.push({'estado':true,'idusuario':idusuario,'perfil':perfil,'descripcion':descripcion});
							console.log('uno....',vehiculo);
							console.log('dos....',usuarioss);
							socket.emit('respuestaasignacionchofervehiculo', {vehiculos:vehiculo,nombres_apellidos:nombres_apellidos,usuarios:usuarioss});
						})
					});
				});
			});
		});
	});
	//....................registro de chofer a vehiculo.........................//
	socket.on('registrarchoferavehiculo',function(valor){
		console.log('llegoooooooooooo',valor);
		var dato0=Object();
		for(var k=0;k<valor.idvehiculo.length;k++){
			//console.log('rururu',valor.idvehiculo[k]);
			dato0.encargado=valor.idusuario[k];
			console.log('reg:',dato0);
			query.update("asignacionvehiculos",dato0).where({"idequipo":valor.idvehiculo[k]}).execute(function(row){
				if(row.affectedRows==1){
					console.log('se registro',row);
					socket.emit('respuestaactualizacionasignacionchofer',true);
				}else{
					socket.emit('respuestaactualizacionasignacionchofer',false);
				}
			})
		}
	});

//...........informe semanal..........................//
	socket.on('informesemanal',function(aux){
		var idresidencia=aux;
		var mes='octubre';
		query.get('informesemanal').execute(function(infosemanal){
			if(infosemanal.result.length>0){
				console.log('datos info semanal:',infosemanal);
				query.get("quincenal").where({'idresidencia':idresidencia}).execute(function(programacionquincenal){
					//console.log('el informe:',programacionquincenal);
					var ultimo;
					var penultimo;
					var ultimomes;
					var penultimomes;
					ultimo=programacionquincenal.result.length-1;//1
					penultimo=programacionquincenal.result.length-2;//0
					
					var ultimomes=programacionquincenal.result[ultimo].mes;
					var penultimomes=programacionquincenal.result[penultimo].mes;
					//console.log('kkll',penultimo);
					if(programacionquincenal.result.length>0){
						var idproquincenal=programacionquincenal.result[penultimo].idprogramacionquincenal;
						console.log('mnb',idproquincenal);
						if(programacionquincenal.result.length>1){
							idproquincenal2=programacionquincenal.result[ultimo].idprogramacionquincenal;
							var totaltickes=[],totaltickes1=[];
							query.get("detallequincenal").where_or({'idproquincena':idproquincenal}).execute(function(detallequincenal){
								query.get("detallequincenal").where_or({'idproquincena':idproquincenal2}).execute(function(detallequincenal2){
									query.get("codificacionsam").execute(function(sam){
										query.get("asignacionvehiculos").where({'idresidencia':idresidencia}).execute(function(asignacionvehiculos){
											query.get("vehiculos").execute(function(vehiculos){
												var idtramopartediario=programacionquincenal.result[0].ruta;
												query.get('partesdiarios').where({'idResidencia':idresidencia,'Tramo':idtramopartediario}).execute(function(partesdiarios){
												//console.log('el sam',partesdiarios);
													query.get("volumenestrabajo").execute(function(volumen){
														//console.log('los volumenes:',volumen);
														//console.log('los volumenes:',ultimomes);
														if(ultimomes==penultimomes){
															var idproquincenalpenultimomes=programacionquincenal.result[penultimo].idprogramacionquincenal;
															var idproquincenalultimomes=programacionquincenal.result[ultimo].idprogramacionquincenal;
															var idsdeprogramacionquincenal=[];
															idsdeprogramacionquincenal.push(idproquincenalpenultimomes,idproquincenalultimomes);
															var cantidades=[],dia=[];
															for(var i=0;i<volumen.result.length;i++){
															for(var t=0;t<idsdeprogramacionquincenal.length;t++){
																if(idsdeprogramacionquincenal[t]==volumen.result[i].idproquincena){
																	cantidades.push(volumen.result[i].cantidades);dia.push(volumen.result[i].dia);
																}else{
																	if(volumen.result.length==0){
																		console.log('no existe volumenes del mes');
																	}
																}
															}
																
															}
															console.log('utututu',cantidades);
															var horastrabajadas=[],idpartesdiarios=[];
															//console.log('hh',programacionquincenal.result[0].ruta);
															for(var k=0;k<partesdiarios.result.length;k++){
																//idpartesdiarios.push(partesdiarios.result[k].idPartesDiarios);
																horastrabajadas.push(partesdiarios.result[k].TotalHorasTrabajadas);
															}
														}
														//console.log('del prate diario',idpartesdiarios);
														var vlista2=[],vehiculoss=[];
														var vlistacol2=[];
														for(var l=0; l<infosemanal.result.length; l++){
															for(var i=0; i<vehiculos.result.length; i++){
																console.log('proba',infosemanal.result[l].ninternoequipo);
																if(infosemanal.result[l].ninternoequipo==vehiculos.result[i].idequipos){
																	vlista2.push(vehiculos.result[i].codinterno);
																	//console.log('ssss',vlista1);
																}
																if(infosemanal.result[l].ninternoequipo1==vehiculos.result[i].idequipos){
																vlistacol2.push(vehiculos.result[i].codinterno);
																}
															}
														}
														vehiculoss.push({'estado':true,'codinterno':vlista2,'codinterno1':vlistacol2});
														console.log('lolo',vehiculoss);
														for(var i=0; i<detallequincenal.result.length; i++){
															var samcod,tickeo,idsam,seccion,proinicial,progfinal;
															for(var j=0; j<sam.result.length; j++){
																if(detallequincenal.result[i].idsam==sam.result[j].idsam){
																	idsam=detallequincenal.result[i].idsam;
																	tickeo=detallequincenal.result[i].tickeo;
																	samcod=sam.result[i].codsam;
																	seccion=detallequincenal.result[i].seccion;
																	proinicial=detallequincenal.result[i].progresivade;
																	progfinal=detallequincenal.result[i].progresivahasta;
																}
															}
															totaltickes.push({'idsam':idsam,'tickeo':tickeo,'sam':samcod,'seccion':seccion,'proinicial':proinicial,'progfinal':progfinal,'horastrabajadas':horastrabajadas})
														}
														for(var i=0; i<detallequincenal2.result.length; i++){
															var samcod1,tickeo1,idsam1,seccion1,proinicial1,progfinal1;
															for(var j=0; j<sam.result.length; j++){
																if(detallequincenal2.result[i].idsam==sam.result[j].idsam){
																	idsam1=detallequincenal2.result[i].idsam;
																	tickeo1=detallequincenal2.result[i].tickeo;
																	samcod1=sam.result[i].codsam;
																	seccion1=detallequincenal2.result[i].seccion;
																	proinicial1=detallequincenal2.result[i].progresivade;
																	progfinal1=detallequincenal2.result[i].progresivahasta;
																}
															}
															totaltickes1.push({'idsam':idsam1,'tickeo':tickeo1,'sam':samcod1,'seccion1':seccion1,'proinicial1':proinicial1,'progfinal1':progfinal1})
														}

														//console.log('primera quincena:',totaltickes);
														//console.log('segunda quincena:',totaltickes1);
														socket.emit('insertarinformesemanal',{'estado':true,'estadoquincena':true,'totalsemanas':true,'totalticket':totaltickes,'totalticket1':totaltickes1,'vehiculoss':vehiculoss,'cantidades':cantidades,'dia':dia,'infosemanal':infosemanal});
													})
												})
											})
										})
									});
								});
							});
						}
					}
				});
				//socket.emit('insertarinformesemanal',{'estado':true,infosemanal:infosemanal});
			}else{
				query.get("quincenal").where({'mes':mes}).execute(function(programacionquincenal){
					//console.log('el informe:',programacionquincenal);
					if(programacionquincenal.result.length>0){
						var idproquincenal=programacionquincenal.result[0].idprogramacionquincenal;
						if(programacionquincenal.result.length>1){
							idproquincenal2=programacionquincenal.result[1].idprogramacionquincenal;
							var totaltickes=[],totaltickes1=[];
							query.get("detallequincenal").where_or({'idproquincena':idproquincenal}).execute(function(detallequincenal){
								query.get("detallequincenal").where_or({'idproquincena':idproquincenal2}).execute(function(detallequincenal2){
									query.get("codificacionsam").execute(function(sam){
										//console.log('el sammmm',sam);
										query.get("asignacionvehiculos").where({'idresidencia':idresidencia}).execute(function(asignacionvehiculos){
											query.get("vehiculos").execute(function(vehiculos){
												var idtramopartediario=programacionquincenal.result[0].ruta;
												query.get('partesdiarios').where({'idResidencia':idresidencia,'Tramo':idtramopartediario}).execute(function(partesdiarios){
													//console.log('el PD',partesdiarios);
													query.get("volumenestrabajo").execute(function(volumen){
													//console.log('los volumenes:',volumen);
														var cantidades=[],dia=[];
														for(var i=0;i<volumen.result.length;i++){
															cantidades.push(volumen.result[i].cantidades);dia.push(volumen.result[i].dia);
														}
														//console.log('utututu',dia);
														var horastrabajadas=[],idpartesdiarios=[];
														//console.log('hh',quincenal.result[0].ruta);
														for(var k=0;k<partesdiarios.result.length;k++){
															//idpartesdiarios.push(partesdiarios.result[k].idPartesDiarios);
															horastrabajadas.push(partesdiarios.result[k].TotalHorasTrabajadas);
														}
														//console.log('del prate diario',idpartesdiarios);
														var vlista1=[],vlista2=[], vlista3=[],vehiculoss=[];
														for(var l=0; l<asignacionvehiculos.result.length; l++){
															for(var i=0; i<vehiculos.result.length; i++){
																if(asignacionvehiculos.result[l].idequipo==vehiculos.result[i].idequipos){
																	vlista1.push(vehiculos.result[i].idequipos); vlista2.push(vehiculos.result[i].codinterno);vlista3.push(vehiculos.result[i].tipo);
																	//console.log('ssss',vlista1);
																}
															}
														}
														vehiculoss.push({'estado':true,'idequipos':vlista1,'codinterno':vlista2,'tipo':vlista3});
														for(var i=0; i<detallequincenal.result.length; i++){
															var samcod,tickeo,idsam,seccion,proinicial,progfinal;
															for(var j=0; j<sam.result.length; j++){
																if(detallequincenal.result[i].idsam==sam.result[j].idsam){
																	idsam=detallequincenal.result[i].idsam;
																	tickeo=detallequincenal.result[i].tickeo;
																	samcod=sam.result[i].codsam;
																	seccion=detallequincenal.result[i].seccion;
																	proinicial=detallequincenal.result[i].progresivade;
																	progfinal=detallequincenal.result[i].progresivahasta;
																}
															}
															totaltickes.push({'idsam':idsam,'tickeo':tickeo,'sam':samcod,'seccion':seccion,'proinicial':proinicial,'progfinal':progfinal,'horastrabajadas':horastrabajadas})
														}
														for(var i=0; i<detallequincenal2.result.length; i++){
															var samcod1,tickeo1,idsam1,seccion1,proinicial1,progfinal1;
															for(var j=0; j<sam.result.length; j++){
																if(detallequincenal2.result[i].idsam==sam.result[j].idsam){
																	idsam1=detallequincenal2.result[i].idsam;
																	tickeo1=detallequincenal2.result[i].tickeo;
																	samcod1=sam.result[i].codsam;
																	seccion1=detallequincenal2.result[i].seccion;
																	proinicial1=detallequincenal2.result[i].progresivade;
																	progfinal1=detallequincenal2.result[i].progresivahasta;
																}
															}
															totaltickes1.push({'idsam':idsam1,'tickeo':tickeo1,'sam':samcod1,'seccion1':seccion1,'proinicial1':proinicial1,'progfinal1':progfinal1})
														}
														console.log('primera quincena:',totaltickes);
														console.log('segunda quincena:',totaltickes1);
														socket.emit('insertarinformesemanal',{'estado':false,'estadoquincena':true,'totalsemanas':true,'totalticket':totaltickes,'totalticket1':totaltickes1,'vehiculoss':vehiculoss,'cantidades':cantidades,'dia':dia});
													})
												})
											})
										})
									})
								})
							})
						}
						else{
							var totaltickes=[];
							query.get("detallequincenal").where_or({'idproquincena':idproquincenal}).execute(function(detallequincenal){
								console.log('ñññññ',detallequincenal);
								for(var i=0; i<detallequincenal.result.length; i++){
									var samcod=[],tickeo=[],idsam=[];
									for(var j=0; j<sam.result.length; j++){
										if(detallequincenal.result[i].idsam==sam.result[j].idsam){
											idsam.push(detallequincenal.result[i].idsam);
											tickeo.push(detallequincenal.result[i].tickeo);
											samcod.push(sam.result[i].codsam);
										}
									}
									totaltickes.push({'idsam':idsam,'tickeo':tickeo,'sam':samcod})
								}
								socket.emit('insertarinformesemanal',{'estado':false,'estadoquincena':true,'totalsemanas':false,'totalticket':totaltickes});
							});
						}
					}
				})
			}
		})
   })
//....................registrar informe semanal............................//
	socket.on('llenarinformesemanal',function(valor){
		console.log('llego datos del informe', valor);
		var ci=valor.ci;
		query.get("quincenal").where({'idusuario':ci}).execute(function(a){
			var ultimo=a.result.length-1;
			console.log('ultimito',ultimo);
			var primeraquincena=a.result[ultimo].idprogramacionquincenal;
			var dato0=Object();
			for(var i=0;i<valor.ruta.length;i++){
				dato0.idprograquincenal=primeraquincena;
				dato0.ruta=valor.ruta[i];
				dato0.seccion=valor.seccion[i];           
				dato0.kinicial=valor.kinicial[i];              
				dato0.kfinal=valor.kfinal[i];
				dato0.claseper=valor.claseper[i];
				dato0.hregularesper=valor.hregularesper[i];
				dato0.claseper2=valor.claseper2[i];
				dato0.hregularesper2=valor.hregularesper2[i];
				dato0.clasematerial=valor.clasematerial[i];
				dato0.cantmaterial=valor.cantmaterial[i];
				dato0.clasematerial2=valor.clasematerial2[i];
				dato0.cantmaterial2=valor.cantmaterial2[i];
				dato0.ninternoequipo=valor.ninternoequipo[i];
				dato0.hutilizadasequipo=valor.hutilizadasequipo[i];
				dato0.ninternoequipo1=valor.ninternoequipo1[i];
				dato0.hutilizadasequipo1=valor.hutilizadasequipo1[i];
				dato0.observaciones=valor.observaciones[i];
				console.log('el dato0:',dato0);
				query.save("informesemanal",dato0,(function(resultado){
				  if(resultado.affectedRows==1){
						console.log('registro informesemanal!!!');
						socket.emit('respuestaregistroinformequincenal',true);
				  }else{
						socket.emit('respuestaregistroinformequincenal',false);
				  }
				}));
			}
		});
	});
	/*socket.on('pruebapdf',function(val){
		console.log(val.pdf);
	});*/
});

module.exports = app;