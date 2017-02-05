$(function(){
    var socket=io();
    var socket2=io();
    var aux22=JSON.parse(localStorage.getItem('userinfo'));
    socket2.emit('nuevousuario',aux22.idusuario);//enviar mi id para tener usuario en el socket
    socket2.on('usernames',function(data){
        console.log(data);
    });
    var idresideciaactual=JSON.parse(localStorage.getItem('residenciainfo'));
    socket.emit('listarplanilla',idresideciaactual.idresidencia);
    socket.on('respuestaplanilla',function(valor){
        console.log('respuesta para la planilla:', valor);
        var aux;var a=[];var aux1;var vol=[];
        for(var v=0;v<valor.cantidadesmesanterior.length;v++){
            aux1=valor.cantidadesmesanterior[v].split("|");
            vol.push(aux1);
        }
        //console.log('nanana',vol); 
        for(var t=0;t<valor.cantidades.length;t++){
            aux=valor.cantidades[t].split("|");
            a.push(aux);
            
        }

        suma1=0;
        var col1=[];var posicicion1;
        for (var i=0;i<vol[0].length-1;i++) { // recorre filas 
            suma1=0;
            for (var j=0;j<vol.length;j++) { // recorre columnas
                posicicion1=parseInt(vol[j][i]);
                suma1=suma1+posicicion1;
            }
            col1.push(suma1);
            
        }
        console.log('suma de cada columna de volumenes mes anterior:',col1);

        suma=0;
        var col=[];var posicicion;
        //var tamaño=a[0].length-1;
        //console.log('poo',tamaño);
        //console.log('uio',a[0].length-1);
        for (var i=0;i<a[0].length-1;i++) { // recorre filas 
            suma=0;
            for (var j=0;j<a.length;j++) { // recorre columnas
                posicicion=parseInt(a[j][i]);
                suma=suma+posicicion;
            }
            col.push(suma);
            
        }
        console.log('suma de cada columna de volumenes mes actual:',col);

        $('#nobreresidencia').append('<h4 style="color: #010101" class="col-md-2 col-md-offset-4">RESIDENCIA:<h4 style="color: #929292" class="col-md-2">'+idresideciaactual.nombreresidencia+'</h4></h4>');
        var codigos=0, nombreruta=0;
        for (var i=0;i<valor.tramos.length;i++) {
            //console.log('oo',valor.tramos[i].descripcion[0]);
            $('#rutaplanilla').append("<option class='"+valor.tramos[i].idtramo[0]+"' value='"+i+"'>"+valor.tramos[i].descripcion[0]+"</option>");

        };
        codigos=$('#rutaplanilla option').attr('class');
        for(var i=0;i<valor.tramos.length;i++){
            if(valor.tramos[i].idtramo[0]==codigos){
                nombreruta=valor.tramos[i].descripcion[0];
                //console.log('nombre ruta:',nombreruta);
            }
        }
        var avancedelmes=0;var avancealafecha=0;var total=0;
        $('#rutaplanilla').attr('value',valor.tramos[0].idtramo[0]);
        //console.log('wertyu',valor.tramos[0].codsam.length);
        for(var j=0;j<valor.tramos[0].codsam.length;j++){
            total=(valor.tramos[0].preciounitario[j] * valor.tramos[0].cantidadtrab[j]);
            avancedelmes=(((valor.tramos[0].preciounitario[j])*(col[j]))/(total))*(100);
            avancealafecha=(total)/(total)*(100);
            console.log('popop',total);

            $('.bodyplanilla').append('<tr id="fila'+j+'"><td id="idsam" value="'+valor.tramos[0].idsam[j]+'">'+valor.tramos[0].codsam[j]+'</td><td>'+valor.tramos[0].descripcionactividad[j]+'</td><td>'+valor.tramos[0].unidadactividad[j]+'</td><td>'+valor.tramos[0].preciounitario[j]+'</td><td>'+valor.tramos[0].cantidadtrab[j]+'</td><td class="sumamontooriginal'+j+'">'+total+'</td><td>'+0+'</td><td>'+0+'</td><td>'+0+'</td><td>'+0+'</td><td>'+col1[j]+'</td><td class="sumamontomesanterior'+j+'">'+(valor.tramos[0].preciounitario[j])*(col1[j])+'</td><td>'+col[j]+'</td><td class="sumamontosmes'+j+'">'+(valor.tramos[0].preciounitario[j])*(col[j])+'</td><td>'+valor.tramos[0].cantidadtrab[j]+'</td><td class="sumamontosfecha'+j+'">'+total+'</td><td class="sumaavancemes'+j+'">'+avancedelmes+'</td><td>'+(total)/(total)*(100)+'</td></td></tr>');
            
        }
        var sumamontooriginal=0;var fila1,fila2,sumamontomes=0,fila3,sumamontomesanterior=0,fila4,sumamontosfecha=0,fila5,sumaavancemes=0;
        for (var j=0; j<18; j++) {
            //var sumamontooriginal=0;
            for (var i = 0; i < valor.tramos[0].codsam.length; i++) {
                fila1=parseFloat($('#fila'+i+'>.sumamontooriginal'+j+'').text());
                //console.log('la fila1',parseInt($('#fila'+i+'>.sumamontooriginal'+j+'').text()));
                if($('#fila'+i+'>.sumamontooriginal'+j+'').text()!=''){
                    sumamontooriginal=sumamontooriginal+fila1;
                    //console.log('la fila1',sumamontooriginal);sumamontomesanterior
                }
                fila2=parseFloat($('#fila'+i+'>.sumamontomesanterior'+j+'').text());
                if($('#fila'+i+'>.sumamontomesanterior'+j+'').text()!=''){
                    sumamontomesanterior=sumamontomesanterior+fila2;
                    //console.log('la filaaaa',sumamontomesanterior);
                }
                fila3=parseFloat($('#fila'+i+'>.sumamontosmes'+j+'').text());
                if($('#fila'+i+'>.sumamontosmes'+j+'').text()!=''){
                    sumamontomes=sumamontomes+fila3;
                    //console.log('la filaaaa',sumamontomes);
                }
                fila4=parseFloat($('#fila'+i+'>.sumamontosfecha'+j+'').text());
                if($('#fila'+i+'>.sumamontosfecha'+j+'').text()!=''){
                    sumamontosfecha=sumamontosfecha+fila4;
                    //console.log('la fil',sumamontosfecha);sumaavancemes
                }
                fila5=parseFloat($('#fila'+i+'>.sumaavancemes'+j+'').text());
                //console.log('fre',fila4);
                if($('#fila'+i+'>.sumaavancemes'+j+'').text()!=''){
                    sumaavancemes=sumaavancemes+fila5;
                    //console.log('la filaaaa',sumaavancemes);
                }
            }
        }
        
        $('.bodyplanilla').after('<tr style="background:#CDDEEB; font-size: 12px"><td colspan="5">TOTALES</td><td colspan="1">'+sumamontooriginal+'</td><td colspan="1"></td><td colspan="1"></td><td colspan="1"></td><td colspan="1"></td><td colspan="1"></td><td colspan="1">'+sumamontomesanterior+'</td><td colspan="1"></td><td colspan="1">'+sumamontomes+'</td><td colspan="1"></td><td colspan="1">'+sumamontosfecha+'</td><td colspan="1">'+sumaavancemes+'</td><td colspan="1"></td></tr>')
        
        var idtra=0;
        $('#rutaplanilla').change(function(){
            idtra=$(this).val();
            $('#rutaplanilla').attr('value',valor.tramos[idtra].idtramo[0]);
            codigos=$(this).attr('value');
            if(valor.tramos[idtra].idtramo[0]==codigos){
                nombreruta=valor.tramos[idtra].descripcion[0];
                //console.log('nombre ruta:',nombreruta);
            }
            $('.bodyplanilla').empty();
            for(var i=0;i<valor.tramos[idtra].codsam.length;i++){  //introducir la fila
                //console.log('qwer',valor.tramos[idtra].codsam[i]);
                total=(valor.tramos[idtra].preciounitario[i] * valor.tramos[idtra].cantidadtrab[i]);
                avancedelmes=(((valor.tramos[idtra].preciounitario[i])*(col[i]))/(total))*(100);
                avancealafecha=(total)/(total)*(100);
                console.log('popop',total);
                $('.bodyplanilla').append('<tr id="fila'+i+'"><td id="idsam" value="'+valor.tramos[idtra].idsam[i]+'">'+valor.tramos[idtra].codsam[i]+'</td><td>'+valor.tramos[idtra].descripcionactividad[i]+'</td><td>'+valor.tramos[idtra].unidadactividad[i]+'</td><td>'+valor.tramos[idtra].preciounitario[i]+'</td><td>'+valor.tramos[idtra].cantidadtrab[i]+'</td><td class="sumamontooriginal'+i+'">'+total+'</td><td>'+0+'</td><td>'+0+'</td><td>'+0+'</td><td>'+0+'</td><td>'+col1[i]+'</td><td class="sumamontomesanterior'+i+'">'+(valor.tramos[idtra].preciounitario[i])*(col1[i])+'</td><td>'+col[i]+'</td><td class="sumamontosmes'+i+'">'+(valor.tramos[idtra].preciounitario[i])*(col[i])+'</td><td>'+valor.tramos[idtra].cantidadtrab[i]+'</td><td class="sumamontosfecha'+i+'">'+total+'</td><td class="sumaavancemes'+i+'">'+avancedelmes+'</td><td>'+(total)/(total)*(100)+'</td></td></tr>');
            }
            
            var sumamontooriginal=0;var fila1,fila2,sumamontomes=0,fila3,sumamontomesanterior=0,fila4,sumamontosfecha=0,fila5,sumaavancemes=0;
            for (var j=0; j<18; j++) {
                //var sumamontooriginal=0;
                for (var i = 0; i < valor.tramos[0].codsam.length; i++) {
                    fila1=parseFloat($('#fila'+i+'>.sumamontooriginal'+j+'').text());
                    //console.log('la fila1',parseInt($('#fila'+i+'>.sumamontooriginal'+j+'').text()));
                    if($('#fila'+i+'>.sumamontooriginal'+j+'').text()!=''){
                        sumamontooriginal=sumamontooriginal+fila1;
                        //console.log('la fila1',sumamontooriginal);sumamontomesanterior
                    }
                    fila2=parseFloat($('#fila'+i+'>.sumamontomesanterior'+j+'').text());
                    if($('#fila'+i+'>.sumamontomesanterior'+j+'').text()!=''){
                        sumamontomesanterior=sumamontomesanterior+fila2;
                        //console.log('la filaaaa',sumamontomesanterior);
                    }
                    fila3=parseFloat($('#fila'+i+'>.sumamontosmes'+j+'').text());
                    if($('#fila'+i+'>.sumamontosmes'+j+'').text()!=''){
                        sumamontomes=sumamontomes+fila3;
                        //console.log('la filaaaa',sumamontomes);
                    }
                    fila4=parseFloat($('#fila'+i+'>.sumamontosfecha'+j+'').text());
                    if($('#fila'+i+'>.sumamontosfecha'+j+'').text()!=''){
                        sumamontosfecha=sumamontosfecha+fila4;
                        //console.log('la fil',sumamontosfecha);sumaavancemes
                    }
                    fila5=parseFloat($('#fila'+i+'>.sumaavancemes'+j+'').text());
                    //console.log('fre',fila4);
                    if($('#fila'+i+'>.sumaavancemes'+j+'').text()!=''){
                        sumaavancemes=sumaavancemes+fila5;
                        //console.log('la filaaaa',sumaavancemes);
                    }
                }
            }
            //$('.bodyplanilla td').empty();
            $('.bodyplanilla').after('<tr style="background:#CDDEEB; font-size: 12px"><td colspan="5">TOTALES</td><td colspan="1">'+sumamontooriginal+'</td><td colspan="1"></td><td colspan="1"></td><td colspan="1"></td><td colspan="1"></td><td colspan="1"></td><td colspan="1">'+sumamontomesanterior+'</td><td colspan="1"></td><td colspan="1">'+sumamontomes+'</td><td colspan="1"></td><td colspan="1">'+sumamontosfecha+'</td><td colspan="1">'+sumaavancemes+'</td><td colspan="1"></td></tr>')
            
        });

        var ctx = document.getElementById("myChart");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["enero", "febrero", "marzo", "abril", "mayo", "junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],
                datasets: [{
                    label: '% avance',
                    data: [,,,,,24,,,,avancedelmes],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    $('#cmd').click(function(){
        window.print();
    });
    var fecha = new Date();
    var fechaaa=(fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate());
    //console.log('la fechaaa',fechaaa);
    new Date($.now());
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    //console.log('la horaaaa',time);
    $('#enviar').click(function(){
        var idusuario=aux22.idusuario;
        var idresidencia=idresideciaactual.idresidencia;
        var categoria = $("#selectcategoria option:selected").html();
        var valor={idusuario:idusuario, idresidencia:idresidencia, categoria:categoria, fecha:fechaaa, hora:time}
        socket.emit("reporte",valor);
    })
      

        
        //return { columns:headers, data:data, rows:data }
        

        //pdf.save('sample-file.pdf');
    

            // var aux = doc.output('blob');
            // //var aux = btoa(encodeURIComponent(doc.output()));
            // //var convertido=aux.output();
            // // console.log('bbbb',aux);
            // // socket.emit('pruebapdf',{pdf:aux});
            // var data = new FormData();

            // data.append('data',aux);
            // $.ajax({
            //     type: "POST",
            //     url: "/Planilla",
            //     data: data,
            //     processData: false,
            //     contentType:false 
            // }).done(function(data){
            //    console.log(data);
            // });
        
    });
    socket.on('resp_registro_reporte',function(value){
        console.log('hola',value);
        if(value==true){
            swal({
              title: "ENVIO SATISFACTORIO",
              text: "se envio reporte!",
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
              title: "ENVIO FALLIDO",
              text: "no se envio reporte!",
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
    
})