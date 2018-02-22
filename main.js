function fadeInChildren(){
  var queue = [];
  $(".content .container .row").children().each(function(){
    queue.push($(this).find("h2"));
    $(this).find(".list-group").children().each(function(){
      queue.push($(this));
    });
  });
  var currentIndex = 0;
  var currentInterval = window.setInterval(function(){
    queue[currentIndex].fadeIn(500);
    currentIndex += 1;
    if(currentIndex >= queue.length){
      window.clearInterval(currentInterval);
      //Goodbye, fadeouts.
      localStorage.setItem('finished', 'true');
    }
  }, 1000);
}
function fadeInDescription(){
  $("#description").fadeIn(1000, fadeInChildren);
}
window.onload = function(){
  if(localStorage.getItem('finished') !== 'true'){
    $("#name").fadeOut(0);
    $("#description").fadeOut(0);
    $(".content .container .row").children().each(function(){
      $(this).find("h2").fadeOut(0);
      $(this).find(".list-group").children().each(function(){
        $(this).fadeOut(0);
      });
    });
    $("#name").fadeIn(1000, fadeInDescription);
  }
}
