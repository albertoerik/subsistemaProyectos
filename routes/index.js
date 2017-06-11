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
  database:"sistemasedecauatf",
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
		file.path = DirRout+'/public/images/Upload/'+fechaa + file.name;
		dirImagen = 'images/Upload/'+ fechaa + file.name;
	});
	form.on('file', function (name, file){
		console.log('Uploaded ' + file.name);
		res.render('EncargadoResidencia',{ title: 'residente', dirImagen:dirImagen});
	});
});

router.get('/asignacionactividades',function(req ,res){
	res.render('asignacionactividades',{ title: 'residente'});
});


router.get('/enviarreportes',function(req ,res){
  res.render('enviarreportes',{ title: 'hola'});
});



router.get('/listaprogramacionquincenal', function(req, res, next) {
  var mes=req.query.mes;
  //console.log('wwwwwwwwww',mes);

  query.get('quincenal').where({'mes':mes}).execute(function(proquincenal){
    
    var listarprogramacionesquincenales=[]; var codisam=[];var unidad=[];var descripcion=[];
    query.get("detallequincenal").execute(function(detalleproquincenal){
      query.get("equiposquincenal").execute(function(requnidadobra){
        query.get("materialquincenal").execute(function(reqmaterialobra){
          query.get('codificacionsam').execute(function(samm){
            for(var i=0; i<proquincenal.result.length; i++){
              
              var idprogramacionquincenal=[];var idusuario=[];var fechapreparacion=[];var fechade=[];var fechahasta=[]; var ruta=[]; var observaciones=[];var idresidencia=[];
              var idsam=[];var progresivade=[];var progresivahasta=[];var cantidadtrabajoprog=[];var tickeo=[];var idequipo=[];var seccion=[];
              var idequipos=[];var litroshora=[];
              var idmaterial=[];var cantidad=[];var precio=[];
              idprogramacionquincenal.push(proquincenal.result[i].idprogramacionquincenal);fechapreparacion.push(proquincenal.result[i].fechapreparacion);fechade.push(proquincenal.result[i].fechade);fechahasta.push(proquincenal.result[i].fechahasta);ruta.push(proquincenal.result[i].ruta);observaciones.push(proquincenal.result[i].observaciones);idresidencia.push(proquincenal.result[i].idresidencia);
              
              for(var j=0; j<detalleproquincenal.result.length; j++){
                
                if(proquincenal.result[i].idprogramacionquincenal==detalleproquincenal.result[j].idproquincena){
                  idsam.push(detalleproquincenal.result[j].idsam);progresivade.push(detalleproquincenal.result[j].progresivade);progresivahasta.push(detalleproquincenal.result[j].progresivahasta);cantidadtrabajoprog.push(detalleproquincenal.result[j].cantidadtrabajoprog);tickeo.push(detalleproquincenal.result[j].tickeo);idequipo.push(detalleproquincenal.result[j].idequipo);seccion.push(detalleproquincenal.result[j].seccion); 
                  //console.log('el equipo:',detalleproquincenal.result[j].idequipo);
                }
                for(var z=0;z<samm.result.length;z++){
                    if(idsam[j]==samm.result[z].idsam){
                      codisam.push(samm.result[z].codsam); descripcion.push(samm.result[z].descripcion);unidad.push(samm.result[z].unidad);
                    }
                }
              }
              for(var k=0; k<requnidadobra.result.length; k++){
                if(proquincenal.result[i].idprogramacionquincenal==requnidadobra.result[k].idproquincenal){
                  idequipos.push(requnidadobra.result[k].idequipo);litroshora.push(requnidadobra.result[k].litroshora);
                }

              }
              for(var l=0; l<reqmaterialobra.result.length; l++){
                if(proquincenal.result[i].idprogramacionquincenal==reqmaterialobra.result[l].idprogramacionquincenal){
                  idmaterial.push(reqmaterialobra.result[l].idmaterial);cantidad.push(reqmaterialobra.result[l].cantidad);precio.push(reqmaterialobra.result[l].precio);
                }
              }
              listarprogramacionesquincenales.push({'estado':true,'codisam':codisam,'descripcion':descripcion,'unidad':unidad,'idprogramacionquincenal':idprogramacionquincenal,'fechapreparacion':fechapreparacion,'fechade':fechade,'fechahasta':fechahasta,'ruta':ruta,'observaciones':observaciones,'idresidencia':idresidencia,'idsam':idsam,'progresivade':progresivade,'progresivahasta':progresivahasta,'cantidadtrabajoprog':cantidadtrabajoprog,'tickeo':tickeo,'idequipo':idequipo,'seccion':seccion,'idequipos':idequipos,'litroshora':litroshora,'idmaterial':idmaterial,'cantidad':cantidad,'precio':precio,});
            }
            console.log('la programacion para listar:',listarprogramacionesquincenales);
            res.render('listaprogramacionquincenal',{listarprogramacionesquincenales:listarprogramacionesquincenales,codisam:codisam,unidad:unidad});
          });
        });
      });
    });
  })
  //res.render('listaprogramacionquincenal');
});
router.get('/principalavance',function(req, res){
  res.render('principalavance', {title:'residencia'});
})

