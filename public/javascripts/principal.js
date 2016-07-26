var auxx;
var estado;
$(function(){
	var socket=io('http://192.168.1.70:5000');
	var socket2=io();
	var socket3=io('http://192.168.1.12:5000');

	var Principal=$(location).attr('href');
	if(Principal=='http://localhost:5000/EncargadoResidencia'){
		socket.emit('notificaciones');  //envia un alerta para listar NOTIFICACIONES
	}
	$('.avatarNombre').text(sessionStorage.getItem("Nombre"));
	$("#botonImg").change(function(){
        var nombree=($(this).val()).toString();var tamano=nombree.length;
        if(tamano>24){
        	var total=nombree.substring(12,18);total=total+'..';var formato=nombree.substring(tamano-4,tamano);total=total+formato;$('.nombreImg').text(total);
        }else{
        	var total=nombree.substring(12,tamano);$('.nombreImg').text(total);
        }
    });

	var auuu=$('.dirImagen').text();
	if(auuu!=''){
		var direccionImg=$('.dirImagen').text();// F:/fmdskf/sfa
		var direction='http://192.168.1.68:5000/';
		for (var i = 0; i <direccionImg.length; i++) {
			direction=direction+direccionImg[i];
		};
		var almacenar=sessionStorage.getItem("CI");
		var noticia=sessionStorage.getItem("mensaje");
		var valor={noticia:noticia,ci:almacenar,direccion:direction}
		console.log('la nueva notificacion: ',valor);
		$('.dirImagen').text('');
		socket.emit("nuevaNoticia",valor);
	}
	socket.on('NotificacionResponse', function(r){
		$(".cajaNoticia").remove();
		$(".cajaPosicionNoti").remove();
		$(".cajaNoticia strong").remove();
		$(".cajaNoticia span").remove();
		$(".cajaNoticia p").remove();
		$(".imagenNoti").remove();
		var img=r.direccionImg;
		//console.log(img);
		var imagenesTotal=[];
		var img2="src='";
		for(var j=0;j<img.length;j++){
			var palabra=img[j].toString();
			for(var k=0;k<palabra.length;k++){
				img2=img2+palabra[k];
			}
			img2=img2+"'";
			imagenesTotal.push(img2);
			img2="src='";
		}
		for(var i=r.nombre.length-1; i>=0; i--){
			$(".noticias").append( '<div class=cajaNoticia><div class=cajaPosicionNoti><strong>'+r.nombre[i]+'</strong><span>'+r.cargo[i]+' </span><span class=fechaNoti>'+r.fecha[i]+'</span><p>'+r.descripcion[i]+'</p><img class=imagenNoti '+imagenesTotal[i]+'></div></div>');
		}
	});
	$("#btnNoticiaNew").click(function(){
		var mensaje=$('#textNoticiaNew').val();
		sessionStorage.setItem('mensaje',mensaje);
	});
	$('.btnRegistroEquipo').click(function(){
		var codigo = $('#codE').val();
		var nombre = $('#nombreE').val();
		var estado = $('#estadoE').val();
		var observaciones = $('#observacionesE').val();
		var datos={codigo:codigo,nombre:nombre,estado:estado,observaciones:observaciones};

		//console.log('datossss', datos);
		if(codigo==''){
			$("#mensaje1").fadeIn( "slow" );
			return false;
		}
		else
		{
			$("#mensaje1").fadeOut( "slow" );
			if(nombre==''){
				$("#mensaje2").fadeIn( "slow" );
				return false;
			}
			else
			{
				$("#mensaje2").fadeOut( "slow" );
				if(estado==''){
					$("#mensaje3").fadeIn( "slow" );
					return false;
				}
				else
				{
					$("#mensaje3").fadeOut( "slow" );
					if(observaciones==''){
						$("#mensaje4").fadeIn( "slow" );
						return false;
					}
				}
				$("#mensaje4").fadeOut( "slow" );
			}
		}

		if(codigo!=''){
			socket2.emit('RegistrarEquipo',datos);
			$('#myModal').remove();
			$('body').append('<div id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" class="modal fade"><div role="document" class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button></div><div class="modal-body"><div class="modal-footer"></div></div></div></div></div>');
		}
		//console.log('no registro');
	});
	socket2.on('RespuestaRegistroE',function(valor){
		var estado=valor;
		$('#codE').val('');
		$('#nombreE').val('');
		$('#estadoE').val('');
		$('#observacionesE').val('');
		if(estado=='true'){
			$('.modal-body').append('<h1>REGISTRO EXITOSO</h1><div align="center"><img src="../images/success.png" class="img-responsive" alt="Image"></div>');
		}
		else{
			$('.modal-body').append('<h1>ERROR EN EL REGISTRO</h1><div align="center"><img src="../images/warning.png" class="img-responsive" alt="Image"></div>');
		}
		console.log(estado);
	});
	$('.btnRegistroSam').click(function(){
		var codigo = $('#codS').val();
		var actividad = $('#actividadS').val();
		var unidad = $('#unidadS').val();
		var preciounitario = $('#preciounitarioS').val();
		var datos1={codigo:codigo,actividad:actividad,unidad:unidad,preciounitario:preciounitario};
		if(codigo==''){
			$("#mensaje1").fadeIn( "slow" );
			return false;
		}
		else
		{
			$("#mensaje1").fadeOut( "slow" );
			if(actividad==''){
				$("#mensaje2").fadeIn( "slow" );
				return false;
			}
			else
			{
				$("#mensaje2").fadeOut( "slow" );
				if(unidad==''){
					$("#mensaje3").fadeIn( "slow" );
					return false;
				}
				else
				{
					$("#mensaje3").fadeOut( "slow" );
					if(preciounitario==''){
						$("#mensaje4").fadeIn( "slow" );
						return false;
					}
				}
				$("#mensaje4").fadeOut( "slow" );
			}
		}

		if(codigo!=''){
			socket2.emit('RegistrarSam',datos1);
		$('#myModal').remove();
		$('body').append('<div id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" class="modal fade"><div role="document" class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button></div><div class="modal-body"><div class="modal-footer"></div></div></div></div></div>');
		
		}

		
	});
	socket2.on('RespuestaRegistroS',function(valor){
		var estado=valor;
		$('#codS').val('');
		$('#actividadS').val('');
		$('#unidadS').val('');
		$('#preciounitarioS').val('');
		if(estado=='true'){
			$('.modal-body').append('<h1>REGISTRO EXITOSO</h1><div align="center"><img src="../images/success.png" class="img-responsive" alt="Image"></div>');
		}
		else{
			$('.modal-body').append('<h1>ERROR EN EL REGISTRO</h1><div align="center"><img src="../images/warning.png" class="img-responsive" alt="Image"></div>');
		}
		console.log(estado);
	});
	//$('.nombreResidencia').text(sessionStorage.getItem("CI"));
	var direccionUrl=$(location).attr('href');
	if(direccionUrl=='http://localhost:5000/RecursosHumanos'){
		auxx=$('#variables').text();
		BuscadorResidencia(auxx);
		function BuscadorResidencia(auxx){
			if(auxx==''){
				$('.btnControlPersonalResidencia').val('GUARDAR CAMBIOS');

				/*var nombre=$('#1').text();
				console.log('este el nombre', nombre);*/
				socket.emit('BuscarUsuariosParaResidencia');
				var nombre=$('#1').text();
				$('#1').val(nombre);
				if($('#1').text()==''){  //entra para registrar
					for(var i=0;i<8;i++){
						var nombre=$('#'+i+'').text();
						$('#'+i+'').append('<div class="has-error has-feedback" id="rojo'+i+'"><input type="text" data-toggle="modal" data-target="#myModal" class="form-control" id="inputError2" aria-describedby="inputError2Status"><span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span><span id="inputError2Status" class="sr-only">(error)</span></div>');
						$('#'+i+' input').val(nombre);
					}
					estado='registrar';
					$('.btnControlPersonalResidencia').attr("disabled" , "disabled");
				}
				else{  //entra para modificar
					for(var i=0;i<8;i++){
						var nombre=$('#'+i+'').text();
						$('#'+i+'').append('<div class="has-success has-feedback" id="rojo'+i+'"><input type="text" data-toggle="modal" data-target="#myModal" class="form-control" id="inputError2" aria-describedby="inputError2Status"><span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span><span id="inputError2Status" class="sr-only">(error)</span></div>');
						$('#'+i+' input').val(nombre);

						$('#'+i+' p').css({'display':'none'});	
					}
					estado='modificar';
					$('.btnControlPersonalResidencia').attr("disabled" , "disabled");
				}
				
			}
			else{
				$('.btnControlPersonalResidencia').val('MODIFICAR PERSONAL');
			}
		}
		socket.on('RespuestaBuscarUsuariosResidencia', function(v){
			$('body').append('<div id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" class="modal fade"><div role="document" class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button><h4 class="modal-title col-md-5">Mensajes Directos</h4><button type="button" class="btn btn-primary col-md-3 col-md-offset-1 btnNuevoMensaje">Nuevo Mensaje</button></div><div class="modal-body PrincipalMensajes"></div><div class="modal-footer"></div></div></div></div>');
			for(var i=0;i<v.ci.length;i++){
				$('.modal-body').append('<div class="row" class="close" data-dismiss="modal" aria-label="Close"><h3 id="listass">'+v.nombres[i]+'<small>'+'   '+v.ci[i]+'</small></h3></div></div>');
			}
			var fila;
			var valorr;
			$('.form-control').click(function(){
				fila=$(this).closest('td').attr('id');
			});
			if(estado=='registrar'){
				$('.row h3').click(function(){
						valorr=$(this).text();
						$('#rojo'+fila+' input').remove();
						$('#rojo'+fila+' span').remove();
						$('#rojo'+fila+'').removeClass('has-error has-success has-feedback').addClass('has-success has-feedback');
						$('#rojo'+fila+'').append('<input type="text" data-toggle="modal" data-target="#myModal" class="form-control" id="inputSuccess2" aria-describedby="inputSuccess2Status"><span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span><span id="inputSuccess2Status" class="sr-only">(success)</span>');
						$('#'+fila+' input').val('');
						$('#'+fila+' input').val(valorr);

						$('.form-control').click(function(){
							fila=$(this).closest('td').attr('id');
						});
						var a=$('#0 input').val();var b=$('#1 input').val();var c=$('#2 input').val();var d=$('#3 input').val();var e=$('#4 input').val();var f=$('#5 input').val();var g=$('#6 input').val();var h=$('#7 input').val();
						if((a!='')&&(b!='')&&(c!='')&&(d!='')&&(e!='')&&(f!='')&&(g!='')&&(h!='')){
							$('.btnControlPersonalResidencia').removeAttr("disabled");
						}	
				});
			}
			else{
				if(estado=='modificar'){
					$('.row h3').click(function(){
						valorr=$(this).text();
						$('#rojo'+fila+' input').remove();
						$('#rojo'+fila+' span').remove();
						$('#rojo'+fila+'').removeClass('has-error has-success has-feedback').addClass('has-success has-feedback');
						$('#rojo'+fila+'').append('<input type="text" data-toggle="modal" data-target="#myModal" class="form-control" id="inputSuccess2" aria-describedby="inputSuccess2Status"><span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span><span id="inputSuccess2Status" class="sr-only">(success)</span>');
						$('#'+fila+' input').val('');
						$('#'+fila+' input').val(valorr);

						$('.form-control').click(function(){
							fila=$(this).closest('td').attr('id');
						});	
						$('.btnControlPersonalResidencia').removeAttr("disabled");
					});
				}
			}
			$('.btnControlPersonalResidencia').click(function(){
				var valor=$('.btnControlPersonalResidencia').val();
				console.log('su valor',valor);
				if(valor=='GUARDAR CAMBIOS'){
						var nombres=[];cis=[]; var ocupacionTotal=[];
						var nomRes=sessionStorage.getItem("Completo");
						var ciRes=sessionStorage.getItem("CI");
						nombres.push(nomRes);
						cis.push(ciRes);
						var idResidencia=sessionStorage.getItem("IdResidencia");
						var ocupacion='Residente';
						ocupacionTotal.push(ocupacion);
						ocupacion='Encargado Campamento';
						ocupacionTotal.push(ocupacion);
						ocupacion='Mecanico B';
						ocupacionTotal.push(ocupacion);
						ocupacion='Operador Motoniveladora';
						ocupacionTotal.push(ocupacion);
						ocupacion='Operador B';
						ocupacionTotal.push(ocupacion);
						ocupacion='Operador Multiple';
						ocupacionTotal.push(ocupacion);
						ocupacion='Chofer';
						ocupacionTotal.push(ocupacion);
						ocupacionTotal.push(ocupacion);
						ocupacionTotal.push(ocupacion);
						var ciUs='';
						var nomUs='';
						var aux=0;
						for(var i=0;i<8;i++){
							var nomInput=$('#'+i+' input').val();
							//var ciInput=
							//nombres.push(nomInput);
							
							for(var j=nomInput.length-1;j>=0;j--){
								//nomInput=nomInput[j];  jimena trabajadora 35
								var ascii=nomInput[j].charCodeAt();
								if((nomInput[j]!=' ')&&(aux<1)&&(ascii>47)&&(ascii<58)){
									ciUs=ciUs+nomInput[j];
								}
								else{
									if((nomInput[j]!=' ')||(aux==2)){
										nomUs=nomUs+nomInput[j];
										aux=2;
									}
									else{
										aux=3;
									}
								}
							}
							aux=0;
							var au1='';
							var au2='';
							for(var l=nomUs.length-1;l>=0;l--){
								au1=au1+nomUs[l];
							}
							nomUs='';
							for(var m=ciUs.length-1;m>=0;m--){
								au2=au2+ciUs[m];
							}
							ciUs='';
							nombres.push(au1);
							cis.push(au2);
						}
						if(estado=='registrar'){
							socket2.emit('registroPersonalResidencia',{ci:cis,residencia:idResidencia,ocupacionTotal:ocupacionTotal,nombres:nombres});
						}
						else{
							console.log(estado);
							if(estado=='modificar'){
								socket2.emit('ActualizarPersonalResidencia',{ci:cis,ocupacionTotal:ocupacionTotal,nombres:nombres});
							}
						}

					}
				});
		});
		socket2.on('RespuestaRegistroUsuarios',function(r){
			console.log(r);
			location.reload();
		});
		$('.btnControlPersonalResidencia').click(function(){
				var valor=$('.btnControlPersonalResidencia').val();
				console.log('su valor',valor);
				if(valor=='MODIFICAR PERSONAL'){
					auxx='';
					console.log('entro al click de modificar');
					BuscadorResidencia(auxx);
					
				}
		});
	}
	/*socket.on('RespuestaPersonalResidencia', function(v){
		console.log(v);
		$('#nombreResidente').text(v.nombres[0]);
		for(var i=0; i<9;i++){
			$('#'+i+'').text(v.nombres[i+1]);
		}
		$('.btnControlPersonalResidencia').click(function(){
			var valor=$('.btnControlPersonalResidencia').val();
			if(valor=='MODIFICAR PERSONAL'){
				auxx='';
				BuscadorResidencia();
			}
		});
	});*/
	$('.btnRegistroTramos').click(function(){
		var descripcion = $('#descripcionT').val();
		var longitud = $('#longitudT').val();
		var costoTotal = $('#costoTotalT').val();
		var datosT={descripcion:descripcion,longitud:longitud,costoTotal:costoTotal};

		socket2.emit('RegistrarTramo',datosT);
			$('#myModal').remove();
			$('body').append('<div id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" class="modal fade"><div role="document" class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button></div><div class="modal-body"><div class="modal-footer"></div></div></div></div></div>');
	});
	socket2.on('RespuestaRegistroT',function(valor){
		var estado=valor;
		$('#descripcionT').val('');
		$('#longitudT').val('');
		$('#costoTotalT').val('');
		if(estado=='true'){
			$('.modal-body').append('<h1>REGISTRO EXITOSO</h1><div align="center"><img src="../images/success.png" class="img-responsive" alt="Image"></div>');
		}
		else{
			$('.modal-body').append('<h1>ERROR EN EL REGISTRO</h1><div align="center"><img src="../images/warning.png" class="img-responsive" alt="Image"></div>');
		}
	});
	// registrar servicios no basicos
	$('.btnRegistroServicios').click(function(){
		var servicios = $('#servicio').val();
		var cantidad = $('#cantidad').val();
		var fechaInicio = $('#fechaInicio').val();
		var fechaFin = $('#fechaFin').val();
		var precioUnitario = $('#precioUnitario').val();
		var monto = $('#monto').val();
		var partidaPresupuesto = $('#partidaPresupuesto').val();
		var datosServ={servicios:servicios,cantidad:cantidad,fechaInicio:fechaInicio,fechaFin:fechaFin,precioUnitario:precioUnitario,monto:monto,partidaPresupuesto:partidaPresupuesto};

		socket2.emit('RegistrarServicios',datosServ);
			$('#myModal').remove();
			$('body').append('<div id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" class="modal fade"><div role="document" class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button></div><div class="modal-body"><div class="modal-footer"></div></div></div></div></div>');
	});
	socket2.on('RespuestaRegistroservicios',function(valor){
		$('#servicios').val('');
		$('#cantidad').val('');
		$('#fechaIn').val('');
		$('#fechaFi').val('');
		$('#precioUni').val('');
		$('#monto').val('');
		$('#partidaPres').val('');
		if(estado=='true'){
			$('.modal-body').append('<h1>REGISTRO EXITOSO</h1><div align="center"><img src="../images/success.png" class="img-responsive" alt="Image"></div>');
		}
		else{
			$('.modal-body').append('<h1>ERROR EN EL REGISTRO</h1><div align="center"><img src="../images/warning.png" class="img-responsive" alt="Image"></div>');
		}
	});
	// registrar materiales y suministros
	$('.btnRegistroMateriales').click(function(){
		var descripcionActivos = $('#descripcion').val();
		var unidadMedida = $('#unidad').val();
		var cantRequerida = $('#cantReq').val();
		var cantExistente = $('#cantExi').val();
		var cantSolicitada = $('#cantSoli').val();
		var precioUnita = $('#precioUni').val();
		var monto = $('#monto').val();
		var partidaPresupuesto = $('#partidaPresu').val();
		var datosMate={descripcionActivos:descripcionActivos,unidadMedida:unidadMedida,cantRequerida:cantRequerida,cantExistente:cantExistente,cantSolicitada:cantSolicitada,precioUnita:precioUnita,monto:monto,partidaPresupuesto:partidaPresupuesto};
		socket2.emit('RegistrarMateriales',datosMate);
			$('#myModal').remove();
			$('body').append('<div id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" class="modal fade"><div role="document" class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button></div><div class="modal-body"><div class="modal-footer"></div></div></div></div></div>');
	});
	socket2.on('RespuestaRegistromateriales',function(valor){
		var estado=valor;
		$('#descripcion').val('');
		$('#unidadMedida').val('');
		$('#cantReq').val('');
		$('#cantExi').val('');
		$('#cantSol').val('');
		$('#presUnit').val('');
		$('#montoMa').val('');
		$('#partidaPres').val('');
		if(estado=='true'){
			$('.modal-body').append('<h1>REGISTRO EXITOSO</h1><div align="center"><img src="../images/success.png" class="img-responsive" alt="Image"></div>');
		}
		else{
			$('.modal-body').append('<h1>ERROR EN EL REGISTRO</h1><div align="center"><img src="../images/warning.png" class="img-responsive" alt="Image"></div>');
		}
	});


	$('#btn1').click(function(){
		$("#panel-body2").load('http://localhost:5000/EquiposAcasio #esto1');
	})
	$('#btn2').click(function(){
		$("#panel-body2").load('http://localhost:5000/EquiposAcasio #esto2');
	})
	$('#btn3').click(function(){
		$("#panel-body2").load('http://localhost:5000/EquiposAcasio #esto3');
	})
	$('#btn4').click(function(){
		$("#panel-body2").load('http://localhost:5000/EquiposAcasio #esto4');
	})
	//.....................partes diarios.........................
	//socket3.emit('DatosPartesDiarios');
	var fecha=['12/09/2016','12/09/2016','12/09/2016'];
	var nombresss=['alan','asd','qweqwe'];
	var PD=['1','4','5'];
	//console.log(valores);
	/*socket3.emit('RespuestaPD',function(valores){
		
	});*/
	var direcUrl=$(location).attr('href');
	if(direcUrl=='http://localhost:5000/ResAcasio'){

		for (var i = 0; i < fecha.length; i++) {
			//console.log('oo',valores[i]);
			$('.bod').append("<tr><td>"+fecha[i]+"</td><td>"+nombresss[i]+"</td><td>"+PD[i]+"</td></tr>");
		};
		
		$('.bod').click(function(){
			$(".ventanaModal").slideDown('slow');
			//$(".desmarcado td").each(function(index){
				//alert($(this).text());
			//});
		});
	}
	/*...........................asignacion de obras a tramos............................*/
	$('.btnObras').click(function(){
		window.location.href = "http://localhost:5000/obrasTramo";
		
	});
	/*.............................PROGRAMACION DE TRABAJO...............................*/
	var fecha = new Date();

	var dia_semana = ["Do","Lu","Ma","Mi","Ju","Vi","Sa"];
	var mes = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
	var month_days = [
	'31', // ene
	'28', // feb
	'31', // mar
	'30', // apr
	'31', // may
	'30', // jun
	'31', // jul
	'31', // ago
	'30', // sept
	'31', // oct
	'30', // nov
	'31' // dic
	];
	var dame_fecha = "Hoy " + dia_semana[fecha.getDay()] + ", " + fecha.getDate() + " de " + mes[fecha.getMonth()] + " del " + fecha.getFullYear();
	//document.write("<p>" + dame_fecha + "</p>");
	$('#mes').append("<tr><th>"+mes[fecha.getMonth()]+"</th></tr>");
	for (var i = 0; i < dia_semana.length; i++){
		//console.log(dia_semana.length);
		if(dia_semana[i]=='Do'){
				$('#calendarioD').append("<tr><th>"+dia_semana[i]+"</th></tr>");
				$('#calendarioDom').append("<tr><th>"+dia_semana[i]+"</th></tr>");
				//$('#calendarioFeD').append("<tr><th>"+fecha.getDate()+"</th></tr>");
			}
		else{
			if(dia_semana[i]=='Lu'){
				$('#calendarioL').append("<tr><th>"+dia_semana[i]+"</th></tr>");
				$('#calendarioLun').append("<tr><th>"+dia_semana[i]+"</th></tr>");
			}
			else{
				if(dia_semana[i]=='Ma'){
					$('#calendarioM').append("<tr><th>"+dia_semana[i]+"</th></tr>");
					$('#calendarioMar').append("<tr><th>"+dia_semana[i]+"</th></tr>");
					
				}
				else{
					if(dia_semana[i]=='Mi'){
						$('#calendarioMi').append("<tr><th>"+dia_semana[i]+"</th></tr>");
						$('#calendarioMier').append("<tr><th>"+dia_semana[i]+"</th></tr>");
						$('#calendarioFeMier').append("<tr><th>"+fecha.getDate()+"</th></tr>");
					}
					else{
						if(dia_semana[i]=='Ju'){
							$('#calendarioJ').append("<tr><th>"+dia_semana[i]+"</th></tr>");
							$('#calendarioJue').append("<tr><th>"+dia_semana[i]+"</th></tr>");
						}
						else{
							if(dia_semana[i]=='Vi'){
								$('#calendarioV').append("<tr><th>"+dia_semana[i]+"</th></tr>");
								$('#calendarioVie').append("<tr><th>"+dia_semana[i]+"</th></tr>");
							}
						}
						if(dia_semana[i]=='Sa'){
								$('#calendarioS').append("<tr><th>"+dia_semana[i]+"</th></tr>");
								$('#calendarioSab').append("<tr><th>"+dia_semana[i]+"</th></tr>");
								
						}
					}
				}
			}
		}
	};

})