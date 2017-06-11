$(function(){
	var socket=io();
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
		cambios();
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
		cambios();
	});
	function cambios(){
		if(($("#loginnick").hasClass('has-success'))&&($("#loginpass").hasClass('has-success'))){
			$("#btnEnviarLogin").attr('disabled',false);
		}else{
			$("#btnEnviarLogin").attr('disabled',true);
		}
	}	
	$('#btnEnviarLogin').click(function(){
		$(this).attr('disabled',true);
		var nombre=$('#loginnick input').val();
		var contras=$('#loginpass input').val();
		var datos={nombre:nombre, contras:contras};
		socket.emit('Login',datos);});
	socket.on('LoginRespuesta',function(rows){
		console.log('aaa', rows);
		if(rows.estado==true){
			localStorage.setItem('userinfo',JSON.stringify(rows.usuario[0]));
			if(rows.estadoasignacion!=false){
				localStorage.setItem('residenciainfo',JSON.stringify(rows.residencia[0]))
			}
			location.href="MenuPrincipal";
		}else{
			$("#loginnick input").val('');
			$("#loginpass input").val('');
			$("#loginpass").removeClass('has-success');
			$("#loginpass").addClass('has-error');
			$("#loginpass span").removeClass('glyphicon-ok');
			$("#loginpass span").addClass('glyphicon-remove');
			$("#loginnick").removeClass('has-success');
			$("#loginnick").addClass('has-error');
			$("#loginnick span").removeClass('glyphicon-ok');
			$("#loginnick span").addClass('glyphicon-remove');
			$('#estadolog').text('Nombre de usuario o contraseña incorrectos');
		}
	});
})