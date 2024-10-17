document.getElementById("loading").style.display = "none";
document.getElementById("bigcont").style.display = "none";
document.getElementById("userCont").style.display = "none";
document.getElementById("oppNameCont").style.display = "none";
document.getElementById("valueCont").style.display = "none";
document.getElementById("whosTurn").style.display = "none";





const socket = io();

let name;
let currentPlayer;  // Track whether the current player is "X" or "O"
let results = [];
let Xpoint = 0
let Ypoint = 0
// Find the opponent
console.log(results);

document.getElementById('find').addEventListener("click", function () {
    name = document.getElementById("name").value;
    document.getElementById("user").innerText = name;

    if (!name) {
        alert("Please enter a name");
    } else {
        socket.emit("find", { name: name });

        
        document.getElementById("loading").style.display = "block";
        document.getElementById("find").disabled = true;
    }
});

socket.on("find", (e) => {
    let allPlayersArray = e.allPlayers;
    console.log(allPlayersArray);

    

    if (name) {
        document.getElementById("userCont").style.display = "block";
        document.getElementById("oppNameCont").style.display = "block";
        document.getElementById("valueCont").style.display = "block";
        document.getElementById("loading").style.display = "none";
        document.getElementById("name").style.display = "none";
        document.getElementById("find").style.display = "none";
        document.getElementById("enterName").style.display = "none";
        document.getElementById("bigcont").style.display = "block";
        document.getElementById("whosTurn").style.display = "block";
        document.getElementById("whosTurn").innerText = "X's Turn";
    }

    let oppName;
    let value;
    

    const foundObject = allPlayersArray.find(obj => obj.p1.p1name === name || obj.p2.p2name === name);
    foundObject.p1.p1name === name ? oppName = foundObject.p2.p2name : oppName = foundObject.p1.p1name;
    foundObject.p1.p1name === name ? value = foundObject.p1.p1value : value = foundObject.p2.p2value;

    currentPlayer = value;  // Set currentPlayer as X or O
   
    document.getElementById("player1").innerText = allPlayersArray[0].p1.p1name
    document.getElementById("player2").innerText = allPlayersArray[0].p2.p2name
    document.getElementById("oppName").innerText = oppName;
    document.getElementById("value").innerText = value;
});

document.querySelectorAll(".btn").forEach(e => {
    e.addEventListener("click", function () {
        let value = document.getElementById("value").innerText;

        // Check if the current turn matches the player's symbol before allowing the click
        let currentTurn = document.getElementById("whosTurn").innerText.charAt(0);  // "X" or "O"
        if (currentTurn === value) {
            e.innerText = value;
            socket.emit("playing", { value: value, id: e.id, name: name });
        } else {
            alert("It's not your turn!");  // Optional: You can replace this with UI feedback instead of alert
        }
    });
});

socket.on("playing", (e) => {
    const foundObject = (e.allPlayers).find(obj => obj.p1.p1name === name || obj.p2.p2name === name);

    let p1id = foundObject.p1.p1move;
    let p2id = foundObject.p2.p2move;

    // Alternate between X and O's turns
    if (foundObject.sum % 2 === 0) {
        document.getElementById("whosTurn").innerText = "O's Turn";
    } else {
        document.getElementById("whosTurn").innerText = "X's Turn";
    }

    // Disable already clicked buttons and update the board
    if (p1id) {
        document.getElementById(`${p1id}`).innerText = "X";
        document.getElementById(`${p1id}`).disabled = true;
        document.getElementById(`${p1id}`).style.color = "black";
    }
    if (p2id) {
        document.getElementById(`${p2id}`).innerText = "O";
        document.getElementById(`${p2id}`).disabled = true;
        document.getElementById(`${p2id}`).style.color = "black";
    }

    // Check for game over conditions after every move
    check(name, foundObject.sum);
});

function check(name, sum) {
    const b1 = document.getElementById("btn1").innerText || "a";
    const b2 = document.getElementById("btn2").innerText || "b";
    const b3 = document.getElementById("btn3").innerText || "c";
    const b4 = document.getElementById("btn4").innerText || "d";
    const b5 = document.getElementById("btn5").innerText || "e";
    const b6 = document.getElementById("btn6").innerText || "f";
    const b7 = document.getElementById("btn7").innerText || "g";
    const b8 = document.getElementById("btn8").innerText || "h";
    const b9 = document.getElementById("btn9").innerText || "i";

    if ((b1 === b2 && b2 === b3) || (b4 === b5 && b5 === b6) || (b7 === b8 && b8 === b9) ||
        (b1 === b4 && b4 === b7) || (b2 === b5 && b5 === b8) || (b3 === b6 && b6 === b9) ||
        (b1 === b5 && b5 === b9) || (b3 === b5 && b5 === b7)) {

        socket.emit("gameOver", { name: name });

        setTimeout(() => {
            // Determine the winner and update the result array
            const winner = sum % 2 === 0 ? "X" : "O";
            const winnerName = sum % 2 === 0 ? name : oppName
            results.push({ name: winnerName,  player: winner, result: "WON" });
            console.log(results);
            

            // Call a function to update the results table
            updateResultsTable(winner, "WON");

            // Reset the board after a short delay
            setTimeout(() => {
                resetBoard();
            }, 2000);

        }, 100);
    } else if (sum === 10) {
        socket.emit("gameOver", { name: name });

        setTimeout(() => {
            alert("DRAW!!");

            // Update results for a draw
            updateResultsTable("Both", "DRAW");

            setTimeout(() => {
                resetBoard();
            }, 2000);

        }, 100);
    }
}


function resetBoard() {
    document.querySelectorAll(".btn").forEach(button => {
        button.innerText = "";  // Clear the button text
        button.disabled = false;  // Enable the buttons for the next game
    });

    // Reset the turn indicator to start a new game
    document.getElementById("whosTurn").innerText = "X's Turn";  // X usually starts the game
    currentPlayer = "X";  // Reset to X for the next game

    // Results are kept intact for history
    // The game can continue without reloading the page
}

function updateResultsTable(player, result) {
  const player1Point = document.getElementById("pl1Point")
  const player2Point = document.getElementById("pl2Point")
   
    if(player == "X" ){
        console.log("if");
        console.log(results);
        
        
        player1Point.innerText = ++Xpoint;  
        player2Point.innerText = Ypoint;  

    
    

     
    }


    else{
     console.log("else");
     player1Point.innerText = Xpoint ;     
     player2Point.innerText = ++Ypoint ;

 
    }
    

    
}
