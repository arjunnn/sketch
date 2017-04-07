const canvas = document.querySelector('#draw');
const patternLayer = document.querySelector('#pattern');
const ctx = canvas.getContext('2d');
const pctx = patternLayer.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
patternLayer.width = window.innerWidth;
patternLayer.height = window.innerHeight;
pctx.fillStyle = 'white';
pctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = '#00000';
ctx.lineWidth = 20;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let direction = true;
let isMulticolour = false;

function draw(e) {
  if(!isDrawing) return;
  //
  if(isMulticolour) {
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
  }
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  lastX = e.offsetX;
  lastY = e.offsetY;
  hue++;
  if(hue >= 360){
    hue = 0;
  }
}
//   if(ctx.lineWidth >= 100 || ctx.lineWidth <= 1) {
//     direction = !direction;
//   }
//   ctx.lineWidth++;


canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

const colours = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', '#e34234', '#ffbf00', 'chartreuse', 'teal', 'violet', 'magenta', 'multicolour'];
const widths = [5, 15, 20, 30, 40];


var palette = document.getElementById("palette");
var widthSelector = document.getElementById("widthSelector");

for (var i = 0; i < colours.length; i++) {
    var colourOption = document.createElement("li");
    colourOption.style.backgroundColor = `${colours[i]}`;
    colourOption.classList.add("palette-colour");
    colourOption.setAttribute('data-colour', colours[i])
    palette.appendChild(colourOption);
}

var topl = 40;

for (var i = 0; i < widths.length; i++) {
  var widthOption = document.createElement("li");
  widthOption.classList.add("brush-width");
  widthOption.classList.add("outer");
  widthOption.setAttribute('data-width', widths[i]);
  widthSelector.appendChild(widthOption);

  var div1 = document.createElement("div");
  div1.classList.add("inner");

  div1.style.top = topl+"%";
  div1.style.left = topl+"%";
  div1.style.width = 100 - (2 * topl)+"%";
  div1.style.height = 100 - (2 * topl)+"%";
  widthOption.appendChild(div1);

  topl -= 5;   
}

$('.palette-colour').on('click', function() {
  $(this).parent().children().removeClass("selected");
  $(this).addClass("selected");
  if($(this).data('colour') === 'multicolour') {
  isMulticolour = true;
  $(".inner").css('background', 'url("./beachball.jpg") center center');
}
  else {
    isMulticolour = false;
    ctx.strokeStyle = $(this).data('colour');
    $(this).addClass("selected");
    $(".inner").css('background', 'none');
    $(".inner").css('backgroundColor', $(this).data('colour'));
  }
});

$(".brush-width").on('click', function() {
  ctx.lineWidth = $(this).data('width');
});

function saveImage() {
  pctx.drawImage(canvas,0,0);
  var img = patternLayer.toDataURL("image/png").replace("image/png", "image/octet-stream");
  document.querySelector("a").setAttribute('href', img);
}

function changePattern(pattern) {
  pctx.fillStyle = 'white';
  pctx.fillRect(0, 0, canvas.width, canvas.height);
  switch (pattern) {
    case "dot":
      var img = document.getElementById("pattern-dot");
      break;

    case "grid":
      var img = document.getElementById("pattern-grid");
      break;

    default:
      break;
  }
  var pat = pctx.createPattern(img, "repeat");
  pctx.rect(0, 0, canvas.width, canvas.height);  
  pctx.fillStyle = pat;
  pctx.fill();

// pctx.globalCompositeOperation='source-over';
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//touch events


  
  canvas.addEventListener("touchstart", handleStart, false);
  canvas.addEventListener("touchend", handleEnd, false);
  canvas.addEventListener("touchcancel", handleCancel, false);
  canvas.addEventListener("touchmove", handleMove, false);
  console.log("initialized.");

  var ongoingTouches = [];

  function handleStart(evt) {
  evt.preventDefault();
  console.log("touchstart.");

  var touches = evt.changedTouches;
        
  for (var i = 0; i < touches.length; i++) {
    console.log("touchstart:" + i + "...");
    ongoingTouches.push(copyTouch(touches[i]));
    ctx.beginPath();
    ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
    // ctx.fillStyle = color;
    ctx.fill();
    console.log("touchstart:" + i + ".");
  }
}

function handleMove(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      console.log("continuing touch "+idx);
      ctx.beginPath();
      console.log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      console.log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.lineWidth = 4;
      // ctx.strokeStyle = color;
      ctx.stroke();

      ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
      console.log(".");
    } else {
      console.log("can't figure out which touch to continue");
    }
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  console.log("touchend");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      ctx.lineWidth = 4;
      // ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
      ongoingTouches.splice(idx, 1);  // remove it; we're done
    } else {
      console.log("can't figure out which touch to end");
    }
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  console.log("touchcancel.");
  var touches = evt.changedTouches;
  
  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);
    ongoingTouches.splice(idx, 1);  // remove it; we're done
  }
}

function copyTouch(touch) {
  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;
    
    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}