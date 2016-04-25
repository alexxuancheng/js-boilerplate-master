 // Constructor for JSBoilerplate. If you rename this, you need to rename it also in init.js
// Take options object as a parameters. Given options override defaults
JSBoilerplate = function(options) {
	// Make this object visible in functions.
	var self = this; 

	// Default values for options
	// These are defined pretty well in init.js. I'll save some space and leave this half empty.
	self.options = {
		parent: $('body'),
		url: '/',
		theme: 'normal',
	}

	// Extend default options with given options
	// This uses jQuery ($)
	$.extend(self.options, options);

	// Make some options easier to access
	self.data = self.options.data; 
	self.url = self.options.url; 
	self.submit = self.options.submit; 
	self.sendAnswer = self.options.sendAnswer;
	self.nQuestions = self.options.nOfQuestions;
	self.lifes = self.options.lifes;
	self.questionTimerDefault = self.options.questionTimer;	
	self.timeAdder = self.options.timeAdder;
	self.isTimerOn = false;
	
	self.currentQuestion = 0;
	self.canWalk = true;
	self.randomQuestionArray = [];
	self.questionTimer = self.questionTimerDefault

	// Create a container for the game. 
	// There needs to be a "gamearea"-container, which is positioned relative and takes the 
	// full width and height of it's parent. Everything in the game must be placed inside "gamearea".
	// Note: self.options.parent is the most outer container
	// self.parent is the game itself and everything should be added there
	// USE self.parent TO ADD THINGS IN YOUR GAME! 
	self.parent  = $('<div class="gamearea"></div>');
	// Add the game to the outer element
	self.options.parent.append(self.parent); 

	// Load necessary CSS-files
	self.loadCss();

	// Make the are fullscreen. Give some time to make sure
	// the parent is rendered before resizing
	setTimeout(function() {
		self.resize();
	}, 500);

	// Handle window resize
	window.onresize = self.resize.bind(self); 

	// Check if game has been detached every 1000ms
	var detacherId = setInterval(function () {

		if ($(self.parent).parents('body').length === 0) {
			// Detach all key and mouse listeners here.
			// Aslo clear all intervals and timeouts
			clearInterval(detacherId);
		}
	}, 1000);


	// Draw start screen 
	self.drawStartScreen(); 
}


//Starting point for the game
JSBoilerplate.prototype.start = function() {
	var self = this; 

    self.drawGameArea();
	self.init();
	console.log("the game has begun!");

}


///Amir AminiNaji  22/04/2016
JSBoilerplate.prototype.drawGameArea = function () {
    var self = this;
    //<img src="images/maze.gif">
    //Puttin the background picture or road map in the page.
    //self.roadContainer = $('<div class="mainBody"><img class="algebra" id="al" src="images/al gebra.png"><div class="mainImage"><img id="mazeBack" src="images/maze.png" class="backgroundImage"></div></div><div class="lifebar"><img src="images/lifebar.png"></div>');
    self.roadContainer = $('<div class="scoreBar"><h1><span class="label label-warning timerSpan"></span></h1></div><div class="mainBody"><img class="algebra" id="al" src="images/al gebra.png"><div class="mainImage"><img id="mazeBack" src="images/maze.png" class="backgroundImage"></div></div><div style="float: right; width: 464px; height: 640px;"><div class="alert alert-danger alertDiv">The answer is wrong, please try it again!</div><div class="lifebarDiv"><img id="midlayer" src="images/midlayer.png" style="position:absolute;"/><img id="lifebar" src="images/lifebar.png" style="position:absolute;"/></div></div>');
    
    self.parent.append(self.roadContainer);

    self.optionsContainer = $('<div class="groupContainer"><div class="optionsContainerLeft"></div><div class="optionsContainer"><div class="wrapper1"><kbd class="question"></kbd><div class="answer input-group"><span class="input-group-addon" id="basic-addon1">=</span><input type="text" width="100px" class="form-control" placeholder="answer" aria-describedby="basic-addon1" id="answerInput"></div></div></div><div class="optionsContainerRight"></div></div>');

    self.parent.append(self.optionsContainer);

    self.questionValue = $('.question');
    self.answerValue = $('.answer');
}


