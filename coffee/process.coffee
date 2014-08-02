buff_l = []
buff_r = []

window.pitch

@pitchProcess = (e) ->
  p = window.pitch
  J = 24
      
  input_l = e.inputBuffer.getChannelData(0)
  input_r = e.inputBuffer.getChannelData(1)

  output_l = e.outputBuffer.getChannelData(0)
  output_r = e.outputBuffer.getChannelData(1)

  # for i in [0...output_l.length]
  #   t = p * i
  #   offset = (int) t

  #   for m in [(offset-J/2)...(offset+J/2)]
  #     if m >= 0 && m < output_l.length
  #       output_l[i] += input_l[i] * sinc(Math.PI * (t - m))
  #       output_r[i] += input_r[i] * sinc(Math.PI * (t - m))
        
sinc = (v) ->
  
window.depth = 0.5
window.rate = 5.0

@toremoroProcess = (e) ->
  depth = window.depth
  rate = window.rate
  fs = e.inputBuffer.sampleRate
  
  input_l = e.inputBuffer.getChannelData(0)
  input_r = e.inputBuffer.getChannelData(1)

  output_l = e.outputBuffer.getChannelData(0)
  output_r = e.outputBuffer.getChannelData(1)

  for i in [0...output_l.length]
    a = 1.0 + depth * Math.sin(2.0 * Math.PI * rate * i / fs)
    output_l[i] = a * input_l[i]
    output_r[i] = a * input_r[i]

window.a = 0.5
window.d = 0.5
window.repeat = 

@delayProcess = (e) ->
  a = window.a
  d = e.inputBuffer.sampleRate * window.d
  re = window.repeat
  bu_l = buff_l
  bu_r = buff_r
  
  input_l = e.inputBuffer.getChannelData(0)
  input_r = e.inputBuffer.getChannelData(1)

  Array.prototype.push.apply buff_l, input_l
  Array.prototype.push.apply buff_r, input_r

  output_l = e.outputBuffer.getChannelData(0)
  output_r = e.outputBuffer.getChannelData(1)

  for i in [0...output_l.length]
    output_l[i] = input_l[i]
    output_r[i] = input_r[i]
    for j in [1..re]
      m = parseInt(i - j * d) + bu_l.length - input_l.length
      output_l[i] += Math.pow(a,j) * bu_l[m] if m >= 0
      output_r[i] += Math.pow(a,j) * bu_r[m] if m >= 0



window.gain_rate = 1.0

@gainProcess = (e) ->
  rate = window.gain_rate
    
  input_l = e.inputBuffer.getChannelData(0)
  input_r = e.inputBuffer.getChannelData(1)

  output_l = e.outputBuffer.getChannelData(0)
  output_r = e.outputBuffer.getChannelData(1)

  for i in [0...output_l.length]
    output_l[i] = input_l[i] * rate
    output_r[i] = input_r[i] * rate
