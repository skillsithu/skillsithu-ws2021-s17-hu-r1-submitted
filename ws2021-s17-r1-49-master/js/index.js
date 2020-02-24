/* When scroll the website, logo'll get a new style with class. */
window.onload = function(){
	gallery();
}
window.onscroll = function scrolling(){
	var scroll_y = window.pageYOffset;
	let logo = document.getElementById("logo");

	if(scroll_y > 10){
		logo.className = ("navbar-brand l-scroll");
	} else {
		logo.className = ("navbar-brand");
	}
}


/* Gallery */
function gallery(){
	for(let i = 1; i <= 12; i++){
		if(i < 10){
			document.getElementById("gallery").innerHTML += "<div class='col-md-3 gallery-img'><img src='images/gallery/shanghai_park_0"+i+".jpg'></div>";
			
		} else if(i >= 10){
			document.getElementById("gallery").innerHTML += "<div class='col-md-3 gallery-img'><img src='images/gallery/shanghai_park_"+i+".jpg'></div>";
		}
		else {
			document.getElementById("gallery").innerHTML += "<div> Nem található kép! </div>";
		}
	}
}

/* Form */
function send(){
	let getform = document.getElementById("cform");
	let firstname = document.getElementById("firstname").value;

	if(firstname != null && firstname != ""){
		getform.innerHTML = "<div>Dear " + firstname + "! <br> Thank you for message. We will contact you as soo as possible.</div>";

	}
}
