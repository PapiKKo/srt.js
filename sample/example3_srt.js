0
00:00:00,000 --> 00:00:15,000
doOnce[0] = true;
var g=document.createElement("div");
g.id = "webcam-container";
document.getElementsByTagName( 'body' )[ 0 ].appendChild(g);
var time=document.createElement("div");
time.id = "stopwatch";
document.getElementsByTagName( 'body' )[ 0 ].appendChild(time);
loadScript('//cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js',function(e){
    loadScript('//cdn.jsdelivr.net/npm/@teachablemachine/image@0.8/dist/teachablemachine-image.min.js',function(e2){
	URL = "https://teachablemachine.withgoogle.com/models/L2MQt0wYW/";
	model = null;
	let webcam, labelContainer, maxPredictions;
	stopwatch = null;
	init = async function init() {
	    modelURL = URL + "model.json";
	    metadataURL = URL + "metadata.json";
	    // load the model and metadata
            // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
            // or files from your local hard drive
            // Note: the pose library adds "tmImage" object to your window (window.tmImage)
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();
	    // Convenience function to setup a webcam
            size = 400;
            flip = true; // whether to flip the webcam
            webcam = new tmImage.Webcam(size, size, flip); // width, height, flip
            await webcam.setup(); // request access to the webcam
            await webcam.play();
	    window.requestAnimationFrame(loop);
	    // append/get elements to the DOM
            document.getElementById("webcam-container").appendChild(webcam.canvas);
            //labelContainer = document.getElementById("label-container");
            //for (let i = 0; i < maxPredictions; i++) { // and class labels
		//labelContainer.appendChild(document.createElement("div"));
	    stopwatch = document.getElementById("stopwatch");
	    stopwatch.appendChild(document.createElement("div"));
	    stopwatch.innerHTML = "00:00:00";
	}
	init();
	//start();
	loop = async function loop(timestamp) {
            webcam.update(); // update the webcam frame
            await predict();
	    //study('id');
	    //console.log("test");
            window.requestAnimationFrame(loop);
	}
	prediction = null;
	currentpose = null;
	ary = null;
	// run the webcam image through the image model
	async function predict() {
	    // predict can take in an image, video or canvas html element
            const prediction = await model.predict(webcam.canvas);
            for (let i = 0; i < maxPredictions; i++) {
		const classPrediction =
                  prediction[i].className + ": " + prediction[i].probability.toFixed(2);
		//labelContainer.childNodes[i].innerHTML = classPrediction;
            }
	    // finally draw the poses
	    //console.log(typeof(pose));
	    //ここに追記する
	    // １番確率の高いポーズを求める。    
	    // その確率が予め決めた閾値以上であったら
	    // そのポーズのラベルを、グローバル変数currentPoseに書き込む
	    let max_id = 0;
	    let max = -1;
	    for (let i=0;i<maxPredictions;i++){
		    if (prediction[i].probability > max){
		      max_id = i;
		      max = prediction[i].probability;
		  }
		}
	    if (prediction[max_id].probability > 0.8)
		    currentpose = prediction[max_id].className;
	    //console.log(currentpose);
	}
	//経過時刻を更新するための変数。 初めだから0で初期化
	elapsedTime = 0;
	timerId = 0;
	timeToadd = 0;
	sh = 00;
	sm = 00;
	ss = 00;
    });
});

1
00:00:30,000
const music = new Audio('./with_video/white_noise1.mp3');
music.volume = 0.5;
point = 0;
startTime = 0;
stopTime = 0;
text = "START";
study('id');
function study(id) {
    id = setInterval(function () {
	if (currentpose == "drinking") {
	    if (text == "START") {
		stop();
		console.log("if stop()");
		console.log("水分補給中");
	    }
	    point = 0;
	    music.pause();
	    console.log("水分補給中");
	}
	if (currentpose == "スマホ") {
	    point++;
	    if (text == "START") {
		stop();
		console.log("if stop()");
	    }
	    if (point == 3) {
		player.playVideo();
		music.play();
		music.loop = true;
		console.log("スマホ見てまーーーーーーす");
		point = 1;
	    }
	}if (currentpose == "離席") {
	    if (text == "START") {
		stop();
		console.log("if stop()");
		console.log("席離れてまーーーーーーーす");
	    }
	    point = 0;
	    player.pauseVideo();
	    music.pause();
	    console.log("席離れてまーーーーーーーす");
	}if (currentpose == "勉強") {
	    if (player.getPlayerState() == 1) {
		if (text == "STOP") {
		    start();
		    console.log("if start()");
		}
		point = 0;
		player.playVideo();
		music.pause();
		//console.log("勉強してまーーーーーーーす");
		//console.log("勉強時間：" + sh + ":"+ sm + ":" +ss);
	    }
	    if (player.getPlayerState() == 2) {
		if (text == "START") {
		    stop();
		    console.log("if stop()");
		    console.log("ちょっと停止しまーーーーす");
		}
		point = 0;
		player.pauseVideo();
		music.pause();
		console.log("ちょっと停止しまーーーーす");
	    }
	    music.pause();
	}
	if(currentpose == "手のひら") {
		if (text == "START") {
		    stop();
		    player.pauseVideo();
		    music.pause();
		    console.log("if stop()");
		    console.log("ちょっと停止しまーーーーす");
		}
		if (text == "STOP") {
		    start();
		    player.playVideo();
		    music.pause();
		    console.log("if start()");
		}
	}
    }, 1000);
}
function stop(id) {
    clearInterval(id);
}
start = function start() {
    startTime = performance.now();
    text = "START";
    countUp();
}
stop = function stop() {
    text = "STOP";
    clearTimeout(timerId);
    timeToadd += performance.now() - startTime;
}
//再帰的に使える用の関数
countUp = function countUp(){
    timerId = setTimeout(function(){
	elapsedTime = performance.now() - startTime + timeToadd;
	updateTimetText();
	countUp();
    },10);
}
updateTimetText = function updateTimetText(){
    sh = Math.floor(elapsedTime / 3600000);
    sm = Math.floor(elapsedTime / 60000);
    ss = Math.floor(elapsedTime % 60000 / 1000);	    
    sh = ('0' + sh).slice(-2);
    sm = ('0' + sm).slice(-2);
    ss = ('0' + ss).slice(-2);
    stopwatch.innerHTML = sh + ":"+ sm + ":" +ss;
}
