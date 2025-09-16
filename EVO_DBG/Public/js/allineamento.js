function cacheCleaner() {
	let tScript = $("script");

	for (let i = 0; i < tScript.length; i++) {
		let type = tScript[i].type,
			src = tScript[i].src;

		if (type === "text/javascript" && src.length > 0 && src.indexOf("?") === -1 && src.slice(src.length - 3).toLowerCase() === ".js") {
			let iFrame = document.createElement("iframe");
			iFrame.src = src + "?rnd=" + Math.trunc(Math.random() * 1000000000);
			iFrame.style = "display: none;";

			document.body.appendChild(iFrame);
		}
	}

	let tLink = $("link");

	for (let i = 0; i < tLink.length; i++) {
		let type = tLink[i].type,
			rel = tLink[i].rel,
			href = tLink[i].href;

		if (type === "text/css" && rel === "stylesheet" && href.length > 0 && href.indexOf("?") === -1 && href.slice(href.length - 4).toLowerCase() === ".css") {
			let iFrame = document.createElement("iframe");
			iFrame.src = href + "?rnd=" + Math.trunc(Math.random() * 1000000000);
			iFrame.style = "display: none;";

			document.body.appendChild(iFrame);
		}
	}

	setTimeout(function () {
		location.reload();
	}, 250);
}


function changebackimg(img) {
	var left = $(".chgbackimg").css('left');
	var top = $(".chgbackimg").css('top');
	var style = "background-image: url('" + img + "') !important; left: " + left + "; top: " + top + ";";
	$(".chgbackimg").attr('style', style);
}
