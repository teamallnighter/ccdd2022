function randomImage() {
    var images = [
        'assets/media/img/bg1.png',
        'assets/media/img/bg2.png',
        'assets/media/img/bg3.png',
        'assets/media/img/bg4.png',
        'assets/media/img/bg5.png',
    ];
    var size = images.length;
    var x = Math.floor(size * Math.random());
    console.log(x);
    var element = document.getElementsByClassName('parallax');
    console.log(element);
    element[0].style["background-image"] = "url(" + images[x] + ")";
}

document.addEventListener("DOMContentLoaded", randomImage);