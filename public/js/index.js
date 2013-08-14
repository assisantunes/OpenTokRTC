// Generated by CoffeeScript 1.6.1
(function() {
  var goToRoom, mtop;

  $("#roomName").focus();

  goToRoom = function() {
    var roomName;
    roomName = $("#roomName").val().trim();
    if (roomName.length <= 0) {
      alert("Room Name is Invalid");
      return;
    }
    $("#roomContainer").fadeOut('slow');
    return window.location = "/" + roomName;
  };

  $('#submitButton').click(function() {
    return goToRoom();
  });

  $('#roomName').keypress(function(e) {
    if (e.keyCode === 13) {
      return goToRoom();
    }
  });

  mtop = (window.innerHeight - $(".container").height()) / 3;

  $(".container").css({
    "margin-top": "" + mtop + "px"
  });

}).call(this);
