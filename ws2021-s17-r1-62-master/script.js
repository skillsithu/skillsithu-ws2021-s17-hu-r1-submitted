// Open and close hamburger menu on mobile
document.getElementById("hamburger-menu").addEventListener("click", ()=>{
    let menu = document.getElementById("menu-items")
    if (menu.className.indexOf("open")!==-1){
        menu.className = menu.className.replace("open", "")
    } else {
        menu.className = menu.className + " open"
    }
})

// Close hamburger menu when an item is selected
Array.from(document.getElementsByClassName("menu-item")).forEach(el=>{
    el.addEventListener("click", ()=>{
        let menu = document.getElementById("menu-items")
        menu.className = menu.className.replace("open", "")
    })
})

// Gallery image click: load the clicked image into the modal
Array.from(document.getElementById("gallery-images").children).forEach(el=>{
    el.addEventListener("click", ()=>{
        document.getElementById("gallery-modal-img").src = el.children[0].src
    })
})

// Contact form submit
document.getElementById("contact-form").addEventListener("submit", (e)=>{
    e.preventDefault()
    e.target.style.display = "none"
    document.getElementById("contact-success").style.display = "block"
    document.getElementById("contact-success-first-name").innerHTML = document.getElementById("first-name").value
})

// Map zoom
// mapSize:
//  0: zoom in, 1: initial, 2: zoom out
let mapSize = 1
let mapImg = document.getElementById("map-img")
let plusButton = document.getElementById("map-plus")
let minusButton = document.getElementById("map-minus")

plusButton.addEventListener("click", ()=>{
    if (mapSize==1){
        mapImg.src = "images/shnaghai_park_map+.png"
        mapSize--
        plusButton.className += " disabled"
    } else if (mapSize==2){
        mapImg.src = "images/shanghai_park_map.png"
        mapSize--
        minusButton.className = minusButton.className.replace("disabled", "")
    }
})

minusButton.addEventListener("click", ()=>{
    if (mapSize==1){
        mapImg.src = "images/shanghai_park_map-.png"
        mapSize++
        minusButton.className += " disabled"
    } else if (mapSize==0){
        mapImg.src = "images/shanghai_park_map.png"
        mapSize++
        plusButton.className = plusButton.className.replace("disabled", "")
    }
})


// Flat selector
let flatsTable = document.getElementById("flats-table")
let selectedLevel = 0

// Fetch all flats
fetch("assets/shanghai_park_flats.json").then(response=>{
    response.json().then(json=>{
        // Map hover effect to and handle clicks on the building image
        Array.from(document.getElementsByClassName("building-level")).forEach(el=>{
            el.addEventListener("mouseover", (e)=>{
                let level = Number(e.target.id.replace("level_", ""))
                document.getElementById("level-indicator").innerHTML = (level===0) ? "Ground Floor" : "Floor " + level
            })
            el.addEventListener("mouseleave", ()=>{
                document.getElementById("level-indicator").innerHTML = (selectedLevel===0) ? "Ground Floor" : "Floor " + selectedLevel
            })
            el.addEventListener("click", (e)=>{
                let level = Number(e.target.id.replace("level_", ""))
                selectedLevel = level
                document.getElementById("selected-level").innerHTML = (selectedLevel===0) ? "Ground Floor" : "Floor " + selectedLevel
                updateFlatsTable(json, level)
            })
        })
        // Load Floor 0 initially
        updateFlatsTable(json, 0)
        
    })
})

// Creates the flats table given the data and the level
const updateFlatsTable = (flats, level)=>{
    // Clear table
    flatsTable.innerHTML = ""
    // Map flats on the specified level
    Object.keys(flats[level]).map(flatNo=>{
        let flat = flats[level][flatNo]
        flat.flatNo = flatNo
        // Insert row
        let row = flatsTable.insertRow(0)
        // Insert cells
        let fields = ["flatNo", "rooms", "net_area", "sales_area", "orientation", "price_eur"]
        fields.map((field, index)=>{
            let cell = row.insertCell(index)
            cell.innerHTML = flat[field]
        })
    })
}


// Menu handler
// Get all menuitem's absolute Y position
let menuItemAnchorIds = ["house", "flats", "environment", "gallery", "contact", "map"]
let menuItemPositions = menuItemAnchorIds.map(id=>{
    return window.scrollY + document.getElementById(id).getBoundingClientRect().top
})

window.addEventListener("scroll", e=>{
    // Get current scroll postion
    let scroll = this.scrollY
    // Get how many item's absolute Y position are smaller than the current scroll value
    // This value is the menu item's index the user is currently at
    let menuItemNumber = Math.min(menuItemPositions.filter(val=>val<scroll).length, menuItemAnchorIds.length-1)
    // Change the active menu item
    let activeElement = document.getElementsByClassName("active")[0]
    activeElement.className = activeElement.className.replace("active", "")
    document.getElementsByClassName("menu-item")[menuItemNumber].className += " active"
})