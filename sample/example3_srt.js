0
00:00:00,000 --> 00:00:20,000
doOnce[0]=true;
var g=document.createElement("div");
g.id = "webcam-container";
document.getElementsByTagName( 'body' )[ 0 ].appendChild(g);
var g2=document.createElement("div");
g2.id = "label-container";
document.getElementsByTagName( 'body' )[ 0 ].appendChild(g2);
loadScript('//cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js',function(e){
    loadScript('//cdn.jsdelivr.net/npm/@teachablemachine/image@0.8/dist/teachablemachine-image.min.js',function(e2){
	URL = "https://teachablemachine.withgoogle.com/models/L2MQt0wYW/";
	model = null;
	let webcam, labelContainer, maxPredictions;
	    // タイマー部
	let stop;
	let progress;
	let addition = 0;
	const record = document.querySelector("p.counter");
	// カウンター
	timer = function timer() {
	    const start = new Date().getTime();
	    stop = setInterval(function() {
		progress = new Date().getTime() - start + addition;
		const noms = progress / 1000;
		const millisecond = progress ? ("0" + String(noms).split(".")[1]).slice(-2) : "00";
		const nos = Math.trunc(noms);
		const second = nos ? ("0" + (nos % 86400 % 3600 %60)).slice(-2) : "00";
		const minute = nos >= 60 ? ("0" + Math.trunc(nos % 86400 % 3600 / 60)).slice(-2) : "00";
		const hour = nos >= 360 ? ("0" + Math.trunc(nos % 86400 / 3600)).slice(-2) : "00";
		if (progress < 86400) {
		    record.textContent = hour + ":" + minute + "." + second + "." + millisecond;
		} else {
		    record.textContent = "00:00.00.00"; clearInterval(stop); }
	    }, 10);
	}
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
            size = 200;
            flip = true; // whether to flip the webcam
            webcam = new tmImage.Webcam(size, size, flip); // width, height, flip
            await webcam.setup(); // request access to the webcam
            await webcam.play();
	    window.requestAnimationFrame(loop);
	    // append/get elements to the DOM
            document.getElementById("webcam-container").appendChild(webcam.canvas);
            labelContainer = document.getElementById("label-container");
            for (let i = 0; i < maxPredictions; i++) { // and class labels
		labelContainer.appendChild(document.createElement("div"));
            }
	}
	init();
	clearInterval(stop);
	progress = 0;
	//record.textContent = "00:00.00.00";
	addition = 0;
	loop = async function loop(timestamp) {
            webcam.update(); // update the webcam frame
            await predict();
	    console.log("test");
	    if (currentpose == "スマホ") {
		player.pauseVideo();
		clearInterval(stop);
    		addition = progress;
	    }if (currentpose == "離席") {
		player.pauseVideo();
		clearInterval(stop);
    		addition = progress;
	    }if (currentpose == "PC作業") {
		player.playVideo();
		progress = 0;
    		timer();
	    }
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
		labelContainer.childNodes[i].innerHTML = classPrediction;
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
	    if (prediction[max_id].probability > 0.6)
		    currentpose = prediction[max_id].className;
	    console.log(currentpose);
	}
    });
});

