var sliderMin = 0;
var sliderMax = 20;
var sliderStep = 1;
var sliderValue = 0;

ZGN(function() {
	var sliderMin = 0;
	var sliderMax = 20;
	var sliderStep = 1;
	var sliderValue = 0;

	initialize();

	var term = ZGN.term(1);
	
	var pin1 = '25';
	term.gpio.pinMode(pin1, ZGN.PWM);
	
	var pin2 = '24';
	term.gpio.pinMode(pin2, ZGN.PWM);
	
	var pin3 = '23';
	term.gpio.pinMode(pin3, ZGN.PWM);
	
	
    // スライダを動かしたときに呼ばれるイベントハンドラの設定
    var sliderHandler1 = function(e, ui){
        var ratio = ui.value/sliderMax;
        // 共通カソードの場合次の行を無効に
        ratio = 1.0 - ratio;
        term.gpio.pwmWrite(pin1, ratio, function () {
        	console.log('PWM: ' + ratio);
        });
    };
    var sliderHandler2 = function(e, ui){
        var ratio = ui.value/sliderMax;
        // 共通カソードの場合次の行を無効に
        ratio = 1.0 - ratio;
        term.gpio.pwmWrite(pin2, ratio, function () {
        	console.log('PWM: ' + ratio);
        });
    };
    var sliderHandler3 = function(e, ui){
        var ratio = ui.value/sliderMax;
        // 共通カソードの場合次の行を無効に
        ratio = 1.0 - ratio;
        term.gpio.pwmWrite(pin3, ratio, function () {
        	console.log('PWM: ' + ratio);
        });
    };

    // 3つのスライダへ設定を適用
    $( "#slider1" ).slider({
        min: sliderMin,
        max: sliderMax,
        step: sliderStep,
        value: sliderValue,
        change: sliderHandler1,
        slide: sliderHandler1
    });
    $( "#slider2" ).slider({
        min: sliderMin,
        max: sliderMax,
        step: sliderStep,
        value: sliderValue,
        change: sliderHandler2,
        slide: sliderHandler2
    });
    $( "#slider3" ).slider({
        min: sliderMin,
        max: sliderMax,
        step: sliderStep,
        value: sliderValue,
        change: sliderHandler3,
        slide: sliderHandler3
    });
});

function applyCustomCss(custom_css){
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('link');
    style.rel = "stylesheet";
    style.type = 'text/css';
    style.href = custom_css;
    head.appendChild(style);
}

function initialize(){
    applyCustomCss('styles.css');
    
    console.log("applied styles.css");
}

