<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Music Player</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap');
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Poppins", sans-serif;
    color: #fff;
    user-select: none;
}
body {
    height: 100vh;
    width: 100vw;
    overflow: auto;
}
#container {
    position: absolute;
    top: 0;
    left: 0;
    background: #000;
    width: 100%;
    height: 100%;
}

#canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
input#file {
   display: none;
}
.keys {
  display: block;
  padding: 20px;
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.keys .circle {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
.keys i {
  margin:0 30px;
}
.middle {
  display: block;
  width: 100%;
  padding: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
}

#range-bar {
  width: 100%;
  height: 4px;
  border: 0;
  outline: none;
}
h3 {
  text-align: center;
  margin-top: 20px;
}
small {
  display: block;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}
.top { 
  position: absolute;
  display: block;
  width: 100%;
  padding: 20px;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
ol {
  position: fixed;
  top: 0;
  left: -80vw;
  width: 80vw;
  height: 100vh;
  background-color: #000;
  border-right: 1px solid #fff;
  transition: left 0.4s ease;
  padding: 30px;
  overflow-y: auto;
  padding-bottom: 60px;
}
.active {
  left: 0;
}
ol li {
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: block;
  width: 100%;
  padding: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
}
li:hover {
  opacity: 0.7;
  color: red;
}
.loadingState {
  height: 100vh;
  width: 100vw;
  background: rgba(0,0,0,0.9);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content:center;
}
  </style>
</head>
<body>
   <div id="container">
      <canvas id="canvas"></canvas>
      <input type="file" multiple="multiple" id="file" accept="audio/*">
      
      <div class="top">
          <i class="fas fa-arrow-left"></i>
          <i class="fas fa-stream"></i>
      </div>
      
      <div class="middle">
        <input id="range-bar" max="0" value="0" type="range" min="0">
        <small>
           <span id="currentDuration">0:00</span>
           <span id="totalDuration">0:00</span>
        </small>
        <h3>No song Selected..</h3>
      </div>
      
      <div class="keys">
        <i id="leftArrow" class="fa fa-angle-double-left"></i>
        <span class="circle">
          <i class="fa fa-play" id="playBtn"></i>
        </span>
        <i id="rightArrow" class="fa fa-angle-double-right"></i>
      </div>
      
      <ol class="list">
         <span id="fa-plus"><i class="fas fa-plus"></i>&nbsp;&nbsp;&nbsp;Add Playlist</span><br><br>
      </ol>
   </div>
   <a id="link" style="display: none"></a>
   <div class="loadingState">
     <div class="spinner-border"></div>&nbsp;&nbsp;Please wait...
   </div>
<script>
document.addEventListener('readystatechange', e => {
  if(e.target.readyState === 'loading' || e.target.readyState === 'interactive') {
    document.querySelector('.loadingState').style.display = 'block'
  } else if(e.target.readyState === 'complete') {
    document.querySelector('.loadingState').style.display = 'none'
  }
})
$(document).ready(() => {
  const file = document.getElementById('file')
  $('.fa-stream').on('click', () => {
       $('.list').toggleClass('active')
  })
  $('.fa-plus').on('click', () => {
       file.click()
  })
  $('#fa-plus').on('click', () => {
       file.click()
  })
  const canvas = document.getElementById('canvas')
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth
  const particlesArray = []
  let hue = 0
  
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  class Particle {
    constructor() {
      this.x = Math.floor(Math.random() * canvas.width)
      this.y = Math.floor(Math.random() * canvas.height)
      this.speedX = Math.random() * 3 - 1.5
      this.speedY = Math.random() * 3 - 1.5
      this.size = Math.random() * 10
      this.color = `hsl(${hue}, 100%, 50%)`
    }
    update() {
      this.x += this.speedX
      this.y += this.speedY
      if(this.size > 0.2) this.size -= 0.1 
    }
    draw() {
      ctx.beginPath()
      ctx.fillStyle = this.color
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.closePath()
    }
  }

  function addParticles() {
    for (let i = 0; i < 1; i++) {
      particlesArray.push(new Particle())
    }
  }
  
  setInterval(addParticles, 100)
 function handleParticles() {
   for(let i = 0; i < particlesArray.length; i++) {
     particlesArray[i].draw()
     particlesArray[i].update()
     for(let j = i; j < particlesArray.length; j++) {
       let dx = particlesArray[i].x - particlesArray[j].x
       let dy = particlesArray[i].y - particlesArray[j].y
       let distance = Math.sqrt(dx * dx + dy * dy)
       if(distance <= 100) {
         ctx.beginPath()
         ctx.strokeStyle = particlesArray[i].color
         ctx.lineWidth = particlesArray[i].size / 10
         ctx.moveTo(particlesArray[i].x, particlesArray[i].y)
         ctx.lineTo(particlesArray[j].x, particlesArray[j].y)
         ctx.stroke()
         ctx.closePath()
       }
     }
     
     if(particlesArray[i].size <= 0.3) {
       particlesArray.splice(i, 1)
       i--
     }
   }
 }
  function animate() {
   ctx.fillStyle = 'rgba(0,0,0,0.9)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    handleParticles()
    hue += 1
    if(hue > 360) hue = 0
    window.requestAnimationFrame(animate)
  }
  animate()
  
  
  $('#file').on('change', () => {
    handleList()
    let li = document.querySelectorAll('li')
    li.forEach((e, i) => {
      e.onclick = () => {
        handleAuido(i)
      }
    })
  })
  
  let audio = new Audio(), i = 0, playing = false
 
  function handleAuido(index) {
    let reader = new FileReader()
    reader.onload = e => {
      audio.src = e.target.result
      if(playing) {
          audio.play()
      }
      setInterval(() => {
        let current = Math.floor(audio.currentTime / 60) + ':' + Math.floor(audio.currentTime % 60) + 's'
        
        let totalDuration = Math.floor(audio.duration / 60) + ':' + Math.floor(audio.duration % 60) + 's'
        $('#range-bar').attr('max', Math.floor(audio.duration))
        $('#range-bar').val(Math.floor(audio.currentTime))
        $('#currentDuration').html(current)
        $('#totalDuration').html(totalDuration)
      }, 0500)
      setInterval(() => {
        if(audio.currentTime == audio.duration) {
          nextAudio()
        }
      }, 1000)
    }
    $("#range-bar").on('input', () => {
      audio.currentTime = $('#range-bar').val()
    })
    $('h3').html(file.files[index].name)
    reader.readAsDataURL(file.files[index])
  }
  function handleList() {
    for(let i = 0; i < file.files.length; i++) {
      let li = document.createElement('li')
      li.innerHTML = file.files[i].name
      $('.list').append(li)
    }
    handleAuido(i)
    
  }
  
  function audioPlay() {
    if(!playing) {
      $('#playBtn').removeClass('fa-play')
      $('#playBtn').addClass('fa-pause')
      playing = true
      audio.play()
      handleAudioVisualizer()
    } else {
      $('#playBtn').removeClass('fa-pause')
      $('#playBtn').addClass('fa-play')
      playing = false
      audio.pause()
    }
  }
  
  function handleAudioVisualizer() {
    const audioCtx = new AudioContext()
    let audioSource = audioCtx.createMediaElementSource(audio)
    let analyser = audioCtx.createAnalyser()
    audioSource.connect(analyser)
    analyser.connect(audioCtx.destination)
    analyser.fftSize = 64 * 4
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const barWidth = canvas.width / bufferLength
   
   
   function init() {
      let x = 0;
      ctx.fillStyle = 'rgba(0,0,0,0.01)'
      ctx.fillRect(0,0, canvas.width, canvas.height)
      analyser.getByteFrequencyData(dataArray);
      for(let i = 0; i < bufferLength; i++) {
         barHeight = dataArray[i];
         var grd = ctx.createLinearGradient(0, 10, 200, 0);
         grd.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
         grd.addColorStop(1, `hsl(${hue}, 100%, 50%)`);
         ctx.shadowBlur = 5;
         ctx.shadowColor = '#000'
         ctx.fillStyle = grd
         ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
         x += barWidth + 2
      }
    requestAnimationFrame(init)
    }
    init()
  }
  
  $('#playBtn').on('click', () => {
    audioPlay()
    if(!document.fullscreenElement) {
     document.documentElement.requestFullscreen() 
    }
  })
  
  $('#leftArrow').on('click', () => {
    previousAudio()
  })
  $('#rightArrow').on('click', () => {
   nextAudio() 
  })
  function nextAudio() {
    i++
    if(i > file.files.length) i = 0
    handleAuido(i)
  }
  function previousAudio() {
    i--
    if(i < 0) i = file.files.length - 1
    handleAuido(i)
  }
  $('.fa-arrow-left').on('click', () => {
    if(document.fullscreenElement) {
      document.exitFullscreen()
    }
  })
  $('canvas').on('dblclick', () => {
    if('print' in window) {
      window.print()
    } else {
      var link = document.getElementById('link')
      link.setAttribute('download', 'canvas-screenShot.png')
      link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"))
      link.click();
    }
  })
})

</script>
</body>
</html>
