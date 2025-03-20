const mainDiv = document.getElementById("myDiv");
const copyBtn = document.getElementById("copyIcon");
const quoteArea = document.getElementById("setQuote");
const authorName = document.getElementById("authorName");
const twitterButton = document.getElementById("twitterButton");
const downloadButton = document.getElementById("downloadButton");

fetchNewQuote();

function fetchNewQuote() {
    fetch("https://api.freeapi.app/api/v1/public/quotes/quote/random")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        let randomImageUrl = `https://random-image-pepebigotes.vercel.app/api/random-image?${new Date().getTime()}`;
        myDiv.style.backgroundImage = `url(${randomImageUrl})`;

        let quoteText = data.data.content;
        document.getElementById("setQuote").innerHTML = `“${quoteText}”`;
        authorName.innerHTML = `- ${data.data.author}`;
        successMsg(data.message);
    })
    .catch(error => {
        errorMsg(error);
    });
}

function copyToClipboard() {
    let quoteText = document.getElementById("setQuote").innerText;
    let author = document.getElementById("authorName").innerText;
    let fullText = `${quoteText} \n${author}`;

    let tempInput = document.createElement("textarea");
    tempInput.value = fullText;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    successMsg("Quote copied successfully!");
}


function downloadQuoteImage() {
    let myDiv = document.getElementById("myDiv");
    let backgroundImage = myDiv.style.backgroundImage;
    
    if (!backgroundImage) {
        errorMsg("background image found.");
        return;
    }
    
    let imageUrl = backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');

    let img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = function () {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        let link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "quote.png";
        link.click();
    };

    img.onerror = function () {
        errorMsg("Failed to load background image due to CORS.");
    };
}



function shareQuoteOnTwitter() {
    let quoteDiv = document.getElementById("quoteData");
    
    if (!quoteDiv) {
        errorMsg("Element #myDiv not found.");
        return;
    }

    let quoteText = quoteDiv.innerText.trim();
    let twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteText)}`;
    
    window.open(twitterUrl, "_blank");
}

function successMsg(message) {
    let toast = document.createElement("div");
    toast.className = "success-message";
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}

function errorMsg(message) {
    let toast = document.createElement("div");
    toast.className = "error-message";
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}