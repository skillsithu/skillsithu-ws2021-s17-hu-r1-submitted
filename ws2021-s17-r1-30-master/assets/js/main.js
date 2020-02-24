var FLATS;
fetch( "assets/data/shanghai_park_flats.json" )
.then(response => response.json())
.then(json => { FLATS = json });

// Hamburger
document.querySelector( ".hamburger" ).addEventListener( "click", () => {
  document.querySelector( ".dropdown-menu" ).classList.toggle( "invisible" );
});

// Flats
function polygon( needle, haystack ) 
{
  let x = needle[0]; 
  let y = needle[1];
  let inside = false;

  for ( let i = 0, j = haystack.length - 1; i < haystack.length; j = i++) 
  {
      var xi = haystack[i][0], yi = haystack[i][1];
      var xj = haystack[j][0], yj = haystack[j][1];

      let intersecton = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersecton) inside = !inside;
  }

  return inside;
};

document.addEventListener("click", e => {
  let floors = {
    0: [[20,316],[20,359],[816,302],[816,329]],
    1: [[20,261],[20,305],[816,282],[816,300]],
    2: [[20,212],[20,259],[816,264],[816,280]],
    3: [[20,173],[20,209],[816,236],[816,259]],
    4: [[20,123],[20,169],[816,210],[816,233]],
    5: [[20,78],[20,119],[816,183],[816,208]],
    6: [[20,29],[20,76],[816,162],[816,180]],
    7: [[180,23],[180,41],[695,119],[695,134]]
  };
console.log(e);
  if (e.target.id == "floor-choosing" || e.target.id == "levelBlock")
  {
    Object.keys(floors).forEach(item => {
      if (polygon([e.layerX, e.layerY], floors[item]))
      {
        let level = item;
        let table = document.getElementById("flatTableBody");
        let counter = document.querySelector(".floor-counter-number");

        counter.innerText = level;
        
        let finalString = "<tr>";
        let floor = FLATS[level];
        
        Object.keys(floor).forEach(item => {
          finalString += "<td>"+item+"</td><td>"+floor[item].rooms+"</td><td>"+Math.round(floor[item].net_area)+"</td><td>"+Math.round(floor[item].sales_area)+"</td><td>"+floor[item].orientation+"</td>";
          if (floor[item].price_eur == null)
          {
            finalString += "<td>-</td>"
          }
          else
          {
            finalString += "<td>"+floor[item].price_eur+"</td>";
          }
          finalString += "</tr>";
        });
        
        table.innerHTML = finalString;
      }
    });
  }
});

document.addEventListener("mousemove", e => {
  let floors = {
    0: [[20,316],[20,359],[816,302],[816,329]],
    1: [[20,261],[20,305],[816,282],[816,300]],
    2: [[20,220],[20,259],[816,264],[816,280]],
    3: [[20,180],[20,219],[816,236],[816,259]],
    4: [[20,133],[20,179],[816,210],[816,233]],
    5: [[20,94],[20,130],[816,183],[816,208]],
    6: [[20,52],[20,86],[816,162],[816,180]],
    7: [[180,23],[180,41],[695,119],[695,134]]
  };

  if (e.target.id == "floor-choosing" || e.target.id == "levelBlock")
  {
    Object.keys(floors).forEach(item => {
      if (polygon([e.layerX, e.layerY], floors[item]))
      {
        let block = document.getElementById("levelBlock");
        block.style.display = "block";
        block.style.top = floors[item][0][1]+"px";
      }
    });
  }
});

// Flats
const modalCreator = () => {
  let body = document.getElementsByTagName("body")[0];

  let modal = document.createElement( "DIV" );
      modal.classList.add("modal");

  let modalContainer = document.createElement( "DIV" );
      modalContainer.classList.add("modal-container");
      modalContainer.classList.add("flex-modal");

  let image = document.createElement("IMG");
      image.src = "assets/images/shanghai_park_building.png";
      image.classList.add("modal-max-width");
      image.id = "floor-choosing";

  let tableContainer = document.createElement("DIV");
      tableContainer.classList.add("table-container");

  let table = document.createElement("TABLE");
      table.classList.add("table");
      table.innerHTML = '<thead><tr><th>Flat number</th><th>Rooms</th><th>Netto area (m<sup>2</sup>)</th><th>Brutto area (m<sup>2</sup>)</th><th>Orientation</th><th>Price (EUR)</th></tr></thead>';

  let times = document.createElement("I");
      times.classList.add("fas");
      times.classList.add("fa-times");
      times.addEventListener( "click", () => {
        body.style.overflowY = "scroll";
        body.classList.add("parallax");
        document.querySelector( ".modal" ).remove();
      });

  let levelBlock = document.createElement("DIV");
      levelBlock.classList.add("level-block");
      levelBlock.id = "levelBlock";

  let floorCounter = document.createElement("DIV");
      floorCounter.classList.add("floor-counter");
      floorCounter.innerHTML = "<p class='floor-counter-number'>0</p>"

  let finalString = "<tbody id='flatTableBody'><tr>";
  let floor = FLATS[0];
  
  Object.keys(floor).forEach(item => {
    finalString += "<td>"+item+"</td><td>"+floor[item].rooms+"</td><td>"+Math.round(floor[item].net_area)+"</td><td>"+Math.round(floor[item].sales_area)+"</td><td>"+floor[item].orientation+"</td>";
    if (floor[item].price_eur == null)
    {
      finalString += "<td>-</td>"
    }
    else
    {
      finalString += "<td>"+floor[item].price_eur+"</td>";
    }
    finalString += "</tr>";
  });
  finalString += "</tbody>";

  table.innerHTML += finalString;

  modalContainer.appendChild(image);
  tableContainer.appendChild(table);
  modalContainer.appendChild(tableContainer);
  modalContainer.appendChild(times);
  modalContainer.appendChild(levelBlock);
  modalContainer.appendChild(floorCounter);

  modal.appendChild(modalContainer);

  return modal;
}

