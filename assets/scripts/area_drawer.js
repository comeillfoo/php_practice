"use strict"

/**
 * Function gets GET-parameter by
 * its name from URL
 */
function getGETParameter(name) {
	let url_string = window.location.href;
	let url = new URL(url_string);
	let param = url.searchParams.get(name);
	url = null; // maybe memory optimization
	return param;
}

/**
 * Function checks if URL has 'check'
 * GET-parameter so form was used to
 * send x, y and radius parameters too
 */
function issetCorrectGET() {
	const keyword = "check";
	return getGETParameter(keyword) === keyword;
}

function handle_drawing(radio_btn, max_radius=5, min_radius=1, area_colour = "#3399ff") {
	// get radius value
	const realRadius = issetCorrectGET()? getGETParameter('radius') : radio_btn.value;
	const newRealRadius = (max_radius - realRadius + min_radius);
	// get canvas
	console.log('looking for drawing area');
	const canvas = document.getElementById('area');
	console.log('requested area was found');

	// check if canvas is available
	console.log('check if we can draw on the canvas');
	if (!(canvas && canvas.getContext)) {
		console.log('the canvas can\'t be modified');
		return;
	}
	console.log('the canvas is suitable for drawing');

	// get canvas width property
	console.log('getting canvas width');
	const width = realRadius * canvas.width / max_radius;
	console.log('successfully got canvas width');

	// get canvas height property
	console.log('getting canvas height');
	const height = realRadius * canvas.height / max_radius;
	console.log('successfully got canvas height');

	// get canvas context property
	console.log('getting canvas 2d context');
	let context = canvas.getContext('2d');
	console.log('successfully got canvas 2d context');

	console.log('defining used constants');
	// defining colour for lines and text
	const staff_colour = "#000000";
	// defining half-width-radius proportion
	const proportion = 0.85;
	// TODO: check operand types and if it occurs the integer division
	// defining constant pseudo-radius
	const radius = proportion * width / 2;

	// clear previous canvas
	context.clearRect(0, 0, canvas.width, canvas.height);

	const xshift = (canvas.width - width) / 2;
	const yshift = (canvas.height - height) / 2;
	// starting drawing
	// draw first part of area (quadrant)
	console.log('drawing area quadrant');
	draw_circle(context, width, height, radius, area_colour, xshift, yshift);
	console.log('quadrant has been drawn successfully');

	// draw second part of area (triangle)
	console.log('drawing triangle area');
	draw_triangle(context, width, height, radius, area_colour, xshift, yshift);
	console.log('triangle has been drawn successfully');

	// draw third (last) part of area (rectangle)
	console.log('drawing rectangle area');
	draw_rectangle(context, width, height, radius, area_colour, xshift, yshift);
	console.log('rectangle has been drawn successfully');

	// draw coordinate lines
	console.log('drawing coordinate lines')
	draw_lines(context, canvas.width, canvas.height, staff_colour, 0, 0);
	console.log('lines has been drawn successfully');

	// draw dashes and put numbers
	console.log('marking signed segments');
	draw_dashes(context, canvas.width, canvas.height, radius, staff_colour, realRadius, 0, 0);
	console.log('marking has been successfully');

	console.log('check if URL has GET-parameters and form\'s been used');
	if (issetCorrectGET()) {
		console.log('form\'s been used --- getting parameters');
		let xGET = getGETParameter("x");
		let yGET = getGETParameter("y");
		let radiusGET = getGETParameter("radius");
		putDot(context, xshift + width / 2 + xGET * radius / realRadius, yshift + height / 2 - yGET * radius / realRadius, canvas.width / 80, staff_colour);
	} else console.log('form has not been used to send parameters or they are absent');
	console.log('drawing finished');
	/**
	 * Function draws coordinate lines
	 * at the center of canvas context
	 * with defined width and height
	 */
	function draw_lines(ctx, width, height, color, xshift, yshift) {
		// setting ctx (brush) properties
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 0.75;

		// creating lines
		ctx.fillRect(xshift, yshift + height / 2, width, 1);
		ctx.fillRect(xshift + width / 2, yshift, 1, height);

		const arrow_width = 2;
		const arrow_height = 6;

		// creating vertical arrow
		ctx.beginPath();
		ctx.moveTo(xshift + width / 2 - 1.4 * arrow_width, yshift + arrow_height);
		ctx.lineTo(xshift + width / 2 + arrow_width / 4, yshift);
		ctx.lineTo(xshift + width / 2 + 1.7 * arrow_width, yshift + 1.1 * arrow_height);
		ctx.stroke();

		// creating horizontal arrow
		ctx.beginPath();
		ctx.moveTo(xshift + width - arrow_height, yshift + height / 2 - 1.6 * arrow_width);
		ctx.lineTo(xshift + width, yshift + height / 2 + arrow_width / 4); 
		ctx.lineTo(xshift + width - arrow_height, yshift + height / 2 + 1.6 * arrow_width);
		ctx.stroke();

		const fontName = "Sans-serif";
		const textSize = width / 30;
		ctx.font = `${textSize}px ${fontName}`;

		// name vertical line
		ctx.fillText("y", xshift + width / 2 + width / 30, yshift + height / 50);

		// name horizontal line
		ctx.fillText("x", xshift + width - width / 50, yshift + height / 2 - height / 30);
	}

	/**
	 * Function draws quadrant with 
	 * certain radius that belongs to
	 * defined area due to it has
	 * another colour
	 */
	function draw_circle(ctx, width, height, radius, color, xshift, yshift) {
		// setting ctx (brush) properties
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 2;

		// creating quadrant path
		ctx.beginPath();
		// drawing arc using anticlockwise drawing
		// direction and radius at the center of canvas
		// but function uses clockwise reference direction!!! (WHY)
		ctx.arc(xshift + width / 2, yshift + height / 2, radius, -Math.PI / 2, -Math.PI, true);
		// draw another line to complete quadrant
		ctx.lineTo(xshift + width / 2, yshift + height / 2);
		// uncomment next line if area hasn't full appearance
		// ctx.lineTo(300 / 2, 300 / 2 - 100);
		// magic cause of closePath function
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}

	/**
	 * Function draws triangle area
	 */
	function draw_triangle(ctx, width, height, radius, color, xshift, yshift) {
		// setting ctx (brush) properties
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 2;

		// creating triangle path
		ctx.beginPath();
		ctx.moveTo(xshift + (width - radius) / 2, yshift + height / 2);
		ctx.lineTo(xshift + width / 2, yshift + height / 2);
		ctx.lineTo(xshift + width / 2, yshift + (height + radius) / 2);
		// uncomment next line if area hasn't full appearance
		// ctx.lineTo((width - radius) / 2, height / 2);
		// magic cause of closePath function
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}

	/**
	 * Function draws the rectangle area
	 * with R height and R/2 width
	 */
	function draw_rectangle(ctx, width, height, radius, color, xshift, yshift) {
		// setting ctx (brush) properties
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 2;

		ctx.fillRect(xshift + width / 2, yshift + height / 2, radius / 2, radius);
	}

	/**
	 * Function makes dashes on coordinate
	 * lines on canvas use appropriately
	 * subfunctions for vertical and horizontal 
	 */
	function draw_dashes(ctx, width, height, radius, color, max_value, xshift, yshift) {
		// setting ctx (brush) properties
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 1;

		const dashes_number = 5;
		const dash_length = 0.9 * width / 40;
		for (let i = 0; i < dashes_number; ++i) {
			let xpos = xshift + (width / 2 - radius) + i * 2 * radius / (dashes_number - 1); // x0 + i * dx
			let ypos = yshift + (height / 2 - radius) + i * 2 * radius / (dashes_number - 1); // y0 + i * dy 
			let value = -max_value + i * 2 * max_value / (dashes_number - 1);
			if (value == 0) continue;
			draw_vertical_dash(ctx, xpos, yshift + height / 2 - dash_length / 2, dash_length, color, value, width);
			draw_horizontal_dash(ctx, xshift + width / 2 - dash_length / 2, ypos, dash_length, color, -value, width);
		}
	}

	/**
	 * Function draws vertical signed dashes
	 * at certain (x; y) position with text above
	 */
	function draw_vertical_dash(ctx, x, y, length, color, sign, width) {
		// setting ctx (brush) properties
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 1;

		const fontName = "Sans-serif";
		const textSize = width / 40;
		ctx.font = `${textSize}px ${fontName}`;		

		ctx.fillRect(x, y, ctx.lineWidth, length);
		ctx.fillText(sign, x - 0.5 * length, y -  0.5 * length);
	}

	/**
	 * Function draws horizontal signed dashes
	 * at certain (x; y) position with text 
	 * on the right
	 */
	function draw_horizontal_dash(ctx, x, y, length, color, sign, width) {
		// setting ctx (brush) properties
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 1;

		const fontName = "Sans-serif";
		const textSize = width / 40;
		ctx.font = `${textSize}px ${fontName}`;

		ctx.fillRect(x, y, length, ctx.lineWidth);
		ctx.fillText(sign, x + 1.5 * length, y - 0.25 * length);
	}

	/**
	 * Function puts dots on context with
	 * given parameters
	 */
	function putDot(ctx, x, y, diameter, color) {
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.arc(x, y, diameter / 2, 0, 2 * Math.PI, true);
		ctx.closePath();
		ctx.fill();
	}
}

// assign drawing on window loading with value that have checked already
console.log('Assigning drawing function to window loading');
window.onload = handle_drawing(document.getElementById("radius-changing__radio-btn--checked"));