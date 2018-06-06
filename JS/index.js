//Runs function Start when the page is fully loaded
window.onload = Start();

function Start()
{
    LoadHighscores();
}

function LoadHighscores()
{
    //Get the local highscore
    var highScore_score = localStorage.getItem("score");
    var highScore_time = localStorage.getItem("tijd");
    var highScore_size = localStorage.getItem("grootte");
    //get the target html elements
    var target_score = document.getElementById("highscore_score");
    var target_time = document.getElementById("highscore_time");
    var target_size = document.getElementById("highscore_size");
    //populate the targets if they are not null, else insert a /
    target_score.innerHTML = (highScore_score == null) ? "/" : highScore_score;
    target_size.innerHTML = (highScore_size == null) ? "/" : highScore_size;
    target_time.innerHTML = (highScore_time == null) ? "/" : highScore_time;
}