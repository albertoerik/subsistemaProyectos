$(function(){
	var socket=io();



//.................listar inf sem ................//
	var nombremesIF=$('#btnmesinfsem').text();
    $('.meses a').click(function(){
        var mesactual=$(this).text();
        if(nombremesIF!=mesactual){
            $('#btnmesinfsem').text($(this).text());
            $('#btnmesinfsem').append('<span style="margin-left:5px" class="caret"></span>');
            nombremesIF=$(this).text();
            //console.log('hgf',nombremesIF);
            socket.emit('listarinfsem',{'mes':nombremesIF});
        }
    });
	socket.on('resplistarinfsem',function(val){
		//console.log('resp lista inf sem',val);
		if(val.estado==true){
			var uno=[], dos=[];var semanas=[];
			for(var j=0;j<val.tickeoo.length;j++){ //2
				var mitad=val.tickeoo[1].length/2;
				for(var k=0;k<val.tickeoo[1].length;k++){ //16
					
					if(mitad>0){
						uno.push(val.tickeoo[j].charAt(k));
						mitad--;
						
					}else{
						dos.push(val.tickeoo[j].charAt(k));
					}
				}
				semanas.push(uno,dos);
				uno=[];
				dos=[];
			}
			console.log('las 4 sem',semanas);

			for(var i=0;i<2;i++){
				$('.contenidotablainsemanal').append('<tr class="filatm" value="'+val.numero[0]+'"><td id="num">'+(i+1)+'</td><td>'+val.mesquincenal[0]+'</td><td>'+val.nomtramo[0]+'</td><td><button type="button" style="margin:0 auto;display:block;" class="btn btn-primary btninfosem'+i+'">IMPRIMIR</button></td></tr>');
				
			}
			for(var i=2;i<4;i++){
				$('.contenidotablainsemanal').append('<tr class="filatm" value="'+val.numero[1]+'"><td id="num">'+(i+1)+'</td><td>'+val.mesquincenal[1]+'</td><td>'+val.nomtramo[1]+'</td><td><button type="button" style="margin:0 auto;display:block;" class="btn btn-primary btninfosem">IMPRIMIR</button></td></tr>');
				
			}
		}else{
			if(val.estado==false){
				$('.mesajealerta').append('<div class="alert alert-danger"><button type="button" data-dismiss="alert" aria-hidden="true" class="close">×</button><strong>ALERTA!!</strong> No realizo ninguna programacion quincenal. Para realizar una programacion quincenal por favor seleccione el boton nuevo que se encuentra en la parte inferior</div>');
			}
		}
	})
//................pdf boton INF SEM...............................................//
	/*var nombremesIFORSEM=$('#btnmesinfsem').text();
    $('.meses a').click(function(){
        var mesactualIF=$(this).text();
        if(nombremesIFORSEM!=mesactualIF){
            $('#btnmesinfsem').text($(this).text());
            $('#btnmesinfsem').append('<span style="margin-left:5px" class="caret"></span>');
            nombremesIFORSEM=$(this).text();
			$('.btninfosem').click(function(){
				var auu1=272;//$(this).attr('value');
				console.log('yryy',nombremesIFORSEM,auu1);	
				socket.emit('pdfinfsem',{'idpq1':auu1,'mes':nombremesIFORSEM});
			});
        }
    });*/


    var aux;
	$('.btninfosem').click(function(){
		aux=$('#num').text();
		console.log('ioio',aux);
		var auu1=272;//$(this).attr('value');
		var num=1;
		console.log('yryy',auu1);	
		socket.emit('pdfinfsem',{'idpq1':auu1,'num':num});
	});
//......................pdf infor semanal.........................//
	socket.on('resppdfinfsem', function(val){
		console.log('semanal',val.infsem);
		var tbody1=[];
		var tfila1=[];
		//tfila1.push({text:'dia',style:'rotar',rowSpan: 2}, {text:'Ruta', style:'rotar',rowSpan: 2}, {text:'S\ne\nc\nc\ni\no\nn', style:'rotar',rowSpan: 2}, {text:'K.\ni\nn\ni\nc\ni\no',style:'rotar',rowSpan: 2},{text:'K.\nf\ni\nn\na\nl',style:'rotar',rowSpan: 2},{text:'A\nc\nt\ni\nv\ni\nd',style:'rotar',rowSpan: 2},{text:'V\no\nl\nu\nm\ne\nn',style:'rotar',rowSpan: 2},{text:'PERSONAL', colSpan:4,style:'rotar'},{},{},{},{text:'MATERIALES', colSpan:4,style:'rotar'},{},{},{},{text:'EQUIPOS', colSpan:4,style:'rotar'},{},{},{},{text:'Observaciones',style:'rotar',rowSpan: 2});
		//tbody1.push(tfila1);tfila1=[];
		//tfila1.push({text:''}, {text: ''}, {text: ''}, {text: ''},{text: ''},{text: ''},{text: ''},{text:'C\nl\na\ns\ne',style:'rotar'},{text:'H.\nr\ne\ng\nu',style:'rotar'},{text:'C\nl\na\ns\ne',style:'rotar'},{text:'H.\nr\ne\ng\nu',style:'rotar'},{text:'C\nl\na\ns\ne',style:'rotar'},{text:'C\na\nn\nt\ni',style:'rotar'},{text:'C\nl\na\ns\ne',style:'rotar'},{text:'C\na\nn\nt\ni',style:'rotar'},{text:'N.\ni\nn\nt\ne',style:'rotar'},{text:'H.\nu\nt\ni\nl',style:'rotar'},{text:'N.\ni\nn\nt\ne',style:'rotar'},{text:'H.\nu\nt\ni\nl',style:'rotar'});


		for (var i = 0; i < val.infsem.length; i++) {
			for (var j = 0; j < val.infsem[i].length; j++) {
				
				tfila1.push({text:val.infsem[i][j]});
				
			}
			tbody1.push(tfila1);tfila1=[];
			
		};
		console.log('ñoño',tbody1);
		var infosem = {
		    pageOrientation: 'landscape',
			content: [
				
				{text: 'INFORME SEMANAL', style: 'subheader',alignment:'center'},
				{
					style: 'tableExample',
					table: {
						widths: [30, 30, 30, 30,30,30,30,20,20,20,20,20,20,20,20,20,20,20,20,'*'],
						body: [
							[{text:'dia',style:'rotar',rowSpan: 2}, {text:'Ruta', style:'rotar',rowSpan: 2}, {text:'S\ne\nc\nc\ni\no\nn', style:'rotar',rowSpan: 2}, {text:'K.\ni\nn\ni\nc\ni\no',style:'rotar',rowSpan: 2},{text:'K.\nf\ni\nn\na\nl',style:'rotar',rowSpan: 2},{text:'A\nc\nt\ni\nv\ni\nd',style:'rotar',rowSpan: 2},{text:'V\no\nl\nu\nm\ne\nn',style:'rotar',rowSpan: 2},{text:'PERSONAL', colSpan:4,style:'rotar'},{},{},{},{text:'MATERIALES', colSpan:4,style:'rotar'},{},{},{},{text:'EQUIPOS', colSpan:4,style:'rotar'},{},{},{},{text:'Observaciones',style:'rotar',rowSpan: 2}],
							[{text:''}, {text: ''}, {text: ''}, {text: ''},{text: ''},{text: ''},{text: ''},{text:'C\nl\na\ns\ne',style:'rotar'},{text:'H.\nr\ne\ng\nu',style:'rotar'},{text:'C\nl\na\ns\ne',style:'rotar'},{text:'H.\nr\ne\ng\nu',style:'rotar'},{text:'C\nl\na\ns\ne',style:'rotar'},{text:'C\na\nn\nt\ni',style:'rotar'},{text:'C\nl\na\ns\ne',style:'rotar'},{text:'C\na\nn\nt\ni',style:'rotar'},{text:'N.\ni\nn\nt\ne',style:'rotar'},{text:'H.\nu\nt\ni\nl',style:'rotar'},{text:'N.\ni\nn\nt\ne',style:'rotar'},{text:'H.\nu\nt\ni\nl',style:'rotar'}]
							
						]
					}
				},
				
			],
			styles: {
				header: {
					fontSize: 18,
					bold: true,
					margin: [0, 0, 0, 10],
					
				},
				subheader: {
					fontSize: 16,
					bold: true,
					margin: [0, 10, 0, 5]
				},
				tableExample: {
					margin: [0, 5, 0, 15]
				},
				tableHeader: {
					bold: true,
					fontSize: 13,
					color: 'black'
					
				},
				rotar:{
				    alignment:'center',
				}
			},
			defaultStyle: {
				// alignment: 'justify'
			}
		}
		
		pdfMake.createPdf(infosem).open();
		
	})
	


//.....................btn PQ pdf........................//
	var nombremes=$('#btnmes').text();
    $('.meses a').click(function(){
        var mesactual=$(this).text();
        if(nombremes!=mesactual){
            $('#btnmes').text($(this).text());
            $('#btnmes').append('<span style="margin-left:5px" class="caret"></span>');
            nombremes=$(this).text();
            $('.btnimpPQ').click(function(){
				var auu=272;//$(this).attr('value');
				//console.log('yryy',nombremes,auu);	
				socket.emit('pdfPQ',{'idpq':auu,'mes':nombremes});
				
			});
        }
    });

//..................................pdf PQ.................................//
	socket.on('resppdfPQ',function(valor){
		//console.log('la respuesta',valor);
		var dias=['L','M','M','J','V','S','D'];
        var days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        var fecha = new Date();
        var fechade;var fechahasta;var textomes;
        var mesactual;
        var mesess=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
        for(var t=0;t<mesess.length;t++){

            if(valor.mesquin==mesess[t]){

                mesactual=t+1;
                //console.log('uuuu',mesactual);
            }
        }
        var val=valor.estadoquin;
    	if(val==1){
    		//$('.selectMes').css('display','none');
    		fecha=new Date(fecha.getFullYear(),mesactual, 0);
            //console.log('lelelele',fecha);

	    	var num=fecha.toDateString().substring(8,10);
	    	var dy=fecha.toDateString().substring(0,3);
	    	var o=0;var aux=1;var aux2=15;var ii=1;
            //$('#CalendarioFila').attr('colspan',15);
	    	cambiofecha(num,dy,o,aux,aux2,ii);

    	}
    	else{
    		if(val==2){ // mes a llenar Ej: Agosto
    			//$('.selectMes').css('display','none');
    			fecha=new Date(fecha.getFullYear(),mesactual, 0);
		    	var num=fecha.toDateString().substring(8,10); //ultimo dia del mes = 31
		    	var dy=fecha.toDateString().substring(0,3); // dia del ultimo dia mes = Mon
		    	var o=0;var aux=16;var aux2=parseInt(num);var ii=(31-parseInt(num)); //var aux2=parseInt(num)-15
                
                console.log(aux2,ii,'ve esto',num);
                cambiofecha(num,dy,o,aux,aux2,ii);

    		}
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
        
			var tbody=[];
			var tfila=[];
			
			tfila.push({text:'Actividad', rowSpan:3,alignment: 'center'}, {text:'Seccion', rowSpan:3,alignment: 'center'}, {text:'Unidad', rowSpan:3,alignment: 'center'}, {text:'Progresiva', colSpan: 2, alignment: 'center'}, {}, {text:'Calendario de Trabajo', colSpan: 16,alignment: 'center'},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{text:'Cantidad',rowSpan:3, alignment: 'center'});
			tbody.push(tfila);tfila=[];
			tfila.push({text:''}, {text:''}, {text:''}, {text: 'De',rowSpan:2},{text: 'Hasta',rowSpan:2});

			for (var i = aux; i <= aux2; i++) {
				if(o==6){
					tfila.push(dias[o]);
					o=0;
				}else{
					tfila.push(dias[o]);
					o++;
				}
			};

			tfila.push({text:''});
			
			tbody.push(tfila);tfila=[];
			tfila.push('','','','','');
			for (var i = aux; i <= aux2; i++) {
				//console.log('poi',i);
				tfila.push({text:i});
			};
			tfila.push('');
			tbody.push(tfila);tfila=[];
			//console.log(tbody);
			for (var i = 0; i < valor.PQ.length; i++) {
				for (var j = 0; j < valor.PQ[i].length; j++) {
					if(valor.PQ[i][j]!=''){
						tfila.push({text:valor.PQ[i][j]});
					}else{
						tfila.push({text:' '});
					}
				}
				tbody.push(tfila);tfila=[];
				
			};
			var imgData = 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRBQzhFRkRCQjE4RjExRTY5NEM5OEI2MEY0NEYxRTk2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjRBQzhFRkRDQjE4RjExRTY5NEM5OEI2MEY0NEYxRTk2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NEFDOEVGRDlCMThGMTFFNjk0Qzk4QjYwRjQ0RjFFOTYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NEFDOEVGREFCMThGMTFFNjk0Qzk4QjYwRjQ0RjFFOTYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQ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xK7ag8Ssqspsaq1TXYh6XRhgqR2ET5yJ6/rPb+za6436rSV22nm5BBPx6SMzZTs200Ia6tHSqHgR6anI8cib/XcbakQeOSc273jvmgCp6w1NS8BXcOrh/Fwb756Fb7d2K7qL6CgluZCBT/6cTT/8S9uf/wAFf/q//KVtlrb81J+Ig2+394G9bcut9P0W6mR0z1DqXtB7pJzRpNFpdFV6GkqWmrOehBgZPbN8yJEREAREQBERAEREAREQBERAEREAREQBIT3hTdd7e1a081Cu470RgzfdJufFtaW1vU4yjgqw7wRgwDxKJ07lon2/X6jRPzocqD3r+E/MTmndVyk+5URESQIiACTgcSeQgCWL2LpPX35LSPLpq3sPxI6B/wC6atk9pbju4d2zpKEwPUtRssT+yvDMvuwe39LsenauljbbaQbbWwC2OQAHITDLkTTqtSUiVmYic5IiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCYmZiAeUe7bxf7h1rA5CMKx/cUL+mQ87N3W5d11nroa7TdYxUjHNieE452Y/yV8irEREuBJH29XZZveh9NGfpvrZukE4UNxJxPnbNk3HdbVTS0syEgNcRhFHaSx4T1bbdt0u2aVNNpkCqigMwADOR+Jj2kzDLlUcVrO5KR1TMROckREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREARMTMAREQBMTMQDh3LZtt3RQuuoW0r9LcVYfBlwZBv/t5srNlbdQg7gyn9KS1RJXL9M/AFXq/2/wBiTHW19pBzxcAHw8qiSek9sbFoyrU6OsunEO+XbP8AfzJWIfLrPxBhVVRhQAByA4CZiJAEREAREQBERAEREAREQBExMwBERAEREAREQBERAEREA//';

			var repproquin = {
			    pageOrientation: 'landscape',

				content: [
					{text: 'PROGRAMACION QUINCENAL', style: 'header'},
					{
						style: 'tableExample',
						table: {
							widths: [70, 60, 60, 50,50,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,'*'],
							
							body: tbody
						}
					}
					
				],
				defaultStyle: {
					alignment: 'center'
				}
			}
			pdfMake.createPdf(repproquin).open();
		}

		
	})
})