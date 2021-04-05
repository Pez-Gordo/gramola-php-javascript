// Global Variables

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
let audioSource
let analyzer
var canciones

// Implementamos carga dinámica de archivos segun el contenido del directorio audio. Desactivo el modo asíncrono para evitar errores en la consola
$.ajax({
	async: false,
    url: './listado-archivos.php',
    method: 'POST',
    dataType: 'json',
    success: function(response) {
        console.log(response)
        var songsArray = response
        songsArray.shift()
        songsArray.shift()
        canciones = songsArray
    }
})

var indiceActual = new Array(1)
//Funcion para crear mediante javascript el listado de canciones
function crearPlayList(){
	const listado = document.createElement('ol')
	listado.setAttribute("id", 'listadoMusica')
	for (let i = 0; i<canciones.length; i++){
		const item = document.createElement('li')
		item.appendChild(document.createTextNode(canciones[i])) 
		item.setAttribute("id", canciones.indexOf(canciones[i]))
		listado.appendChild(item)
	}
	return listado
}
document.getElementById('collection').appendChild(crearPlayList())


var listadoMusica= document.getElementById('listadoMusica')
// Evento para reproducir cancion al hacer clic. Cambiar por añadir a la cola
listadoMusica.onclick = (e) =>{
	const itemClick = e.target
	removeActive() // --> Quita la cancion actual
	itemClick.classList.add("active"); // --> Añade la clase active al elemento de la lista que ha sido clicado
	reproduccionActual("Playing: "+ itemClick.innerText) // --> Actualiza el banner con la cancion que se ha pinchado
	loadMusic(itemClick.innerText) // --> Carga la cancion que se ha pinchado
	player.play() // --> Comienza a reproducir
	indiceActual[0]= e.target.id // --> Actualiza el indice
	classIconPlay(); // --> Cambia el icono play/pause

}

//Funcion para cambiar el icono del reprodutor
function classIconPlay(){
	var element = document.getElementById("iconPlay")
	element.classList.remove("fa-play-circle");
    element.classList.add("fa-pause-circle");
}

//Funcion para control del volumen
const volumen= document.getElementById("volumen")
volumen.oninput= (e) =>{
	const vol = e.target.value
	player.volume =vol
}

//Funcion para actualizar la barra de progreso del reprodutor
const updateProgress = () => {
	if (player.currentTime > 0) {
		const barra = document.getElementById('progress')
		barra.value = (player.currentTime / player.duration) * 100
		
		var duracionSegundos= player.duration.toFixed(0);
		dura=secondsToString(duracionSegundos);
		var actualSegundos = player.currentTime.toFixed(0)
		actual=secondsToString(actualSegundos);
		
		duracion= actual +' / '+ dura
		document.getElementById('timer').innerText=duracion 
	}
	if (player.ended) {
		// if(lista) {nextMusicList()} else
		nextRandomMusic();//Reproducir la siguiente pista
	} 
}

//Funcion para reproducir la proxima cancion
function nextMusic(){  
	const source = document.getElementById('source');
	var musicaActual= Number(indiceActual[0]);
	if (canciones.length == (musicaActual+1)){
		var siguiente = 0
	} else {
		var siguiente = musicaActual + 1
	}
	removeActive()
	var item=document.getElementById(siguiente)
	item.classList.add("active");
	loadMusic(canciones[siguiente]);
	player.play()
	indiceActual[0]= siguiente
	reproduccionActual("Playing: "+ canciones[siguiente])
	classIconPlay()
}

//Funcion para reproducir la cancion anterior
function prevMusic(){  
	const source = document.getElementById('source');
	var musicaActual= Number(indiceActual[0]);
	if (musicaActual==0){
		var anterior= canciones.length - 1
	} else {
		var anterior = musicaActual - 1
	}
	removeActive()
	var item=document.getElementById(anterior)
	item.classList.add("active");
	loadMusic(canciones[anterior]);
	player.play()
	indiceActual[0]= anterior
	reproduccionActual("Reproduciendo: "+ canciones[anterior])
	classIconPlay()
}

//Funcion para reproducir la proxima cancion
function nextRandomMusic(){  
	
	var siguiente = Math.floor(Math.random() * canciones.length)// random number
	
	removeActive()
	var item=document.getElementById(siguiente)
	item.classList.add("active");
	loadMusic(canciones[siguiente]);
	player.play()
	indiceActual[0] = siguiente
	reproduccionActual("Playing: "+ canciones[siguiente])
	classIconPlay()
}

