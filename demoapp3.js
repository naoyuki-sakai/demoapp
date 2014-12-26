// 前に送信したデューティー比を覚えておく
var rate4Prev = 0;
var rate3Prev = 0;
var rate2Prev = 0;
var rate1Prev = 0;

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
	
	term.gpio.pinMode('19', ZGN.PWM);
	term.gpio.pinMode('18', ZGN.PWM);

	term.gpio.pinMode('4', ZGN.OUTPUT);
	term.gpio.pinMode('3', ZGN.OUTPUT);
	term.gpio.pinMode('2', ZGN.OUTPUT);
	term.gpio.pinMode('1', ZGN.OUTPUT);


	
	// まずモーターを止める
	modPinValue(0, 0, 0, 0, 1.0);

    // タッチエリアの設定
    var touchArea = $("#touchArea")[0];

    // タッチイベントのイベントリスナーの登録
    touchArea.addEventListener("touchstart", touchEvent, false);
    touchArea.addEventListener("touchmove", touchEvent, false);
    touchArea.addEventListener("touchend", touchEndEvent, false);

    // クリックイベントのイベントリスナーの登録
    touchArea.addEventListener("click", clickEvent, false);	
	

	function modPinValue(in4, in3, in2, in1, rate) {
		// モータードライバー入力端子への出力
		digitOutput('4', in4);
		digitOutput('3', in3);
		digitOutput('2', in2);
		digitOutput('1', in1);


		rate4Prev = rate*in4;
		rate3Prev = rate*in3;
		rate2Prev = rate*in2;
		rate1Prev = rate*in1;

		// PWM 制御端子への出力
		pwmOutput('19', rate);
		pwmOutput('18', rate);
	}
	
	function digitOutput(pinNo, digitIn){
		if ( digitIn == 1 ) { 
			term.gpio.digitalWrite(pinNo, ZGN.HIGH, function(){
				console.log("pin " + pinNo + " DIGIT: HIGH");
			});
		} else {
			term.gpio.digitalWrite(pinNo, ZGN.LOW, function(){
				console.log("pin " + pinNo + " DIGIT: LOW");
			});
		}
	}
	
	function pwmOutput(pinNo, vreff){
		term.gpio.pwmWrite(pinNo, vreff, function() {
			console.log("pin " + pinNo + " PWM: " + vreff);
		});
	}
	
	function touchEvent(e){
	    e.preventDefault();

	    var touch = e.touches[0];  
	    var width = document.getElementById("touchArea").offsetWidth;
	    var height = document.getElementById("touchArea").offsetHeight;

	    if(touch.pageX<width/3){ // 左旋回
	        var rate = maxSpeed*(width/3-touch.pageX)/(width/3);
	        // 前回送信時と値が大きく違うときのみ送信
	        if(Math.abs(rate-rate3Prev)>th || Math.abs(rate-rate2Prev)>th){
	        	modPinValue(0, 1, 1, 0, rate);
	        }
	    }else if(touch.pageX<2*width/3){ // 前後移動
	        // 左右の車輪の速さの違いの補正

	        if(touch.pageY<height/2){
	            var rate = maxSpeed*(height/2-touch.pageY)/(height/2);

	            // 前回送信時と値が大きく違うときのみ送信
	            if(Math.abs(rate-rate4Prev)>th || Math.abs(rate-rate2Prev)>th){
	            	modPinValue(1, 0, 1, 0, rate);
	            }
	        }else{
	            var rate = maxSpeed*(touch.pageY-height/2)/(height/2);

	            // 前回送信時と値が大きく違うときのみ送信
	            if(Math.abs(rate-rate3Prev)>th || Math.abs(rate-rate1Prev)>th){
	            	modPinValue(0, 1, 0, 1, rate);
	            }
	        }

	    }else{ // 右旋回
	        var rate = maxSpeed*(touch.pageX - 2*width/3)/(width/3);

	        // 前回送信時と値が大きく違うときのみ送信
	        if(Math.abs(rate-rate4Prev)>th || Math.abs(rate-rate1Prev)>th){
	        	modPinValue(1, 0, 0, 1, rate);
	        }
	    }

	}

	// タッチ終了時のイベントリスナー
	function touchEndEvent(e){
	    e.preventDefault();

		modPinValue(0, 0, 0, 0, 1.0);
	}

	// クリック時のイベントリスナー（主にPC用）
	function clickEvent(e){

	    var width = document.getElementById("touchArea").offsetWidth;
	    var height = document.getElementById("touchArea").offsetHeight;

	    if(e.pageX<width/3){ // 左旋回
	        var rate = maxSpeed*(width/3-e.pageX)/(width/3);
			modPinValue(0, 1, 1, 0, rate);
	    }else if(e.pageX<2*width/3){ // 前後移動
	        // 左右の車輪の速さの違いの補正
	        if(e.pageY>=2*height/5 && e.pageY<3*height/5){
	        	modPinValue(0, 0, 0, 0, rate);
	        }else if(e.pageY<height/2){
	            var rate = maxSpeed*(height/2-e.pageY)/(height/2);
				modPinValue(1, 0, 1, 0, rate);
	        }else{
	            var rate = maxSpeed*(e.pageY-height/2)/(height/2);
				modPinValue(0, 1, 0, 1, rate);
	        }
	    }else{ // 右旋回
	        var rate = maxSpeed*(e.pageX - 2*width/3)/(width/3);
			modPinValue(1, 0, 0, 1, rate);
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



