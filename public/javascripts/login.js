$(function(){
	var socket=io('http://192.168.1.70:5000');
	$('#btnEnviarLogin').click(function(){
		var nombre=$('#nombre').val();
		var contras=$('#contraseña').val();
		var datos={nombre:nombre, contras:contras};
		console.log(datos);
		if(nombre!=''&&contras!=''){
			socket.emit('Login',datos);
		}	
	});
	socket.on('LoginRespuesta',function(rows){
		var nombre=rows.nombre;
		var apellido=rows.apellido;
		var completo=nombre+' '+apellido;
		var ci=rows.ci;
		var estado=rows.estado;
		var descripcion=rows.descripcion;
		if(estado==true){
			sessionStorage.setItem('Nombre',nombre);
			sessionStorage.setItem('Completo',completo);
			sessionStorage.setItem('CI',ci);
			if(descripcion=='ACASIO'){
				sessionStorage.setItem('IdResidencia',1);
			}
			location.href="http://localhost:5000/EncargadoResidencia";
		}
		else{
			$('.error').text('verifique sus datos')
			$('.errorLogo').slideDown('fast');

		}
		console.log(rows);
	});
})