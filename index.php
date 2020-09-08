<!-- need to be resumed or started for first time -->
<?php 
	if (session_status() == PHP_SESSION_NONE)
		session_start();
?>
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
			<caption><a href="index.php">Точки на области | Dots among the Area</a></caption>

			<thead>
				<!-- author's information -->
				<tr>
					<!-- task information -->
					<td rowspan="4" colspan="1">
						<canvas id="area" width="460px" height="460px"></canvas>
					</td>
					<!-- surname -->
					<th class="header__field header__field--title">Фамилия | Surname</th>
					<td class="header__field header__field--filled">Ханнанов</td>
				</tr>

				<tr>
					<!-- name -->
					<th class="header__field header__field--title">Имя | Name</th>
					<td class="header__field header__field--filled">Ленар</td>
				</tr>

				<tr>
					<!-- group -->
					<th class="header__field header__field--title">Группа | Group</th>
					<td class="header__field header__field--filled">P3214</td>
				</tr>

				<tr>
					<!-- variant -->
					<th class="header__field header__field--title">Вариант | Variant</th>
					<td class="header__field header__field--filled">2518</td>
				</tr>
			</thead>

			<tbody>
				<!-- input form -->
				<tr class="sending-form">
					<td colspan="3">
						<form method="GET" action="<?=explode('?', $_SERVER['REQUEST_URI'], 2)[0];?>" onsubmit="return validateForm();">
							<!-- x parameter changing -->
							<fieldset class="col1-3" title="Обязательно следует выбрать лишь одно значение X">
								Изменение X<br>
								<label>-4<input type="radio" name="x" value="-4" required></label>
								<label>-1<input type="radio" name="x" value="-1"></label>
								<label>&nbsp;2<input type="radio" name="x" value="2"></label><br>
								<label>-3<input type="radio" name="x" value="-3"></label>
								<label>&nbsp;0<input type="radio" name="x" value="0"></label>
								<label>&nbsp;3<input type="radio" name="x" value="3"></label>
								<br>
								<label>-2<input type="radio" name="x" value="-2"></label>
								<label>&nbsp;1<input type="radio" name="x" value="1"></label>
								<label>&nbsp;4<input type="radio" name="x" value="4"></label>
							</fieldset><!-- y parameter changing 
							--><fieldset class="col1-3" title="Значение Y должно быть действительным число в интервале от -5 до -3 (десятичный разделитель &mdash; точка &lt;.&gt;)">
								Изменение Y<br>
								<input id="js-y-validation" type="text" name="y" placeholder="Y&isin;(-5; -3)" required>
							</fieldset><!-- radius changing
							--><fieldset class="col1-3" title="Обязательно следует выбрать лишь одно значение R">
								Изменение R<br>
								<label>1<input id="radius-changing__radio-btn--checked" type="radio" name="radius" onclick="handle_drawing(this, 5, 1, area_colour='#3399FF');" value="1" required checked></label>
								<label>2<input type="radio" name="radius" onclick="handle_drawing(this, 5, 1, area_colour='#3098F2');" value="2"></label>
								<label>3<input type="radio" name="radius" onclick="handle_drawing(this, 5, 1, area_colour='#79C4F2');" value="3"></label>
								<label>4<input type="radio" name="radius" onclick="handle_drawing(this, 5, 1, area_colour='#79BAF2');" value="4"></label>
								<label>5<input type="radio" name="radius" onclick="handle_drawing(this, 5, 1, area_colour='#30A8F2');" value="5"></label>
							</fieldset><!-- submit parameters 
							--><fieldset class="field__submitting">
								<input id="submit-btn" type="submit" name="check" value="check" title = "Кнопка отправки формы: следует нажать лишь при установке валидных параметров">
							</fieldset>
						</form>
					</td>
				</tr>
				<!-- table with results -->
				<tr>
					<td colspan="3">
						<table class="resulting-table">
							<thead>
								<tr>
									<th>Время создания</th><th>Время, нс</th><th>X</th><th>Y</th><th>R</th><th>Результат [yes/no]</th>
								</tr>
							</thead>

							<tbody>
							<!-- loading previus results from session -->
							<?php if (isset($_SESSION['attempts']) && count($_SESSION['attempts']) > 0): ?>
								<?php foreach ($_SESSION['attempts'] as $attempt): ?>
								<tr>
									<td><?=$attempt['timestamp']?></td>
									<td><?=$attempt['time']?></td>
									<td><?=$attempt['x']?></td>
									<td><?=$attempt['y']?></td>
									<td><?=$attempt['radius']?></td>
									<td><?=$attempt['result']? 'yes' : 'no'?></td>
								</tr>
								<?php endforeach ?>
							<?php endif ?>

							<!-- culturating new value that came from GET method -->
							<?php
								// just because of fucking PHP 5
								$start = microtime(true) * 1e9; // $start = hrtime(true) * 1000;
								// getting certain timestamp of query sending
								$now = date('Y-m-d H:i:s', $_SERVER['REQUEST_TIME']);
								// values that x parameter can take
								$valid_x = ['-4', '-3', '-2', '-1', '0', '1', '2', '3', '4',];
								// values that radius can take
								$valid_radius = ['1', '2', '3', '4', '5',];
								// adores trailing commas
                				$xURL = $_GET['x'];
                				$radiusURL = $_GET['radius'];
                				$yURL = trim($_GET['y']);

                				// defining EPSILON constant exactly for PHP5
                				if (startsWith(phpversion(), '5'))
                					define('PHP_FLOAT_EPSILON', 0.000001);
							?>
							<!-- checking if user use form not the typed parameters into URL-->
							<?php if (isset($_GET['check']) && $_GET['check'] === 'check'): ?>
								<?php if (isset($xURL) && in_array($xURL, $valid_x, true)): ?>
									<?php if (isset($radiusURL) && in_array($radiusURL, $valid_radius, true)): ?>
										<?php if (isset($yURL)): ?>
											<?php if (!(($y = doubleval($yURL)) == 0) && ($y + PHP_FLOAT_EPSILON < -3) && ($y - PHP_FLOAT_EPSILON > -5)): ?>
												<?php
													$x = doubleval($xURL);
													$radius = doubleval($radiusURL);
													// calculating dot hitting
													$hit = ($x <= 0 && $y - PHP_FLOAT_EPSILON >= 0 && $x * $x + $y * ($y + 2 * PHP_FLOAT_EPSILON) <= $radius * $radius) || ($x <= 0 && $y <= PHP_FLOAT_EPSILON && $x + $y - PHP_FLOAT_EPSILON >= -$radius / 2) || ($x >= 0 && $y <= PHP_FLOAT_EPSILON && $x <= $radius / 2 && $y - PHP_FLOAT_EPSILON >= -$radius);
													// just because of fucking PHP 5
													$finished = microtime(true) * 1e9 - $start; // $finished = hrtime(true) * 1000 - $start;
                          							$_SESSION['attempts'][] = array('timestamp' => $now, 'time' => $finished, 'x' => $xURL, 'y' => $yURL, 'radius' => $radiusURL, 'result' => $hit);
												?>
												<tr>
													<td><?=$now ?></td>
													<td><?=$finished ?></td>
													<td><?=$xURL ?></td>
													<td><?=$yURL ?></td>
													<td><?=$radiusURL ?></td>
													<td><?=$hit? 'yes' : 'no' ?></td>
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
		<script type="text/javascript" src="assets/scripts/parameter_y_validator.js" async></script>
		<script type="text/javascript" src="assets/scripts/area_drawer.js" async></script>
	</body>
</html>
