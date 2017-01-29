$(function(){ 
 // MI RESIDENCIA INDIVIDUAL
	if(window.location.pathname=='/Mi_Residencia'){
		var marker;
		var map = L.map('mimapa').setView([$('#latitud').text(), $('#longitud').text()], 17);
		L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGltYmVydGFiIiwiYSI6ImNpcG9mMnV3ZDAxcHZmdG0zOWc1NjV2aGwifQ.89smGLtgJWmUKgd7B0cV1Q', {
		    attribution: 'de: <a href="http://www.sedecapotosi.com">Servicio Departamental de caminos POTOSI</a>',
			maxZoom: 17
		}).addTo(map);
		marker = L.marker([$('#latitud').text(), $('#longitud').text()]).addTo(map)
			.bindPopup('<b>Ubicación exacta!</b><br>para cambiar la ubicación,<br> click en MODIFICAR')
    		.openPopup();
    }
    $('#mainNav').affix({offset: {top: 100}});
})


