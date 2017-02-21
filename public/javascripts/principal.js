var auxx;
var estado;
$(function(){
	var socket=io();
	var socket2=io();
	var socket3=io();
	var aux=JSON.parse(localStorage.getItem('userinfo'));
	socket.emit('nuevousuario',aux.idusuario);//enviar mi id para tener usuario en el socket
	socket.on('usernames',function(data){
		console.log(data);
	});

	//............asignar actividades a tramos................//

	$('.btnregactividad').click(function(){
		var idtramo=$(this).attr('value');

		var actividades = $('#fila'+idtramo+' select').val();
		var cantidad = $('#fila'+idtramo+' .cantidad').val();
		var preciounitario = $('#fila'+idtramo+' .presunit').val();

		
		var datosActividades={actividades:actividades,cantidad:cantidad,preciounitario:preciounitario,idtramo:idtramo};
		console.log('fff',datosActividades);
		socket2.emit('NuevaActividad',datosActividades);
	});
	socket2.on('RespuestaRegistroactividadestra',function(r){
			if(r==true){
				swal({
				  title: "REGISTRO SATISFACTORIO",
				  text: "la actividad se registro!",
				  type: "success",
				  confirmButtonColor: "#07CC32",
				  confirmButtonText: "Aceptar!"
				},
				function(){
				  location.reload();
				});
			}
			else{
				swal({
				  title: "REGISTRO FALLIDO",
				  text: "existe problemas en la conexion!",
				  type: "error",
				  confirmButtonColor: "#DD6B55",
				  confirmButtonText: "Aceptar!"
				},
				function(){
				  location.reload();
				});
			}
	});
//.................listar PQ en el menuproquin................//
	socket2.emit('listarPQ');
	socket2.on('resplistarPQ',function(val){
		if(val.estado==true){
			for(var i=0;i<val.numero.length;i++){
				$('.contenidotabla').append('<tr id="filatm'+i+'" value="'+val.numero[i]+'"><td id="idquine'+i+'" value="btnver'+i+'">'+val.numero[i]+'</td><td id="fechaa">'+val.fecha[i]+'</td><td id="mes">'+val.mesquincenal[i]+'</td><td>'+val.nomtramo[i]+'</td><td><button id="btnver'+i+'" type="button" data-toggle="modal" data-target=".bs-example-modal-lg" class="btn btn-success">VER</button></td><td><button id="btnmodificar'+i+'" type="button" data-toggle="modal" data-target=".bs-example-modal-lg" class="btn btn-warning">MODIFICAR</button></td></tr>');
			}
		}else{
			if(val.estado==false){
				$('.mesajealerta').append('<div class="alert alert-danger"><button type="button" data-dismiss="alert" aria-hidden="true" class="close">×</button><strong>ALERTA!!</strong> No realizo ninguna programacion quincenal. Para realizar una programacion quincenal por favor seleccione el boton nuevo que se encuentra en la parte inferior</div>');
			}
		}
//.....................los botones de menuproquin...............................//	
		$('.botonnuevoPQ').click(function(){
			location.href="/residenciaQuincenal";
		});
		var idQuncenal, con=0;
		for(var j=0;j<val.numero.length;j++){
			console.log('el j:',j);
			$('#btnver'+j+'').click(function(){
				con++;
				
				for (var i = 0; i < val.numero.length; i++) {
					console.log('el j2:',con);
					if(con==1){
						idQuncenal=$('#idquine'+i+'').text();
						console.log('el boton ver', idQuncenal);
						socket2.emit('verPQ', idQuncenal);
						//con=0;
					}
					con++;
				}
				
			})
			$('#btnmodificar'+j+'').click(function(){
				idQuncenal=$('#idquine'+0+'').text();
				console.log('el boton modificar', idQuncenal);
				socket2.emit('modificarPQ', idQuncenal);
			})
		}
		
        var idrusuarioactual=JSON.parse(localStorage.getItem('userinfo'));
		socket2.on('respverPQ', function(resp){
			$('.btnguardarcambios').css('display','none');
			function cambiofecha(num,dy,o,aux,aux2){
	            //console.log(num,dy,o,aux,aux2,'functionnn'); // num=30 - dy=Mon - o=0
	            for(var i=0;i<days.length;i++){  //encuentra el mes y le asigna un numero Ej: Enero=1=o
	                if(dy==days[i]){
	                    o=i;
	                } //o=2=miercoles
	            }
	            for(var i=num-1;i>=aux;i--){ //regresa atras para encontrar el dia
	                if(o==0){
	                    o=6;
	                }
	                else{
	                    o=o-1;
	                }      
	            }
	            //console.log(o); //6
	            for(var i=0;i<aux2;i++){ //inserta numeros y dias 16 
	                //console.log(aux2,aux,i) //16,0
	                if(o==6){
	                    $('.dia'+i+'').text(dias[o]);
	                    $('.nro'+i+'').text(aux);
	                    o=0; aux++;
	                }
	                else{
	                    $('.nro'+i+'').text(aux);
	                    $('.dia'+i+'').text(dias[o]);
	                    o++; aux++;
	                }
	            }
	            //console.log('fff',ii);
	            if(ii!=0){
	                console.log('ff',ii);
	                var clas=15
	                for(var j=0;j<ii;j++){
	                    $('.nro'+clas+'').css('display','none');
	                    $('.dia'+clas+'').css('display','none');
	                    clas--;
	                }
	            }
	        }
			console.log('plpl',resp);
			var dias=['L','M','M','J','V','S','D'];
	        var days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
	        var fecha = new Date();
	        //cuando no se hizo ninguna planificacion           = false
	        //se hizo planificacion en las 2 quincenas de 1mes  = 2
	        //se hizo la planificacion en una sola quincena     = 1
	        var mesactual;
	        var mesess=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
	        for(var t=0;t<mesess.length;t++){
	            if(resp.listarprogramacionesquincenales[0].mesquin==mesess[t]){
	                mesactual=t+1;
	                //console.log('uuuu',mesactual);
	            }
	        }
	        var valor=resp.estadoquince;
	        if(valor==false){
	        	fecha=new Date(fecha.getFullYear(), $("select[name=mes]").val(), 0);
	        	var num=fecha.toDateString().substring(8,10);
	        	var dy=fecha.toDateString().substring(0,3);
	        	var o=0;var aux=1;var aux2=15;var ii=1;
	            $('#CalendarioFila').attr('colspan',15);
	            cambiofecha(num,dy,o,aux,aux2,ii);
	        }
	        else{
	        	if(valor==2){
	        		$('.selectMes').css('display','none');
        			fecha=new Date(fecha.getFullYear(),mesactual, 0);
    		    	var num=fecha.toDateString().substring(8,10); //ultimo dia del mes = 30
    		    	var dy=fecha.toDateString().substring(0,3); // dia del ultimo dia mes = Mon
    		    	var o=0;var aux=16;var aux2=parseInt(num)-15;var ii=(31-parseInt(num));
                    //console.log(aux2,ii,'ve esto',num);
                    $('#CalendarioFila').attr('colspan',aux2);
                    cambiofecha(num,dy,o,aux,aux2,ii);
	        	}
	        	else{
	        		if(valor==1){ // mes a llenar Ej: Agosto
	        			$('.selectMes').css('display','none');
		        		fecha=new Date(fecha.getFullYear(),mesactual, 0);
		                //console.log('lelelele',mesactual);
		    	    	var num=fecha.toDateString().substring(8,10);
		    	    	var dy=fecha.toDateString().substring(0,3);
		    	    	var o=0;var aux=1;var aux2=15;var ii=1;
		                $('#CalendarioFila').attr('colspan',15);
		    	    	cambiofecha(num,dy,o,aux,aux2,ii);
	        		}
	        	}
	        }
	        if(valor==false){
	            textomes = $("#selectmes option:selected").html();
	            $('#meses select').change(function(){ //funcion que actua cuando ocurre un cambio en el mes
	                fecha=new Date(fecha.getFullYear(), $("select[name=mes]").val(), 0);
	                $("#resultado").html(fecha.toDateString());
	                var num=fecha.toDateString().substring(8,10);
	                var dy=fecha.toDateString().substring(0,3);
	                var o=0;var aux=1;var aux2=15;var ii=0;
	                $('#CalendarioFila').attr('colspan',15);
	                cambiofecha(num,dy,o,aux,aux2,ii);
	            });
	        }
	        $('.modal-body').append('<div style="padding-left:40px;" class="row col-md-12"></div><div style="padding-left:40px;" class="row col-md-12"><div class="form-group col-md-12"><h4>PROGRAMACION QUINCENAL DEL MES DE<small style="padding-left:20px;">'+resp.listarprogramacionesquincenales[0].mesquin+'</small></h4></div></div><div style="padding-left:40px;" class="row col-md-12"><div class="form-group col-md-12"><h4>ENCARGADO DE RESIDENCIA<small style="padding-left:20px;">'+idrusuarioactual.nombres+'</small></h4></div></div><div style="padding-left:40px;" class="row col-md-12"><div class="form-group col-md-12"><h4>TRAMO</h4><p>'+resp.listarprogramacionesquincenales[0].descriptramo+'</p></div></div><div style="padding-left:40px;" class="row col-md-12"><div class="form-group col-md-6"><h4>FECHA DE</h4><p>'+resp.listarprogramacionesquincenales[0].fechade+'</p></div><div class="form-group col-md-6"><h4>FECHA HASTA</h4><p>'+resp.listarprogramacionesquincenales[0].fechahasta+'</p></div></div><div style="margin:20px" class="row"><h3 style="text-align:center;padding-bottom:10px;">PROGRAMACION DE TRABAJO</h3><table class="table table-bordered table-hover table2"><thead><tr><th rowspan="3">NRO ACTIVIDAD</th><th rowspan="3">SECCION</th><th rowspan="3">UNIDAD</th><th colspan="2">PROGRESIVA</th><th colspan="15" id="CalendarioFila">CALENDARIO DE TRABAJO</th><th rowspan="3">CANTIDAD TRABAJO PROGRAMADO</th></tr><tr><th rowspan="3" style="width:10%">DE</th><th rowspan="3" style="width:10%">HASTA</th><th style="padding:0px;" class="dia0"></th><th style="padding:0px;" class="dia1"></th><th style="padding:0px;" class="dia2"></th><th style="padding:0px;" class="dia3"></th><th style="padding:0px;" class="dia4"></th><th style="padding:0px;" class="dia5"></th><th style="padding:0px;" class="dia6"></th><th style="padding:0px;" class="dia7"></th><th style="padding:0px;" class="dia8"></th><th style="padding:0px;" class="dia9"></th><th style="padding:0px;" class="dia10"></th><th style="padding:0px;" class="dia11"></th><th style="padding:0px;" class="dia12"></th><th style="padding:0px;" class="dia13"></th><th style="padding:0px;" class="dia14"></th><th style="padding:0px;" class="dia15"></th></tr><tr><th style="padding:0px;" class="nro0"></th><th style="padding:0px;" class="nro1"></th><th style="padding:0px;" class="nro2"></th><th style="padding:0px;" class="nro3"></th><th style="padding:0px;" class="nro4"></th><th style="padding:0px;" class="nro5"></th><th style="padding:0px;" class="nro6"></th><th style="padding:0px;" class="nro7"></th><th style="padding:0px;" class="nro8"></th><th style="padding:0px;" class="nro9"></th><th style="padding:0px;" class="nro10"></th><th style="padding:0px;" class="nro11"></th><th style="padding:0px;" class="nro12"></th><th style="padding:0px;" class="nro13"></th><th style="padding:0px;" class="nro14"></th><th style="padding:0px;" class="nro15"></th></tr></thead><tbody class="bodyver"></tbody></table></div><div class="col-md-12"><div class="form-group col-md-6"><table class="table table-bordered table-hover"><thead><tr><th>UNIDAD</th><th>LITROS/HORA</th></tr></thead><tbody class="bodyequipos"></tbody></table></div><div class="form-group col-md-6"><table class="table table-bordered table-hover"><thead><tr><th>MATERIAL</th><th>CANTIDAD</th><th>PRECIO</th></tr></thead><tbody class="bodymateriales"></tbody></table></div><h4 align="center">OBSERVACIONES</h4><div id="observaciones" name="" rows="3" required="required" class="form-control"></div></div>');
			cambiofecha(num,dy,o,aux,aux2,ii);
			for(var j=0;j<resp.listarprogramacionesquincenales[0].codisam.length;j++){
	            $('.bodyver').append('<tr align="center" valign="middle" id="filaa'+j+'"><td>'+resp.listarprogramacionesquincenales[0].codisam[j]+'</td><td>'+resp.listarprogramacionesquincenales[0].seccion[j]+'</td><td>'+resp.listarprogramacionesquincenales[0].unidad[j]+'</td><td>'+resp.listarprogramacionesquincenales[0].progresivade[j]+'</td><td>'+resp.listarprogramacionesquincenales[0].progresivahasta[j]+'</td></tr>');
	            
	            for(var k=0;k<15;k++){ //introduce  checbox  X
	            	var a=resp.listarprogramacionesquincenales[0].tickeo[j].charAt(k);
	            	console.log('hhhh',a);
	            	if(a==1){
						$('#filaa'+j+'').append('<td id="filafecha'+j+''+k+'" style="padding:0px;"><div data-toggle="buttons" class="btn-group"><label style="padding-left:5px;padding-right:5px;outline: none;" class="btn btn-default btn-danger">X<input type="checkbox"/></label></div></td>');
	            	}else{
	            		if(a==0){
	            			$('#filaa'+j+'').append('<td id="filafecha'+j+''+k+'" style="padding:0px;"><div data-toggle="buttons" class="btn-group"><label style="padding-left:5px;padding-right:5px;outline: none;" class="btn btn-default">X<input type="checkbox"/></label></div></td>');
	            		}
	            	}
	            }
	            $('#filaa'+j+'').append('<td>'+resp.listarprogramacionesquincenales[0].cantidadtrabajoprog[j]+'</td>')
	        }
            for(var h=0;h<resp.listarprogramacionesquincenales[0].codigointerno.length;h++){
				$('.bodyequipos').append('<tr><td>'+resp.listarprogramacionesquincenales[0].codigointerno[h]+'</td><td>'+resp.listarprogramacionesquincenales[0].litroshora[h]+'</td></tr>');
            }
            for(var h=0;h<resp.listarprogramacionesquincenales[0].descripmaterial.length;h++){
            	$('.bodymateriales').append('<tr><td>'+resp.listarprogramacionesquincenales[0].descripmaterial[h]+'</td><td>'+resp.listarprogramacionesquincenales[0].cantidad[h]+'</td><td>'+resp.listarprogramacionesquincenales[0].precio[h]+'</td></tr>');
            }
            $('#observaciones').append(''+resp.listarprogramacionesquincenales[0].observaciones+'');
            $('.btnaceptar').click(function(){
            	location.reload();
            })
	    });
		socket2.on('respmodificarPQ',function(val){	
			$('.btnaceptar').css('display','none');
			function cambiofecha(num,dy,o,aux,aux2){
	            //console.log(num,dy,o,aux,aux2,'functionnn'); // num=30 - dy=Mon - o=0
	            for(var i=0;i<days.length;i++){  //encuentra el mes y le asigna un numero Ej: Enero=1=o
	                if(dy==days[i]){
	                    o=i;
	                } //o=2=miercoles
	            }
	            for(var i=num-1;i>=aux;i--){ //regresa atras para encontrar el dia
	                if(o==0){
	                    o=6;
	                }
	                else{
	                    o=o-1;
	                }      
	            }
	            //console.log(o); //6
	            for(var i=0;i<aux2;i++){ //inserta numeros y dias 16 
	                //console.log(aux2,aux,i) //16,0
	                if(o==6){
	                    $('.dia'+i+'').text(dias[o]);
	                    $('.nro'+i+'').text(aux);
	                    o=0; aux++;
	                }
	                else{
	                    $('.nro'+i+'').text(aux);
	                    $('.dia'+i+'').text(dias[o]);
	                    o++; aux++;
	                }
	            }
	            //console.log('fff',ii);
	            if(ii!=0){
	                console.log('ff',ii);
	                var clas=15
	                for(var j=0;j<ii;j++){
	                    $('.nro'+clas+'').css('display','none');
	                    $('.dia'+clas+'').css('display','none');
	                    clas--;
	                }
	            }
	        }
			var dias=['L','M','M','J','V','S','D'];
	        var days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
	        var fecha = new Date();
	        //cuando no se hizo ninguna planificacion           = false
	        //se hizo planificacion en las 2 quincenas de 1mes  = 2
	        //se hizo la planificacion en una sola quincena     = 1
	        var mesactual;
	        var mesess=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
	        for(var t=0;t<mesess.length;t++){
	            if(val.listarprogramacionesquincenales[0].mesquin==mesess[t]){
	                mesactual=t+1;
	                //console.log('uuuu',mesactual);
	            }
	        }
	        var valor=val.estadoquince;
	        if(valor==false){
	        	fecha=new Date(fecha.getFullYear(), $("select[name=mes]").val(), 0);
	        	var num=fecha.toDateString().substring(8,10);
	        	var dy=fecha.toDateString().substring(0,3);
	        	var o=0;var aux=1;var aux2=15;var ii=1;
	            $('#CalendarioFila').attr('colspan',15);
	            cambiofecha(num,dy,o,aux,aux2,ii);
	        }
	        else{
	        	if(valor==2){
	        		$('.selectMes').css('display','none');
        			fecha=new Date(fecha.getFullYear(),mesactual, 0);
    		    	var num=fecha.toDateString().substring(8,10); //ultimo dia del mes = 30
    		    	var dy=fecha.toDateString().substring(0,3); // dia del ultimo dia mes = Mon
    		    	var o=0;var aux=16;var aux2=parseInt(num)-15;var ii=(31-parseInt(num));
                    //console.log(aux2,ii,'ve esto',num);
                    $('#CalendarioFila').attr('colspan',aux2);
                    cambiofecha(num,dy,o,aux,aux2,ii);
	        	}
	        	else{
	        		if(valor==1){ // mes a llenar Ej: Agosto
	        			$('.selectMes').css('display','none');
		        		fecha=new Date(fecha.getFullYear(),mesactual, 0);
		                //console.log('lelelele',mesactual);
		    	    	var num=fecha.toDateString().substring(8,10);
		    	    	var dy=fecha.toDateString().substring(0,3);
		    	    	var o=0;var aux=1;var aux2=15;var ii=1;
		                $('#CalendarioFila').attr('colspan',15);
		    	    	cambiofecha(num,dy,o,aux,aux2,ii);
	        		}
	        	}
	        }
	        if(valor==false){
	            textomes = $("#selectmes option:selected").html();
	            $('#meses select').change(function(){ //funcion que actua cuando ocurre un cambio en el mes
	                fecha=new Date(fecha.getFullYear(), $("select[name=mes]").val(), 0);
	                $("#resultado").html(fecha.toDateString());
	                var num=fecha.toDateString().substring(8,10);
	                var dy=fecha.toDateString().substring(0,3);
	                var o=0;var aux=1;var aux2=15;var ii=0;
	                $('#CalendarioFila').attr('colspan',15);
	                cambiofecha(num,dy,o,aux,aux2,ii);
	            });
	        }
	        $('.modal-body').append('<div style="padding-left:40px;" class="row col-md-12"><div class="form-group col-md-12"><h4>TRAMO</h4><h3 id="ruta" style="width:50%;margin:0 auto;display:block;" value="'+val.listarprogramacionesquincenales[0].ruta+'">'+val.listarprogramacionesquincenales[0].descriptramo+'</h3></div></div><li style="width:60px;margin:0 auto;list-style: none;" class="btnMouse1"><img src="/images/scroll.gif" class="logosedeca img-responsive"/></li><div style="margin:20px" class="row"><div id="2" style="height:600px;" class="panel-body"><h3 style="text-align:center;padding-bottom:10px;">PROGRAMACION DE TRABAJO</h3><table class="table table-bordered table-hover table2"><thead><tr><th rowspan="3">NRO ACTIVIDAD</th><th rowspan="3">SECCION</th><th colspan="2">PROGRESIVA</th><th colspan="15" id="CalendarioFila">CALENDARIO DE TRABAJO</th><th rowspan="3">CANTIDAD TRABAJO PROGRAMADO</th></tr><tr><th rowspan="3" style="width:10%">DE</th><th rowspan="3" style="width:10%">HASTA</th><th style="padding:0px;" class="dia0"></th><th style="padding:0px;" class="dia1"></th><th style="padding:0px;" class="dia2"></th><th style="padding:0px;" class="dia3"></th><th style="padding:0px;" class="dia4"></th><th style="padding:0px;" class="dia5"></th><th style="padding:0px;" class="dia6"></th><th style="padding:0px;" class="dia7"></th><th style="padding:0px;" class="dia8"></th><th style="padding:0px;" class="dia9"></th><th style="padding:0px;" class="dia10"></th><th style="padding:0px;" class="dia11"></th><th style="padding:0px;" class="dia12"></th><th style="padding:0px;" class="dia13"></th><th style="padding:0px;" class="dia14"></th><th style="padding:0px;" class="dia15"></th></tr><tr><th style="padding:0px;" class="nro0"></th><th style="padding:0px;" class="nro1"></th><th style="padding:0px;" class="nro2"></th><th style="padding:0px;" class="nro3"></th><th style="padding:0px;" class="nro4"></th><th style="padding:0px;" class="nro5"></th><th style="padding:0px;" class="nro6"></th><th style="padding:0px;" class="nro7"></th><th style="padding:0px;" class="nro8"></th><th style="padding:0px;" class="nro9"></th><th style="padding:0px;" class="nro10"></th><th style="padding:0px;" class="nro11"></th><th style="padding:0px;" class="nro12"></th><th style="padding:0px;" class="nro13"></th><th style="padding:0px;" class="nro14"></th><th style="padding:0px;" class="nro15"></th></tr></thead><tbody class="boddd"></tbody></table></div><li style="width:60px;margin:0 auto;list-style: none;" class="btnMouse2"><img src="/images/scroll.gif" class="logosedeca img-responsive"/></li><div style="margin:20px" class="row"></div><div id="3" style="height:600px;" class="panel-body"><h3 style="text-align:center;padding-bottom:10px;">REQUERIMIENTO UNIDADES DE OBRA</h3><table style="width:80%;margin: 0 auto;" class="table table-bordered table-hover scroll2 table-responsive"><thead><tr class="vehiculoSelect"><th>UNIDAD</th><th>LITROS/HORA</th></tr></thead><tbody> </tbody></table><div style="margin:60px" class="row"></div></div><li style="width:60px;margin:0 auto;list-style: none;" class="btnMouse3"><img src="/images/scroll.gif" class="logosedeca img-responsive"/></li><div style="margin:20px" class="row"></div><div id="4" class="panel-body"><h3 style="text-align:center;padding-bottom:10px;">REQUERIMIENTO MATERIALES DE OBRA</h3><table style="width:80%;margin: 0 auto;" class="table table-bordered table-hover scroll2 table-responsive"><thead><tr class="materialSelect"><th>MATERIAL</th><th>CANTIDAD</th><th>PRECIO</th></tr></thead><tbody><tr><th style="text-align:center;" colspan="3">OBSERVACIONES</th></tr><tr style="padding:0px;margin:0px;"><td colspan="3" style="padding:0px;margin:0px;"><div id="obse"></div></td></tr></tbody></table><div style="margin:60px" class="row"></div></div></div>');
			cambiofecha(num,dy,o,aux,aux2,ii);
			for(var j=0;j<val.listarprogramacionesquincenales[0].codisam.length;j++){
				console.log('datos a modificar',val);
				$('.boddd').append('<tr align="center" valign="middle" id="filaamodif'+j+'"><td value="'+val.listarprogramacionesquincenales[0].idsam[j]+'" id="idsam">'+val.listarprogramacionesquincenales[0].codisam[j]+'</td><td><input type="number" value="'+val.listarprogramacionesquincenales[0].seccion[j]+'" style="width:50px;" class="seccion"/></td><td><input type="number" value="'+val.listarprogramacionesquincenales[0].progresivade[j]+'" style="width:50px;" class="de"/></td><td><input type="number" value="'+val.listarprogramacionesquincenales[0].progresivahasta[j]+'" style="width:50px;" class="hasta"/></td></tr>');
				for(var k=0;k<15;k++){ //introduce  checbox  X
	            	var a=val.listarprogramacionesquincenales[0].tickeo[j].charAt(k);
	            	if(a==1){
						$('#filaamodif'+j+'').append('<td id="filafecha'+j+''+k+'" style="padding:0px;"><div data-toggle="buttons" class="btn-group"><label style="padding-left:5px;padding-right:5px;outline: none;" class="btn btn-default btn-danger">X<input type="checkbox"/></label></div></td>');
	            	}else{
	            		if(a==0){
	            			$('#filaamodif'+j+'').append('<td id="filafecha'+j+''+k+'" style="padding:0px;"><div data-toggle="buttons" class="btn-group"><label style="padding-left:5px;padding-right:5px;outline: none;" class="btn btn-default">X<input type="checkbox"/></label></div></td>');
	            		}
	            	}
	            }
	            $('#filaamodif'+j+'').append('<td><input type="number" class="cantidad" style="width:80px;" value="'+val.listarprogramacionesquincenales[0].cantidadtrabajoprog[j]+'"/></td>');
			}
			$('.btn-group label').click(function(){ //selecciona y deselecciona un checkbox
                $(this).toggleClass( "btn-default btn-danger");
            });
			for(var h=0;h<val.listarprogramacionesquincenales[0].codigointerno.length;h++){
				$('.vehiculoSelect').after('<tr value="'+val.listarprogramacionesquincenales[0].codigointerno[h]+'" id="unidad'+h+'"><td>'+val.listarprogramacionesquincenales[0].codigointerno[h]+'</td><td><input type="text" id="litro'+h+'" class="form-control" value="'+val.listarprogramacionesquincenales[0].litroshora[h]+'"></td></tr>');
            }
            for(var h=0;h<val.listarprogramacionesquincenales[0].descripmaterial.length;h++){
            	$('.materialSelect').after('<tr><td id="material'+h+'" value="'+val.listarprogramacionesquincenales[0].descripmaterial[h]+'">'+val.listarprogramacionesquincenales[0].descripmaterial[h]+'</td><td><input type="text" id="cantidad'+h+'" class="form-control" value="'+val.listarprogramacionesquincenales[0].cantidad[h]+'"></td><td><input type="text" id="precio'+h+'" class="form-control" value="'+val.listarprogramacionesquincenales[0].precio[h]+'"></td></tr>');
            }
            $('#obse').after('<textarea style="width:100%;" rows="3" class="obser">'+val.listarprogramacionesquincenales[0].observaciones+'</textarea>');
		

			$('.btnguardarcambios').click(function(){
	            var idsamm=[]; var Unidades=[];var idvehiculos=[];var seccion=[];var checks=[];var numeros=[];var actividad=[];var equipo=[];var progresivade=[];var progresivahasta=[];var cantidadtrabajoprog=[];
	            //actividad=valor.tramos[idtra].codsam;
	            for(var j=0;j<16;j++){
	                if($('.nro'+j+'').text()!=''){
	                    numeros.push($('.nro'+j+'').text());
	                    dias.push($('.dia'+j+'').text());
	                }
	            }
	            var checki='';
	            for(var i=0;i<val.listarprogramacionesquincenales[0].codisam.length;i++){
	                for(var j=0;j<aux2;j++){
	                    if($('#filafecha'+i+''+j+' label').hasClass('btn-danger')){
	                        checki=checki+'1';
	                    }
	                    else{
	                        checki=checki+'0';
	                    }
	                }
	                checks.push(checki);checki='';
	                seccion.push($('#filaamodif'+i+' .seccion').val());
	                progresivade.push($('#filaamodif'+i+' .de').val());
	                progresivahasta.push($('#filaamodif'+i+' .hasta').val());
	                cantidadtrabajoprog.push($('#filaamodif'+i+' .cantidad').val());
	                idsamm.push($('#filaamodif'+i+'>#idsam').attr('value'));
	            }
	            var idequiposs=[];var diass=[];var litross=[];var observaciones=[];
	            for(var i=0;i<val.listarprogramacionesquincenales[0].codigointerno.length;i++){
	                idequiposs.push($('#unidad'+i+'').attr('value'));
	                litross.push($('#litro'+i+'').val());
	                //console.log('asdasd',litross);
	            }
	            var materiales=[],cantidad=[],precio=[];
	            for(var i=0;i<val.listarprogramacionesquincenales[0].descripmaterial.length;i++){
	                materiales.push($('#material'+i+'').attr('value'));
	                cantidad.push($('#cantidad'+i+'').val());
	                precio.push($('#precio'+i+'').val());
	            }
	            observaciones.push($('.obser').text());
	            var datos={idQuncenal:idQuncenal, observaciones:observaciones, idsamm:idsamm,progresivade:progresivade, progresivahasta:progresivahasta, cantidadtrabajoprog:cantidadtrabajoprog,checks:checks, seccion:seccion, idequiposs:idequiposs,litross:litross,materiales:materiales,cantidad:cantidad,precio:precio};
	            console.log('los datos a modificar en pq',datos);
	            socket2.emit('modificardatos',datos);
	            socket2.on('respuestaupdateproquincenal',function(r){
					if(r==true){
						swal({
						  title: "SE MODIFICO SATISFACTORIAMENE",
						  text: "se modifico satisfactoriamente!",
						  type: "success",
						  confirmButtonColor: "#07CC32",
						  confirmButtonText: "Aceptar!"
						},
						function(){
						  location.reload();
						});
					}
					else{
						swal({
						  title: "REGISTRO FALLIDO",
						  text: "existe problemas en la conexion!",
						  type: "error",
						  confirmButtonColor: "#DD6B55",
						  confirmButtonText: "Aceptar!"
						},
						function(){
						  location.reload();
						});
					}
				});
	        });
		})
	})
})