$(function(){
    var socket=io();
    if(window.location.pathname=='/VolumenesTrabajo'){
        socket.emit('listarvolumenes',{'idresidencia':2});
    }
    socket.on('respuestalistarvolumenes', function(resultados){
        $('#tablavolumen thead').empty();
        $('#volumenestable').empty();
        $('#btnmes').removeClass('disabled');
        if(resultados.estadoquincenal==true){
            $('#tablavolumen thead').append('<tr class="cabeza"></tr>');
            for (var i = 0; i < resultados.codigosam.length; i++) {
                if(i==0){
                    $('.cabeza').append('<th id="filaprincipal">FECHA ACTIVIDAD</th>');
                }
                $('.cabeza').append('<td>'+resultados.codigosam[i]+'<br>'+resultados.descripcionsam[i]+'</td>');   
            }
            if(resultados.estadocantidadquincenal==true){
                if(resultados.estadovolumen==true){
                    if(resultados.estadocantidadvolumen==true){
                        //llenar volumen 31 dias
                        console.log('volumenes llenos',resultados);
                        $('#btnguardarvolumen').css('display','none');
                        for (var i=1; i<16; i++){
                            $('#volumenestable').append('<tr id="fila'+i+'"></tr>');
                            var posicion=null;
                            for (var k=0; k<resultados.totalvolumenes.length; k++) {
                                if(resultados.totalvolumenes[k].dia==i){
                                    posicion=k;
                                }
                            }
                            if(posicion!=null){
                                var cadena=resultados.totalvolumenes[posicion].cantidad.split('|');
                            }
                            for (var j=0; j<resultados.codigosam.length+1; j++) {
                                if(j==0){
                                   $('#fila'+i+'').append('<td class="columnanumero">'+i+'</td>');
                                }
                                else{
                                    if((posicion!=null)&&(cadena[j-1]!='0')){
                                        $('#fila'+i+'').append('<td class="columna'+j+'">'+cadena[j-1]+'</td>'); 
                                    }
                                    else{
                                        $('#fila'+i+'').append('<td class="columna'+j+'"></td>');
                                    }
                                    
                                }
                            }
                            posicion=null;
                        }
                        $('#fila15').after('<tr class="sumatotal1"><td>TOTAL</td></tr>');
                        for (var j=0; j<resultados.codigosam.length; j++) {
                            var suma=0;
                            for (var i = 1; i < 16; i++) {
                                if($('#fila'+i+'>.columna'+(j+1)+'').text()!=''){
                                    var fil=parseInt($('#fila'+i+'>.columna'+(j+1)+'').text());
                                    suma=suma+fil;
                                }   
                            }
                            if(suma!=0){
                                $('.sumatotal1').append('<td>'+suma+'</td>');
                            }
                            else{
                                $('.sumatotal1').append('<td></td>');
                            }
                            console.log('suma de la columna: ',j,': ',suma);
                        }
                        for (var i=1; i<17; i++){
                            $('#volumenestable').append('<tr id="fila'+(15+i)+'"></tr>');
                            var posicion=null;
                            for (var k=0; k<resultados.totalvolumenes2.length; k++) {
                                if(resultados.totalvolumenes2[k].dia==(15+i)){
                                    posicion=k;
                                }
                            }
                            if(posicion!=null){
                                var cadena=resultados.totalvolumenes2[posicion].cantidad.split('|');
                            }
                            for (var j=0; j<resultados.codigosam.length+1; j++) {
                                if(j==0){
                                   $('#fila'+(15+i)+'').append('<td class="columnanumero">'+(15+i)+'</td>');
                                }
                                else{
                                    if((posicion!=null)&&(cadena[j-1]!='0')){
                                        $('#fila'+(15+i)+'').append('<td class="columna'+j+'">'+cadena[j-1]+'</td>'); 
                                    }
                                    else{
                                        $('#fila'+(15+i)+'').append('<td class="columna'+j+'"></td>');
                                    } 
                                }
                            }
                            posicion=null;
                        }
                        $('#fila31').after('<tr class="sumatotal2"><td>TOTAL</td></tr>');
                        for (var j=0; j<resultados.codigosam.length; j++) {
                            var suma2=0;
                            for (var i = 1; i < 17; i++) {
                                if($('#fila'+(15+i)+'>.columna'+(j+1)+'').text()!=''){
                                    var fil=parseInt($('#fila'+(15+i)+'>.columna'+(j+1)+'').text());
                                    suma2=suma2+fil;
                                }
                                
                            }
                            if(suma2!=0){
                                $('.sumatotal2').append('<td>'+suma2+'</td>');
                            }
                            else{
                                $('.sumatotal2').append('<td></td>');
                            }
                            console.log('suma de la columna: ',j,': ',suma2);
                        }
                        
                            
                    }else{
                        //llenar   volumen ultimos 15 dias
                        console.log('ultimos 15 dias',resultados);
                        
                        for (var i=1; i<16; i++){
                            $('#volumenestable').append('<tr id="fila'+i+'"></tr>');
                            var posicion=null;
                            for (var k=0; k<resultados.totalvolumenes.length; k++) {
                                if(resultados.totalvolumenes[k].dia==i){
                                    posicion=k;
                                }
                            }
                            if(posicion!=null){
                                var cadena=resultados.totalvolumenes[posicion].cantidad.split('|');
                            }
                            for (var j=0; j<resultados.codigosam.length+1; j++) {
                                if(j==0){
                                   $('#fila'+i+'').append('<td class="columnanumero">'+i+'</td>');
                                }
                                else{
                                    if((posicion!=null)&&(cadena[j-1]!='0')){
                                        $('#fila'+i+'').append('<td class="columna'+j+'">'+cadena[j-1]+'</td>'); 
                                    }
                                    else{
                                        $('#fila'+i+'').append('<td class="columna'+j+'"></td>');
                                    }   
                                }
                            }
                            posicion=null;
                        }
                        $('#fila15').after('<tr class="sumatotal1"><td>TOTAL</td></tr>');
                        for (var j=0; j<resultados.codigosam.length; j++) {
                            var suma=0;
                            for (var i = 1; i < 16; i++) {
                                if($('#fila'+i+'>.columna'+(j+1)+'').text()!=''){
                                    var fil=parseInt($('#fila'+i+'>.columna'+(j+1)+'').text());
                                    suma=suma+fil;
                                }
                                
                            }
                            if(suma!=0){
                                $('.sumatotal1').append('<td>'+suma+'</td>');
                            }
                            else{
                                $('.sumatotal1').append('<td></td>');
                            }
                            console.log('suma de la columna: ',j,': ',suma);
                        }
                        /////////
                        for (var i=1; i<17; i++) {
                            $('#volumenestable').append('<tr id="fila'+(15+i)+'"></tr>');
                            for (var j=0; j<resultados.codigosam.length+1; j++) {
                                if(j==0){
                                    $('#fila'+(15+i)+'').append('<td class="columnanumero">'+(15+i)+'</td>');
                                }
                                else{
                                    $('#fila'+(15+i)+'').append('<td><input type="number" class="columna'+j+'"/></td>');
                                }
                            }
                        }
                    }
                }else{
                    console.log('estado volumen falso',resultados);
                    for (var i = 1; i < 16; i++) {
                        $('#volumenestable').append('<tr id="fila'+i+'"></tr>');
                        for (var j = 0; j < resultados.codigosam.length+1; j++) {
                            if(j==0){
                                $('#fila'+i+'').append('<td class="columnanumero">'+i+'</td>');
                            }
                            else{
                                $('#fila'+i+'').append('<td><input type="number" class="columna'+j+'"/></td>');
                            }
                        }
                    } 
                }
                 
            }
            else{
                console.log('estado cantidad quincenal');
                if(resultados.estadovolumen==false){
                    for (var i = 1; i < 16; i++) {
                        $('#volumenestable').append('<tr id="fila'+i+'"></tr>');
                        for (var j = 0; j < resultados.codigosam.length+1; j++) {
                            if(j==0){
                                $('#fila'+i+'').append('<td class="columnanumero">'+i+'</td>');
                            }
                            else{
                                $('#fila'+i+'').append('<td><input type="number" class="columna'+j+'"/></td>');
                            }
                        }
                    }
                }
                else{
                    //listar volumen 1era quincena
                    for (var i=1; i<16; i++){
                        $('#volumenestable').append('<tr id="fila'+i+'"></tr>');
                        var posicion=null;
                        for (var k=0; k<resultados.totalvolumenes.length; k++) {
                            if(resultados.totalvolumenes[k].dia==i){
                                posicion=k;
                            }
                        }
                        if(posicion!=null){
                            var cadena=resultados.totalvolumenes[posicion].cantidad.split('|');
                        }
                        for (var j=0; j<resultados.codigosam.length+1; j++) {
                            if(j==0){
                               $('#fila'+i+'').append('<td class="columnanumero">'+i+'</td>');
                            }
                            else{
                                if((posicion!=null)&&(cadena[j-1]!='0')){
                                    $('#fila'+i+'').append('<td class="columna'+j+'">'+cadena[j-1]+'</td>'); 
                                }
                                else{
                                    $('#fila'+i+'').append('<td class="columna'+j+'"></td>');
                                }
                                
                            }
                        }
                        posicion=null;
                    }
                    $('#fila15').after('<tr class="sumatotal1"><td>TOTAL</td></tr>');
                    for (var j=0; j<resultados.codigosam.length; j++) {
                        var suma=0;
                        for (var i = 1; i < 16; i++) {
                            if($('#fila'+i+'>.columna'+(j+1)+'').text()!=''){
                                var fil=parseInt($('#fila'+i+'>.columna'+(j+1)+'').text());
                                suma=suma+fil;
                            }
                            
                        }
                        if(suma!=0){
                            $('.sumatotal1').append('<td>'+suma+'</td>');
                        }
                        else{
                            $('.sumatotal1').append('<td></td>');
                        }
                        console.log('suma de la columna: ',j,': ',suma);
                    }
                }
            }
        }
        else{
            console.log('uyyy sin quincenal',resultados)
            //no existen programaciones quincenales en este mes
        }

        $('#btnguardarvolumen').click(function(){
            if($(this).hasClass('disabled')){

            }else{
                var volumenfilatotal=[];
                var tam;
                if($('#fila16').val()!=undefined){
                    tam=32;
                }else{
                    tam=16;
                }
                for (var i = 1; i < tam; i++) {
                    var cantidades='',contador=0;
                    for (var j = 1; j < resultados.codigosam.length+1; j++) {
                        var valorr=$('#fila'+i+' .columna'+j+'').val();
                        console.log('-_-_____----__-',valorr,i,j)
                        if(valorr!=''){
                            contador=contador+1;

                            cantidades=cantidades+($('#fila'+i+' .columna'+j+'').val())+'|';
                        }
                        else{
                            cantidades=cantidades+'0'+'|'; 
                        }  
                    }
                    if(contador>0){
                        volumenfilatotal.push({'dia':$('#fila'+i+' .columnanumero').text(),'cantidades':cantidades});
                    } 
                }
                var idresidencia=2;
                var mes= 'noviembre';
                $(this).addClass('disabled');
                socket.emit('insertarVolumen',{'mes':mes,'idresidencia':idresidencia,'volumenes':volumenfilatotal});
                console.log('mammmmmammam',volumenfilatotal);
            }
        });
    });
    socket.on('respuestaprogramacionquincenal',function(value){
        if(value==true){
            swal({
                title: "SATISFACTORIO?",
                text: "Los volumenes se insertaron correctamente!",
                type: "success",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Aceptar!",
                closeOnConfirm: false
            },
            function(){
                location.reload();
            });
        }
        else{
            swal({
                title: "ERROR?",
                text: "Ocurrio un error en la conexion intentelo nuevamente!",
                type: "error",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Aceptar!",
                closeOnConfirm: false
            },
            function(){
                location.reload();
            });
        }
    });
})