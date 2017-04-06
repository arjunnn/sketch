  const canvas = document.querySelector('#draw');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    // console.log(e);
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

  var palette = document.getElementById("palette");
  for (var i = 0; i < colours.length; i++) {
      var colourOption = document.createElement("li");
      colourOption.style.backgroundColor = `${colours[i]}`;
      colourOption.classList.add("palette-colour");
      colourOption.setAttribute('data-colour', colours[i])
      palette.appendChild(colourOption);
  }

  $('.palette-colour').on('click', function() {
    if($(this).data('colour') === 'multicolour') {
    isMulticolour = true;     
  }
    else {
      isMulticolour = false;
      ctx.strokeStyle = $(this).data('colour');
    }
  })

// document.getElementsByTagName("body").addEventListener("touchmove", function(e) {e.preventDefault()})

 canvas.addEventListener("touchstart", function(e) { // = mousedown
    touch = true
    is_drawing = true
    last_x = e.touches[0].pageX
    last_y = e.touches[0].pageY
})
canvas.addEventListener("touchmove", draw) // = mousemove
canvas.addEventListener("touchend", function() {isDrawing = false}) // = mouseup