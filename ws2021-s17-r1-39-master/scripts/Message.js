const formSubmit = document.getElementById("formSubmit");

//Handles message submitting
formSubmit.onclick = () => {
	const messageBox = document.getElementById("messageBox");
	messageBox.style.display = "block";
	const firstNameInput = document.getElementById("firstName");
	messageBox.innerText = `Dear ${firstNameInput.value}! Thank you for your message. We will contact you as soon as possible.`;
	document.getElementById("form").style.display = "none";
	document.getElementById("section5").style.height = "300px";
};
