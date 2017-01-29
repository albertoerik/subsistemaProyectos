$(function(){
	var socket=io('http://192.168.43.175:5000');
	$("#loginnick input").keyup(function(){
		if($(this).val().length>3){
			$("#loginnick").removeClass('has-error');
			$("#loginnick").addClass('has-success');
			$("#loginnick span").removeClass('glyphicon-remove');
			$("#loginnick span").addClass('glyphicon-ok');
		}else{
			$("#loginnick").removeClass('has-success');
			$("#loginnick").addClass('has-error');
			$("#loginnick span").removeClass('glyphicon-ok');
			$("#loginnick span").addClass('glyphicon-remove');
		}
	});
	$("#loginpass input").keyup(function(){
		if($(this).val().length>3){
			$("#loginpass").removeClass('has-error');
			$("#loginpass").addClass('has-success');
			$("#loginpass span").removeClass('glyphicon-remove');
			$("#loginpass span").addClass('glyphicon-ok');
		}else{
			$("#loginpass").removeClass('has-success');
			$("#loginpass").addClass('has-error');
			$("#loginpass span").removeClass('glyphicon-ok');
			$("#loginpass span").addClass('glyphicon-remove');
		}
	});
	$(".formularios").change(function(){
		console.log('cambios');
		if(($("#loginnick").hasClass('has-success'))&&($("#loginpass").hasClass('has-success'))){
			$("#btnEnviarLogin").removeClass('disabled');
		}else{
			$("#btnEnviarLogin").addClass('disabled');
		}
	});
	var $btn;
	$('#btnEnviarLogin').click(function(){
		
		if($(this).hasClass('disabled')){
		}else{
			$btn = $(this).button('loading');
			var nombre=$('#loginnick input').val();
			var contras=$('#loginpass input').val();
			var datos={nombre:nombre, contras:contras};
			$(this).addClass('disabled');
			console.log(datos);
			socket.emit('Login',datos);
		}	
	});
	socket.on('LoginRespuesta',function(rows){
		console.log('ffff', rows);
		if(rows.estado==true){
			
			if(rows.usuario[0].cargo=='Encargado de Residencia'){
				if(rows.estadoasignacion==true){
					localStorage.setItem('userinfo', JSON.stringify(rows.usuario[0]));
					localStorage.setItem('residenciainfo', JSON.stringify(rows.residencia[0]));
					location.href="MenuPrincipal";
				}
				else{
					localStorage.setItem('userinfo', JSON.stringify(rows.usuario[0]));
					location.href="MenuPrincipal";
				}
			}
			else{
				$('.error').text('No corresponde acceder al sistema');
				$('.errorLogo').slideDown('fast');
			}
		}else{
			$('.error').text('NO EXISTE EL USUARIO');
			$('.errorLogo').slideDown('fast');
		}
		
		// 	
		// 	sessionStorage.setItem('CI',ci);
		// 	
		// }
		// else{
		// 	$('.error').text('verifique sus datos')
		// 	$('.errorLogo').slideDown('fast');
		// }
	});
})