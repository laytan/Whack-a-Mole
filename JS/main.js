
//Amount of clicks on moles
		var score = 0;

		//Populated by generateboard with the board
        var places = [];

		//Interval to update time every second
		var timeInterval;
		//Interval that spawns moles
		var gameLoop;

		//Is the game in progress or on UI screen
		var inProgress = false;

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

		if(localStorage.getItem('score') != null 
		&& localStorage.getItem('tijd') != null 
		&& localStorage.getItem('grootte') != null) 
		{
			//If we have a highscore, populate the scores div with the highscore
			var highscore = localStorage.getItem('score');
			var tijd = localStorage.getItem('tijd');
			var grootte = localStorage.getItem('grootte');
			document.getElementById("scores").innerHTML = 'Score: ' + highscore +
														 '<br>Tijd: ' + tijd +
														  '<br>Grootte: ' + grootte;
		}

        function Start()
        {
			//Difficulty and variable initializer
			InitSettings();
			DisplayUI();
            GenerateBoard();
            HideAll();
			//Main loop to make moles appear and dissappear
            WaitAndShowRandomMole();
        }

		function InitSettings()
		{
			//Switch trough checked difficulty and change variables according to it
			switch(document.querySelector('input[name="mode"]:checked').value) 
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
			}
		}

		function DisplayUI() 
		{	
			// Set timeLeft to the maxTime for this game so we can do calculations with it
			timeLeft = maxTime;

			//Hide the options element
            document.getElementById('options').style.display = 'none';
			//Display the game UI
			document.getElementById("ui").style.display = 'block';

			//Run UpdateTime every second / 1000Milliseconds
			timeInterval = setInterval(function() {UpdateTime()}, 1000);
		}

		function UpdateTime() {
			/*Subtracts a second from the timeLeft variable 
			and updates it to the UI, if the timeLeft is 0 call the function Finished();*/
			timeLeft--;
			if(timeLeft < 0) {
				Finished();
			}
			else {
				document.getElementById("tijd").innerHTML = timeLeft.toString();
			}
		}

		function Finished() {
			//Stop the timeLeft from counting and stop the gameloop
			clearInterval(timeInterval);
			inProgress = false;
		}

        function GenerateBoard()
        {
			//sets game to be started
			inProgress = true;
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
			//Get the opacity of this parent
			var opacity = window.getComputedStyle(document.getElementById(parent), null).opacity;
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
			if(inProgress)
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
			//Called by the stop button in the UI
			if(localStorage.getItem('score') != null && localStorage.getItem('tijd') != null && localStorage.getItem('grootte') != null) 
			{
				//If the highscore is less then this score, change the highscores to this session
				var highscore = localStorage.getItem('score');
				if(score > highscore) 
				{
					localStorage.setItem('score', score);
					localStorage.setItem('tijd', maxtime);
					localStorage.setItem('grootte', grootte);
				}
			}
			else 
			{
				//If there was no score to compare to this is automatically the highscore
				localStorage.setItem('score', score);
				localStorage.setItem('tijd', maxtime);
				localStorage.setItem('grootte', grootte);
			}
			//End game and reload window to get back to start conditions
			inProgress = false;
			location.reload();
		}

		function Validate()
		{
			Start();
		}