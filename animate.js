function fadeInChildren(){
  var queue = [];
  $(".content .container .row").children().each(function(){
    queue.push($(this).find("h5"));
    $(this).find("h5").css("display", "inline");
    $(this).find(".list-group").children().each(function(){
      $(this).css("display", "inline");
      queue.push($(this));
    });
  });
  var currentIndex = 0;
  var currentInterval = window.setInterval(function(){
    $("#navbar").css("transition", "2s");
    $("#navbar").css("-webkit-transition", "2s");
    queue[currentIndex].css("opacity", 1);
    queue[currentIndex].css("transition", "0.5s");
    queue[currentIndex].css("-webkit-transition", "0.5s");
    currentIndex += 1;
    if(currentIndex >= queue.length){
      window.clearInterval(currentInterval);
      $("#navbar").css("opacity", 1);
      localStorage.setItem('finished', 'true');
    }
  }, 500);
}
function fadeInDescription(){
  setTimeout(fadeInChildren, 2000);
}
function isReady(){
  if(localStorage.getItem('finished') !== 'true'){
    $("#name").css("opacity", 0);
    $("#description").css("opacity", 0);
    $(".content .container .row").children().each(function(){
      $(this).find("h5").css("display", "none");
      $(this).find("h5").css("opacity", 0);
      $(this).find("h5").css("transition", "2s");
      $(this).find("h5").css("-webkit-transition", "2s");
      $(this).find(".list-group").children().each(function(){
        $(this).css("display", "none");
        $(this).css("opacity", 0);
        $(this).css("transition", "2s");
        $(this).css("-webkit-transition", "2s");
      });
    });
    $("body").css("background", "#000000");
    $(".background .row").css("opacity", 0);
    $("#navbar").css("opacity", 0);
    $("#navbar").css("transition", "0s");
    $("#navbar").css("-webkit-transition", "0s");
    $(".center").html(function(){
      var h = $(".center").html();
      h += "<h1 id=\"welcome\" style=\"transition: 2s; -webkit-transition: 2s; opacity: 0;\">Welcome.</h1>";
      return h;
    });
    setTimeout(function(){
      $("#welcome").css("opacity", 1);
      $("#name").css("-webkit-transition", "1s");
      $("#name").css("transition", "1s");
      setTimeout(function(){        
        $(".background .row").css("transition", "2s");
        $(".background .row").css("-webkit-transition", "2s");
        $(".background .row").css("-webkit-transition-property", "opacity");
        $(".background .row").css("opacity", 1);
        setTimeout(function(){
        $("body").css("background", "");
        $("body").css("background", "linear-gradient(to right, #CC0000, #FF8800, #77B300, #2A9FD6);");
        }, 2000);
      }, 500);
      setTimeout(function(){
          $("#welcome").css("opacity", 0);
          setTimeout(function(){
            $("#description").css("opacity", 1);
            $("#name").css("opacity", 1);
            setTimeout(fadeInDescription, 2000);
          }, 3000);
      }, 2000);
    }, 1500);
  }
}
