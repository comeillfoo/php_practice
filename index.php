<!DOCTYPE html>

<html lang="ru">
	<head>
		<meta http-equiv="Content-Type" content="text/html" charset="utf-8">
		<title>Точки на области | P3214 Ханнанов Ленар 2518</title>
		<!-- addition that included files like stylesheets or scripts -->
		<link rel="stylesheet" type="text/css" href="assets/stylesheets/main.css">
	</head>

	<body>
		<table>
			<!-- page title -->
			<caption>Попадание точек в область</caption>

			<thead>
				<!-- author's information -->
				<tr>
					<!-- surname -->
					<th>Фамилия</th>
					<td>Ханнанов</td>
				</tr>

				<tr>
					<!-- name -->
					<th>Имя</th>
					<td>Ленар</td>
				</tr>

				<tr>
					<!-- group -->
					<th>Группа</th>
					<td>P3214</td>
				</tr>

				<tr>
					<!-- variant -->
					<th>Вариант</th>
					<td>2518</td>
				</tr>

				<!-- task information -->
				<tr>
					<td>
						<canvas id="area" width="240px" height="240px"></canvas>
					</td>
				</tr>
			</thead>

			<tbody>
				<!-- input form -->
				<tr>
					<td>
						<form method="GET" action="<?=$_SERVER['REQUEST_URI']?>" onsubmit="return validateForm();">
							<!-- x parameter changing -->
							<fieldset title="Обязательно следует выбрать лишь одно значение X">
								Изменение X:<br>
								<label>-4<input type="radio" name="x-changing" value="-4" required></label>
								<label>-3<input type="radio" name="x-changing" value="-3"></label>
								<label>-2<input type="radio" name="x-changing" value="-2"></label>
								<label>-1<input type="radio" name="x-changing" value="-1"></label>
								<label>0<input type="radio" name="x-changing" value="0"></label>
								<label>1<input type="radio" name="x-changing" value="1"></label>
								<label>2<input type="radio" name="x-changing" value="2"></label>
								<label>3<input type="radio" name="x-changing" value="3"></label>
								<label>4<input type="radio" name="x-changing" value="4"></label>
							</fieldset>

							<!-- y parameter changing -->
							<fieldset title="Значение Y должно быть действительным число в интервале от -5 до -3 (десятичный разделитель &mdash; точка &lt;.&gt;)">
								Изменение Y:
								<input id="js-y-validation" type="text" name="y-changing" placeholder="Y&isin;(-5; -3)" required>
							</fieldset>

							<!-- radius changing -->
							<fieldset title="Обязательно следует выбрать лишь одно значение R">
								Изменение R:<br>
								<label>1<input id="radius-changing__radio-btn--checked" type="radio" name="radius-changing" onclick="handle_drawing(this);" value="1" required checked></label>
								<label>2<input type="radio" name="radius-changing" onclick="handle_drawing(this);" value="2"></label>
								<label>3<input type="radio" name="radius-changing" onclick="handle_drawing(this);" value="3"></label>
								<label>4<input type="radio" name="radius-changing" onclick="handle_drawing(this);" value="4"></label>
								<label>5<input type="radio" name="radius-changing" onclick="handle_drawing(this);" value="5"></label>
							</fieldset>

							<!-- submit parameters -->
							<fieldset>
								<input id="submit-btn" type="submit" name="check" value="check" title = "Кнопка отправки формы: следует нажать лишь при установке валидных параметров">
							</fieldset>
						</form>
					</td>
				</tr>
				<!-- table with results -->
				<tr>
					<td>
						<table>
							<thead>
								<tr>
									<th>Время создания</th><th>Время</th><th>X</th><th>Y</th><th>R</th><th>Результат</th>
								</tr>
							</thead>

							<tbody>
							<!-- loading previus results from session -->
							<?php if (isset($_SESSION['attempts']) && $_SESSION['attempts'].count() > 0): ?>
								<?php foreach ($_SESSION['attempts'] as $attempt): ?>
								<tr>
									<td><?= $attempt['timestamp'] ?></td>
									<td><?= $attempt['time'] ?></td>
									<td><?= $attempt['x'] ?></td>
									<td><?= $attempt['y'] ?></td>
									<td><?= $attempt['radius'] ?></td>
									<td><?= $attempt['result'] ?></td>
								</tr>
								<?php endforeach;?>
							<?php endif ?>

							<!-- culturating new value that came from GET method -->
							<?php
								if (session_status() == PHP_SESSION_NONE)
									session_start();
								$start = microtime();
								// getting certain timestamp of query sending
								$now = date("Y-m-d H:i:s", $_SERVER['REQUEST_TIME']);
								// values that x parameter can take
								$valid_x = ['-4', '-3', '-2', '-1', '0', '1', '2', '3', '4',];
								// values that radius can take
								$valid_radius = ['1', '2', '3', '4', '5',];
								// adores trailing commas
							?>
							<!-- checking if user use form not the typed parameters into URL-->
							<?php if (isset($_GET['check']) && $_GET['check'] === 'check'): ?>
								<?php if (isset($xURL = $_GET['x-changing']) && isset($valid_x[$xURL])): ?>
									<?php if (isset($radiusURL = $_GET['radius-changing']) && isset($valid_radius[$radiusURL])): ?>
										<?php if (isset($yURL = trim($_GET['y-changing']))): ?>
											<?php if (!(($y = doubleval($yURL)) == 0) && ($y + PHP_FLOAT_EPSILON < -3) && ($y - PHP_FLOAT_EPSILON > -5)): ?>
												<?php
													$x = doubleval($xURL);
													$radius = doubleval($radiusURL);
													// calculating dot hitting
													$hit = ($x <= 0 && $y - PHP_FLOAT_EPSILON >= 0 && $x * $x + $y * ($y + 2 * PHP_FLOAT_EPSILON) <= $radius * $radius) // checking quadrant hitting
													|| ($x <= 0 && $y <= PHP_FLOAT_EPSILON && $x + $y - PHP_FLOAT_EPSILON >= -$radius / 2) // checking triangle hittitng
													|| ($x >= 0 && $y <= PHP_FLOAT_EPSILON && $x <= $radius / 2 && $y - PHP_FLOAT_EPSILON >= -$radius); // checking rectangle hitting
													$finished = microtime() - $start;
													$_SESSION['attempts'][] = ['timestamp' => $now, 
														'time' => $finished, 
														'x' => $xURL, 
														'y' => $yURL, 
														'radius' => $radiusURL,
														'result' => $hit,
													];
												?>
												<tr>
													<td><?= $now ?></td>
													<td><?= $finished ?></td>
													<td><?= $xURL ?></td>
													<td><?= $yURL ?></td>
													<td><?= $radiusURL ?></td>
													<td><?= $hit? 'yes' : 'no' ?></td>
												</tr>
											<?php endif ?>
										<?php endif ?>
									<?php endif ?>
								<?php endif ?>
							<?php endif?>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- validation and drawing scripts at the bottom for best perfomance -->
		<script type="text/javascript" src="assets/scripts/parameter_y_validator.js"></script>
		<script type="text/javascript" src="assets/scripts/area_drawer.js"></script>
	</body>
</html>