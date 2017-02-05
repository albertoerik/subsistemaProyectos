$(function(){
    
    var socket=io();
    var socket2=io();
    var aux=JSON.parse(localStorage.getItem('userinfo'));
    socket2.emit('nuevousuario',aux.idusuario);//enviar mi id para tener usuario en el socket
    socket2.on('usernames',function(data){
        console.log(data);
    });
    var idresideciaactual=JSON.parse(localStorage.getItem('residenciainfo'));
    var idrusuarioactual=JSON.parse(localStorage.getItem('userinfo'));
    //.....................control de estados PQ..................//
    socket.emit('manipulacionestados');
    socket.on('estadodeprogquincenal',function(datos){
        console.log('el estado',datos);
        var dias=['L','M','M','J','V','S','D'];
        var days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        var fecha = new Date();
        //cuando no se hizo ninguna planificacion           = false
        //se hizo planificacion en las 2 quincenas de 1mes  = 2
        //se hizo la planificacion en una sola quincena     = 1
        var fechade;var fechahasta;var textomes;
        var mesactual;
        var mesess=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
        for(var t=0;t<mesess.length;t++){
            if(datos.ultimomes==mesess[t]){
                mesactual=t+1;
                //console.log('uuuu',mesactual);

            }
        }
        var valor=datos.estado;
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
                //console.log('lelelele',mesactual);

    	    	var num=fecha.toDateString().substring(8,10);
    	    	var dy=fecha.toDateString().substring(0,3);
    	    	var o=0;var aux=1;var aux2=15;var ii=1;
                $('#CalendarioFila').attr('colspan',15);
    	    	cambiofecha(num,dy,o,aux,aux2,ii);

                var mes=fecha.toDateString().substring(4,7);
                //console.log('tututut',mes);
                fe=fecha=new Date(fecha.getFullYear(),mesactual-1, 0);
                
                //fee=fecha=new Date(fecha.getFullYear(),mesactual+1, 0);
                textomes=mesess[mesactual];//el mes que va a programar la quincena
                console.log('el mes de programacion:',textomes);
                $('#messss').append('<small style="padding-left:20px;">'+textomes+'</small>')

                var fechapreparacion=fe.toDateString().substring(4,15);
                fechade=fecha.getFullYear()+"-" +mes+"-"+aux;
                fechahasta=fecha.getFullYear()+"-" +mes+"-"+aux2;
                console.log('ñññ', fechade, fechahasta, fechapreparacion);


        	}
        	else{
        		if(valor==1){ // mes a llenar Ej: Agosto
        			$('.selectMes').css('display','none');
        			fecha=new Date(fecha.getFullYear(),mesactual, 0);
    		    	var num=fecha.toDateString().substring(8,10); //ultimo dia del mes = 30
    		    	var dy=fecha.toDateString().substring(0,3); // dia del ultimo dia mes = Mon
    		    	var o=0;var aux=16;var aux2=parseInt(num)-15;var ii=(31-parseInt(num));
                    //console.log(aux2,ii,'ve esto',num);
                    $('#CalendarioFila').attr('colspan',aux2);
                    cambiofecha(num,dy,o,aux,aux2,ii);

                    var mes=fecha.toDateString().substring(4,7);
                    fe=fecha=new Date(fecha.getFullYear(),mesactual, 0);
                    textomes=mesess[mesactual-1];//el mes que va a programar la quincena
                    console.log('ererere',textomes);
                    $('#messss').append('<small style="padding-left:20px;">'+textomes+'</small>')

                    var fechapreparacion=fe.toDateString().substring(4,15);
                    fechade=fecha.getFullYear()+"-" +mes+"-"+aux;
                    fechahasta=fecha.getFullYear()+"-" +mes+"-"+num;
                    console.log('lassss fechas', fechade, fechahasta, fechapreparacion);
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

                var elmes;
                elmes=$("select[name=mes]").val();
                //console.log('veremos el mes:',elmes);
                textomes = $("#selectmes option:selected").html();
                //console.log('el mes:',textomes);
            });
        }
        
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
    

//...................... programacion quincenal.............................//
        if(window.location.pathname=='/residenciaQuincenal'){
            socket.emit('listartramos',idresideciaactual.idresidencia);
        }
        socket.on('respuestatramos',function(valor){
            console.log('haberrrr', valor);

            var codigos=0, nombreruta=0;var idruta;
            for (var i=0;i<valor.tramos.length;i++) {
                //console.log('oo',valor.tramos[i].descripcion[0]);
                $('#ruta').append("<option class='"+valor.tramos[i].idtramo[0]+"' value='"+i+"'>"+valor.tramos[i].descripcion[0]+"</option>");

            };
            codigos=$('#ruta option').attr('class');
            for(var i=0;i<valor.tramos.length;i++){
                if(valor.tramos[i].idtramo[0]==codigos){
                    nombreruta=valor.tramos[i].descripcion[0];
                    idruta=valor.tramos[i].idtramo[0];
                    //console.log('id ruta:',idruta);
                }
            }
            $('#ruta').attr('value',valor.tramos[0].idtramo[0]);
            for(var j=0;j<valor.tramos[0].codsam.length;j++){
                $('.boddd').append('<tr id="fila'+j+'"><td id="idsam" value="'+valor.tramos[0].idsam[j]+'">'+valor.tramos[0].codsam[j]+'</td><td><input type="text" class="seccion"/></td><td style="padding:0px;"><input type="text" class="de"/></td><td style="padding:0px;"><input type="text" class="hasta"/></td></td>');
                for(var k=0;k<aux2;k++){ //introduce  checbox  X
                    $('#fila'+j+'').append('<td id="filafecha'+j+''+k+'" style="padding:0px;"><div data-toggle="buttons" class="btn-group"><label style="padding-left:5px;padding-right:5px;outline: none;" class="btn btn-default">X<input type="checkbox"/></label></div></td>');
                }
                $('#fila'+j+'').append('<td style="padding:0px;"><input type="text" class="cantidad"/></td>')
            }
            var idtra=0;
            $('#ruta').change(function(){
                idtra=$(this).val();
                $('#ruta').attr('value',valor.tramos[idtra].idtramo[0]);
                codigos=$(this).attr('value');
                if(valor.tramos[idtra].idtramo[0]==codigos){
                    nombreruta=valor.tramos[idtra].descripcion[0];
                    idruta=valor.tramos[idtra].idtramo[0];
                    //console.log('id ruta:',idruta);
                    //console.log('nombre ruta:',nombreruta);
                }
                $('.boddd').empty();
                for(var i=0;i<valor.tramos[idtra].codsam.length;i++){  //introducir la fila
                    $('.boddd').append('<tr id="fila'+i+'"><td id="idsam" value="'+valor.tramos[0].idsam[i]+'">'+valor.tramos[idtra].codsam[i]+'</td><td><input type="text" class="seccion"/></td><td style="padding:0px;"><input type="text" class="de"/></td><td style="padding:0px;"><input type="text" class="hasta"/></td></td>');
                    
                    for(var j=0;j<aux2;j++){ //introduce  checbox  X
                        $('#fila'+i+'').append('<td id="filafecha'+i+''+j+'" style="padding:0px;"><div data-toggle="buttons" class="btn-group"><label style="padding-left:5px;padding-right:5px;outline: none;" class="btn btn-default">X<input type="checkbox"/></label></div></td>');
                    }
                    $('#fila'+i+'').append('<td style="padding:0px;"><input type="text" class="cantidad"/></td>')
                }
                $('.btn-group label').click(function(){ //selecciona y deselecciona un checkbox
                    $(this).toggleClass( "btn-default btn-danger");
                });
            });
            $('.btn-group label').click(function(){ //selecciona y deselecciona un checkbox
                $(this).toggleClass( "btn-default btn-danger");
            });
            
            //..............listar vehiculos en la programacionquincenal......................//
            if(valor.vehiculos[0].estado==true){
                for(var i=0;i<valor.vehiculos.length;i++){
                    for(var k=0;k<valor.vehiculos[i].codinterno.length;k++){   
                        $('.vehiculoSelect').after('<tr value="'+valor.vehiculos[i].idequipos[k]+'" class="unidadE" id="unidad'+k+'"><td>'+valor.vehiculos[i].codinterno[k]+'</td><td><input type="text" id="litro'+k+'" class="form-control" placeholder="Litros/Hora"></td></tr>')
                    }
                }
            }else{
                if(valor.vehiculos[0].estado==false){
                    console.log('no existe vehiculos');
                    $('.Content').slideUp("normal");
                    $('.mensajealerta').append('<div class="alert alert-danger">no existe vehiculos consulte al administrador</div>');
                }
                
            }
            //...............listar materiales en la programacionquincenal....................//
            //console.log('los tramos:',valor.tramos.length);
            //for(var i=0;i<valor.tramos.length;i++){
                
                console.log('materiales:',valor.tramos[3].materiales[0].descripciones.length);
                for(var k=0;k<valor.tramos[3].materiales[0].descripciones.length;k++){
                    //console.log('descripciones:',valor.tramos[i].materiales[j].descripciones[k]);    
                    $('.materialSelect').after('<tr value="'+valor.tramos[3].materiales[0].idmateriales[k]+'" id="material'+k+'"><td>'+valor.tramos[3].materiales[0].descripciones[k]+'</td><td><input type="text" id="cantidad'+k+'" class="form-control" placeholder="cantidad"></td><td><input type="text" id="precio'+k+'" class="form-control" placeholder="precio"></td></tr>')
                    //var idmateriales=0;
                    //idmateriales=$('#material'+k+'').attr('value');
                    //console.log('los id de materiales',idmateriales);
                }
               
            //}
            

            $('.clickS').click(function(){
                var residenciaaa=[];var programacionquin=[];var encargado=[];
                residenciaaa.push($('#ress').text());
                programacionquin.push($('#prog').text());
                encargado.push($('#encres').text());
                
                

                var idsamm=[]; var Unidades=[];var idvehiculos=[];var seccion=[];var checks=[];var numeros=[];var actividad=[];var equipo=[];var progresivade=[];var progresivahasta=[];var cantidadtrabajoprog=[];
                actividad=valor.tramos[idtra].codsam;
                for(var j=0;j<16;j++){
                    if($('.nro'+j+'').text()!=''){
                        numeros.push($('.nro'+j+'').text());
                        dias.push($('.dia'+j+'').text());
                    }
                }
                var checki='';
                for(var i=0;i<valor.tramos[idtra].codsam.length;i++){
                    for(var j=0;j<aux2;j++){
                        if($('#filafecha'+i+''+j+' label').hasClass('btn-danger')){
                            checki=checki+'1';
                        }
                        else{
                            checki=checki+'0';
                        }
                    }
                    //Unidades.push($('#'+i+'').text());
                    checks.push(checki);checki='';
                    seccion.push($('#fila'+i+' .seccion').val());
                    progresivade.push($('#fila'+i+' .de').val());
                    progresivahasta.push($('#fila'+i+' .hasta').val());
                    cantidadtrabajoprog.push($('#fila'+i+' .cantidad').val());
                    //idvehiculos.push($('#'+i+'').attr('value'));
                    idsamm.push($('#fila'+i+'>#idsam').attr('value'));

                }

                //console.log('idsam:::',idsam);
                //console.log('vehiculos:::',idsamm);
                var idequiposs=[];var diass=[];var litross=[];var observaciones=[];
                for(var i=0;i<valor.vehiculos[0].codinterno.length;i++){
                    idequiposs.push($('#unidad'+i+'').attr('value'));
                    litross.push($('#litro'+i+'').val());
                    //console.log('asdasd',litross);
                }
                var materiales=[],cantidad=[],precio=[];
                for(var i=0;i<valor.tramos.length;i++){
                    materiales.push($('#material'+i+'').attr('value'));
                    cantidad.push($('#cantidad'+i+'').val());
                    precio.push($('#precio'+i+'').val());
                }


                observaciones.push($('#obse').val());
                console.log('asd', fechahasta);
                var datos={textomes:textomes, ci:idrusuarioactual.idusuario, idResidencia:idresideciaactual.idresidencia,  idruta:idruta, observaciones:observaciones, idsamm:idsamm,progresivade:progresivade, progresivahasta:progresivahasta, cantidadtrabajoprog:cantidadtrabajoprog,checks:checks, seccion:seccion, idequiposs:idequiposs,litross:litross,materiales:materiales,cantidad:cantidad,precio:precio};
                console.log('los datos a registrar en pq',datos);
                socket.emit('llenarprogramacionquincenal',datos);
            });

        });
        socket.on('respuestaregistroporquincenal',function(value){
            //console.log(value);
            if(value==true){
                swal({
                  title: "REGISTRO SATISFACTORIO",
                  text: "la actividad se registro!",
                  type: "success",
                  confirmButtonColor: "#07CC32",
                  confirmButtonText: "Aceptar!"
                },
                function(){
                  //location.reload();
                  location.href="/menuproquin";
                });
            }else{
                swal({
                  title: "REGISTRO FALLIDO",
                  text: "existe problemas en la conexion!",
                  type: "error",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "Aceptar!"
                },
                function(){
                  //location.reload();
                  location.href="/menuproquin";
                });
            }
        });
    });
    $('#nobreresidencia').append(idresideciaactual.nombreresidencia);
    $('#nombreresidente').append(idrusuarioactual.nombres);

    //................asignacion actividades a trab........................//
    
    /*if(window.location.pathname=='/asignacionactividades'){
        var mes="septiembre";
        //var idresidencia=2;
        socket.emit('programacionactividadespersonal',{'idresidencia':idresideciaactual.idresidencia,'mes':mes});
    }*/

    var diatotal=0;
    socket.on('respondeprogramacionactividadespersonal',function(values){
        var dias=[],codigos=[],idsams=[];
        console.log('werewewew',values);
        $('#tableasignaruser').empty();
        $('#btnmes').removeClass('disabled');
        //$('.btnasignacion').css('display','none');
        if(values.estado==true){
            //listar asignaciones
            for (var i = 0; i < values.asignaciontotal.length; i++) {
                $('#tableasignaruser').append('<tr><td>'+values.asignaciontotal[i].dias+'</td><td>'+values.asignaciontotal[i].sam+'</td><td>'+values.asignaciontotal[i].nombres+'</td></td></tr>');
            }
            if(values.estadoquincena==true){
                if(values.totalsemanas==true){
                    var dias1=[],codigos1=[],idsams1=[];
                    var ticked=values.totalticket1[0].tickeo;
                    for (var t = 0; t < ticked.length; t++) {
                        for (var j = 0; j < values.totalticket1.length; j++) { //00101110101010101
                            var cadena=values.totalticket1[j].tickeo;
                            if(cadena[t]=='1'){
                                dias1.push(16+t);
                                codigos1.push(values.totalticket1[j].sam);
                                idsams1.push(values.totalticket1[j].idsam);
                            }
                        }
                    }
                    diatotal=diatotal+dias1.length;
                    console.log('dias2_______-',diatotal);
                    $('.tabla2daquincena').append('<h3>SEGUNDA QUINCENA</h3><table style="width:80%;margin:0 auto" class="table table-bordered table-hover"><thead><tr class="info"><th>DIA</th><th>ACTIVIDAD</th><th>PERSONAL</th></tr></thead><tbody id="tablaasignaruser1"></tbody></table>');
                    for (var b = 0; b < dias1.length; b++) {
                        $('#tablaasignaruser1').append('<tr id="fila'+b+'" value="'+idsams1[b]+'"><td id="coldia'+b+'">'+dias1[b]+'</td><td>'+codigos1[b]+'</td><td data-toggle="modal" data-target=".bs-example-modal-lg" class="filatabla" id="colpersonal'+b+'" ></td></tr>');
                    }
                }
            }
        }else{
            if(values.estadoquincena==true){
                if(values.totalsemanas==true){
                    var ticked=values.totalticket[0].tickeo;
                    for (var i = 0; i < ticked.length; i++) {
                        for (var j = 0; j < values.totalticket.length; j++) { //00101110101010101
                            var cadena=values.totalticket[j].tickeo;
                            if(cadena[i]=='1'){
                                dias.push(i+1);
                                codigos.push(values.totalticket[j].sam);
                                idsams.push(values.totalticket[j].idsam);
                            }
                        }
                    }
                    diatotal=diatotal+dias.length;
                    console.log('____________',dias.length);
                    for (var i = 0; i < dias.length; i++) {
                        $('#tableasignaruser').append('<tr id="fila'+i+'" value="'+idsams[i]+'" ><td id="coldia'+i+'">'+dias[i]+'</td><td>'+codigos[i]+'</td><td data-toggle="modal" data-target=".bs-example-modal-lg" class="filatabla" id="colpersonal'+i+'" ></td></tr>');
                    }



                    var dias=[],codigos=[],idsams=[];
                    var ticked=values.totalticket1[0].tickeo;
                    for (var i = 0; i < ticked.length; i++) {
                        for (var j = 0; j < values.totalticket1.length; j++) { //00101110101010101
                            var cadena=values.totalticket1[j].tickeo;
                            if(cadena[i]=='1'){
                                dias.push(16+i);
                                codigos.push(values.totalticket1[j].sam);
                                idsams.push(values.totalticket1[j].idsam);
                            }
                        }
                    }
                    for (var j = 0; j < values.totalticket1.length; j++) {

                    }
                    diatotal=diatotal+dias.length;
                    console.log('dias2_______-',diatotal);
                    for (var i = 0; i < dias.length; i++) {
                        $('#tableasignaruser').append('<tr id="fila'+(15+i)+'" value="'+idsams[i]+'"><td id="coldia'+(15+i)+'">'+dias[i]+'</td><td>'+codigos[i]+'</td><td data-toggle="modal" data-target=".bs-example-modal-lg" class="filatabla" id="colpersonal'+(16+i)+'" ></td></tr>');
                    }
                    var aux;
                    $('.filatabla').click(function(){
                        //alert('sasdsad');
                        aux=$(this).attr('id');
                        console.log('huuuu',aux);
                        for(var i=1;i<7;i++){
                            if($('#movil'+i+'').hasClass('select')){
                                $('#movil'+i+'').removeClass('select');
                            }
                        }
                    });
                    var idss='';
                    $(".modalSmall").bind("click", function() {
                        var idss='';
                        console.log('huuuuclick');
                        var A=[];var B=[]; var C=[];var D=[];
                        for(var i=0;i<30;i++){
                            if($('#movil'+(i+1)+'').hasClass('select')){
                                A.push($('#movil'+(i+1)+' p').text());
                                idss=idss+$('#movil'+(i+1)+' p').attr('class')+',';
                            }
                        }
                        var idd=idss.length;
                        $('#'+aux+'').text(A);
                        $('#'+aux+'').attr('value',idss.substring(0,idd-1));
                    });
                }else{
                    if(values.totalticket.length>0){
                        var ticked=values.totalticket[0].tickeo[0];
                        for (var i = 0; i < ticked.length; i++) {
                            for (var j = 0; j < values.totalticket.length; j++) { //00101110101010101
                                var cadena=values.totalticket[j].tickeo[0];
                                if(cadena[i]==1){
                                    dias.push(i+1);
                                    codigos.push(values.totalticket[j].sam);
                                    idsams.push(values.totalticket[j].idsam);

                                }
                            }
                        }
                        diatotal=diatotal+dias.length;
                        for (var i = 0; i < dias.length; i++) {
                            $('#tableasignaruser').append('<tr id="fila'+i+'" value="'+idsams[i]+'" ><td id="coldia'+i+'">'+dias[i]+'</td><td>'+codigos[i]+'</td><td data-toggle="modal" data-target=".bs-example-modal-lg" class="filatabla" id="colpersonal'+i+'" ></td></tr>');
                        }
                    } 
                }
                
            }else{
                //no hay programacion quincenal
            }
        }
        socket.emit('usuariosparamiresidencia',{'idresidencia':idresideciaactual.idresidencia});
        socket.on('respuestausuariosparamiresidencia',function(valor){
            console.log('haberrrr', valor);
            
            for(var j=0;j<valor.nombres_apellidos.length;j++){
                $('.modal-body').append('<div id="movil'+(j+1)+'" class="col-md-4 personalClick"><img src="/images/user.jpg"/><p value="'+valor.idusuario[j]+'">'+valor.nombres_apellidos[j]+'</p></div>')
            }
            var aux;
            $('.filatabla').click(function(){
                aux=$(this).attr('id');
                //console.log('wwwqqq',aux);
                for(var i=1;i<7;i++){
                    if($('#movil'+i+'').hasClass('select')){
                        $('#movil'+i+'').removeClass('select');
                    }
                }
            });
            $('.personalClick').click(function(){ //selecciona y deselecciona un checkbox
                $(this).toggleClass( "select");
            });
            var idss='';
            $(".modalSmall").bind("click", function() {
                var idss='';
                var A=[];var B=[]; var C=[];var D=[];
                for(var i=0;i<valor.nombres_apellidos.length;i++){
                    if($('#movil'+(i+1)+'').hasClass('select')){
                        A.push($('#movil'+(i+1)+' p').text());
                        idss=idss+$('#movil'+(i+1)+' p').attr('value')+',';
                        console.log('ewew',idss);
                    }
                }
                var idd=idss.length;
                $('#'+aux+'').text(A);
                $('#'+aux+'').attr('value',idss.substring(0,idd-1));
            });
        });
    });

    var nombremes=$('#btnmes').text();
    $('.meses a').click(function(){
        var mesactual=$(this).text();
        if(nombremes!=mesactual){
            $('#btnmes').text($(this).text());
            $('#btnmes').append('<span style="margin-left:5px" class="caret"></span>');
            nombremes=$(this).text();
            //var idresidencia=2;
            $('#btnmes').addClass('disabled');
            socket.emit('programacionactividadespersonal',{'idresidencia':idresideciaactual.idresidencia,'mes':nombremes});
        }
    });
    
