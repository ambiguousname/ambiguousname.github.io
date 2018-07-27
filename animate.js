
function fadeInChildren(){
  var queue = [];
  $(".content .container .row").children().each(function(){
    queue.push($(this).find("h5"));
    $(this).find(".list-group").children().each(function(){
      queue.push($(this));
    });
  });
  var currentIndex = 0;
  var currentInterval = window.setInterval(function(){
    queue[currentIndex].stop().slideDown(500);
    currentIndex += 1;
    if(currentIndex >= queue.length){
      window.clearInterval(currentInterval);
      //Goodbye, fadeouts.
      $("#navbar").slideDown(500);
      localStorage.setItem('finished', 'true');
    }
  }, 1000);
}
function fadeInDescription(){
  $("#description").fadeIn(1000, fadeInChildren);
}
function isReady(){
  if(localStorage.getItem('finished') !== 'true'){
    $("#name").fadeOut(0);
    $(".background").animate({height: "0"}, 0);
    $("#description").fadeOut(0);
    $(".content .container .row").children().each(function(){
      $(this).find("h5").fadeOut(0);
      $(this).find(".list-group").children().each(function(){
        $(this).fadeOut(0);
      });
    });
    $("#navbar").fadeOut(0);
    $(".center").html(function(){
      var h = $(".center").html();
      h += "<h1 id=\"welcome\">Welcome.</h1>";
      return h;
    });
    $("#welcome").fadeOut(0);
    $("#welcome").fadeIn(1000);
    setTimeout(function(){
      $(".background").animate({height: "100%"}, 2000, function(){
        $("#welcome").fadeOut(1000, function(){
          $("#name").fadeIn(1000, fadeInDescription);
        });
      });
    }, 1000);
  }
}