// Draws the initial start screen, with a big start-button. 
// Game starts only after user has decied to start the game. 
// You can skip this, if you like.
JSBoilerplate.prototype.drawStartScreen = function() {
	var self = this; 

	self.parent.append('<div class="startbutton">Start!</div>'); 
	$('.startbutton').click(function(e) {
		var elem = this; 
		e.preventDefault();
		// disable keylistener
		$(document).off('keypress');

		// ugly hack to wait until the animation is completed.
		setTimeout(function() {
			// fade button, start game, remove button
			$(elem).fadeOut(function() {
				// focus parent div (needed, if you have keylistener in your game)
				self.parent.focus();
				// start the game 
				self.start(); 
				// remove start-button
				$(elem).remove();
			});
		}, 200);
		$(".gamearea").css("background-image", "url()");
	});
	
	$(document).keypress(function(e) {
		if(e.which === 13 || e.keyCode === 13) {
			$('.startButton').click(); 
		}
	});
}

// Load the base_theme.css and set theme, if available.
// No need to modify this, unless you want to implement themes or 
// load external css-libraries
JSBoilerplate.prototype.loadCss = function() {
	var self = this;
	// remove all existing stylesheets (should not be any)
	$("[id^=boilerpalte-style]").remove();

	////////////////////////////////////////////////////////////
	// See which theme is selected, default is normal or empty
	////////////////////////////////////////////////////////////
	if(self.options.theme == "normal") {
		$(self.parent).addClass(self.options.theme);
	}
	// Example for alterntive theme
	// Not implemented in this boilerplate!
	else if (self.options.theme == 'something_else') {
		$(self.parent).addClass(self.options.theme);
		var style = self.url + 'stylesheets/something_else.css';
	}
	// Default case, if the theme is completely missing from options
	else {
		console.log("Theme not supported, using 'normal'");
		$(self.parent).addClass("normal");
	}
	
	var count = $("[id^=boilerpalte-style]").length + 1; 

	////////////////////////////////////////////////////////////
	// Load the files
	////////////////////////////////////////////////////////////
	// load the base_theme.css
	$('head').append('<link id="boilerpalte-style'+ count +'" rel="stylesheet" href="'+ self.url + 'stylesheets/base_theme.css' +'">');	

	// Load special theme
	if(style) {
		$('head').append('<link id="boilerpalte-style'+ (count+1) +'" rel="stylesheet" href="'+ style +'">');
	}

	// Loading any external stylesheets, like animate.css
	// $('head').append('<link id="boilerpalte-style'+ (count+2) +'" rel="stylesheet" href="' + self.options.url + 'stylesheets/animate.css">');
}

// Keep the game in fullscreen even on window resize
JSBoilerplate.prototype.resize = function() {
	var self = this;
	// First make sure that the outer most element is full width and height
	$(self.options.parent).width(parseFloat($(window).width()) - parseFloat($(self.options.parent).offset().left) + 'px');
	$(self.options.parent).height(parseFloat($(window).height()) - parseFloat($(self.options.parent).offset().top) + 'px');

	// Make sure that the game container fills the outer most container.
	$(self.parent).width($(self.options.parent).width());
	$(self.parent).height($(self.options.parent).height());
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// Helper functions, use if you need 
///////////////////////////////////////////////////////////////////////////////////////////////////

// Shuffle options array. Makes sure correct option is included in shuffled array
JSBoilerplate.prototype.shuffleOptions = function(options, correct) {
	var self = this; 
	var arr = []; 

	options = self.shuffle(options);
	var isCorrect = false;

	for(var i=0; i<self.options.nOptions; i++) {
		arr.push(options[i]);
		if(options[i] === correct) {
			isCorrect = true;
		}
	}

	if(!isCorrect) {
		arr[0] = correct;
	}

	arr = self.shuffle(arr);

	return arr;
}

// Get random int including min and max
JSBoilerplate.prototype.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Shuffle array
JSBoilerplate.prototype.shuffle = function(array) {

	var currentIndex = array.length, temporaryValue, randomIndex ;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

	// Pick a remaining element...
	randomIndex = Math.floor(Math.random() * currentIndex);
	currentIndex -= 1;

	// And swap it with the current element.
	temporaryValue = array[currentIndex];
	array[currentIndex] = array[randomIndex];
	array[randomIndex] = temporaryValue;
	}
	return array;
}

