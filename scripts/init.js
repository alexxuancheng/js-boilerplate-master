function startGame() {
	// Interface to communicate with ViLLE
	// Call submit, when the game ends.
	// There is no need to modify this, unless you want to debug something
	var submit = function() {
		console.log("Submit"); 
	}

	// After each answer, call sendAnswer to record answers.
	// There is no need to modify this, unless you want to debug something
	var sendAnswer = function(answer) {
		console.log("Saving ", answer); 
	}

	// options for the game
	var options = {
	    parent: $('body'), 		// Where the game should be created
	    url: '',				// Base url for stylesheets, images etc.
	    submit: submit, 		// Uses submit -function defined above
	    sendAnswer: sendAnswer, // Uses sendAnswer -function defined above
	    data: [					// array of questions/problems
			// First question object
			{
			    question: '1 + 5', 				// Question as a string
			    options: ['8', '6', '7', '5'], 	// OPTIONAL if there are multiple choices, you can use this. Each option is a string. 
			    correct: ['6'],				// Array of correct answers. as strings Multiple correct answers are allowed
			    type: 'plus',


			}, // first question object ends

			// Second question object
			{
			    question: '5+6',
			    options: ['13', '11', '9', '15'],
			    correct: ['11'],
			    type: 'plus'
			}, // second question object ends

			{
			    question: '9+5',
			    options: ['14', '13', '16', '11'],
			    correct: ['14'],
			    type: 'plus'
			},

			{
			    question: '11+16',
			    options: ['22', '33', '24', '27'],
			    correct: ['27'],
			    type: 'plus'
			},

			{
			    question: '13+8',
			    options: ['19', '20', '22', '21'],
			    correct: ['21'],
			    type: 'plus'
			},
			{
			    question: '4+7',
			    options: ['12', '9', '11', '13'],
			    correct: ['11'],
			    type: 'plus'
			},
			{
			    question: '20-7',
			    options: ['12', '13', '11', '14'],
			    correct: ['13'],
			    type: 'minus'
			},
			{
			    question: '12-9',
			    options: ['6', '5', '4', '3'],
			    correct: ['3'],
			    type: 'minus'
			},
			{
			    question: '30-14',
			    options: ['12', '14', '16', '18'],
			    correct: ['16'],
			    type: 'minus'
			},
			{
			    question: '3*4',
			    options: ['12', '8', '18', '7'],
			    correct: ['12'],
			    type: 'plus'
			},
			{
			    question: '6*7',
			    options: ['13', '42', '46', '35'],
			    correct: ['42'],
			    type: 'plus'
			},
            	{
            	    question: '21+13',
            	    options: ['33', '34', '35', '36'],
            	    correct: ['34'],
            	    type: 'plus'
            	},

			{
			    question: '5*7',
			    options: ['33', '34', '35', '36'],
			    correct: ['35'],
			    type: 'plus'
			},
			{
			    question: '34-15',
			    options: ['19', '18', '29', '27'],
			    correct: ['19'],
			    type: 'plus'
			},
			{
			    question: '12-5',
			    options: ['8', '7', '6', '5'],
			    correct: ['7'],
			    type: 'plus'
			},

			{
			    question: '12*2',
			    options: ['14', '24', '22', '20'],
			    correct: ['24'],
			    type: 'plus'
			},
			{
			    question: '23+7',
			    options: ['30', '24', '22', '20'],
			    correct: ['30'],
			    type: 'plus'
			},
			{
			    question: '9*8',
			    options: ['14', '72', '22', '20'],
			    correct: ['72'],
			    type: 'plus'
			},
			{
			    question: '3*7',
			    options: ['14', '21', '22', '20'],
			    correct: ['21'],
			    type: 'plus'
			},
			{
			    question: '30-13',
			    options: ['17', '24', '22', '20'],
			    correct: ['17'],
			    type: 'plus'
			},
			{
			    question: '12/2',
			    options: ['14', '6', '22', '20'],
			    correct: ['6'],
			    type: 'plus'
			}, {
			    question: '15/3',
			    options: ['14', '5', '22', '20'],
			    correct: ['5'],
			    type: 'plus'
			}, {
			    question: '14/2',
			    options: ['14', '7', '22', '20'],
			    correct: ['7'],
			    type: 'plus'
			}, {
			    question: '11*4',
			    options: ['14', '44', '22', '20'],
			    correct: ['24'],
			    type: 'plus'
			},
			{
			    question: '5+16',
			    options: ['14', '24', '22', '21'],
			    correct: ['21'],
			    type: 'plus'
			},
	    ],
	    theme: 'normal',

	    ///////////////////////////////////////////////////////////////////////////////////
	    // Optional configurations
	    // Add as many you need in your game, these are just examples
	    lifes: 5, 			// How many tries?
	    nOfOptions: 4, 		// How many options should be visible at the same time
	    nOfQuestions: 12,    // How many question student should answer
	    questionTimer: 5,  // The time that student has to answer a question in second
        timeAdder: 5    //The time student can add to questionTimer after he/she answers correctly

	}

	// crate new instance of the game. 
	// If you rename the JSBoilerplate in the game.js, you must rename it here too. 
	var game = new JSBoilerplate(options); 

}

// Run the game on page load
startGame(); 

