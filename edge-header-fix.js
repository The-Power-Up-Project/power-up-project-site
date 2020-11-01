if(navigator.userAgent.match(/Trident\/7\./)) { // if IE
  $('body').on("mousewheel", function (event) {
      // remove default behavior
      event.preventDefault(); 

      //scroll without smoothing
      var wheelDelta = event.wheelDelta;
      var currentScrollPosition = window.pageYOffset;
      window.scrollTo(0, currentScrollPosition - wheelDelta);
  });
}   