// Checks if array as given item
JSBoilerplate.prototype.isIn = function(array, item) {
	for(var i=0; i<array.length; i++) {
		if(array[i] === item) {
			return true;
		}
	}
	
	return false;
}

///Amir AminiNaji   22/04/2016
JSBoilerplate.prototype.CharacterAlgebraInit = function() {
    
}

JSBoilerplate.prototype.CharacterAlgebra = function(x, y, w, h) {
    //ctx.beginPath();
    
    //JSBoilerplate.prototype.CharacterAlgebra(x, y, w, h);
    //ctx.closePath();
    //ctx.fill();
}

JSBoilerplate.prototype.CharacterAlgebraDraw = function() {
    //JSBoilerplate.prototype.clear();
    //ctx.fillStyle = "white";
    JSBoilerplate.prototype.CharacterAlgebra(200, 5, 64, 64);
}


JSBoilerplate.prototype.RandomQuestionMaker = function (questionAmounts) {
    var self = this;
    var i = 0;
    var xValue = 0;
    var yValue = 0;
    while (i < questionAmounts) {
        xValue = Math.floor((Math.random() * 10));
        yValue = Math.floor((Math.random() * 10));
        if (self.roadMap[String(xValue) + String(yValue)].includes("Q") == true){//If the numbers are the same as before
            xValue = Math.floor((Math.random() * 10));
            yValue = Math.floor((Math.random() * 10));
        }
        self.roadMap[String(xValue) + String(yValue)] += "Q";
        //console.log(self.backGroundX);
        self.PutQuestionsInTheMaze(self.backGroundX + (xValue * 64), self.backGroundY + (yValue * 64), String(xValue) + String(yValue));
        i++;
    }
}

JSBoilerplate.prototype.PutQuestionsInTheMaze = function (x, y, count) {
    var self = this;
    //console.log(x, y);
    self.parent.append('<img class="questionblock question'+count+'" src="images/questionblock.png">');
    $('.question'+count).css({
        left: x,
        top: y,
        position: "absolute",
    });
}

