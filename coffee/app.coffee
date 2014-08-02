navigator.getMedia = navigator.getUserMedia ||
                     navigator.webkitGetUserMedia ||
                     navigator.mozGetUserMedia ||
                     navigator.msGetUserMedia 

window.nodes = new Array

# DOMコンテンツ読み込み後
$ ->
  $(document).foundation();

  initEvents()

  suc = (stream) ->
    context = new webkitAudioContext()
    
    window.source = context.createMediaStreamSource(stream)
    buffSize = getBufferSize()

    window.destination = context.destination

    window.analyser = context.createAnalyser()
    startDrawing(window.analyser)

    # oscillator = context.createOscillator()
        
    # oscillator.connect(context.destination)
    # oscillator.noteOn(0)

    window.filter_gain = createFilter(context, buffSize)
    window.filter_gain.onaudioprocess = gainProcess

    window.filter_delay = createFilter(context, buffSize)
    window.filter_delay.onaudioprocess = delayProcess

    window.filter_toremoro = createFilter(context, buffSize)
    window.filter_toremoro.onaudioprocess = toremoroProcess

    window.filter_pitch = createFilter(context, buffSize)
    window.filter_pitch.onaudioprocess = pitchProcess
    
    window.source.connect(window.analyser)
    window.analyser.connect(window.destination)

  # 端末のビデオ、音声ストリームを取得
  navigator.getMedia(
    {video:false, audio:true},
    suc,
    (err) ->
      console.log "error"
  )
