$(function(){
        
    var socket=io();
    var socket2=io();
    var aux=JSON.parse(localStorage.getItem('userinfo'));
    socket2.emit('nuevousuario',aux.idusuario);//enviar mi id para tener usuario en el socket
    socket2.on('usernames',function(data){
        console.log(data);
    });

    var idresideciaactual=JSON.parse(localStorage.getItem('residenciainfo'));
    //var idresidencia=2;
    socket.emit('asignacionchoferavehiculo',{'idresidencia':idresideciaactual.idresidencia});
    socket.on('respuestaasignacionchofervehiculo',function(valor){
        console.log('usuarios y vehiculos',valor);
        var personal=[];var cargo=[];var vehiculo=[];
        for (var i=0;i<valor.nombres_apellidos.length;i++) {
            //$('#tablaasignacionchofer').append('<tr><td>'+valor.nombres_apellidos[i]+'</td><td>'+valor.usuarios[0].perfil[i]+'</td><td>'+valor.vehiculos[0].tipo[i]+'</td></td></tr>');
        	if(valor.usuarios[0].descripcion[i]=='Operador A'||valor.usuarios[0].descripcion[i]=='Operador B'){
                //$('#tablaasignacionchofer').append('<tr id="fila'+i+'" value="" ><td id="'+valor.usuarios[0].idusuario[i]+'">'+valor.nombres_apellidos[i]+'</td><td>'+valor.usuarios[0].perfil[i]+'</td><td><select name="" id="select" class="form-control"></select></td></tr>');
                $('#tablaasignacionchofer').append('<tr id="fila'+i+'" value="" ><td id="colpersonal'+i+'" value="'+valor.usuarios[0].idusuario[i]+'">'+valor.nombres_apellidos[i]+'</td><td>'+valor.usuarios[0].descripcion[i]+'</td><td data-toggle="modal" data-target=".bs-example-modal-lg" class="filatabla" id="'+i+'" ></td></tr>');
            }
        }
        /*for(var z=0;z<valor.vehiculos[0].codinterno.length;z++){
            $('#fila'+i+',#select').append('<option value="">'+valor.vehiculos[0].codinterno[z]+'</option>');
        }*/
        for(var j=0;j<valor.vehiculos[0].codinterno.length;j++){
            //console.log('vehiculos',valor.nombres_apellidos.length);
            $('.modal-body').append('<div align="center" id="movil'+(j+1)+'" class="col-md-4 vehiculoClick"><img src="/images/tractor.ico"/><p value="'+valor.vehiculos[0].idequipos[j]+'">'+valor.vehiculos[0].codinterno[j]+'</p></div>')
        
            //$('.modal-body').append('<div class="media"><a class="pull-left" href="#"><img class="media-object" src=/images/tractor.ico" alt="Image"></a><div class="media-body"><h4 class="media-heading">'+valor.vehiculos[0].tipo[j]+'</h4><p>'+valor.vehiculos[0].codinterno[j]+'</p></div></div>');
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
        $('.vehiculoClick').click(function(){ //selecciona y deselecciona un checkbox
            $(this).toggleClass( "select");
        });
        var idss='';
        $(".modalSmall").bind("click", function() {
            var idss='';
            var A=[];var B=[]; var C=[];var D=[];
            for(var i=0;i<valor.vehiculos[0].codinterno.length;i++){
                if($('#movil'+(i+1)+'').hasClass('select')){
                    A.push($('#movil'+(i+1)+' p').text());
                    idss=idss+$('#movil'+(i+1)+' p').attr('value')+',';
                    //console.log('ewew',idss);
                }
            }
            var idd=idss.length;
            $('#'+aux+'').text(A);
            $('#'+aux+'').attr('value',idss.substring(0,idd-1));
            
            
        });
        var idusuarios=[];var idevehi=[];
        $('.btnasignacionchofer').click(function(){
            var idusuario=[];var idvehiculo=[];
            for(var i=0;i<valor.nombres_apellidos.length;i++){
                if($('#colpersonal'+i+'').text()!=''){
                    idusuario.push($('#colpersonal'+i+'').attr('value'));
                    idvehiculo.push($('#'+i+'').attr('value'));
                    console.log('fgfgfgf',idvehiculo);
                    var str = $('#colpersonal'+i+'').attr('value');
                    var res = str.split(",");
                    idusuarios.push(res);

                    var str1 = $('#'+i+'').attr('value');
                    var res1 = str1.split(",");
                    idevehi.push(res1);

                }  
            }
            
            var datosasignacioncho={idusuario:idusuario,idvehiculo:idvehiculo,idresidencia:'2','mes':'octubre'};
            console.log('campoinput',datosasignacioncho);
            socket.emit('registrarchoferavehiculo',datosasignacioncho);
        });
        socket.on('respuestaactualizacionasignacionchofer',function(value){
            if(value==true){
                swal({
                  title: "REGISTRO SATISFACTORIO",
                  text: "el chofer fue asignado!",
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
                      title: "FALLO REGISTRO",
                      text: "el chofer no se asigno!",
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

    
})