JSBoilerplate.prototype.DoKeyUp = function (evt) {
    //alert("tr");
    //console.log(evt);
    var self = this;
    if (self.canWalk) {
        switch (evt.keyCode) {
            case 38:  /* Up arrow was pressed */
                if ($("#al").offset().top > self.backGroundY) {
                    //alert([String(self.characterX) + String(self.characterY)]);
                    if (self.roadMap[String(self.characterX) + String(self.characterY)].includes("U")) {
                        $("#al").css('top', $("#al").offset().top - 64);
                        self.characterY--;                        
                    }
                }
                break;
            case 40:  /* Down arrow was pressed */
                if ($("#al").offset().top < self.backGroundY + $("#mazeBack").height() - 64) {
                    //alert(self.roadMap[String(self.characterX) + String(self.characterY)].includes("D"));
                    //alert(self.characterX);
                    
                    if (self.roadMap[String(self.characterX) + String(self.characterY)].includes("D")) {
                        $("#al").css('top', $("#al").offset().top + 64);
                        self.characterY++;
                        
                    }
                }
                break;
            case 37:  /* Left arrow was pressed */
                if ($("#al").offset().left > self.backGroundX) {
                    if (self.roadMap[String(self.characterX) + String(self.characterY)].includes("L")) {
                        $("#al").attr("src", "images/algebra_left.png");
                        $("#al").css('left', $("#al").offset().left - 64);
                        self.characterX--;
                        
                    }
                    //$('#al').stop().animate({
                    //    left: '-=64'
                    //});
                }
                break;
            case 39:  /* Right arrow was pressed */
                if ($("#al").offset().left < self.backGroundX + $("#mazeBack").width() - 64) {
                    if (self.roadMap[String(self.characterX) + String(self.characterY)].includes("R")) {
                        $("#al").attr("src", "images/al gebra.png");
                        $("#al").css('left', $("#al").offset().left + 64);
                        self.characterX++;
                    }
                }
                break;
            //case 13:
            //    console.log("Wer are out!!");
            //    if ($("#answerInput").css("visibility") == "visible")
            //        console.log("Wer are in");
            //    break;
        }
    }
    self.CurrentTile(self.characterX, self.characterY);
    switch (evt.keyCode) {
        case 13:
            if ($("#answerInput").css("visibility") == "visible")
                if ($("#answerInput").val().length > 0) {//It just check if it's empty or not. We have to add another condition to make sure that they can just enter digits.
                    if ($("#answerInput").val() == self.currentData.correct) {
                        self.HideQuestion();
                        $("#answerInput").val("");
                        self.NextQuestion();
                        self.RemoveQuestion(self.characterX, self.characterY);
                        //console.log($('.question' + (String(self.characterX) + String(self.characterY))));
                        //$('.question' + (String(self.characterX) + String(self.characterY))).css("src", 'url("images/button_stage1.png")');
                        $('.question' + (String(self.characterX) + String(self.characterY))).attr("src", "images/correct.png");
                        self.StopTimer();
                        self.questionTimer += self.timeAdder;
                    }
                    else {//The answer is wrong
                        //console.log(self.lifes);
                        self.LifeBar("The answer is wrong, please try it again!");
                    }
                }                
            break;
        case 27: 
            self.HideQuestion();            
            break;
    }
}

//Amir AminiNaji    24/04/2016
//It's going to descreas the life span any time that it's called.
JSBoilerplate.prototype.LifeBar = function (showMessage) {
    var self = this;
    self.lifes--;
    if (self.lifes >= 0) {//Decreasing the life bar with animation
        $(".alertDiv").html(showMessage);
        $(".alertDiv").animate({ opacity: 1 }, 200);
        $(".alertDiv").animate({ opacity: 0 }, 5000);
        switch (self.lifes) {
            case 4:
                $("#midlayer").css("height", "480px");
                break;
            case 3:
                $("#midlayer").css("height", "370px");
                break;
            case 2:
                $("#midlayer").css("height", "265px");
                break;
            case 1:
                $("#midlayer").css("height", "160px");
                break;
            case 0:
                $("#midlayer").css("height", "0px");
                break;
        }

    }
    else {
        self.gameOver();
    }
}

//Amir AminiNaji    24/04/2016
JSBoilerplate.prototype.RandomQuestionNumber = function (nOfQuesitons) {
    var self = this;    
    rQuestionNumber = Math.floor((Math.random() * nOfQuesitons));//It depends on the amounts of the questions that exists.
    if (self.randomQuestionArray.indexOf(rQuestionNumber) > 0)
        self.randomQuestionArray.push(rQuestionNumber);//Added the new number to the array
    return rQuestionNumber;
}

JSBoilerplate.prototype.StartTimer = function () {
    var self = this;
    if (self.questionTimer > 0) {
        $(".timerSpan").html(self.questionTimer);
        if (self.isTimerOn == false) {
            self.intervalTime = setInterval(function () {
                $(".timerSpan").html(self.questionTimer--);
                if (self.questionTimer < 0) {
                    self.LifeBar("You are ran out of time!");
                    self.StopTimer();
                }
            }, 1000);
            self.isTimerOn = true;
        }
    }
}

