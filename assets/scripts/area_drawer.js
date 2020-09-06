"use strict"

function handle_drawing(radio_btn) {
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
	const width = canvas.width;
	console.log('successfully got canvas width');

	// get canvas height property
	console.log('getting canvas height');
	const height = canvas.height;
	console.log('successfully got canvas height');

	// get canvas context property
	console.log('getting canvas 2d context');
	let context = canvas.getContext('2d');
	console.log('successfully got canvas 2d context');

	console.log('defining used constants');
	// defining colour for lines and text
	const staff_colour = "#000000";
	// defining colour for selected area
	const area_colour = "#3399ff";
	// defining half-width-radius proportion
	const proportion = 0.75;
	// TODO: check operand types and if it occurs the integer division
	// defining constant pseudo-radius
	const radius = proportion * width / 2;

	// clear previous canvas
	context.clearRect(0, 0, width, height);

	// starting drawing
	// draw first part of area (quadrant)
	console.log('drawing area quadrant');
	draw_circle(context, width, height, radius, area_colour);
	console.log('quadrant has been drawn successfully');

	// draw second part of area (triangle)
	console.log('drawing triangle area');
	draw_triangle(context, width, height, radius, area_colour);
	console.log('triangle has been drawn successfully');

	// draw third (last) part of area (rectangle)
	console.log('drawing rectangle area');
	draw_rectangle(context, width, height, radius, area_colour);
	console.log('rectangle has been drawn successfully');

	// draw coordinate lines
	console.log('drawing coordinate lines')
	draw_lines(context, width, height, staff_colour);
	console.log('lines has been drawn successfully');

	// draw dashes and put numbers
	console.log('marking signed segments');
	draw_dashes(context, width, height, radius, staff_colour, radio_btn.value);
	console.log('marking has been successfully');

	/**
	 * Function draws coordinate lines
	 * at the center of canvas context
	 * with defined width and height
	 */
	function draw_lines(ctx, width, height, color) {
		// setting ctx (brush) properties
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 0.75;

		// creating lines
		ctx.fillRect(0, height / 2, width, 1);
		ctx.fillRect(width / 2, 0, 1, height);

		const arrow_width = 2;
		const arrow_height = 6;

		// creating vertical arrow
		ctx.beginPath();
		ctx.moveTo(width / 2 - 1.4 * arrow_width, arrow_height);
		ctx.lineTo(width / 2 + arrow_width / 4, 0);
		ctx.lineTo(width / 2 + 1.7 * arrow_width, 1.1 * arrow_height);
		ctx.stroke();

		// creating horizontal arrow
		ctx.beginPath();
		ctx.moveTo(width - arrow_height, height / 2 - 1.6 * arrow_width);
		ctx.lineTo(width, height / 2 + arrow_width / 4); 
		ctx.lineTo(width - arrow_height, height / 2 + 1.6 * arrow_width);
		ctx.stroke();

		const fontName = "Sans-serif";
		const textSize = width / 16;
		ctx.font = `${textSize}px ${fontName}`;

		// name vertical line
		ctx.fillText("y", width / 2 + width / 30, height / 30);

		// name horizontal line
		ctx.fillText("x", width - width / 30, height / 2 - height / 30);
	}

	/**
	 * Function draws quadrant with 
	 * certain radius that belongs to
	 * defined area due to it has
	 * another colour
	 */
	function draw_circle(ctx, width, height, radius, color) {
		// setting ctx (brush) properties
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 2;

		// creating quadrant path
		ctx.beginPath();
		// drawing arc using anticlockwise drawing
		// direction and radius at the center of canvas
		// but function uses clockwise reference direction!!! (WHY)
		ctx.arc(width / 2, height / 2, radius, -Math.PI / 2, -Math.PI, true);
		// draw another line to complete quadrant
		ctx.lineTo(width / 2, height / 2);
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
	function draw_triangle(ctx, width, height, radius, color) {
		// setting ctx (brush) properties
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 2;

		// creating triangle path
		ctx.beginPath();
		ctx.moveTo((width - radius) / 2, height / 2);
		ctx.lineTo(width / 2, height / 2);
		ctx.lineTo(width / 2, (height + radius) / 2);
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
	function draw_rectangle(ctx, width, height, radius, color) {
		// setting ctx (brush) properties
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 2;

		ctx.fillRect(width / 2, height / 2, radius / 2, radius);
	}

	/**
	 * 
	 *
	 */
	function draw_dashes(ctx, width, height, radius, color, max_value) {
		// setting ctx (brush) properties
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 1;

		const dashes_number = 5;
		const dash_length = radius / 15;
		for (let i = 0; i < dashes_number; ++i) {
			let xpos = (width / 2 - radius) + i * radius / 2; // x0 + i * dx
			let ypos = (height / 2 - radius) + i * radius / 2; // y0 + i * dy 
			let value = -max_value + i * max_value / 2;
			if (value == 0) continue;
			draw_vertical_dash(ctx, xpos, height / 2 - dash_length / 2, dash_length, color, value);
			draw_horizontal_dash(ctx, width / 2 - dash_length / 2, ypos, dash_length, color, -value);
		}
	}

	/**
	 * Function draws vertical signed dashes
	 * at certain (x; y) position with text above
	 */
	function draw_vertical_dash(ctx, x, y, length, color, sign) {
		// setting ctx (brush) properties
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 1;

		const fontName = "Sans-serif";
		const textSize = width / 18;
		ctx.font = `${textSize}px ${fontName}`;		

		ctx.fillRect(x, y, ctx.lineWidth, length);
		ctx.fillText(sign, x - 0.5 * length, y -  0.5 * length);
	}

	/**
	 * Function draws horizontal signed dashes
	 * at certain (x; y) position with text 
	 * on the right
	 */
	function draw_horizontal_dash(ctx, x, y, length, color, sign) {
		// setting ctx (brush) properties
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 1;

		const fontName = "Sans-serif";
		const textSize = width / 18;
		ctx.font = `${textSize}px ${fontName}`;

		ctx.fillRect(x, y, length, ctx.lineWidth);
		ctx.fillText(sign, x + 1.5 * length, y + 0.75 * length);
	}
}

// assign drawing on window loading with value that have checked already
console.log('Assigning drawing function to window loading');
window.onload = handle_drawing(document.getElementById("radius-changing__radio-btn--checked"));