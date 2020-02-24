/*  */
/* PAGE ONLOAD */
/*  */

function onLoad() {
  loadPhotos();
  var contactForm = document.getElementById("contact-form");
  var ths = document.querySelectorAll("#flats-table th");
  function handleForm(event) {
    event.preventDefault();
  }
  contactForm.addEventListener("submit", handleForm);
  ths.forEach(element => {
    element.addEventListener("click", () => {
      FlatsToTable(
        element.getAttribute("data-columndef"),
        element.getAttribute("data-type")
      );
    });
  });
  var hover_placeholder = document.querySelector("#hover-placeholder");
  hover_placeholder.addEventListener("mouseenter", () => {
    document.querySelector(
      ".floor-block-container.active"
    ).style.backgroundColor = "#5dd782";
  });
  hover_placeholder.addEventListener("mouseleave", () => {
    document.querySelector(
      ".floor-block-container.active"
    ).style.backgroundColor = "unset";
  });

  drawFloorCells();
  loadFlats();
}

/*  */
/* FLATS TABLE */
/*  */

var selectedFloor;
var selectedFlats;
var Flats;

// Loading data
function loadFlats() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      Flats = JSON.parse(xhttp.responseText);

      setSelectedFloor(0);
      FlatsToTable();
    }
  };
  xhttp.open("GET", "media_files/data/shanghai_park_flats.json", true);
  xhttp.send();
}

// Data to table
function FlatsToTable(orderby, type) {
  if (orderby == null) orderby = "number";
  if (type == null) type = "string";
  source = Flats[selectedFloor.toString()];
  var selectedFlats = [];
  for (var item in source) {
    source[item].number = item.toString();
    selectedFlats.push(source[item]);
  }
  selectedFlats.sort((a, b) => compare(a, b, orderby, type));
  var table = document.getElementById("flats-table");
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
  for (var i in selectedFlats) {
    var price = selectedFlats[i].price_eur;
    var tableRef = document
      .getElementById("flats-table")
      .getElementsByTagName("tbody")[0];
    var row = tableRef.insertRow(i);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);

    cell1.innerHTML = selectedFlats[i].number.toString();
    cell2.innerHTML = selectedFlats[i].rooms;
    cell3.innerHTML = parseFloat(selectedFlats[i].net_area);
    cell4.innerHTML = parseFloat(selectedFlats[i].sales_area);
    cell5.innerHTML = selectedFlats[i].orientation;
    cell6.innerHTML = price ? parseInt(price) : "-";

    addClassTo(cell2, "text-right");
    addClassTo(cell3, "text-right");
    addClassTo(cell4, "text-right");
    addClassTo(cell5, "text-right");
    addClassTo(cell6, "text-right");
  }
}

// Cell drawing
function drawFloorCells() {
  var panelel = document.getElementById("floor-select-panel");

  for (let i = 7; i >= 0; i--) {
    var parentel = document.createElement("div");
    parentel.classList.add(
      "w-100",
      "d-flex",
      "flex-1",
      "floor-block-container"
    );

    var floorBlock = document.createElement("span");
    floorBlock.innerHTML = i;
    floorBlock.classList.add("m-auto", "floor-block");
    floorBlock.setAttribute("id", "floor-block-" + i);
    parentel.setAttribute("id", "floor-block-container-" + i);
    parentel.onclick = function() {
      setSelectedFloor(i);
      FlatsToTable();
    };
    parentel.appendChild(floorBlock);
    panelel.appendChild(parentel);
  }
}

// Floor selection
function setSelectedFloor(i) {
  // Revoke active status of previous selected floor block
  if (selectedFloor != null)
    document
      .getElementById("floor-block-container-" + selectedFloor)
      .classList.remove("active");

  selectedFloor = i;
  document.getElementById("active-floor").innerHTML = selectedFloor;
  // Grant active status to the newly selected floor block
  document
    .getElementById("floor-block-container-" + selectedFloor)
    .classList.add("active");
}

// Comparing table elements by column property
function compare(a, b, column, type) {
  var left = type == "string" ? a[column] : Number(a[column]);
  var right = type == "string" ? b[column] : Number(b[column]);
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

/*  */
/* GALLERY */
/*  */

var dir = "media_files/images/";
var photo_prefix = "shanghai_park_";
function loadPhotos() {
  var row = document.getElementById("gal-row");

  for (let i = 1; i <= 12; i++) {
    // Parent elements
    var col = document.createElement("div");
    col.classList.add("col-12", "col-md-3", "gal-col", "py-1");
    row.appendChild(col);

    // Photo element
    var photo = document.createElement("div");
    photo.classList.add("gal-photo", "rounded");
    photo.setAttribute("data-target", "#photo-modal");
    photo.setAttribute("id", i);
    photo.setAttribute("data-toggle", "modal");
    var pathString =
      dir +
      photo_prefix +
      (i.toString().length == 1 ? "0" : "") +
      i.toString() +
      ".jpg";
    photo.setAttribute("photo-pathstring", pathString);

    // Click listener of photo element
    photo.addEventListener("click", function() {
      document.getElementById("bigger-photo").src = this.getAttribute(
        "photo-pathstring"
      );
    });
    photo.style.backgroundImage = "url" + "('" + pathString + "')";

    col.appendChild(photo);
  }
}

/* CONTACT MESSAGE */
function sendMessage() {
  var firstname = document.getElementById("con-firstname").value;
  document.getElementById("response-message").innerHTML =
    "Dear " +
    firstname +
    "!</br>" +
    "Thank you for your message. We will contact you as soon as possible.";

  document.getElementById("contact-form-group").style.visibility = "hidden";
  document.getElementById("response-message").style.display = "block";
  return false;
}

/*  */
/* MAP ZOOM */
/*  */

// State of zoom: 1:In 0:Default -1:Out
var zoomState = 0;
function zoomMapIn() {
  if (zoomState < 1) zoomState++;
  checkZoomState();
}
function zoomMapOut() {
  if (zoomState > -1) zoomState--;
  checkZoomState();
}
function checkZoomState() {
  var dir = "media_files/images/";
  var zoomin = document.getElementById("zoom-in");
  var zoomout = document.getElementById("zoom-out");
  var image = document.getElementById("map-image");
  switch (zoomState) {
    case 1: {
      image.src = dir + "shanghai_park_map+.png";
      zoomin.classList.add("disabled");
      break;
    }
    case 0: {
      image.src = dir + "shanghai_park_map.png";
      zoomin.classList.remove("disabled");
      zoomout.classList.remove("disabled");
      break;
    }
    case -1: {
      image.src = dir + "shanghai_park_map-.png";
      zoomout.classList.add("disabled");
      break;
    }
  }
}

/*  */
/* COMMON */
/*  */

// Class addition
function addClassTo(el, classlist) {
  el.classList.add(classlist);
}
