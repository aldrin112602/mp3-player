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
    analyser.fftSize = 64 * 8
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
    document.documentElement.requestFullscreen()
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
})
