// 前に送信したデューティー比を覚えておく
var rate25Prev = 0;
var rate24Prev = 0;
var rate23Prev = 0;
var rate22Prev = 0;

// デューティー比がth (0.0～1.0) 以上変化した時のみ値を送信
var th = 0.1;
// モーターの最大速度 (0.0～1.0)。モーターを保護する意味で1.0にはしない方が良い
var maxSpeed = 0.8;
// 命令送信ごとに増加するIDを作成（iOSのSafariでPOSTがキャッシュされることの対策）
var commandID = 0;

ZGN(function() {
	// zugyuuunの準備が終わってからstyles.cssを適用する
	applyCustomCss('styles3.css');	

	// ターミナル取得
	var term = ZGN.term(1);
	
	/**	
	term.gpio.pinMode('19', ZGN.PWM);
	term.gpio.pinMode('18', ZGN.PWM);
	term.gpio.pinMode('13', ZGN.PWM);
	term.gpio.pinMode('12', ZGN.PWM);
	*/


	term.gpio.pinMode('19', ZGN.OUTPUT);
	term.gpio.pinMode('18', ZGN.OUTPUT);
	term.gpio.pinMode('13', ZGN.OUTPUT);
	term.gpio.pinMode('12', ZGN.OUTPUT);


	
	// まずモーターを止める
	modPinValue(0, 0, 0, 0);

    // タッチエリアの設定
    var touchArea = $("#touchArea")[0];

    // タッチイベントのイベントリスナーの登録
    touchArea.addEventListener("touchstart", touchEvent, false);
    touchArea.addEventListener("touchmove", touchEvent, false);
    touchArea.addEventListener("touchend", touchEndEvent, false);

    // クリックイベントのイベントリスナーの登録
    touchArea.addEventListener("click", clickEvent, false);	
	

	function modPinValue(rate25, rate24, rate23, rate22) {
		
		/**
		term.gpio.pwmWrite('19', rate25, function() {
			console.log("pin 19 PWM: " + rate25);
		});
		term.gpio.pwmWrite('18', rate24, function() {
			console.log("pin 18 PWM: " + rate24);
		});
		term.gpio.pwmWrite('13', rate23, function() {
			console.log("pin 13 PWM: " + rate23);
		});
		term.gpio.pwmWrite('12', rate22, function() {
			console.log("pin 12 PWM: " + rate22);
		});
		*/ 


		if ( rate25 > 0.4 ) { 
			term.gpio.digitalWrite('19', ZGN.HIGH, function(){
				console.log("pin 19 DIGIT: HIGH");
			});
		} else {
			term.gpio.digitalWrite('19', ZGN.LOW, function(){
				console.log("pin 19 DIGIT: LOW");
			});
		}
		if ( rate24 > 0.4 ) { 
			term.gpio.digitalWrite('18', ZGN.HIGH, function(){
				console.log("pin 18 DIGIT: HIGH");
			});
		} else {
			term.gpio.digitalWrite('18', ZGN.LOW, function(){
				console.log("pin 18 DIGIT: LOW");
			});
		}
		if ( rate23 > 0.4 ) { 
			term.gpio.digitalWrite('13', ZGN.HIGH, function(){
				console.log("pin 13 DIGIT: HIGH");
			});
		} else {
			term.gpio.digitalWrite('13', ZGN.LOW, function(){
				console.log("pin 13 DIGIT: LOW");
			});
		}
		if ( rate22 > 0.4 ) { 
			term.gpio.digitalWrite('12', ZGN.HIGH, function(){
				console.log("pin 12 DIGIT: HIGH");
			});
		} else {
			term.gpio.digitalWrite('12', ZGN.LOW, function(){
				console.log("pin 12 DIGIT: LOW");
			});
		}

		rate25Prev = rate25;
		rate24Prev = rate24;
		rate23Prev = rate23;
		rate22Prev = rate22;
	}
	
	function touchEvent(e){
	    e.preventDefault();

	    var touch = e.touches[0];  
	    var width = document.getElementById("touchArea").offsetWidth;
	    var height = document.getElementById("touchArea").offsetHeight;

	    if(touch.pageX<width/3){ // 左旋回
	        var rate = maxSpeed*(width/3-touch.pageX)/(width/3);

	        // 前回送信時と値が大きく違うときのみ送信
	        if(Math.abs(rate-rate24Prev)>th || Math.abs(rate-rate23Prev)>th){
	        	modPinValue(0, rate, rate, 0);
	        }
	    }else if(touch.pageX<2*width/3){ // 前後移動
	        // 左右の車輪の速さの違いの補正
	        //var modL = (1.2-0.8)*(touch.pageX-width/3)/(width/3) + 0.8;
	        //var modR = (0.8-1.2)*(touch.pageX-width/3)/(width/3) + 1.2;

	        if(touch.pageY<height/2){
	            var rate = maxSpeed*(height/2-touch.pageY)/(height/2);
	            //modL *= rate;
	            //modR *= rate;

	            //if(modL > 1.0){ modL = 1.0; }
	            //if(modR > 1.0){ modR = 1.0; }

	            // 前回送信時と値が大きく違うときのみ送信
	            if(Math.abs(rate-rate25Prev)>th || Math.abs(rate-rate23Prev)>th){
	            	modPinValue(rate, 0, rate, 0);
	            }
	        }else{
	            var rate = maxSpeed*(touch.pageY-height/2)/(height/2);
	            //modL *= rate;
	            //modR *= rate;

	            //if(modL > 1.0){ modL = 1.0; }
	            //if(modR > 1.0){ modR = 1.0; }

	            // 前回送信時と値が大きく違うときのみ送信
	            if(Math.abs(rate-rate24Prev)>th || Math.abs(rate-rate22Prev)>th){
	            	modPinValue(0, rate, 0, rate);
	            }
	        }

	    }else{ // 右旋回
	        var rate = maxSpeed*(touch.pageX - 2*width/3)/(width/3);

	        // 前回送信時と値が大きく違うときのみ送信
	        if(Math.abs(rate-rate25Prev)>th || Math.abs(rate-rate22Prev)>th){
	        	modPinValue(rate, 0, 0, rate);
	        }
	    }

	}

	// タッチ終了時のイベントリスナー
	function touchEndEvent(e){
	    e.preventDefault();

		modPinValue(0, 0, 0, 0);
	}

	// クリック時のイベントリスナー（主にPC用）
	function clickEvent(e){

	    var width = document.getElementById("touchArea").offsetWidth;
	    var height = document.getElementById("touchArea").offsetHeight;

	    if(e.pageX<width/3){ // 左旋回
	        var rate = maxSpeed*(width/3-e.pageX)/(width/3);

			modPinValue(0, rate, rate, 0);
	    }else if(e.pageX<2*width/3){ // 前後移動
	        // 左右の車輪の速さの違いの補正
	        //var modL = (1.2-0.8)*(e.pageX-width/3)/(width/3) + 0.8;
	        //var modR = (0.8-1.2)*(e.pageX-width/3)/(width/3) + 1.2;

	        if(e.pageY>=2*height/5 && e.pageY<3*height/5){
	        	modPinValue(0, 0, 0, 0);
	        }else if(e.pageY<height/2){
	            var rate = maxSpeed*(height/2-e.pageY)/(height/2);
	            //modL *= rate;
	            //modR *= rate;

	            //if(modL > 1.0){ modL = 1.0; }
	            //if(modR > 1.0){ modR = 1.0; }

				modPinValue(rate, 0, rate, 0);
	        }else{
	            var rate = maxSpeed*(e.pageY-height/2)/(height/2);
	            //modL *= rate;
	            //modR *= rate;

	            //if(modL > 1.0){ modL = 1.0; }
	            //if(modR > 1.0){ modR = 1.0; }

				modPinValue(0, rate, 0, rate);
	        }

	    }else{ // 右旋回
	        var rate = maxSpeed*(e.pageX - 2*width/3)/(width/3);

			modPinValue(rate, 0, 0, rate);
	    }

	}	

	function applyCustomCss(custom_css){
	    var head = document.getElementsByTagName('head')[0];
	    var style = document.createElement('link');
	    style.rel = "stylesheet";
	    style.type = 'text/css';
	    style.href = custom_css;
	    head.appendChild(style);
	}

})



