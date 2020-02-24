//Sets properties to make a modal visible
function openModal(modal) {
	modal.style.setProperty("display", "flex");
	document.querySelector("body").style.overflow = "hidden";
	modal.onclick = (event) => {
		if (event.target === modal) closeModal(modal);
	};
}

//Sets properties to make a modal invisible
function closeModal(modal) {
	modal.style.setProperty("display", "none");
	document.querySelector("body").style.overflow = "auto";
}

const modal = document.getElementById("gallery-modal");
const imageDiv = document.getElementById("gallery-modal-img");

//When clicking on an image in the gallery it opens up in a modal
for (let i = 1; i <= 12; i++) {
	const image = document.getElementById(`im${i}`);
	image.onclick = (event) => {
		if (window.innerWidth >= 767) {
			openModal(modal);
			imageDiv.style.setProperty(
				"background-image",
				window.getComputedStyle(event.target).backgroundImage
			);
		}
	};
}

const closeButton = document.getElementById("gallery-modal-close");
closeButton.onclick = () => closeModal(modal);
