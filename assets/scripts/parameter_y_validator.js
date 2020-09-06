"use strict"

function checkYParam(input) {
	console.log('Getting element value');
	let inputted = input.value;
	let y = parseFloat(inputted);
	console.log('The value [y = ' + y + '] successfully got');
	console.log('Checking on number identity');
	if (isNaN(y)) {
		console.log('Typed value is not a number');
		alert('Your typed value (изменение Y: ' + inputted + ') is not a number');
		return false;
	} else {
		console.log('Typed value parsed into number');
		if ((-5 < y)  && (y < -3)) {
			console.log('Good value');
			return true;
		} else {
			console.log('Wrong value');
			alert('Your typed Y parameter value (изменение Y: ' + inputted + ') doesn\'t match conditions: must be between -5 and -3 implicitly');
			return false;
		}
	}
	console.log('Successfully worked')
}

function validateForm() {
	console.log("Getting input element");
	let inputElement = document.getElementById("js-y-validation");
	if (inputElement !== null) {
		console.log("Successfully discovered input element");
		return checkYParam(inputElement);
	}
	console.log("Element for validation not found");
	return false;
}