document.querySelector(".flatButton").addEventListener("click", () => {
  let body = document.getElementsByTagName("body")[0];

  body.style.overflowY = "hidden";
  body.classList.remove("parallax");
  body.appendChild(modalCreator());
});

// Gallery
const lightboxCreator = src => {
  let body = document.getElementsByTagName("body")[0];

  let lightbox = document.createElement( "DIV" );
      lightbox.classList.add("modal");

  let lightboxContainer = document.createElement( "DIV" );
      lightboxContainer.classList.add("modal-container");

  let img = document.createElement("IMG");
      img.src = src;

  let times = document.createElement("I");
      times.classList.add("fas");
      times.classList.add("fa-times");
      times.addEventListener( "click", () => {
        body.style.overflowY = "scroll";
        body.classList.add("parallax");
        document.querySelector( ".modal" ).remove();
      });

  lightboxContainer.appendChild(img);
  lightboxContainer.appendChild(times);

  lightbox.appendChild(lightboxContainer);

  return lightbox;
}

document.querySelectorAll( ".galleryImage" ).forEach( item => {
    item.addEventListener( "click", element => {
      if ( window.innerWidth >= 768 )
      {
        let src = element.target.src;
        let body = document.getElementsByTagName("body")[0];

        body.style.overflowY = "hidden";
        body.classList.remove("parallax");
        body.appendChild(lightboxCreator(src));
      }
    })
});

// Contact
document.querySelector( ".messageButton" ).addEventListener( "click", element => {
  let error = false;
  let form = document.querySelector( '.contact-form' );

  let firstname = document.querySelector('input[name="firstname"]');
  let lastname = document.querySelector('input[name="lastname"]');
  let email = document.querySelector('input[name="email"]');
  let phone = document.querySelector('input[name="phone"]');
  let message = document.querySelector('input[name="message"]');

  if ( firstname.value.trim() == "" )
  {
    error = true;
    firstname.classList.add("error");
  }
  else
  {
    firstname.classList.remove("error");
  }

  //TODO: Server-side

  if ( !error )
  {
    form.innerHTML = "<p class='callback-message'>Dear "+escape( firstname.value )+"! Thank you for your message. We will contact you as soon as possible.</p>";
  }
});

const escape = string => {
  return string
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
};

// Map
class Map
{
  constructor()
  {
    this.zoomInButton = document.querySelector( '.map-zoom-in' );
    this.zoomOutButton = document.querySelector( '.map-zoom-out' );
    this.mapImage = document.querySelector( '.map-image' );

    this.zoomInButton.addEventListener( 'click', this.zoomIn.bind(this));
    this.zoomOutButton.addEventListener( 'click', this.zoomOut.bind(this));

    this.maps = [
      "assets/images/shanghai_park_map-.png",
      "assets/images/shanghai_park_map.png",
      "assets/images/shnaghai_park_map+.png"
    ];
    this.current = 1;
  }

  zoomIn()
  {
    if ( !this.zoomInButton.classList.contains( "disabled" ) && this.current+1 <= this.maps.length-1 )
    {
      this.current++;
      this.mapImage.src = this.maps[this.current];

      if ( this.current == this.maps.length-1 )
      {
        this.zoomInButton.classList.add("disabled");
      }

      this.zoomOutButton.classList.remove("disabled");
    }
  }

  zoomOut()
  {
    if ( !this.zoomOutButton.classList.contains("disabled") && this.current-1 >= 0 )
    {
      this.current--;
      this.mapImage.src = this.maps[this.current];

      if ( this.current == 0 )
      {
        this.zoomOutButton.classList.add("disabled");
      }

      this.zoomInButton.classList.remove("disabled");
    }
  }
}

new Map();