//It's stop the timer, and clear the timer area, and free the timer to start again.
JSBoilerplate.prototype.StopTimer = function () {
    var self = this;
    $(".timerSpan").html("");//Clear the timer area after the timer is stopped
    //setTimeout(function () { $(".scoreBar").html(self.questionTimer); }, 1000);//To show the time 1, and 0, otherwise they won't be visible
    clearInterval(self.intervalTime);
    self.isTimerOn = false;
    if (self.questionTimer <= 0) {
        self.questionTimer = self.questionTimerDefault;
        self.HideQuestion();
        self.NextQuestion();
    }
}

//Increase the question number by one and make the next question.
JSBoilerplate.prototype.NextQuestion = function () {
    var self = this;
    self.currentQuestion++;
    self.MakeQuestion();
}

//Amir AminiNaji    23/04/2016
//Checks if the current tile has the question, and stop
JSBoilerplate.prototype.CurrentTile = function (x, y) {
    var self = this;
    if (self.roadMap[String(x) + String(y)].includes("Q")) {
        self.canWalk = false;
        self.ShowQuestion();
        return;
    }
    self.canWalk = true;
}

JSBoilerplate.prototype.RemoveQuestion = function (x, y) {
    var self = this;
    //console.log(self.roadMap[String(x) + String(y)]);
    if (self.roadMap[String(x) + String(y)].includes("Q")) {
        self.roadMap[String(x) + String(y)] = self.roadMap[String(x) + String(y)].replace('Q', '');
        //console.log(self.roadMap[String(x) + String(y)]);
    }
}

//Show the question, and input box to write the answer, it's focused on the input.
JSBoilerplate.prototype.ShowQuestion = function () {
    var self = this;
    $(self.questionValue).css("visibility", "visible");
    $(self.answerValue).css("visibility", "visible");
    //$(".scoreBar").html
    self.StartTimer();
    $("#answerInput").focus();
}

//Hide the question, and input box.
JSBoilerplate.prototype.HideQuestion = function () {
    var self = this;
    $(self.questionValue).css("visibility", "hidden");
    $(self.answerValue).css("visibility", "hidden");
    self.StopTimer();
    self.canWalk = true;
}

JSBoilerplate.prototype.gameOver = function () {
    var self = this;
    //window.removeEventListener('keyup', self.DoKeyUp);
    $(window).unbind('keyup');
    self.isGameOver = true;
    self.parent.html('');
    self.submit();
}

JSBoilerplate.prototype.MakeQuestion = function () {
    
    var self = this;
    //alert(self);
    self.currentData = self.data[self.currentQuestion];//Get the current question's data
    //console.log(self.nQuestions, self.currentQuestion, self.currentData)
    if ((self.currentData != undefined) && (self.currentQuestion < self.nQuestions)) {
        // Update options
        self.updateOptions(self.currentData.options);

        // Update the target value
        self.questionValue.html(self.currentData.question);
    }
    else
    {
        self.gameOver();
    }
    // Update current value
    //self.currentValueContainer.html(self.currentData.startValue);
}

// Helper for updating the buttons. Give options as an array
// This will remove all exisiting options
JSBoilerplate.prototype.updateOptions = function (options) {
    var self = this;

    // define a function to add new options
    ////////////////////////////////////////////////////////////
    // Create new options
    ////////////////////////////////////////////////////////////
    function createNewOptions() {
        // Iterate trough the optiosn and create new buttons
        for (var i = 0; i < options.length; i++) {
            // Create new button by calling self.createOption and give the button text
            // as a parameter. Also add it to proper place on the game area (inner option container)
            $('.options').append(self.createOption(options[i]));
        }
    }

    ////////////////////////////////////////////////////////////
    // Fade out and remove existing options
    ////////////////////////////////////////////////////////////	
    // Use animate.css effects
    // First check, if we have existing buttons. If yes, remove them and then add new ones
    if ($('.option').length > 0) {
        $('.option').addClass('fadeOut');
        // When the animation ends, remove the items. Listen for animation end event
        $('.option').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
			// When animation end fires, this function is executed
			function () {
			    // remove all option-buttons
			    $('.option').remove();
			    createNewOptions();
			});
    }

    else {
        createNewOptions();
    }
}

