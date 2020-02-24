const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Gets the whole json
//Pulls out and converts the important data into
//Returns the data in better structure
function transformData(rawData) {
	const transformedData = [];
	for (let level of Object.keys(rawData)) {
		let levelData = [];
		for (let roomID of Object.keys(rawData[level])) {
			const { price_eur, rooms, net_area, sales_area, orientation, reserved } = rawData[level][
				roomID
			];
			if (!reserved) {
				levelData.push([
					roomID,
					Number(rooms),
					Number(net_area),
					Number(sales_area),
					orientation,
					Number(price_eur)
				]);
			}
		}
		transformedData.push(levelData);
	}
	return transformedData;
}

let flatData;

//Fetches the json, transforms it and stores it
function getFlatsData() {
	fetch("../shanghai_park_flats.json")
		.then((res) => {
			res.json().then((data) => {
				flatData = transformData(data);
			});
		})
		.catch((err) => console.log(err));
}

//Gets an array and shows it as a table
function showTable(flats) {
	const dataRoot = document.getElementById("flats-data");
	while (dataRoot.firstChild) {
		dataRoot.removeChild(dataRoot.firstChild);
	}

	if (flats.length > 0) {
		document.getElementById("flatsTable").style.display = "block";
		document.getElementById("noFlatsMessage").style.display = "none";
		for (let flat of flats) {
			const tr = document.createElement("tr");
			for (let property of flat) {
				const cell = tr.insertCell(-1);
				cell.innerHTML = property;
			}
			dataRoot.appendChild(tr);
		}
	} else {
		document.getElementById("flatsTable").style.display = "none";
		document.getElementById("noFlatsMessage").style.display = "block";
	}
}

let currentLevel = 0;
let currentSortKey;
let sortDirection;

//Sorts the table via the clicked column
//Displays the sorted table
function sortTable() {
	let flatsToSort = flatData[currentLevel];
	if (sortDirection === "ASC") {
		flatsToSort.sort((a, b) => {
			if (a[currentSortKey] < b[currentSortKey]) return -1;
			if (a[currentSortKey] > b[currentSortKey]) return 1;
			return 0;
		});
	} else {
		flatsToSort.sort((a, b) => {
			if (a[currentSortKey] > b[currentSortKey]) return -1;
			if (a[currentSortKey] < b[currentSortKey]) return 1;
			return 0;
		});
	}
	showTable(flatsToSort);
}

//Clears the canvas
function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/*
To draw the img map polygons correctly
the program stores the coordinates for the width of 989px
and this function translates all x coordinates accordingly
*/
function translateX(x) {
	return (x * window.innerWidth * 0.8) / 989;
}

//Draws a polygon from a comma-separated string
function drawPolygon(points) {
	let coords = points.split(",");
	let [startX, startY] = coords.splice(0, 2);
	ctx.beginPath();
	ctx.moveTo(startX, startY);
	while (coords.length > 0) {
		let [x, y] = coords.splice(0, 2);
		ctx.lineTo(x, y);
	}
	ctx.lineTo(startX, startY);
	ctx.closePath();
	ctx.fillStyle = "rgba(93, 215, 130, 0.6)";
	ctx.fill();
}

const baseCoords = [
	[132, 360, 134, 441, 875, 399, 883, 353],
	[132, 307, 134, 360, 885, 353, 881, 320],
	[134, 252, 134, 307, 883, 320, 883, 288],
	[134, 199, 134, 252, 883, 287, 881, 257],
	[134, 144, 134, 197, 885, 255, 883, 224],
	[134, 89, 134, 142, 881, 222, 881, 191],
	[136, 21, 136, 89, 881, 191, 875, 164, 229, 55, 189, 30],
	[193, 6, 195, 31, 229, 55, 875, 162, 836, 130, 780, 107, 692, 90, 528, 60, 470, 47, 318, 17]
];

//Returns the correct image map area coords for each area
function getAreaCoords(level) {
	return baseCoords[level].map((coord, i) => (i % 2 === 0 ? translateX(coord) : coord)).join(",");
}

//For all areas set hover blur and click events
document.querySelectorAll("area").forEach((area) => {
	area.onmouseover = () => drawPolygon(area.coords);
	area.onmouseleave = () => clearCanvas();
	area.onclick = (event) => {
		currentLevel = event.target.dataset.level;
		document.getElementById("levelIndicator").innerText = `Floor ${currentLevel}`;
		showTable(flatData[currentLevel]);
	};
});

const flatsModal = document.getElementById("flats-modal");

//Open flats modal on button click
document.getElementById("flatsModalOpen").onclick = () => {
	openModal(flatsModal);
	document.getElementById("levelIndicator").innerText = `Floor ${currentLevel}`;
	showTable(flatData[0]);
};

//Closes flats modal on close button click
document.getElementById("flatsModalClose").onclick = () => {
	closeModal(flatsModal);
};

//On window resize and on window load set the area coordinates and width of canvas and modal
window.onresize = window.onload = () => {
	canvas.width = window.innerWidth * 0.8;

	document.querySelectorAll("area").forEach((area, i) => {
		area.coords = getAreaCoords(i);
	});
};

getFlatsData();

//When clicking the headers of table sorts the table based on that column
const tableHeaders = document.querySelectorAll("th");
tableHeaders.forEach((th) => {
	th.onclick = () => {
		let sortKey = th.dataset.sortkey;
		if (currentSortKey === sortKey) {
			sortDirection = sortDirection === "ASC" ? "DESC" : "ASC";
		} else {
			if (currentSortKey)
				tableHeaders[currentSortKey].querySelectorAll(".sortArrow").forEach((arrow) => {
					arrow.style.display = "none";
				});
			currentSortKey = sortKey;
			sortDirection = "ASC";
		}
		if (sortDirection === "ASC") {
			th.querySelector(".sortArrow.asc").style.display = "block";
			th.querySelector(".sortArrow.desc").style.display = "none";
		} else {
			th.querySelector(".sortArrow.asc").style.display = "none";
			th.querySelector(".sortArrow.desc").style.display = "block";
		}

		sortTable();
	};
});
