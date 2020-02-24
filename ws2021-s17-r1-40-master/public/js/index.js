console.log("CONNECTED");

//it does what it's named for
function makeActive(element){
    //remove class from old
    var old = document.querySelector(".active");
    if(old) old.classList.remove("active");
    //make the new active
    element.classList.add("active");
}
//make navbar link scrolling to correct position
document.querySelectorAll(".nav-item").forEach(function(element, index){
    element.onclick = function(){
        return false;
    }
    element.addEventListener("click", function(e){
        //find clicked element
        var target = e.target || e.srcElement;
        var href = target.getAttribute("href"); //we also need its href
        //make clicked element the active one
        makeActive(document.querySelector("[href='" + href +"']").parentElement);
        //scroll to clicked
        document.querySelector(href).scrollIntoView();
        //scroll a bit down due to fixed navbar
        window.scrollBy(0, -100);
    });
});
//scrollspy
//I made this scrollSpy so separated I had to organise into an object
var scrollSpy = {
    position: function(elem) { 
        var top = 0,
            height= elem.scrollHeight;
        do { 
            top += elem.offsetTop-elem.scrollTop; 
        } while ( elem = elem.offsetParent ); 
        return [ top, height ]; 
        //Actually I am guilty in copypasting this function. Sorry :c
    },
    contentPositions: function() {
        var sections = [];
        document.querySelectorAll(".nav-link").forEach(function(element, index) {
            //I need to know the href (or name) of every content section
            var href = element.getAttribute("href");
            //and both their scroll position and height
            var position = scrollSpy.position(document.querySelector(href));
            //order all the needed info into one object
            //wich I push into an array
            sections.push({href: href, pos: position[0], size: position[1]});
        });
        return sections;
    },
    scrollSpy: function(content, scroll){
        //every time I hit a section's position
        var i = 0;
        while(scroll >= content[i].pos && scroll <= scroll + content[i].size && i < content.length - 1 ) i++;
        if(i < content.length){
            //make the section href in navbar active
            makeActive(document.querySelector("[href='" + content[i].href + "']").parentElement);
        }
    },
    init: function(){
        var contents = scrollSpy.contentPositions();
        window.addEventListener("scroll", function (event) {
            var scroll = this.scrollY;
            scrollSpy.scrollSpy(contents, scroll);
        });
    }
};
//fill up gallery
var gallery = document.querySelector(".images");
for(var i = 1; i <= 12; i++){
    var num = i < 10 ? "0" + i : i;
    gallery.innerHTML += '<div class="col-12 col-md-3"><img src="public/img/shanghai_park_' + num +'.jpg" class="img-fluid p-2 image"></div>';
}
//Image modal in GALLERY
// Get the modal
var modal = document.getElementById("galleryModal");
//define the image inside modal
var modalImg = document.getElementById("modalImage");
//select the images have a sensitive soul for clicks
var images = document.querySelectorAll("img.image")
images.forEach(function(element, index){
    //each image should detect when we click
    element.addEventListener("click", function(){
        //pass the clicked image attrs into the model
        modal.style.display = "block";
        modalImg.src = this.src;
    });
});
// model close button
var span = document.getElementsByClassName("imgClose")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

//Send Message button actions
var form = document.querySelector("#contactForm form");
form.onsubmit = function(){
    //get Firstname
    var firstname = document.getElementsByName("firstName")[0].value;
    //display a short message
    var text = "<div><p>Dear " + firstname + "!</p><p>Thank you for your message. We will contact you as soon as possible.</p></div>"
    //form must disappear
    document.querySelector("#contactForm").innerHTML = text;
}

//react to clicks
var buttons = document.querySelectorAll(".zoom button");
buttons.forEach(function(element, index) {
    element.addEventListener("click", function(e){
        //so, we need a map
        var map = document.querySelector("#map img");
        var mapSrc = map.getAttribute("src");
        //there are 3 possible outcomes
        //when we press the + on middle case
        if(this.id === "plusBtn" && mapSrc.indexOf("-") == -1) {
            //zoom in completely
            map.src = "public/img/shanghai_park_map+.png";
            //show only - button
            document.getElementById("plusBtn").style.visibility = "hidden";
            console.log("its + case");
        } 
        //when we press the - button on middle case
        else if(this.id === "minusBtn" && mapSrc.indexOf("+") == -1) {
            //zoom out completely
            map.src = "public/img/shanghai_park_map-.png";
            //show only + button
            document.getElementById("minusBtn").style.visibility = "hidden";
            console.log("its - case");
        } else {
            console.log("its mid case");
            //middle case
            map.src = "public/img/shanghai_park_map.png";
            //show both buttons
            document.getElementById("plusBtn").style.visibility = "visible";
            document.getElementById("minusBtn").style.visibility = "visible";
        }
    });
});



//___Flat selection part___ yes, it is not working right nowgit
//render floorSelector
function renderFloors(flats) {
    var floors = document.getElementById("floorSelection"),
        length = Object.keys(flats).length
    //render
    for(var index in flats){
        //append
        floors.innerHTML += '<div class="floor" id="floor-' + (length-1 - index) + '"></div>';
        //check current element
        var current = document.querySelector("#floor-" + (length-1 - index));
        current.style.height = (100 / length) + "%";
        if(length-1-index == 0) {
            current.classList.add("active");
            document.querySelector("#floorDisplay").innerHTML = current.id;
            renderTable(flats[0]);
        }
    }
    //add event listeners to all
    document.querySelectorAll(".floor").forEach(function(element, index){
        element.addEventListener("click", function(e){
            //show selected floor as avtive one and unactivate the old
            document.querySelector(".floor.active").classList.remove("active");
            this.classList.add("active");
            //display the floor in text
            document.querySelector("#floorDisplay").innerHTML = this.id;
            //render the table of the selected floor
            var floor = this.id.slice(this.id.indexOf("-")+1, this.id.length);
            renderTable(flats[floor]);
        });
    });
}
//render the talbe with json's data
function renderTable(floor){
    var table = "";
    //var needed = [rooms, net_area, sales_area, price_eur];
    //define the table
    Object.keys(floor).map(function(objectKey, index) {
        var value = floor[objectKey];
        var row = "";
        row = row.concat("<tr>", 
            "<td>" + objectKey + "</td>",
            "<td>" + value.rooms + "</td>",
            "<td>" + value.net_area + " m<sup>2</sup></td>",
            "<td>" + value.sales_area + " m<sup>2</sup></td>",
            "<td>" + value.orientation + "</td>",
            "<td>" + value.price_eur + " €</td>",
        "</tr>");
        table += row;
    });
    //append the table's body
    document.querySelector("#flats tbody").innerHTML = table;
}


//load in
var first = true;
var flatsData;
var http = new XMLHttpRequest();
http.open( "GET", "public/data/shanghai_park_flats.json", true);
http.onreadystatechange = function () {
    if(http.readyState == 4 && http.status == 200) {
        flatsData = JSON.parse(http.responseText);
    }
}
http.send();
function firstClick(){
    if(first){
        first = false;
        renderFloors(flatsData);
    }
}
document.querySelector('[data-target="#flatSelection"]').addEventListener("click", firstClick);

window.onload = function(){
    scrollSpy.init();
}