router.get('/reportes',function(req, res){
  res.render('reportes', {title:'residencia'});
})

router.get('/Planilla',function(req ,res){
	res.render('Planilla',{ title: 'Planillaavance'});
  
});
router.post('/Planilla', function(req, res){
  var dirImagen='';
  var form = new formidable.IncomingForm();
  form.parse(req);
  form.on('fileBegin', function (name, file){
    var DirRouter=__dirname;
    var DirRout='';
    for(var i=0;i<DirRouter.length-7;i++){
      DirRout=DirRout+DirRouter[i];
    }
    file.path = DirRout+'/public/pdfs/'+ file.name+'.pdf';
  });
  form.on('file', function (name, file){
    console.log('Uploaded ' + file.name);
    //res.render('EncargadoResidencia',{ title: 'residente', dirImagen:dirImagen});
  });
});


router.get('/PROGRAMACION_QUINCENAL',function(req ,res){
	res.render('PROGRAMACION_QUINCENAL',{ title: 'EncargadoResidencia'});
});

router.get('/residenciaQuincenal', function(req, res) {
	res.render('residenciaQuincenal', { title: 'Residencia' });
});
router.get('/MenuPrincipal', function(req, res) {
  res.render('MenuPrincipal', { title: 'Residencia' });
});

router.get('/Mi_Residencia', function(req, res) {
  var id=req.query.id;// residencia=2
  var año;
  if(id!=undefined){
    query.get("residencias").where({'idresidencias':id}).execute(function(residencia){
      console.log(residencia);
      año=residencia.result[0].año;
      if(residencia.result.length==1){
          var personal=[],materiales=[],vehiculos=[],servicios=[],tramos=[],residencias=[],costototal=0,usuarios=[],equipos=[];
          var residencia1,residencia2,residencia3,residencia4,residencia5=0,residencia6=0,residencia7,residencia8,residencia9;
          residencia1=residencia.result[0].nombre;residencia7=residencia.result[0].latitud;residencia8=residencia.result[0].longitud;
          residencia9=residencia.result[0].estado;
          query.get("asignacionusuarios").where({'idresidencia':id}).execute(function(asiguser){
            residencia2=asiguser.result.length;
            query.get("usuarios").execute(function(user){
              console.log(user);
              if(asiguser.result.length>0){
                for (var i=0;i<asiguser.result.length;i++){
                  var persona1=[],persona2=[],persona3=[],persona4=[],persona5=[];
                  for (var j=0;j<user.result.length;j++){
                    if(asiguser.result[i].idusuario==user.result[j].idusuario){
                      persona1.push(user.result[j].idusuario);persona2.push(asiguser.result[i].perfil);persona3.push(user.result[j].nombres_apellidos);persona4.push(asiguser.result[i].observaciones);persona5.push(asiguser.result[i].estado);
                    }
                  }
                  personal.push({"estado":true,'idusuario':persona1,"perfil":persona2,"nombres":persona3,'observaciones':persona4,'estadouser':persona5});
                }
              }else{
                 personal.push({"estado":false});//sin personal en residencia
              }
              query.get("asignacionvehiculos").where({'idresidencia':id}).execute(function(asigvehiculo){
                residencia3=asigvehiculo.result.length;
                query.get("vehiculos").execute(function(cargeneral){
                  if(asigvehiculo.result.length>0){
                    for (var i=0;i<asigvehiculo.result.length;i++){
                      var vehiculo1=[],vehiculo2=[],vehiculo3=[],vehiculo4=[],vehiculo5=[],vehiculo6=[];
                      for (var j=0;j<cargeneral.result.length;j++){
                        if(asigvehiculo.result[i].idequipo==cargeneral.result[j].idequipos){
                          vehiculo1.push(cargeneral.result[j].idequipos);vehiculo2.push(cargeneral.result[j].codinterno);vehiculo3.push(cargeneral.result[j].tipo);
                          if(asigvehiculo.result[i].encargado!=null){
                            for (var k=0;k<user.result.length;k++){
                              if(asigvehiculo.result[i].encargado==user.result[k].idusuario){
                                vehiculo4.push(user.result[k].nombres_apellidos);
                              }
                            }
                          }
                          else{
                            vehiculo4.push('Sin chofer');
                          }
                          vehiculo5.push(asigvehiculo.result[i].estado);vehiculo6.push(asigvehiculo.result[i].observaciones);
                        }
                      }
                      vehiculos.push({"respuesta":true,'idequipo':vehiculo1,"codinterno":vehiculo2,"tipo":vehiculo3,'encargado':vehiculo4,'estado':vehiculo5,'observaciones':vehiculo6});
                    }
                  }else{
                     vehiculos.push({"respuesta":false});//sin personal en residencia
                  }
                  query.get("residencias").where({'año':año}).execute(function(residenciaño){ //2,3,4
                    query.get("asignacionusuarios").execute(function(asig){
                      var idusuariosderesidencia=[];
                      for (var i=0;i<residenciaño.result.length;i++){ //2
                        for (var j=0;j<asig.result.length;j++){
                          if(residenciaño.result[i].idresidencias==asig.result[j].idresidencia){
                            idusuariosderesidencia.push(asig.result[j].idusuario);
                          } 
                        }
                      }
                      var person1=[],person2=[],contador=0;
                      for (var j=0;j<user.result.length;j++){
                        for (var i=0;i<idusuariosderesidencia.length;i++){
                          if(user.result[j].idusuario==idusuariosderesidencia[i]){
                            contador++;
                          }
                        }
                        if(contador==0){
                          person1.push(user.result[j].idusuario);person2.push(user.result[j].nombres_apellidos);
                        }
                        contador=0;
                      }
                      if(person1.length>0){
                        usuarios.push({"estado":true,'idusuario':person1,"nombre":person2});
                      }
                      else{
                        usuarios.push({"estado":false});
                      }
                      query.get("asignacionvehiculos").execute(function(asigcar){
                        var idcaresidencia=[];
                        for (var i=0;i<residenciaño.result.length;i++){ //2
                          for (var j=0;j<asigcar.result.length;j++){
                            if(residenciaño.result[i].idresidencias==asigcar.result[j].idresidencia){
                              idcaresidencia.push(asigcar.result[j].idequipo);
                            } 
                          }
                        }
                        var equipo1=[],equipo2=[],contador=0;
                        for (var j=0;j<cargeneral.result.length;j++){
                          for (var i=0;i<idcaresidencia.length;i++){
                            if(cargeneral.result[j].idequipos==idcaresidencia[i]){
                              contador++;
                            }
                          }
                          if(contador==0){
                            equipo1.push(cargeneral.result[j].idequipos);equipo2.push(cargeneral.result[j].codinterno);
                          }
                          contador=0;
                        }
                        if(equipo1.length>0){
                          equipos.push({"estado":true,'idequipo':equipo1,"codinterno":equipo2});
                        }
                        else{
                          equipos.push({"estado":false});
                        }     
                        query.get("asignacionmateriales").where({'idresidenciamateriales':id}).execute(function(material){
                          if(material.result.length>0){
                            var material1=[],material2=[],material3=[],material4=[],material5=[],material6=[],material7=[];
                            for(var j=0; j<material.result.length; j++){
                              material1.push(material.result[j].idmaterialesysuministros);material2.push(material.result[j].descripcion);material3.push(material.result[j].unidaddemedida);material4.push(material.result[j].cantidad);material5.push(material.result[j].preciounitario);material6.push(material.result[j].monto);material7.push(material.result[j].partidapresupuestaria);
                            }
                            materiales.push({"estado":true,"idmaterial":material1,"descripcion":material2,'unidaddemedida':material3,'cantidad':material4,'presiounitario':material5,'monto':material6,'partidapresupuestaria':material7});
                          }else{
                            materiales.push({"estado":false});//vacio
                          }
                          query.get("asignacionservicios").where({'idresidenciaservicios':id}).execute(function(servicio){
                            if(servicio.result.length>0){
                              var servicio1=[],servicio2=[],servicio3=[],servicio4=[],servicio5=[];
                              for(var j=0; j<servicio.result.length; j++){
                                servicio1.push(servicio.result[j].idserviciosnobasicos);servicio2.push(servicio.result[j].servicios);servicio3.push(servicio.result[j].preciounitario);servicio4.push(servicio.result[j].monto);servicio5.push(servicio.result[j].partidapresupuesto);
                              }
                              servicios.push({"estado":true,"idservicio":servicio1,"descripcion":servicio2,'preciounitario':servicio3,'monto':servicio4,'partidapresupuestaria':servicio5});
                            }else{
                              servicios.push({"estado":false});//vacio
                            }
                            query.get("tramos").where({'idresidencia':id}).execute(function(tramo){
                              var tramos=[];
                              residencia4=tramo.result.length;
                              if(tramo.result.length>0){
                                query.get("actividadestramos").execute(function(actividad){
                                  query.get("codificacionsam").execute(function(sam){
                                    if(actividad.result.length>0){
                                      var longitudtotal=0,longitud=0,contador=0,costotramo=0;
                                      for(var k=0; k<tramo.result.length; k++){ //tramo  //tramo =rio salado id=1
                                        var tramo1=[],tramo2=[],tramo3=[],tramo4=[];
                                        var actividad1=[],actividad2=[],actividad3=[],actividad4=[],actividad5=[];
                                        for(var j=0; j<actividad.result.length; j++){ //actividad
                                          if(tramo.result[k].idtramos==actividad.result[j].idtramo){
                                            contador++;
                                            for(var i=0; i<sam.result.length; i++){
                                              if(actividad.result[j].idsam==sam.result[i].idsam){
                                                if(sam.result[i].unidad=='Km'){
                                                  longitud=longitud+actividad.result[j].cantidad;
                                                  longitudtotal=longitudtotal+longitud;
                                                }
                                                costotramo=costotramo+(actividad.result[j].cantidad*sam.result[i].presunit);
                                                actividad1.push(sam.result[i].codsam);actividad2.push(sam.result[i].descripcion);actividad3.push(sam.result[i].unidad);actividad4.push(actividad.result[j].cantidad);actividad5.push(sam.result[i].presunit);
                                              }
                                            }
                                          }
                                        }
                                        residencia5=residencia5+costotramo;
                                        residencia6=residencia6+longitud;
        
                                        tramo1.push(tramo.result[k].idtramos);tramo2.push(tramo.result[k].descripcion);tramo3.push(longitud);tramo4.push(costotramo);
                                        longitud=0;
                                        costotramo=0;
                                        if(contador>0){
                                          tramos.push({'estado':true,"idtramo":tramo1,"descripcion":tramo2,"longitud":tramo3,'costototal':tramo4,'estadoactividad':true,'codsam':actividad1,'descripcionsam':actividad2,'unidadsam':actividad3,'cantidad':actividad4,'presiounitario':actividad5});
                                        }
                                        else{
                                          tramos.push({'estado':true,"idtramo":tramo1,"descripcion":tramo2,"longitud":tramo3,'costototal':tramo4,'estadoactividad':false});
                                        } 
                                      }
                                      var actividades=[],campo1=[],campo2=[];
                                      for (var i = 0; i < sam.result.length; i++) {
                                        campo1.push(sam.result[i].idsam);campo2.push(sam.result[i].descripcion);
                                      }
                                      console.log('rerere',tramos);
                                      actividades.push({'idsam':campo1,'descripcion':campo2});
                                      residencias.push({"nombre":residencia1,"cantidaduser":residencia2,'cantidadcar':residencia3,'cantidadtramos':residencia4,'costototal':residencia5.toFixed(3),'longitudtotal':residencia6.toFixed(3),'latitud':residencia7,'longitud':residencia8,'estadoR':residencia9});
                                      res.render('miresidencia',{title: 'residente','usuarios':usuarios,'equipos':equipos,"personal":personal,"vehiculos":vehiculos,"materiales":materiales,'tramos':tramos,'servicios':servicios,'residencias':residencias,'actividades':actividades});  
                                    
                                    }else{
                                      var actividades=[],campo1=[],campo2=[];
                                      for (var i = 0; i < sam.result.length; i++) {
                                        campo1.push(sam.result[i].idsam);campo2.push(sam.result[i].descripcion);
                                      }
                                      actividades.push({'idsam':campo1,'descripcion':campo2});
                                      for(var j=0; j<tramo.result.length; j++){
                                        var tramo1=[],tramo2=[],tramo3=[],tramo4=[];
                                        tramo1.push(tramo.result[j].idtramos);tramo2.push(tramo.result[j].descripcion);tramo3.push('0.00');tramo4.push('0.00');
                                      }
                                      tramos.push({'estado':true,"idtramo":tramo1,"descripcion":tramo2,"longitud":tramo3,'costototal':tramo4,'estadoactividad':false});
                                      residencias.push({"nombre":residencia1,"cantidaduser":residencia2,'cantidadcar':residencia3,'cantidadtramos':residencia4,'costototal':residencia5.toFixed(3),'longitudtotal':residencia6.toFixed(3),'latitud':residencia7,'longitud':residencia8,'estadoR':residencia9});
                                      res.render('miresidencia',{title: 'residente','usuarios':usuarios,'equipos':equipos,"personal":personal,"vehiculos":vehiculos,"materiales":materiales,'tramos':tramos,'servicios':servicios,'residencias':residencias,'actividades':actividades});
                                    }
                                  });
                                });
                              }else{
                                tramos.push({"estado":false,'estadoactividad':false});//vacio
                                residencias.push({"nombre":residencia1,"cantidaduser":residencia2,'cantidadcar':residencia3,'cantidadtramos':residencia4,'costototal':residencia5.toFixed(3),'longitudtotal':residencia6.toFixed(3),'latitud':residencia7,'longitud':residencia8,'estadoR':residencia9});
                                res.render('miresidencia',{title: 'residente','usuarios':usuarios,'equipos':equipos,"personal":personal,"vehiculos":vehiculos,"materiales":materiales,'tramos':tramos,'servicios':servicios,'residencias':residencias});
                              }     
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
      }else{
        //no hay residencia
        res.redirect('Residencias');
      }
    });  
  }else{
    res.redirect('Residencias');
  }
});

router.get('/insertarinformeSemanal', function(req, res) {
  res.render('InsertInfoSemanal', { title: 'infosemanal' });
});
router.get('/informeSemanal', function(req, res) {
  res.render('informeSemanal', { title: 'Residencia' });
});
router.get('/asignacionchoferavehiculo', function(req, res) {
  res.render('asignacionchoferavehiculo', { title: 'Residencia' });
});

router.get('/menuproquin', function(req, res) {
  res.render('menuproquin', { title: 'Residencia' });
  /*query.get('quincenal').execute(function(quincenal){
    if(quincenal.result.length>0){
      var fepreparacion=[]; var mesquincenal=[], numero=[];
      for(var i=0;i<quincenal.result.length;i++){
        fepreparacion.push(quincenal.result[i].fechapreparacion);mesquincenal.push(quincenal.result[i].mes);numero.push(quincenal.result[i].idprogramacionquincenal);
      }
      console.log('test',numero);
      res.render('menuproquin', { title: 'Residencia', 'estado':true, 'fecha':fepreparacion, 'mesquincenal':mesquincenal, 'numero':numero});
    }else{
      res.render('menuproquin', {title: 'Residente', 'estado':false});
      console.log('no hay nigun quincenal');
    }
  })*/
});

module.exports = router;