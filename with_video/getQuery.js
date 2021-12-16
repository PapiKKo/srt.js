function execute() {
    var yoga = document.sampleForm.menu[0];
    var bgm = document.sampleForm.menu[1];
    var result = document.getElementById("result");
    var ankert = document.getElementById("ankert"); 
    result.innerHTML = "";
    ankert.innerHTML = "";
    var none = true;
    const textbox = document.getElementById("input-message");
    const inputValue = textbox.value;
    const url = new URL(inputValue);
    const params = new URLSearchParams(url.search);

    if(yoga.checked) {
        result.innerHTML = yoga.value + "が選択されています。";
	ankert.innerHTML = "https://forms.gle/MyJSeqMpmKfbRP4z7";
	window.open("http://localhost:4245/srt.js/index.htm?"+params+"&surl=./sample/example2_srt.js",'_blank');
        none = false;
    }
    if(bgm.checked) {
        result.innerHTML += bgm.value + "が選択されています。";
	ankert.innerHTML = "https://forms.gle/x7rm7X6VNzNp674s8";
	window.open("http://localhost:4245/srt.js/index.htm?"+params+"&surl=./sample/example3_srt.js",'_blank');
        none = false;
    }
}
function btnCopy() {
    const txt = document.querySelector('#ulID').innerText;
    navigator.clipboard.writeText(txt)
}
