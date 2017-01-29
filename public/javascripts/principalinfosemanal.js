$(function(){
    var socket=io();
    var socket2=io();
    var aux=JSON.parse(localStorage.getItem('userinfo'));
    socket2.emit('nuevousuario',aux.idusuario);//enviar mi id para tener usuario en el socket
    socket2.on('usernames',function(data){
        console.log(data);
    });
    var idresideciaactual=JSON.parse(localStorage.getItem('residenciainfo'));
    var idusuarioactual=JSON.parse(localStorage.getItem('userinfo'));
    socket.emit('informesemanal',idresideciaactual.idresidencia);
    socket.on('insertarinformesemanal',function(values){
        console.log('larespuesta',values);
        var aux;var a=[];
        for(var t=0;t<values.cantidades.length;t++){
            aux=values.cantidades[t].split("|");
            a.push(aux);
        }
        console.log('ellelele:',a);
        var col=[];var posicicion1;
        var tamaño=a[0].length-1;
        console.log('poo',tamaño);
        for (var i=0;i<a[0].length;i++) { 
            for (var j=0;j<a.length;j++) { 
                posicicion1=parseInt(a[j][i]);
                col.push(posicicion1);
                
            }

        }
        console.log('las columnas:',col);


        var dia=[],checks=[],sam=[],seccion=[],proginicial=[],progfinal=[],horastrabajadas=[];
        //console.log('werewewew',values);
        for(var i=0;i<values.totalticket.length;i++){
            sam.push(values.totalticket[i].sam);
            checks.push(values.totalticket[i].tickeo);
            //seccion.push(values.totalticket[i].seccion);
            //proginicial.push(values.totalticket[i].proinicial);
            //progfinal.push(values.totalticket[i].progfinal);
            horastrabajadas=(values.totalticket[i].horastrabajadas);
        }
        console.log('los sammmmm:',sam);
        
    	var equipos=values.vehiculoss[0].codinterno;
        var idequipos=values.vehiculoss[0].idequipos;
        //console.log('los equipos:',idequipos);
    	var cantidaddias=checks[0].length;
    	var codigos=[];
        //var seccion1=[];
    	var dias=[];
        //var proginicial1=[];
        //var progfinal1=[];
        var horastrabajadas1=[];
    	for(var i=0;i<=cantidaddias-1;i++){  // 0
            for(var j=0;j<=sam.length-1;j++){
            	var aux=checks[j].substring(i,i+1);
                //console.log('los checkssss',aux);
                if(aux=='1'){
                    codigos.push(sam[j]);
                    //seccion1.push(seccion[j]);
                    dias.push(i+1);
                    //proginicial1.push(proginicial[j]);
                    //progfinal1.push(progfinal[j]);
                    horastrabajadas1.push(horastrabajadas[j]);
                }
            }
        }
        console.log('el dia',dias);
        var semanaquincena=1;var auxiliar=0;
        var cantidadrepetidos=1;
        var u=dias.length-2;
        console.log('ppplpl',values.estado);
        if(values.estado==false){
            if(semanaquincena==1){
                for(var i=dias.length-1;i>=0;i--){  //length=6  
                    //console.log('www',dias[i],dias[u]);
                    if(dias[i]==dias[u]){ 
                        if(auxiliar>=4)// 0 06,07,07,08,08
                	       $('.head2').after('<tr><td style="padding-top:0;padding-bottom:0;vertical-align:middle;">'+codigos[i]+'</td><td style="padding:0"><select style="width:100%;height:100%;" class="form-control"><option></option></select></td><td style="padding:0;vertical-align:middle;"><input type="text" style="width:100%;"/></td></td><td style="padding:0"><select style="width:100%;height:100%;" class="form-control"><option></option></select></td><td style="padding:0;vertical-align:middle;"><input type="text" style="width:100%;"/></td></td><td style="padding:0"><select style="width:100%;height:100%;" class="form-control"><option></option></select></td><td style="padding:0;vertical-align:middle;"><input type="text" style="width:100%;"/></td><td style="padding:0;vertical-align:middle;"><input type="text" style="width:100%;"/></td><td style="padding:0;vertical-align:middle;"><input type="text" style="width:100%;"/></td><td style="padding:0;vertical-align:middle;">'+122+'</td><td style="padding:0;vertical-align:middle;"><input type="text" style="width:100%;"/></td><td style="padding:0;vertical-align:middle;">'+122+'</td><td style="padding:0;vertical-align:middle;"><input type="text" style="width:100%;"/></td></tr>');
                        u--;
                        cantidadrepetidos++;
                    }
                    else{
                        if(auxiliar>=4)
                            console.log('edd:',cantidadrepetidos);
                            $('.head2').after('<tr><td rowspan="'+cantidadrepetidos+'" style="padding:0;vertical-align:middle;" id="diassss'+i+'">'+dias[i]+'</td><td rowspan="'+cantidadrepetidos+'" style="padding:0; vertical-align:middle;"><input id="rutainfor'+i+'" type="text" style="width:100%;"/></td><td rowspan="'+cantidadrepetidos+'" style="padding:0; vertical-align:middle;"><input id="seccion'+i+'" type="text" style="width:100%;"/></td><td rowspan="'+cantidadrepetidos+'" style="padding:0; vertical-align:middle;"><input id="kinicial'+i+'" type="text" style="width:100%;"/></td><td rowspan="'+cantidadrepetidos+'" style="padding:0;vertical-align:middle;"><input id="kfinal'+i+'" type="text" style="width:100%;"/></td><td id="actividad" style="padding-top:0;padding-bottom:0;vertical-align:middle;">'+codigos[i]+'</td><td id="volumenes">'+col[i]+'</td><td style="padding:0;vertical-align:middle;"><input id="claseper'+i+'" type="text" style="width:100%;"/></td><td style="padding:0;vertical-align:middle;"><input id="hregularesper'+i+'" type="text" style="width:100%;"/></td></td><td style="padding:0;vertical-align:middle;"><input id="claseper2'+i+'" type="text" style="width:100%;"/></td><td style="padding:0;vertical-align:middle;"><input id="hregularesper2'+i+'" type="text" style="width:100%;"/></td></td><td style="padding:0;vertical-align:middle;"><input id="clasematerial'+i+'" type="text" style="width:100%;"/></td><td style="padding:0;vertical-align:middle;"><input id="cantmaterial'+i+'" type="text" style="width:100%;"/></td><td style="padding:0;vertical-align:middle;"><input id="clasematerial2'+i+'" type="text" style="width:100%;"/></td><td style="padding:0;vertical-align:middle;"><input id="cantmaterial2'+i+'" type="text" style="width:100%;"/></td><td style="padding:0;vertical-align:middle;"><select name="" id="selectvehiculo'+i+'" class="form-control" style="width:100%;"></select></td><td style="padding:0;vertical-align:middle;"><input id="hutilizadasequipo'+i+'" type="text" style="width:100%;"/></td><td style="padding:0;vertical-align:middle;"><select id="selectvehiculo1'+i+'" style="width:100%;" class="form-control"></select></td><td style="padding:0;vertical-align:middle;"><input id="hutilizadasequipo1'+i+'" type="text" style="width:100%;"/></td><td rowspan="'+cantidadrepetidos+'" style="padding:0; vertical-align:middle;"><textarea id="observaciones'+i+'" class="form-control" rows="'+cantidadrepetidos+'"></textarea></td></tr>');
                            for(var h=0;h<equipos.length;h++){
                                $('#selectvehiculo'+i+'').append('<option value="'+idequipos[h]+'">'+equipos[h]+'</option>');
                                $('#selectvehiculo1'+i+'').append('<option value="'+idequipos[h]+'">'+equipos[h]+'</option>');
                            }
                            
                        u--;auxiliar++;
                        cantidadrepetidos=1;
                    } 
                }
            }else{

            }
        }else{
            //console.log('el tamño de infor',values.vehiculoss[0].codinterno);
            var ruta=[],seccion=[],kinicial=[],kfinal=[],claseper=[],hregularesper=[],claseper2=[],hregularesper2=[],clasematerial=[],cantmaterial=[],clasematerial2=[],cantmaterial2=[],ninternoequipo,hutilizadasequipo=[],ninternoequipo1,hutilizadasequipo1=[],observaciones=[];
            for(var i=0;i<values.infosemanal.result.length;i++){
                ruta.push(values.infosemanal.result[i].ruta);
                seccion.push(values.infosemanal.result[i].seccion);
                kinicial.push(values.infosemanal.result[i].kinicial);
                kfinal.push(values.infosemanal.result[i].kfinal);
                claseper.push(values.infosemanal.result[i].claseper);
                hregularesper.push(values.infosemanal.result[i].hregularesper);
                claseper2.push(values.infosemanal.result[i].claseper2);
                hregularesper2.push(values.infosemanal.result[i].hregularesper2);
                clasematerial.push(values.infosemanal.result[i].clasematerial);
                cantmaterial.push(values.infosemanal.result[i].cantmaterial);
                clasematerial2.push(values.infosemanal.result[i].clasematerial2);
                cantmaterial2.push(values.infosemanal.result[i].cantmaterial2);
                ninternoequipo=values.vehiculoss[0].codinterno;
                hutilizadasequipo.push(values.infosemanal.result[i].hutilizadasequipo);
                ninternoequipo1=values.vehiculoss[0].codinterno1;
                hutilizadasequipo1.push(values.infosemanal.result[i].hutilizadasequipo1);
                observaciones.push(values.infosemanal.result[i].observaciones);

            }
            
            if(semanaquincena==1){
                console.log('prueba:',dias.length);
                for(var i=dias.length-1;i>=0;i--){  //length=6  
                    console.log('www',dias[i],dias[u]);
                    if(dias[i]==dias[u]){ 
                        
                        //if(auxiliar>=1){// 0 06,07,07,08,08
                           console.log('lki',cantidadrepetidos);
                           $('.head2').after('<tr><td id="rutainfor'+i+'" rowspan="'+cantidadrepetidos+'" style="padding:0; vertical-align:middle;">'+ruta[i]+'</td><td id="seccion'+i+'" rowspan="'+cantidadrepetidos+'" style="padding:0; vertical-align:middle;">'+seccion[i]+'</td><td id="kinicial'+i+'" rowspan="'+cantidadrepetidos+'" style="padding:0; vertical-align:middle;">'+kinicial[i]+'</td><td id="kfinal'+i+'" rowspan="'+cantidadrepetidos+'" style="padding:0;vertical-align:middle;">'+kfinal[i]+'</td><td id="actividad" style="padding-top:0;padding-bottom:0;vertical-align:middle;">'+codigos[i]+'</td><td id="volumenes">'+col[i]+'</td><td id="claseper'+i+'" style="padding:0;vertical-align:middle;">'+claseper[i]+'</td><td id="hregularesper'+i+'" style="padding:0;vertical-align:middle;">'+hregularesper[i]+'</td></td><td id="claseper2'+i+'" style="padding:0;vertical-align:middle;">'+claseper2[i]+'</td><td id="hregularesper2'+i+'" style="padding:0;vertical-align:middle;">'+hregularesper2[i]+'</td></td><td id="clasematerial'+i+'" style="padding:0;vertical-align:middle;">'+clasematerial[i]+'</td><td id="cantmaterial'+i+'" style="padding:0;vertical-align:middle;">'+cantmaterial[i]+'</td><td id="clasematerial2'+i+'" style="padding:0;vertical-align:middle;">'+clasematerial2[i]+'</td><td id="cantmaterial2'+i+'" style="padding:0;vertical-align:middle;">'+cantmaterial2[i]+'</td><td id="selectvehiculo'+i+'" style="padding:0;vertical-align:middle;">'+ninternoequipo[i]+'</td><td id="hutilizadasequipo'+i+'" style="padding:0;vertical-align:middle;">'+hutilizadasequipo[i]+'</td><td id="selectvehiculo1'+i+'" style="padding:0;vertical-align:middle;">'+ninternoequipo1[i]+'</td><td id="hutilizadasequipo1'+i+'" style="padding:0;vertical-align:middle;">'+hutilizadasequipo1[i]+'</td><td rowspan="'+cantidadrepetidos+'" id="observaciones'+i+'" style="padding:0; vertical-align:middle;">'+observaciones[i]+'</td></tr>');
                           //$('.head2').after('<br></br>');
                        //}
                        u--;
                        cantidadrepetidos++;
                    }
                    else{
                        //if(auxiliar>=1)
                            console.log('edd:',cantidadrepetidos);
                            $('.head2').after('<tr><td rowspan="'+cantidadrepetidos+'" style="padding:0;vertical-align:middle;" id="diassss'+i+'">'+dias[i]+'</td><td id="rutainfor'+i+'" style="padding:0; vertical-align:middle;">'+ruta[i]+'</td><td id="seccion'+i+'" style="padding:0; vertical-align:middle;">'+seccion[i]+'</td><td id="kinicial'+i+'" style="padding:0; vertical-align:middle;">'+kinicial[i]+'</td><td id="kfinal'+i+'" style="padding:0;vertical-align:middle;">'+kfinal[i]+'</td><td id="actividad" style="padding-top:0;padding-bottom:0;vertical-align:middle;">'+codigos[i]+'</td><td id="volumenes">'+col[i]+'</td><td id="claseper'+i+'" style="padding:0;vertical-align:middle;">'+claseper[i]+'</td><td id="hregularesper'+i+'" style="padding:0;vertical-align:middle;">'+hregularesper[i]+'</td></td><td id="claseper2'+i+'" style="padding:0;vertical-align:middle;">'+claseper2[i]+'</td><td id="hregularesper2'+i+'" style="padding:0;vertical-align:middle;">'+hregularesper2[i]+'</td></td><td id="clasematerial'+i+'" style="padding:0;vertical-align:middle;">'+clasematerial[i]+'</td><td id="cantmaterial'+i+'" style="padding:0;vertical-align:middle;">'+cantmaterial[i]+'</td><td id="clasematerial2'+i+'" style="padding:0;vertical-align:middle;">'+clasematerial2[i]+'</td><td id="cantmaterial2'+i+'" style="padding:0;vertical-align:middle;">'+cantmaterial2[i]+'</td><td id="selectvehiculo'+i+'" style="padding:0;vertical-align:middle;">'+ninternoequipo[i]+'</td><td id="hutilizadasequipo'+i+'" style="padding:0;vertical-align:middle;">'+hutilizadasequipo[i]+'</td><td id="selectvehiculo1'+i+'" style="padding:0;vertical-align:middle;">'+ninternoequipo1[i]+'</td><td id="hutilizadasequipo1'+i+'" style="padding:0;vertical-align:middle;">'+hutilizadasequipo1[i]+'</td><td id="observaciones'+i+'" style="padding:0; vertical-align:middle;">'+observaciones[i]+'</td></tr>');
                            
                           
                        u--;auxiliar++;
                        cantidadrepetidos=1;
                    } 
                }
            }else{

            }
        }


        var ruta=[],seccion=[],kinicial=[],kfinal=[],claseper=[],hregularesper=[],claseper2=[],hregularesper2=[],clasematerial=[],cantmaterial=[],clasematerial2=[],cantmaterial2=[];
        var ninternoequipo=[],hutilizadasequipo=[],ninternoequipo1=[],hutilizadasequipo1=[],observaciones=[];
        $('.btnguardarsemanal').click(function(){
            for(var i=0;i<dias.length;i++){  
                ruta.push($('#rutainfor'+i+'').val());
                seccion.push(parseInt($('#seccion'+i+'').val())); 
                kinicial.push(parseInt($('#kinicial'+i+'').val()));
                kfinal.push(parseInt($('#kfinal'+i+'').val()));
                claseper.push(parseInt($('#claseper'+i+'').val()));
                hregularesper.push(parseInt($('#hregularesper'+i+'').val()));
                claseper2.push(parseInt($('#claseper2'+i+'').val()));
                hregularesper2.push(parseInt($('#hregularesper2'+i+'').val()));
                clasematerial.push(parseInt($('#clasematerial'+i+'').val()));
                cantmaterial.push(parseInt($('#cantmaterial'+i+'').val()));
                clasematerial2.push(parseInt($('#clasematerial2'+i+'').val()));
                cantmaterial2.push(parseInt($('#cantmaterial2'+i+'').val()));
                ninternoequipo.push(parseInt($('#selectvehiculo'+i+'').val()));
                hutilizadasequipo.push(parseInt($('#hutilizadasequipo'+i+'').val()));
                ninternoequipo1.push(parseInt($('#selectvehiculo1'+i+'').val()));
                hutilizadasequipo1.push(parseInt($('#hutilizadasequipo1'+i+'').val()));
                observaciones.push($('#observaciones'+i+'').val());

                //console.log('popopo',seccion);
                
            }
            var datosinforme={ci:idusuarioactual.idusuario,ruta:ruta,seccion:seccion,kinicial:kinicial,kfinal:kfinal,claseper:claseper,hregularesper:hregularesper,claseper2:claseper2,hregularesper2:hregularesper2,clasematerial:clasematerial,cantmaterial:cantmaterial,clasematerial2:clasematerial2,cantmaterial2:cantmaterial2,ninternoequipo:ninternoequipo,hutilizadasequipo:hutilizadasequipo,ninternoequipo1:ninternoequipo1,hutilizadasequipo1:hutilizadasequipo1,observaciones:observaciones};
            console.log('los datos a registrar:',datosinforme);
            socket.emit('llenarinformesemanal',datosinforme);
        });
        socket.on('respuestaregistroinformequincenal',function(value){
            //console.log(value);
            if(value==true){
                swal({
                  title: "REGISTRO SATISFACTORIO",
                  text: "la actividad se registro!",
                  type: "success",
                  confirmButtonColor: "#38DC61",
                  confirmButtonText: "Aceptar!"
                },
                function(){
                  location.reload();
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
                  location.reload();
                });
            }
        });
        $('.btnguardarsemanal').css("display", "none");
    });
    
    $('#cmd').click(function(){
        window.print();
    });
    var fecha = new Date();
    var fechaaa=(fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate());
    console.log('la fechaaa',fechaaa);
    new Date($.now());
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    console.log('la horaaaa',time);
    $('#enviar').click(function(){
        var idusuario=aux.idusuario;
        var idresidencia=idresideciaactual.idresidencia;
        var categoria = $("#selectcategoria option:selected").html();
        var valor={idusuario:idusuario, idresidencia:idresidencia, categoria:categoria}
        socket.emit("reporte",valor);
    })
})