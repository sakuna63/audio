(function() {
  navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  window.nodes = new Array;

  $(function() {
    var suc;
    $(document).foundation();
    initEvents();
    suc = function(stream) {
      var buffSize, context;
      context = new webkitAudioContext();
      window.source = context.createMediaStreamSource(stream);
      buffSize = getBufferSize();
      window.destination = context.destination;
      window.analyser = context.createAnalyser();
      startDrawing(window.analyser);
      window.filter_gain = createFilter(context, buffSize);
      window.filter_gain.onaudioprocess = gainProcess;
      window.filter_delay = createFilter(context, buffSize);
      window.filter_delay.onaudioprocess = delayProcess;
      window.filter_toremoro = createFilter(context, buffSize);
      window.filter_toremoro.onaudioprocess = toremoroProcess;
      window.filter_pitch = createFilter(context, buffSize);
      window.filter_pitch.onaudioprocess = pitchProcess;
      window.source.connect(window.analyser);
      return window.analyser.connect(window.destination);
    };
    return navigator.getMedia({
      video: false,
      audio: true
    }, suc, function(err) {
      return console.log("error");
    });
  });

}).call(this);

(function() {
  var buff_l, buff_r, sinc;

  buff_l = [];

  buff_r = [];

  window.pitch;

  this.pitchProcess = function(e) {
    var J, input_l, input_r, output_l, output_r, p;
    p = window.pitch;
    J = 24;
    input_l = e.inputBuffer.getChannelData(0);
    input_r = e.inputBuffer.getChannelData(1);
    output_l = e.outputBuffer.getChannelData(0);
    return output_r = e.outputBuffer.getChannelData(1);
  };

  sinc = function(v) {};

  window.depth = 0.5;

  window.rate = 5.0;

  this.toremoroProcess = function(e) {
    var a, depth, fs, i, input_l, input_r, output_l, output_r, rate, _i, _ref, _results;
    depth = window.depth;
    rate = window.rate;
    fs = e.inputBuffer.sampleRate;
    input_l = e.inputBuffer.getChannelData(0);
    input_r = e.inputBuffer.getChannelData(1);
    output_l = e.outputBuffer.getChannelData(0);
    output_r = e.outputBuffer.getChannelData(1);
    _results = [];
    for (i = _i = 0, _ref = output_l.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      a = 1.0 + depth * Math.sin(2.0 * Math.PI * rate * i / fs);
      output_l[i] = a * input_l[i];
      _results.push(output_r[i] = a * input_r[i]);
    }
    return _results;
  };

  window.a = 0.5;

  window.d = 0.5;

  window.repeat = this.delayProcess = function(e) {
    var a, bu_l, bu_r, d, i, input_l, input_r, j, m, output_l, output_r, re, _i, _ref, _results;
    a = window.a;
    d = e.inputBuffer.sampleRate * window.d;
    re = window.repeat;
    bu_l = buff_l;
    bu_r = buff_r;
    input_l = e.inputBuffer.getChannelData(0);
    input_r = e.inputBuffer.getChannelData(1);
    Array.prototype.push.apply(buff_l, input_l);
    Array.prototype.push.apply(buff_r, input_r);
    output_l = e.outputBuffer.getChannelData(0);
    output_r = e.outputBuffer.getChannelData(1);
    _results = [];
    for (i = _i = 0, _ref = output_l.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      output_l[i] = input_l[i];
      output_r[i] = input_r[i];
      _results.push((function() {
        var _j, _results1;
        _results1 = [];
        for (j = _j = 1; 1 <= re ? _j <= re : _j >= re; j = 1 <= re ? ++_j : --_j) {
          m = parseInt(i - j * d) + bu_l.length - input_l.length;
          if (m >= 0) {
            output_l[i] += Math.pow(a, j) * bu_l[m];
          }
          if (m >= 0) {
            _results1.push(output_r[i] += Math.pow(a, j) * bu_r[m]);
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      })());
    }
    return _results;
  };

  window.gain_rate = 1.0;

  this.gainProcess = function(e) {
    var i, input_l, input_r, output_l, output_r, rate, _i, _ref, _results;
    rate = window.gain_rate;
    input_l = e.inputBuffer.getChannelData(0);
    input_r = e.inputBuffer.getChannelData(1);
    output_l = e.outputBuffer.getChannelData(0);
    output_r = e.outputBuffer.getChannelData(1);
    _results = [];
    for (i = _i = 0, _ref = output_l.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      output_l[i] = input_l[i] * rate;
      _results.push(output_r[i] = input_r[i] * rate);
    }
    return _results;
  };

}).call(this);

(function() {
  var connect, disconnect;

  this.OnceLog = (function() {
    function OnceLog() {}

    OnceLog.isLogged = false;

    OnceLog.log = function(obj) {
      if (!OnceLog.isLogged) {
        OnceLog.isLogged = true;
        return console.log(obj);
      }
    };

    return OnceLog;

  }).call(this);

  this.log = function(obj) {
    return console.log(obj);
  };

  this.createFilter = function(context, buffSize) {
    return context.createScriptProcessor(buffSize, 2, 2);
  };

  this.getBufferSize = function() {
    if (/(Win(dows )?NT 6\.2)/.test(navigator.userAgent)) {
      return 1024;
    } else if (/(Win(dows )?NT 6\.1)/.test(navigator.userAgent)) {
      return 1024;
    } else if (/(Win(dows )?NT 6\.0)/.test(navigator.userAgent)) {
      return 2048;
    } else if (/Win(dows )?(NT 5\.1|XP)/.test(navigator.userAgent)) {
      return 4096;
    } else if (/Mac|PPC/.test(navigator.userAgent)) {
      return 1024;
    } else if (/Linux/.test(navigator.userAgent)) {
      return 8192;
    } else if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      return 2048;
    } else {
      return 16384;
    }
  };

  this.initEvents = function() {
    var btn_delay, btn_reverb, ch_delay, ch_gain, ch_toremoro, in_dec_rate, in_delay_time, in_gain, in_repeat;
    ch_gain = $("#check-use-gain");
    ch_delay = $("#check-use-delay");
    ch_toremoro = $("#check-use-toremoro");
    in_gain = $("#in-gain");
    in_dec_rate = $("#in-dec-rate");
    in_delay_time = $("#in-delay-time");
    in_repeat = $("#in-repeat");
    btn_delay = $("#btn-delay");
    btn_reverb = $("#btn-reverb");
    ch_gain.change(function() {
      if (ch_gain.is(":checked")) {
        return connect(window.filter_gain);
      } else {
        return disconnect(window.filter_gain);
      }
    });
    ch_delay.change(function() {
      if (ch_delay.is(":checked")) {
        return connect(window.filter_delay);
      } else {
        return disconnect(window.filter_delay);
      }
    });
    $("#check-use-toremoro").change(function() {
      if ($(this).is(":checked")) {
        return connect(window.filter_toremoro);
      } else {
        return disconnect(window.filter_toremoro);
      }
    });
    $("#check-use-pitch").change(function() {
      if ($(this).is(":checked")) {
        return connect(window.filter_pitch);
      } else {
        return disconnect(window.filter_pitch);
      }
    });
    in_gain.change(function() {
      var gain;
      gain = parseFloat(in_gain.val());
      log(gain);
      if (isNaN(gain)) {
        return;
      }
      return window.gain_rate = gain;
    });
    in_dec_rate.change(function() {
      var rate;
      rate = parseFloat(in_dec_rate.val());
      log(rate);
      if (isNaN(rate)) {
        return;
      }
      return window.a = rate;
    });
    in_delay_time.change(function() {
      var time;
      time = parseFloat(in_delay_time.val());
      log(time);
      if (isNaN(time)) {
        return;
      }
      return window.d = time;
    });
    in_repeat.change(function() {
      var repeat;
      repeat = parseFloat(in_repeat.val());
      log(repeat);
      if (isNaN(repeat)) {
        return;
      }
      return window.repeat = repeat;
    });
    btn_delay.click(function() {
      in_dec_rate.val(0.5);
      in_dec_rate.change();
      in_delay_time.val(0.375);
      in_delay_time.change();
      in_repeat.val(2);
      return in_repeat.change();
    });
    return btn_reverb.click(function() {
      in_dec_rate.val(0.5);
      in_dec_rate.change();
      in_delay_time.val(0.05);
      in_delay_time.change();
      in_repeat.val(10);
      return in_repeat.change();
    });
  };

  connect = function(node) {
    var nodes, source;
    nodes = window.nodes;
    source = nodes.length === 0 ? window.source : nodes[nodes.length - 1];
    source.connect(node);
    node.connect(window.analyser);
    nodes.push(node);
    return log(window.nodes);
  };

  disconnect = function(node) {
    var destination, i, item, nodes, source, _i, _ref;
    nodes = window.nodes;
    if (nodes.length === 0) {
      return;
    }
    for (i = _i = 0, _ref = nodes.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (nodes[i] === node) {
        break;
      }
    }
    source = i === 0 ? window.source : nodes[i - 1];
    destination = i === nodes.length - 1 ? window.analyser : nodes[i + 1];
    source.disconnect(0);
    node.disconnect(0);
    source.connect(destination);
    window.nodes = (function() {
      var _j, _len, _results;
      _results = [];
      for (_j = 0, _len = nodes.length; _j < _len; _j++) {
        item = nodes[_j];
        if (item !== node) {
          _results.push(item);
        }
      }
      return _results;
    })();
    return log(window.nodes);
  };

  this.startDrawing = function(analyser) {
    var drawAnimation, frequencyContext, frequencyData, frequencyElement, height, timeDomainContext, timeDomainData, timeDomainElement, width;
    frequencyElement = $("#frequency").get(0);
    timeDomainElement = $("#timedomain").get(0);
    width = $("#frequency").prop("offsetWidth");
    height = $("#frequency").prop("offsetHeight");
    frequencyElement.width = width;
    frequencyElement.height = height;
    timeDomainElement.width = width;
    timeDomainElement.height = height;
    frequencyContext = frequencyElement.getContext("2d");
    timeDomainContext = timeDomainElement.getContext("2d");
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    timeDomainData = new Uint8Array(analyser.frequencyBinCount);
    drawAnimation = function() {
      var i, _i, _j, _ref, _ref1;
      analyser.getByteFrequencyData(frequencyData);
      analyser.getByteTimeDomainData(timeDomainData);
      frequencyContext.clearRect(0, 0, width, height);
      frequencyContext.strokeStyle = 'rgb(4,68,57)';
      frequencyContext.beginPath();
      frequencyContext.moveTo(0, height - frequencyData[0]);
      log(frequencyData.length);
      for (i = _i = 1, _ref = frequencyData.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
        frequencyContext.lineTo(i, height - frequencyData[i]);
      }
      frequencyContext.stroke();
      timeDomainContext.clearRect(0, 0, width, height);
      timeDomainContext.strokeStyle = 'rgb(4,68,57)';
      timeDomainContext.beginPath();
      timeDomainContext.moveTo(0, height - timeDomainData[0]);
      for (i = _j = 1, _ref1 = timeDomainData.length; 1 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
        timeDomainContext.lineTo(i, height - timeDomainData[i]);
      }
      timeDomainContext.stroke();
      return requestAnimationFrame(drawAnimation);
    };
    return drawAnimation();
  };

}).call(this);
