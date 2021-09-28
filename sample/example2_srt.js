0
00:00:00,000 --> 00:00:20,000
loadScript('//cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js',function(e){
    loadScript('//cdn.jsdelivr.net/npm/@teachablemachine/pose@0.8/dist/teachablemachine-pose.min.js',function(e2){
	URL = "./my_model/";
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
	loop = async function loop(timestamp) {
            webcam.update(); // update the webcam frame
            await predict();
	    console.log("test");
            window.requestAnimationFrame(loop);
	}
	video = document.getElementById("video")
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
        }).then(stream => {
            video.srcObject = stream;
            video.play()
        }).catch(e => {
            console.log(e)
        })
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
	    drowPose(pose);
	    // finally draw the poses
	    //console.log(typeof(pose));
	    //ここに追記する
	    // １番確率の高いポーズを求める。    
	    // その確率が予め決めた閾値以上であったら
	    // そのポーズのラベルを、グローバル変数currentPoseに書き込む
	    for (let i = 0;i<10;i++) {
		ary.push(prediction[i] / 10);
	    }
	    aryMax = function (a, b) {return Math.max(a, b);}
	    max = ary.reduce(aryMax);
	    console.log(max);
	    if (max > 0.6) {
		currentpose = pose.lavel;
	    }
	}
	judge = function judge() {
	    video = document.getElementById("video")
            navigator.mediaDevices.getUserMedia({
		video: true,
		audio: false,
            }).then(stream => {
		video.srcObject = stream;
		video.play()
            }).catch(e => {
		console.log(e)
            })
	    for (let i = 0;i<10;i++) {
		ary.push(prediction[i] / 10);
	    }
	    aryMax = function (a, b) {return Math.max(a, b);}
	    max = ary.reduce(aryMax);
	    if (max > 0.6) {
		currentpose = pose.lavel;
	    }
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
//alert("1つ目のポーズ");
//init();
//loop();
//predict();
//judge();
//console.log(max);
if (currentpose != "安楽座_左ねじれ") {
    player.seekTo(40,true);
    //alertのokをおしてから巻き戻す＝＞ポーズが取れていない秒数を開始時間にしてから書く
}
