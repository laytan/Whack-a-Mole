		//Amount of clicks on moles
		var score = 0;

		//Populated by generateboard with the board
        var places = [];

		//Interval to update time every second
		var timeInterval;
		//Interval that spawns moles
		var gameLoop;

		//Is the game in progress or done?
		var spawnMoles = false;

		//Time the game runs for
		var maxTime = 10;

		//== maxTime at the start of the game, so we know how long this game lasts
		var timeLeft;

		//Changed in ui, possibilities: easy, normal, hard, insane
		var difficulty;
		//Changed according to difficulty settings
		var grootte;
		var fadeTime;
		var stayDuration;
		var moleInterval;

//Call start when loaded
window.onload = Start();

        function Start()
        {
			SetDifficulty();
			GenerateBoard();
			HideAll();

			//Makes moles spawnable
			spawnMoles = true;
			//Run UpdateTime every second / 1000Milliseconds
			timeInterval = setInterval(function() {UpdateTime()}, 1000);
			//Main loop to make moles appear and dissappear
            WaitAndShowRandomMole();
        }

		function SetDifficulty()
		{
			// Set timeLeft to the maxTime for this game so we can do calculations with it
			timeLeft = maxTime;

			/*Get difficulty cheched on other page and
			switch trough checked difficulty and change variables according to it */
			switch(localStorage.getItem("difficulty")) 
			{
				case "easy":
					difficulty = "easy";
					grootte = 3;
					fadeTime = 1000;
					stayDuration = 3000;
					moleInterval = 3000;
				break;
				case "normal":
					difficulty = "normal";
					grootte = 4;
					fadeTime = 500;
					stayDuration = 2000;
					moleInterval = 2000;
				break;
				case "hard":
					difficulty = "hard";
					grootte = 5;
					fadeTime = 300;
					stayDuration = 1000;
					moleInterval = 1500;
				break;
				case "insane":
					difficulty = "insane";
					grootte = 5;
					fadeTime = 100;
					stayDuration = 500;
					moleInterval = 1000;
				break;
				default: 
					//Geen difficulty meegekregen dus stop dit script
					document.getElementById('board').innerHTML = '<p>Something went wrong, <a href="index.html">Go back.</a></p>';
					throw new Error("No difficulty could be retrieved");
				break;
			}
		}

		function UpdateTime() {
			/*Subtracts a second from the timeLeft variable 
			and updates it to the UI, if the timeLeft is 0 call the function TimeUp();*/
			timeLeft--;
			if(timeLeft < 0) {
				TimeUp();
			}
			else {
				document.getElementById("tijd").innerHTML = timeLeft.toString();
			}
		}

		function TimeUp() {
			//Stop the timeLeft from counting and stop spawning moles
			clearInterval(timeInterval);
			spawnMoles = false;
		}

        function GenerateBoard()
        {
			//Element where the board will go
            var board = document.getElementById('board');

            for (var i = 0; i < grootte; i++)
            {
				//i = 0 increments every time
                for (var j = 0; j < grootte; j++)
                {
					//j = 0 increments every time

					//Like: 00, 01, 02, 03, 10, 11, 12, 13
                    var coord = i.toString() + j.toString();

					/*Make a div with a mole's image
					 and the id of the current coord */
                    board.innerHTML += '<div id="' + coord + '" class="place">' +
											'<img id="Img_' + coord + '" class="molImg" onclick="MoleClick(this)" src="Mol.png">' +
										'</div>';
					//Put the id / coord in the array so we can acces the moles
                    places.push(coord);
                }
				//Break every time we reach the end of the x axis, so the program begins on a new line
                board.innerHTML += '<br>';
            }
			//Scale the moles so they fit a full screen view
            $('.place').css('width', (100 / grootte).toString() + '%');
            $('.place').css('height', (100 / grootte).toString() + 'vh');
        }

        function HideAll()
        {
			//Loop through all moles and call the Hide function on them
            for (var i = 0; i < places.length; i++) {
                Hide(places[i]);
            }
        }

        function Hide(divID)
        {
			//Fades out the div containing the mole
            $('#' + divID).fadeTo(fadeTime, 0);
        }

        function Show(divID, duration)
        {
			/*Fades in the div containing a mole at the coord divID
			and calls waitAndHide() after that */
            $('#' + divID).fadeTo(fadeTime, 1, waitAndHide());

            function waitAndHide()
            {
				//Runs the Hide function on the div with the mole after a duration
                setTimeout(
                    function() {
                        Hide(divID);
                    }
                , duration);
            }
        }

        function MoleClick(event)
        {
			/*get id of the mole that called the function and get its parent
			by splitting Img_ and the coord*/
			var id = event.id;
			var parent = id.split('_')[1];
			parent = document.getElementById(parent);
			//Get the opacity of this parent
			var opacity = window.getComputedStyle(parent, null).opacity;
			//If its more then 0, the hit is verified
			if(opacity > 0) {
				Hit();
			}
        }

        function Hit()
        {
			//Add to the score and update the UI
            score++;
			document.getElementById("score").innerHTML = score.toString();

        }

        function WaitAndShowRandomMole()
        {
			//If the game is running
			if(spawnMoles)
			{
				//Spawn a mole after a delay
            	setTimeout(ShowRandomMole, moleInterval);
			}
        }

		function ShowRandomMole()
		{
			/*Choose a random place, call Show() on it
			and make this run again by calling WaitAndShowRandomMole()*/
			var randomPlace = places[Math.floor(Math.random() * places.length)];
	        Show(randomPlace, stayDuration);
			WaitAndShowRandomMole();
		}

		function StopGame() 
		{
			if(timeLeft <= 0)
			{
				UpdateHighScores();
			}
			//End game go to main page to get back to start conditions
			spawnMoles = false;
			location.href = "index.html";
		}

		function UpdateHighScores()
		{
			//Get the current highscore
			var highscore_score = localStorage.getItem("score");

			//Check if this highscore is null (No highscore yet) Or if our score is higher then the highscore
			if(highscore_score == null || highscore > score)
			{
				//If this score was higher then the current highest
				localStorage.setItem("score", score);
				localStorage.setItem("tijd", maxTime);
				localStorage.setItem("grootte", grootte);
			}
		}