// Creates a new option button
JSBoilerplate.prototype.createOption = function (content) {
    var self = this;

    var option = $('<div class="animated option bounceIn" data-value="' + content + '">' + content + '</div>');
    // Add click listener. Function gets executed when button is clicked.
    option.click(function (e) {
        // stop default behaviour just in case
        e.preventDefault();
        // If the game is over, dont do anything
        if (self.isGameOver) {
            return;
        }
        // Add or remove .active -class of the button
        $(this).toggleClass('active');
        // calculate the value of currently activate buttons
        self.calculate();
    });

    return option;
}


JSBoilerplate.prototype.BackgroundImageCoordinate = function (backgroundImage, characterImage) {
    var self = this;
    //console.log(backgroundImage.x);
    backgroundImage // Make in memory copy of image to avoid css issues
    .attr("src", backgroundImage.attr("src"))
    .load(function () {
        pic_real_width = this.width;   // Note: $(this).width() will not
        picRealLeft = this.x;
        //charImage.offset({ left: picRealLeft - pic_real_width / 2 });//this.offset().left - pic_real_width;
        self.backGroundX = picRealLeft - pic_real_width / 2;
        
        if (self.backGroundX < 0)
            self.backGroundX = 0;
        characterImage.offset({
            left: self.backGroundX
        });        
        picRealTop = this.y;
        pic_real_height = this.height; // work for in memory images.
        self.backGroundY = picRealTop - pic_real_height / 2;
        if (self.backGroundY < 0)
            self.backGroundY = 0;
        characterImage.offset({
            top: self.backGroundY
        });
        //charImage.offset({ top: picRealTop - pic_real_height / 2 });//this.offset().left - pic_real_width;
        self.RandomQuestionMaker(self.nQuestions);
    });
    
    //$(charImage).offset({        
    //    left: backgroundImage.offset().left
    //});
    //alert($(backgroundImage).offset().top);
    //$(charImage).offset.top = $(backgroundImage).offset().top - /2;
    //$(charImage).css('top', $(backgroundImage).offset().top - $(backgroundImage).offset().top / 2);
}

//JSBoilerplate.prototype.MakeArray = function(x, y){
//    self.roadArray = new Array();
//    for (i = 0; i < x; i++) {
//        self.roadArray[i] = new Array();
//        for (j = 0; j < y; j++){
//            self.roadArray[i][j] = ""
//        }
//     }


//}

