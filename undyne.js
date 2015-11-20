$(document).ready( function(){

	var container = $('#container');
	var character = $('#character');
	var shield = $('#shield');
	var message = $('#message');
	var start = $('#start');
	var health = $('#health');
	var currentHealth = health.width();
	var score = $('#score');
	var currentScore = score.html();
	var scoreTable = $('#scoretable');
	var currentLevel = 1;
	
	var upKey = 38;
	var rightKey = 39;
	var downKey = 40;
	var leftKey = 37;
	var spaceBar = 32;

	var blocking = "up";
	var score = 0;
	
	message.hide();

	$.getJSON('scores.json', function(data) {
		var output="";
		for (var i in data) {
			output+="<tr>";
			output+="<td>" + data[i].player + "</td><td>" + data[i].level + "</td><td>" + data[i].score + "</td>";
			output+="</tr>";
		}
		scoreTable.append=output;
	});
	
	$(document).keydown(function( event ) {
		if ( event.which == upKey ) {
			event.preventDefault();
			shield.css({
				"top" : "200px",
				"left" : "230px",
				"height" : "25px",
				"width" : "40px"
			});

			blocking = "up";
		}

		else if ( event.which == rightKey ) {
			event.preventDefault();
			shield.css({
				"top" : "230px",
				"left" : "275px",
				"height" : "40px",
				"width" : "25px"
			});

			blocking = "right";
		}

		else if ( event.which == downKey ) {
			event.preventDefault();
			shield.css({
				"top" : "275px",
				"left" : "230px",
				"height" : "25px",
				"width" : "40px"
			});

			blocking = "down";
		}

		else if ( event.which == leftKey ) {
			event.preventDefault();
			shield.css({
				"top" : "230px",
				"left" : "200px",
				"height" : "40px",
				"width" : "25px"
			});

			blocking = "left";
		}
	});
	
	function showMessage(){
		
		message.html('<p>Level ' + currentLevel + '</p>');
		message.show();
		
		setTimeout(hideMessage, 2500);
	}

	function hideMessage(){
		message.hide();
	}

	function startLevel(level){

		var bulletCounter = 0;

		var bulletTimer = setInterval(shootBullet, 11000/(level * 3));

		function shootBullet(){
			
			var edge = Math.floor(Math.random() * 4) + 1;

			if ( edge == 1 ){
				$('<div id="topbullet">').appendTo( container ).animate({
					top:'160px'
				}, 18000/(level * 3), "linear", function() {

					this.remove();

					bulletCollision("up");
				});
			}

			else if ( edge == 2 ){
				$('<div id="rightbullet">').appendTo( container ).animate({
					left:'160px'
				}, 18000/(level * 3), "linear", function() {

					this.remove();

					bulletCollision("left");
				});
			}

			else if ( edge == 3 ){
				$('<div id="bottombullet">').appendTo( container ).animate({
					top:'280px'
				}, 18000/(level * 3), "linear", function() {

					this.remove();

					bulletCollision("down");
				});
			}

			else if ( edge == 4 ){
				$('<div id="leftbullet">').appendTo( container ).animate({
					left:'280px'
				}, 18000/(level * 3), "linear", function() {

					this.remove();

					bulletCollision("right");
				});
			}

			bulletCounter++;

			var levelAdjust = (level * 5) - 20;

			if(bulletCounter == levelAdjust){

				window.clearInterval(bulletTimer);

				currentLevel++;

				setTimeout(function() {
					start.click();
				}, 4000);
			}
		}

		function bulletCollision (direction) {

			currentHealth = health.width();
			currentScore = parseInt($('#score').html());

			if (blocking == direction) {
				$('#score').html(parseInt(currentScore + 100));
			}
			else {
				health.css({"width" : currentHealth - 30 + "px"});
			};

			if (currentHealth <= 0) {

				death();
				currentHealth = 1;
			};
		}

		function death(){

			console.log("called death();");

			var tag = prompt("GAME OVER\nYou reached level " + currentLevel + "\nYour final score was: " + currentScore + "\nEnter your initials:", "");

			var playerInfo = new Object();

			playerInfo.player = tag;
			playerInfo.level = currentLevel;
			playerInfo.score = currentScore;

			$.ajax
				({
					type: "GET",
					dataType : 'json',
					async: false,
					url: 'http://drupal.jdillman.com/score.php',
					data: { data: JSON.stringify(playerInfo) },
					success: function () { location.reload(); },
					failure: function() { $(body).append("Could not save score"); }
				});
		}
	}

	start.click(function(){

		var levelSetting = currentLevel + 5;
		
		showMessage();

		setTimeout(function() {
			startLevel(levelSetting);
		}, 2500);
	});
		
});