//..............registrar asignacion de act a trab................//
    var idusuarios=[];
    $('.btnasignacion').click(function(){
        var diass=[], actividadd=[],idpersonal=[];
        for(var i=0;i<diatotal;i++){
            if($('#colpersonal'+i+'').text()!=''){
                diass.push($('#coldia'+i+'').text());
                actividadd.push($('#fila'+i+'').attr('value'));
                idpersonal.push($('#colpersonal'+i+'').attr('value'));

                var str = $('#colpersonal'+i+'').attr('value');
                var res = str.split(",");
                idusuarios.push(res);
            }  
        }
        var datosasignaciontrab={diass:diass,actividadd:actividadd,idresidencia:idresideciaactual.idresidencia,'mes':nombremes};
        console.log('campoinput',datosasignaciontrab);
        socket.emit('registrarasignaciontrab',datosasignaciontrab);
    });
    socket.on('responderegistrarasignaciontrab',function(value){
        console.log(value);
        if(value.estado==true){
            var userids=[],idvolumenes=[];
            var volumenactual=value.idvolumen-1;
            for (var i = 0; i < idusuarios.length; i++) {
                volumenactual=volumenactual+1;
                for (var j = 0; j < idusuarios[i].length; j++) {
                    userids.push(idusuarios[i][j]);
                    idvolumenes.push(volumenactual);
                } 
            }
            socket.emit('llenarasignacionusuarios',{'volumenes':idvolumenes,'userids':userids});
        }
    });
    socket.on('respondellenarasignacionusuarios',function(value){
        console.log(value);
        if(value==true){
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
        }else{
            if(value==false){
                swal({
                  title: "REGISTRO SATISFACTORIO",
                  text: "la actividad se registro!",
                  type: "error",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "Aceptar!"
                },
                function(){
                  location.reload();
                });
            }
        }
    });
})