JSBoilerplate.prototype.MakeTheRoadMap = function () {
    var self = this;
    self.roadMap["00"] = "D";
    self.roadMap["10"] = "D";
    self.roadMap["20"] = "R";
    self.roadMap["30"] = "DL";
    self.roadMap["40"] = "R";
    self.roadMap["50"] = "LD";
    self.roadMap["60"] = "D";
    self.roadMap["70"] = "D";
    self.roadMap["80"] = "R";
    self.roadMap["90"] = "LD";	
	
    self.roadMap["01"] = "URD";
    self.roadMap["11"] = "ULD";
    self.roadMap["21"] = "D";
    self.roadMap["31"] = "UD";
    self.roadMap["41"] = "D";
    self.roadMap["51"] = "UR";
    self.roadMap["61"] = "ULD";
    self.roadMap["71"] = "UD";
    self.roadMap["81"] = "RD";
    self.roadMap["91"] = "UL";
	
	
    self.roadMap["02"] = "U";
    self.roadMap["12"] = "URD";
    self.roadMap["22"] = "UL";
    self.roadMap["32"] = "UD";
    self.roadMap["42"] = "DU";
    self.roadMap["52"] = "D";
    self.roadMap["62"] = "UD";
    self.roadMap["72"] = "URD";
    self.roadMap["82"] = "ULR";
    self.roadMap["92"] = "L";
	
    self.roadMap["03"] = "R";
    self.roadMap["13"] = "ULD";
    self.roadMap["23"] = "D";
    self.roadMap["33"] = "UR";
    self.roadMap["43"] = "UDL";
    self.roadMap["53"] = "URD";
    self.roadMap["63"] = "URDL";
    self.roadMap["73"] = "UDL";
    self.roadMap["83"] = "RD";
    self.roadMap["93"] = "DL";
	
    self.roadMap["04"] = "RD";
    self.roadMap["14"] = "UL";
    self.roadMap["24"] = "URD";
    self.roadMap["34"] = "DL";
    self.roadMap["44"] = "URD";
    self.roadMap["54"] = "ULD";
    self.roadMap["64"] = "U";
    self.roadMap["74"] = "UR";
    self.roadMap["84"] = "UL";
    self.roadMap["94"] = "U";
	
    self.roadMap["05"] = "UR";
    self.roadMap["15"] = "DL";
    self.roadMap["25"] = "U";
    self.roadMap["35"] = "URD";
    self.roadMap["45"] = "ULD";
    self.roadMap["55"] = "UDR";
    self.roadMap["65"] = "L";
    self.roadMap["75"] = "D";
    self.roadMap["85"] = "D";
    self.roadMap["95"] = "D";
	
    self.roadMap["06"] = "D";
    self.roadMap["16"] = "UR";
    self.roadMap["26"] = "RL";
    self.roadMap["36"] = "ULD";
    self.roadMap["46"] = "UD";
    self.roadMap["56"] = "UR";
    self.roadMap["66"] = "LRD";
    self.roadMap["76"] = "UL";
    self.roadMap["86"] = "UD";
    self.roadMap["96"] = "UD";
	
    self.roadMap["07"] = "UD";
    self.roadMap["17"] = "R";
    self.roadMap["27"] = "RLD";
    self.roadMap["37"] = "UL";
    self.roadMap["47"] = "UR";
    self.roadMap["57"] = "LD";
    self.roadMap["67"] = "URD";
    self.roadMap["77"] = "LRD";
    self.roadMap["87"] = "UL";
    self.roadMap["97"] = "UD";
	
    self.roadMap["08"] = "UR";
    self.roadMap["18"] = "LD";
    self.roadMap["28"] = "UR";
    self.roadMap["38"] = "LRD";
    self.roadMap["48"] = "LD";
    self.roadMap["58"] = "UD";
    self.roadMap["68"] = "UD";
    self.roadMap["78"] = "UR";
    self.roadMap["88"] = "LD";
    self.roadMap["98"] = "UD";
	
    self.roadMap["09"] = "R";
    self.roadMap["19"] = "URL";
    self.roadMap["29"] = "RL";
    self.roadMap["39"] = "UL";
    self.roadMap["49"] = "U";
    self.roadMap["59"] = "U";
    self.roadMap["69"] = "UR";
    self.roadMap["79"] = "L";
    self.roadMap["89"] = "UR";
    self.roadMap["99"] = "UL";  

    //self.roadMap["00"] = "D";
    //self.roadMap["10"] = "D";
    //self.roadMap["20"] = "D";
    //self.roadMap["30"] = "DR";
    //self.roadMap["40"] = "RL";
    //self.roadMap["50"] = "RLD";
    //self.roadMap["60"] = "RLD";
    //self.roadMap["01"] = "RU";
    //self.roadMap["11"] = "RUL";
    //self.roadMap["21"] = "LRUQ";
    //self.roadMap["31"] = "LUD";
    //self.roadMap["41"] = "R";
    //self.roadMap["51"] = "UDL";
    //self.roadMap["61"] = "U";
    //self.roadMap["02"] = "D";
    //self.roadMap["12"] = "R";
    //self.roadMap["22"] = "RL";
    //self.roadMap["32"] = "UR";
    //self.roadMap["42"] = "LR";
    //self.roadMap["52"] = "RL";
    //self.roadMap["62"] = "RL";
    //self.roadMap["21"] = "U";
    //self.roadMap["20"] = "R";
    //self.roadMap["30"] = "R";
    //self.roadMap["40"] = "D";
    //self.roadMap["41"] = "D";
    //self.roadMap["42"] = "R";
    //self.roadMap["52"] = "R";
    //self.roadMap["62"] = "R";
}

