$(function(){ 
 // MI RESIDENCIA INDIVIDUAL
 	var socket=io('http://192.168.43.175:5000');
 	var info=JSON.parse(localStorage.getItem('userinfo'));
 	var aux=JSON.parse(localStorage.getItem('residenciainfo'));
 	$('#miperfil').click(function(){
        socket.emit('listaUnUsuario',info.idusuario);

	});
	$('#salirsistema').click(function(){
        
	});
	$('#iramiresidencia').click(function(){
        if(aux!=null){
        	var miresidencia=aux.idresidencia;
			location.href="/Mi_Residencia?id="+miresidencia+"";
        }else{
        	//no existe asignacion
        }
		
	});
	$('#irmenuPQ').click(function(){
        if(aux!=null){
        	var miinformacion=aux.idresidencia;
			location.href="/menuproquin";
        }else{
        	//no existe asignacion
        }
		
	});

	$('#irinformesemanal').click(function(){
    
        if(aux!=null){
        	var miinformacion=aux.idresidencia;
			location.href="/insertarinformeSemanal";
        }else{
        	//no existe asignacion
        }
		
	});
	$('#irplanilladeavance').click(function(){
   
        if(aux!=null){
        	var miinformacion=aux.idresidencia;
			location.href="/planilla";
        }else{
        	//no existe asignacion
        }
	});
	socket.on('RespuestaListaUnUsuario',function(valores){controlador=0;if(valores.estado!='fallido'){if(valores.estado=='actualizado'){swal("Satisfactorio!", "Informacion Actualizada correctamente", "success");}idusuario=valores.idusuario;$('.nomC').text(valores.nombres);$('.nicC').text(valores.nick);$('.ciC').text(valores.ci);$('.carC').text(valores.cargo);$('.domC').text(valores.domicilio);$('.telC').text(valores.telefono);$('.celC').text(valores.celular);	}else{sweetAlert("ERROR!", "Ocurrio un error de conexión intentelo nuevamente!", "error");}$(".User input").css('display','none');$(".User p").slideDown('fast');$('.edit').val('Editar');$('.edit').text('Editar');$('.edit').removeClass('disabled');
    	//MODIFICAR INFORMACION DE USUARIO
		$(".edit").click(function(){var aux2=$('.edit').val();if(aux2=='Editar'){$('.n').val($('.nomC').text());$('.k').val($('.nicC').text());$('.i').val($('.ciC').text());$('.d').val($('.domC').text());$('.t').val($('.telC').text());$('.c').val($('.celC').text());$(".User input").toggle(5);$(".titModalUser").css("display", "none");$('.edit').val('Guardar Cambios');$('.edit').text('Guardar Cambios');$('.edit').addClass('disabled');}else{if(aux2=='Guardar Cambios'){if(controlador==1){var valores={"idusuario":idusuario,"nombres":$('.n').val(),"nick":$('.k').val(),"ci":$('.i').val(),"domicilio":$('.d').val(),"telefono":$('.t').val(),'celular':$('.c').val()};socket.emit('ActualizarUsuarios',valores);}}}});
		//controla que realice una modificacion para actualizar
		$(".User input").keyup(function(){if(($('.n').val()!=$('.nomC').text()) || ($('.k').val()!=$('.nicC').text()) || ($('.i').val()!=$('.ciC').text()) || ($('.d').val()!=$('.domC').text()) || ($('.t').val()!=$('.telC').text()) || ($('.c').val()!=$('.celC').text())){$('.edit').removeClass('disabled');controlador=1;}else{$('.edit').addClass('disabled');}});
	});
})