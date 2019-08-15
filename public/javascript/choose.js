	var drumroll = document.querySelector("#drumroll");
	function choose(){
		<% var randomPerson = Math.floor(Math.random() * selectedClass.students.length)%>
	}
	
	function reset() {
		$("#student-name").remove();
	}
	
	function load() {
    $("#loading").text("DRUMROLL PLEASE");
    for(i = 1; i < 4; i++){
        setTimeout(function(){
            $("#loading").append(".");
        }, 500 * i);
    }
	}
	
	$("#choose").on("click", function(){
	choose();
	drumroll.pause();
    drumroll.currentTime = 0;
    $("#loading").css("display", "block");
    $("#loading").text("DRUMROLL PLEASE");
    drumroll.play();
    for(i = 1; i < 4; i++){
        setTimeout(function(){
            load();
        }, 2000 * i)
    }
    load();
    setTimeout(function(){
        loading.style.display = "none";
        $("#content").append("<h2 id='student-name'><%=selectedClass.students[randomPerson].name%></h2>")
    }, 6900);
    reset();	
	})