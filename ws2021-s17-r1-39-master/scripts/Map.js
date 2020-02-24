const maps = [
	document.getElementById("mapPlus"),
	document.getElementById("mapNormal"),
	document.getElementById("mapMinus")
];

const zoomIn = document.getElementById("zoomInBtn");
const zoomOut = document.getElementById("zoomOutBtn");

let current = 1;

//Handles map zoom in
zoomIn.onclick = () => {
	maps[current].style.display = "none";
	maps[--current].style.display = "block";
	if (current === 0) zoomIn.disabled = true;
	zoomOut.disabled = false;
};

//Handles map zoom out
zoomOut.onclick = () => {
	maps[current].style.display = "none";
	maps[++current].style.display = "block";
	if (current === 2) zoomOut.disabled = true;
	zoomIn.disabled = false;
};
