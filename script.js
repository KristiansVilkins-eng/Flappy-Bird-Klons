const restartButton = document.getElementById("restart-btn");

var myGamePiece;
var myObstacles = [];
var myScore = document.getElementById("score");

var FLAP_STRENGTH = -1.5;

window.onload = function () {
  startGame();
};

document.addEventListener("click", function () {
  accelerate(FLAP_STRENGTH);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    accelerate(FLAP_STRENGTH);
  }
});

function startGame() {
  myGamePiece = new component(30, 30, "red", 10, 120);
  myGamePiece.gravity = 0.05;
  //myScore = new component("30px", "Consolas", "black", 0, 30, "text");
  myGameArea.start();
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    var canvasHost = document.getElementById("canvas");
    if (canvasHost) {
      canvasHost.innerHTML = "";
      canvasHost.appendChild(this.canvas);
    } else {
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

function component(width, height, color, x, y, type) {
  this.type = type;
  this.score = 0;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.gravity = 0;
  this.gravitySpeed = 0;
  this.update = function () {
    ctx = myGameArea.context;
    if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  this.newPos = function () {
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
    this.hitBottom();
    this.hitTop();
  };
  this.hitBottom = function () {
    var rockbottom = myGameArea.canvas.height - this.height;
    if (this.y > rockbottom) {
      this.y = rockbottom;
      this.gravitySpeed = 1;
    }
  };
  this.hitTop = function () {
    var rocktop = 0;
    if (this.y < rocktop) {
      this.y = rocktop;
      this.gravitySpeed = 0;
    }
  };
  this.crashWith = function (otherobj) {
    var myleft = this.x;
    var myright = this.x + this.width;
    var mytop = this.y;
    var mybottom = this.y + this.height;
    var otherleft = otherobj.x;
    var otherright = otherobj.x + otherobj.width;
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + otherobj.height;
    var crash = true;
    if (
      mybottom < othertop ||
      mytop > otherbottom ||
      myright < otherleft ||
      myleft > otherright
    ) {
      crash = false;
    }
    return crash;
  };
}

function updateGameArea() {
  var x, height, gap, minHeight, maxHeight, minGap, maxGap;
  for (i = 0; i < myObstacles.length; i++) {
    if (myGamePiece.crashWith(myObstacles[i])) {
      clearInterval(myGameArea.interval);
      myGameArea.interval = null;
      alert("Game Over");
      return;
    }
  }
  myGameArea.clear();
  myGameArea.frameNo += 1;

  if (myGameArea.frameNo == 1 || everyinterval(80)) {
    x = myGameArea.canvas.width;
    minHeight = 20;
    maxHeight = 200;
    height = Math.floor(
      Math.random() * (maxHeight - minHeight + 1) + minHeight
    );
    minGap = 50;
    maxGap = 200;
    gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    myObstacles.push(new component(10, height, "green", x, 0));
    myObstacles.push(
      new component(10, x - height - gap, "green", x, height + gap)
    );
  }

  myObstacles = myObstacles.filter(function (obstacle) {
    return obstacle.x + obstacle.width > 0;
  });

  for (i = 0; i < myObstacles.length; i++) {
    myObstacles[i].x -= 2;
    myObstacles[i].update();
  }

  //myScore.text = "SCORE: " + myGameArea.frameNo;
  //myScore.update();
  myScore.textContent = "Score: " + myGameArea.frameNo;
  myGamePiece.newPos();
  myGamePiece.update();
  return;
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}

function accelerate(n) {
  // Negative value = flap upward
  myGamePiece.gravitySpeed = typeof n === "number" ? n : FLAP_STRENGTH;
}

restartButton.addEventListener("click", () => {
  window.location.reload();
});
