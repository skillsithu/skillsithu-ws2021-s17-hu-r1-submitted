//Sets an items font and background color
const setStyles = (color, bgColor, item) => {
	item.style.setProperty("color", color);
	item.style.setProperty("background-color", bgColor);
};

//Sets items style to the white background / dark font color set
//If the web page is in mobile view the background has opacity of 0.8
const whiteBackground = (item) => {
	if (window.innerWidth >= 768) {
		setStyles("var(--sGrayDark)", "var(--sWhite)", item);
	} else {
		setStyles("var(--sGrayDark)", "rgba(255, 255, 255, 0.8)", item);
	}
};
//Sets items style to the green background / white font color set
const lightGreenBackground = (item) => setStyles("var(--sWhite)", "var(--sGreen)", item);
//Sets items style to the dark green background / white font color set
const darkGreenBackground = (item) => setStyles("var(--sWhite)", "var(--sGreenDark)", item);

//Puts event listeners on all anchors for hover and blur events
const anchors = document.querySelectorAll("a");
anchors.forEach((anchor) => {
	anchor.onmouseover = () => darkGreenBackground(anchor);
	anchor.onmouseout = () => whiteBackground(anchor);
});

let prevAnchor = null;

//Automatically detects scroll and sets the active anchor on the nav
const navCheck = (entries) => {
	entries.forEach((entry) => {
		const id = entry.target.id;
		const activeAnchor = document.querySelector(`[data-page=${id}]`);
		if (entry.isIntersecting) {
			if (prevAnchor != activeAnchor) {
				if (prevAnchor !== null) {
					whiteBackground(prevAnchor);
					prevAnchor.onmouseout = () => whiteBackground(event.target);
				}
				lightGreenBackground(activeAnchor);
				activeAnchor.onmouseout = () => lightGreenBackground(activeAnchor);
				prevAnchor = activeAnchor;
			}
		}
	});
};

const observer = new IntersectionObserver(navCheck, {
	threshold: 0.8,
	rootMargin: "90px 0px 0px 0px"
});

const sections = document.querySelectorAll("section");
sections.forEach((section) => {
	observer.observe(section);
});

//Makes hamburger menu button act as a toggle
document.getElementById("hamburgerButton").onclick = () => {
	if (window.innerWidth < 768) {
		const nav = document.querySelector("nav");
		if (nav.style.display !== "flex") {
			nav.style.display = "flex";
		} else {
			nav.style.display = "none";
		}
	}
};
