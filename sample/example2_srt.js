0
00:00:00,000 --> 00:00:20,000
var g=document.createElement("canvas");
g.id = "canvas";
document.getElementsByTagName( 'body' )[ 0 ].appendChild(g);
var g2=document.createElement("div");
g2.id = "label-container";
document.getElementsByTagName( 'body' )[ 0 ].appendChild(g2);
loadScript('//cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js',function(e){
    loadScript('//cdn.jsdelivr.net/npm/@teachablemachine/pose@0.8/dist/teachablemachine-pose.min.js',function(e2){
	URL = "https://teachablemachine.withgoogle.com/models/zbz6WeQL8/";
	model = null;
	let webcam, ctx, labelContainer, maxPredictions;
	init = async function init() {
	    modelURL = URL + "model.json";
	    metadataURL = URL + "metadata.json";
	    // load the model and metadata
	    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
	    // Note: the pose library adds a tmPose object to your window (window.tmPose)
	    model = await tmPose.load(modelURL, metadataURL);
	    maxPredictions = model.getTotalClasses();
	    // Convenience function to setup a webcam
            size = 200;
            flip = true; // whether to flip the webcam
            webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
            await webcam.setup(); // request access to the webcam
            await webcam.play();
	    window.requestAnimationFrame(loop);
	    // append/get elements to the DOM
            canvas = document.getElementById("canvas");
            canvas.width = size; canvas.height = size;
            ctx = canvas.getContext("2d");
            labelContainer = document.getElementById("label-container");
            for (let i = 0; i < maxPredictions; i++) { // and class labels
		labelContainer.appendChild(document.createElement("div"));
            }
	}
	init();
	loop = async function loop(timestamp) {
            webcam.update(); // update the webcam frame
            await predict();
	    console.log("test");
            window.requestAnimationFrame(loop);
	}
	prediction = null;
	currentpose = null;
	ary = null;
	async function predict() {
	    // Prediction #1: run input through posenet
	    // estimatePose can take in an image, video or canvas html element
	    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
	    // Prediction 2: run input through teachable machine classification model
	    prediction = await model.predict(posenetOutput);   
	    for (let i = 0; i < maxPredictions; i++) {
		classPrediction =
		      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
		labelContainer.childNodes[i].innerHTML = classPrediction;
	    }
	    drawPose(pose);
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
	function drawPose(pose) {
	    if (webcam.canvas) {
		ctx.drawImage(webcam.canvas, 0, 0);
		// draw the keypoints and skeleton
		if (pose) {
		    const minPartConfidence = 0.5;
		    tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
		    tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
		}
	    }
	}
    });
});

1
00:00:55,000 --> 00:01:09,000
if (currentpose != "肩甲骨") {
    player.seekTo(40,true);//0:40、15s ago
}

2
00:01:46,000 --> 00:01:55,000
if (currentpose != "肘した") {
    player.seekTo(101,true);//1:41、5s ago
}

3
00:02:12,000 --> 00:02:20,000
if (currentpose != "右傾け") {
    player.seekTo(120,true);//2:00、12s ago
}

4
00:02:30,000 --> 00:02:45,000
if (currentpose != "左傾け") {
    player.seekTo(146,true);//2:26、4s ago
}

5
00:03:00,000 --> 00:03:20,000
if (currentpose != "首ぐるぐる") {
    player.seekTo(168,true);//2:48、12s ago
}

6
00:03:40,000 --> 00:04:55,000
if (currentpose != "合掌ピーン") {
    player.seekTo(218,true);//3:38、2s ago
}

7
00:05:25,000 --> 00:06:00,000
if (currentpose != "うさぎのポーズ") {
    player.seekTo(300,true);//5:00、25s ago
}

8
00:06:15,000 --> 00:06:43,000
if (currentpose != "肩こり解消") {
    player.seekTo(360,true);//6:00、15s ago
}

9
00:06:51,000 --> 00:07:20,000
if (currentpose != "おやすみ_おでこ") {
    player.seekTo(405,true);//6:45、6s ago
}

10
00:07:30,000 --> 00:07:42,000
if (currentpose != "足たたく") {
    player.seekTo(444,true);//7:24、6s ago
}

10
00:08:16,000 --> 00:08:55,000
if (currentpose != "仰向け_腰上げ") {
    player.seekTo(470,true);//7:50、26s ago
}

11
00:09:20,000 --> 00:10:20,000
if (currentpose != "後転直前") {
    player.seekTo(540,true);//9:00、20s ago
}
