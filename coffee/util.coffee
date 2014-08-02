# 一度しか出ないログ
class @OnceLog
  @isLogged = false
  @log: (obj)=>
    if not @isLogged
      @isLogged = true
      console.log(obj)


# wrapper function of console.log
@log = (obj) ->
    console.log(obj)

@createFilter = (context, buffSize) ->
  context.createScriptProcessor(buffSize, 2, 2)

# バッファサイズを取得
@getBufferSize = ->
  if (/(Win(dows )?NT 6\.2)/.test(navigator.userAgent))
    return 1024   # Windows 8
  else if(/(Win(dows )?NT 6\.1)/.test(navigator.userAgent))
    return 1024   # Windows 7
  else if(/(Win(dows )?NT 6\.0)/.test(navigator.userAgent))
    return 2048   # Windows Vista
  else if(/Win(dows )?(NT 5\.1|XP)/.test(navigator.userAgent))
    return 4096   # Windows XP
  else if(/Mac|PPC/.test(navigator.userAgent))
    return 1024   # Mac OS X
  else if(/Linux/.test(navigator.userAgent))
    return 8192   # Linux
  else if(/iPhone|iPad|iPod/.test(navigator.userAgent))
    return 2048   # iOS
  else 
    return 16384  # Otherwise


# Eventメソッドの初期化
@initEvents = ->
  ch_gain = $("#check-use-gain")
  ch_delay = $("#check-use-delay")
  ch_toremoro = $("#check-use-toremoro")
  
  in_gain = $("#in-gain")
  in_dec_rate = $("#in-dec-rate")
  in_delay_time = $("#in-delay-time")
  in_repeat = $("#in-repeat")

  btn_delay = $("#btn-delay")
  btn_reverb = $("#btn-reverb")

  ch_gain.change ->
    if ch_gain.is(":checked")
      connect(window.filter_gain)
    else
      disconnect(window.filter_gain)

  ch_delay.change ->
    if ch_delay.is(":checked")
      connect(window.filter_delay)
    else
      disconnect(window.filter_delay)

  $("#check-use-toremoro").change ->
    if $(this).is(":checked")
      connect(window.filter_toremoro)
    else
      disconnect(window.filter_toremoro)

  $("#check-use-pitch").change ->
    if $(this).is(":checked")
      connect(window.filter_pitch)
    else
      disconnect(window.filter_pitch)
      
  in_gain.change ->
    gain = parseFloat(in_gain.val())
    log(gain)
    if isNaN(gain) then return
    window.gain_rate  = gain

  in_dec_rate.change ->
    rate = parseFloat(in_dec_rate.val())
    log(rate)
    if isNaN(rate) then return
    window.a = rate

  in_delay_time.change ->
    time = parseFloat(in_delay_time.val())
    log(time)
    if isNaN(time) then return
    window.d = time

  in_repeat.change ->
    repeat = parseFloat(in_repeat.val())
    log(repeat)
    if isNaN(repeat) then return
    window.repeat = repeat

  btn_delay.click ->
    in_dec_rate.val(0.5)
    in_dec_rate.change()
    in_delay_time.val(0.375)
    in_delay_time.change()
    in_repeat.val(2)
    in_repeat.change()

  btn_reverb.click ->
    in_dec_rate.val(0.5)
    in_dec_rate.change()
    in_delay_time.val(0.05)
    in_delay_time.change()
    in_repeat.val(10)
    in_repeat.change()


# AudioNode間の結合メソッド
connect = (node) ->
  nodes = window.nodes
  source = if nodes.length == 0 then window.source else nodes[nodes.length-1]
  source.connect(node)
  node.connect(window.analyser)

  nodes.push(node)

  log(window.nodes)


# AudioNode間の分解メソッド
disconnect = (node) ->
  nodes = window.nodes

  return if nodes.length == 0

  for i in [0...nodes.length]
    break if nodes[i] == node

  source = if i == 0 then window.source else nodes[i-1]
  destination = if i == nodes.length - 1 then window.analyser else nodes[i+1]

  source.disconnect(0)
  node.disconnect(0)
  source.connect(destination)

  # nodeリストを再構築する
  window.nodes = (item for item in nodes when item != node)

  log(window.nodes)


@startDrawing = (analyser) ->

  frequencyElement = $("#frequency").get(0)
  timeDomainElement = $("#timedomain").get(0)

  width = $("#frequency").prop("offsetWidth")
  height = $("#frequency").prop("offsetHeight")

  frequencyElement.width = width
  frequencyElement.height = height

  timeDomainElement.width = width
  timeDomainElement.height = height

  frequencyContext = frequencyElement.getContext("2d")
  timeDomainContext = timeDomainElement.getContext("2d")

  frequencyData = new Uint8Array(analyser.frequencyBinCount)
  timeDomainData = new Uint8Array(analyser.frequencyBinCount)

  drawAnimation = ->
    analyser.getByteFrequencyData(frequencyData) 
    analyser.getByteTimeDomainData(timeDomainData) 

    frequencyContext.clearRect(0, 0, width, height)
    frequencyContext.strokeStyle = 'rgb(4,68,57)'
    frequencyContext.beginPath() 
    frequencyContext.moveTo(0, height - frequencyData[0])


    log(frequencyData.length)

    for i in [1...frequencyData.length]
      frequencyContext.lineTo(i, height - frequencyData[i]) 

    frequencyContext.stroke() 

    timeDomainContext.clearRect(0, 0, width, height)
    timeDomainContext.strokeStyle = 'rgb(4,68,57)';
    timeDomainContext.beginPath() 
    timeDomainContext.moveTo(0, height - timeDomainData[0]) 

    for i in [1...timeDomainData.length]
      timeDomainContext.lineTo(i, height - timeDomainData[i]) 

    timeDomainContext.stroke()

    requestAnimationFrame(drawAnimation)

  drawAnimation()