JSBoilerplate.prototype.init = function () {
    
    var self = this;
    //console.log(self, "hoiuhiu");
    canvas = document.getElementById("canvas");
    
    //window.addEventListener('keyup', self.DoKeyUp.bind(self));
    $(window).bind('keyup', function (e) { self.DoKeyUp(e)});
    //New way of the keyUp
    //console.log("start");
    //$(function () {        
    //    $("#al").on("keyup", function (event) {
    //        console.log(self.canWalk);
    //        if (self.canWalk) {
    //            console.log("Here");
    //            switch (evt.keyCode) {
    //                case 38:  /* Up arrow was pressed */
    //                    console.log("UP");
    //                    if ($("#al").offset().top > self.backGroundY) {
    //                        //alert([String(self.characterX) + String(self.characterY)]);
    //                        if (self.roadMap[String(self.characterX) + String(self.characterY)].includes("U")) {
    //                            $("#al").css('top', $("#al").offset().top - 64);
    //                            self.characterY--;
    //                        }
    //                    }
    //                    break;
    //                case 40:  /* Down arrow was pressed */
    //                    console.log("Down");
    //                    if ($("#al").offset().top < self.backGroundY + $("#mazeBack").height() - 64) {
    //                        //alert(self.roadMap[String(self.characterX) + String(self.characterY)].includes("D"));
    //                        //alert(self.characterX);
    //                        if (self.roadMap[String(self.characterX) + String(self.characterY)].includes("D")) {
    //                            $("#al").css('top', $("#al").offset().top + 64);
    //                            self.characterY++;
    //                        }
    //                    }
    //                    break;
    //                case 37:  /* Left arrow was pressed */
    //                    if ($("#al").offset().left > self.backGroundX) {
    //                        if (self.roadMap[String(self.characterX) + String(self.characterY)].includes("L")) {
    //                            $("#al").attr("src", "images/algebra_left.png");
    //                            $("#al").css('left', $("#al").offset().left - 64);
    //                            self.characterX--;
    //                        }
    //                        //$('#al').stop().animate({
    //                        //    left: '-=64'
    //                        //});
    //                    }
    //                    break;
    //                case 39:  /* Right arrow was pressed */
    //                    if ($("#al").offset().left < self.backGroundX + $("#mazeBack").width() - 64) {
    //                        if (self.roadMap[String(self.characterX) + String(self.characterY)].includes("R")) {
    //                            $("#al").attr("src", "images/al gebra.png");
    //                            $("#al").css('left', $("#al").offset().left + 64);
    //                            self.characterX++;
    //                        }
    //                    }
    //                    break;
    //            }
    //        }
    //    });
    //});


    self.BackgroundImageCoordinate($("#mazeBack"), $("#al"));
    //JSBoilerplate.prototype.CharacterInit();
    self.characterX = 0;//For navigating the character in x axis
    self.characterY = 0;//For navigating the character in y axis
    self.roadMap = new Object();//Make a map for all the direction that "Al gebra" can go
    
    self.MakeTheRoadMap();
    self.MakeQuestion();
    
    
    
    //img.src = "images/maze.gif";
    //$("canvas").width = img.width;
    //$("canvas").height = img.height;
    //ctx = canvas.getContext("2d");
    //return setInterval(JSBoilerplate.prototype.CharacterAlgebraDraw, 1000);
}

//JSBoilerplate.prototype.clear = function() {
//    ctx.clearRect(0, 0, img.width, img.height);
//    ctx.drawImage(img, 0, 0);
//}