//Funcion para reproducir la cancion anterior
function prevRandomMusic(){  

	var siguiente = Math.floor(Math.random() * canciones.length)// random number

	
	removeActive()
	var item=document.getElementById(anterior)
	item.classList.add("active");
	loadMusic(canciones[anterior]);
	player.play()
	indiceActual[0]= anterior
	reproduccionActual("Reproduciendo: "+ canciones[anterior])
	classIconPlay()
}

//Funcion para remover todas las clases css activas
function removeActive(){
	var elems = document.querySelectorAll(".active");
 	 [].forEach.call(elems, function(el) {
    	el.classList.remove("active");
 	 });
 	 return elems
}
//Funcion para mostrar el nombre del arhivo actual en reproduccion
function reproduccionActual(texto){
	document.getElementById('currentPlay').innerText=texto
}
//Funcion para cargar las canciones en el reproductor
function loadMusic(ruta){
	var source = document.getElementById('source')
	var folder ="audio";//Carpeta donde tenemos almancenada la musica
	source.src= folder+"/"+ruta
	var index= indiceActual[0]= canciones.indexOf(ruta)
	removeActive()
	var item=document.getElementById(index)
	item.classList.add("active");
	reproduccionActual("Playing: "+ ruta)
	player.load()
}
//Funcion para pausar o darle play 
function togglePlay() {
	if (player.paused){
		toggleIcon();
		return player.play();
	} else {
		toggleIcon();
		return player.pause();
	}
}

//Funcion para cambiar el icono play o pause
function toggleIcon() {
   var element = document.getElementById("iconPlay");
   element.classList.toggle("fa-play-circle");
   element.classList.toggle("fa-pause-circle");
}

//Funcion para que al dar click sobre la barra de progeso se permita adelantar
progress.addEventListener('click', adelantar);
function adelantar(e){
	const scrubTime = (e.offsetX / progress.offsetWidth) * player.duration;
	player.currentTime = scrubTime;
	console.log(e);
}

//Funcion para convertir segundos a minutos y horas
function secondsToString(seconds) {
	var hour="";
	if (seconds>3600){
		hour = Math.floor(seconds / 3600);
		hour = (hour < 10)? '0' + hour : hour;
		hour+=":"
	}
   var minute = Math.floor((seconds / 60) % 60);
  minute = (minute < 10)? '0' + minute : minute;
  var second = seconds % 60;
  second = (second < 10)? '0' + second : second;
  return hour  + minute + ':' + second;
}

//loadMusic(canciones[0]) // --> Carga la cancion que esté en el primer puesto de la lista
loadMusic(canciones[Math.floor(Math.random() * canciones.length)]) // --> Inicializa el reproductor con una cancion al azar



// Implementando el visualizador de sonido
player.addEventListener('playing', oscillate)

function oscillate() {
	//const audio1 = document.getElementById('player')
	
	const audioContext = new AudioContext()
	audioSource = audioContext.createMediaElementSource(player)
	analyzer = audioContext.createAnalyser()
	audioSource.connect(analyzer)
	analyzer.connect(audioContext.destination)
	analyzer.fftSize = 512
	const bufferLength = analyzer.frequencyBinCount*0.42
	const dataArray = new Uint8Array(bufferLength)

	const barWidth = canvas.width / bufferLength
	let barHeight
	let x
	function animate() {
		x = 0
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		analyzer.getByteFrequencyData(dataArray)

		drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) 

		requestAnimationFrame(animate)

	}
	animate()
}

function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
	for (let i = 0; i < bufferLength; i++) {
		barHeight = dataArray[i] -60
		
		const hue = i
		ctx.fillStyle = 'white'
		ctx.fillRect(x, canvas.height - barHeight +50, barWidth, barHeight)
		ctx.fillStyle = 'hsl(' + hue + ', 100%, 50%)'
		
		ctx.fillRect(x, canvas.height - barHeight +60, barWidth, barHeight)
		x += barWidth
	}
}

$('#collection').show()
$('#queue').hide()
$('#upload').hide()

document.getElementById("btnradio1").addEventListener("click", function() {
	$('#collection').show()
	$('#queue').hide()
	$('#upload').hide()
})

document.getElementById("btnradio2").addEventListener("click", function() {
	$('#collection').hide()
	$('#queue').show()
	$('#upload').hide()
})

document.getElementById("btnradio3").addEventListener("click", function() {
	$('#collection').hide()
	$('#queue').hide()
	$('#upload').show()
})
