


// calling out all the input boxes
var equityNumBox = document.querySelector('#equityNumBox');
var salaryNumBox = document.querySelector('#salaryNumBox');
var valueNumBox = document.querySelector('#valueNumBox');
var vMultiplierBox = document.querySelector('#vMultiplierBox');
var salaryMultiplierBox = document.querySelector('#salaryMultiplierBox');
var companyProfitBox = document.querySelector('#companyProfitBox');

var allVarInputBoxes = document.getElementsByName('varInputBox');
var allVarInputTDs = document.querySelectorAll('.inputTD'); // This only catches the four variables, not the 2 extra advanced parameters.
var allInputBoxesIncludingAdvancedParams = document.querySelectorAll('.numberInputBox'); // This catches all of the input boxes, period


// calling out the radio buttons
var equityRadio = document.querySelector('#equityRadio');
var salaryRadio = document.querySelector('#salaryRadio');
var valueRadio = document.querySelector('#valueRadio');
var vMultiplierRadio = document.querySelector('#vMultiplierRadio');
var allOutputRadioButtons = document.getElementsByName('outputRadio');
var allHintParas = document.querySelectorAll('.hintPara');
var allInputGroups = document.querySelectorAll('.input-group');

// calling out the calculate and reset-to-default buttons
var calculateButton = document.querySelector('#calculateButton');
var resetToDefaultLink = document.querySelector('#resetToDefaultLink');

// open variables for each input
var equity = null;
var salary = null;
var companyValue = null;
var vMultiplier = null;
var salaryMultiplier = null;
var companyProfit = null;

// calling out the error text box
var errorTextBox = document.querySelector('#errorTextBox');

// This will be set to "true" once the user clicks a radio button.
var hasTheUserChosenAnOutput = false;

// Remains false until the first successful calculation is run, and then stays permanently true.  Used for showing/hiding tooltips (see 'hintPara' class members).
var hasCalculationSuccessfullyOccuredYet = false;


// This function causes an element to "pulse" green.  It is used when the javascript fills in valus (after calculating or resetting parameters to defaults)
function pulseElement(elementToBePulsed) {

	elementToBePulsed.classList.add('pulseOn'); // This adds a green background to the box

	// After waiting a beat (100ms chosen arbitrarily) we add a class that causes all changes to the element to be animated, and then we remove the 'pulseOn' class, so that the border background begins to fade away.
	setTimeout(
		function() {
			elementToBePulsed.classList.add('changesAreAnimated');
			elementToBePulsed.classList.remove('pulseOn');
		}, 100);

	// Once that animation is complete (I assume by 1 second later), we remove the changesAreAnimated class, so that when we set the background back to green on the next click it happens suddenly without being animated in.  I think that looks cooler.
	setTimeout(
		function() {
			elementToBePulsed.classList.remove('changesAreAnimated');
		}, 500);
}




// This function fills in the "Advanced Parameters" input boxes with default values.  It is called at pageload and when the "reset to defaults" link is clicked.
function setAdvancedParametersToDefaults() {
	salaryMultiplierBox.value = '50';
	companyProfitBox.value = '50';
}

// Sets "Advanced Parameters" to default on pageload
setAdvancedParametersToDefaults();

// Add click listener to the link that offers the option to reset the advanced parameters to their defaults.
resetToDefaultLink.addEventListener("click", function() {
	setAdvancedParametersToDefaults();
	pulseElement(salaryMultiplierBox);
	pulseElement(companyProfitBox);

});



// This code controls what happens when the user clicks one of the radio buttons. We start by connecting all the radio buttons to a single on-click handler function.
equityRadio.addEventListener("click", outputRadioClickHandler);
salaryRadio.addEventListener("click", outputRadioClickHandler);
valueRadio.addEventListener("click", outputRadioClickHandler);
vMultiplierRadio.addEventListener("click", outputRadioClickHandler);



// This function greys out and puts a background behind the proper input box every time a radio button is clicked.
function outputRadioClickHandler() {

	hasTheUserChosenAnOutput = true; // Permanently changing this flag now that one of the radio buttons has been clicked.

	// We iterate over all the radio buttons and permanently remove the glow effects that previously highlighted them.
	for (i = 0; i < allOutputRadioButtons.length; i++) {
		allOutputRadioButtons[i].classList.remove('glowingUntilClicked');
		allOutputRadioButtons[i].classList.remove('errorGlow');
		allVarInputTDs[i].classList.remove('hiddenCell')

		if (allOutputRadioButtons[i].checked) { 
			allVarInputBoxes[i].disabled = true; // We disable the input box at hand if its radio button has been checked.
			allVarInputTDs[i].classList.add('chosenOutput'); // We flag it as the "chosen output" as well.  The CSS causes the table item to have a green diagonal background.
			allVarInputBoxes[i].classList.remove('errorGlow');
			allVarInputBoxes[i].classList.add('thisNumberNotComputed'); // change the number to italics until it's been computed, to demonstrate that it is not an accurate number that the calculator produced.

			// If the user hasn't made a successful calculation yet, we un-hide a small tooltip paragraph telling them to fill in the other 3 numbers.  You can find these hints in the HTML under the 'hintPara' class.
			if (!hasCalculationSuccessfullyOccuredYet) {
				allHintParas[i].classList.remove('hiddenPara'); //unhide the hint about entering the other 3 numbers
				allInputGroups[i].classList.add('hiddenPara'); //hide the input box for this variable

			}
		}
		else{
			allVarInputBoxes[i].disabled = false;
			allVarInputBoxes[i].classList.remove('thisNumberWasComputed'); // Removed a class that basically just makes computed text bold, to make it clear that it wasn't typed by the user, it was actually calculated.
			allVarInputBoxes[i].classList.remove('thisNumberNotComputed');
			
			allVarInputTDs[i].classList.remove('chosenOutput');

			allHintParas[i].classList.add('hiddenPara'); // Hide any tooltips that were visible on previously-selected numbers
			allInputGroups[i].classList.remove('hiddenPara') // Unhide the input box
		}

	}

	// solveGrahamEquation(false);

}


// Add listeners to every input boxes that cause the tool to automatically recalculate every time the user edits values.
// for (i=0; i<allInputBoxesIncludingAdvancedParams.length; i++) {
// 	allInputBoxesIncludingAdvancedParams[i].addEventListener("change", function() {solveGrahamEquation(false)});
// }

function inputBoxChangeHandler() {
	console.log('change');
	for (q=0; q<allInputBoxesIncludingAdvancedParams.length; q++) {
			allInputBoxesIncludingAdvancedParams[q].classList.remove('thisNumberWasComputed') // Automatically remove all bold text from calculated numbers if the user starts tinkering with variables, to indicate that the number is no longer accurate
		}
}

// Add listeners to every input boxes that is called when the number inside is changed, to remove the bold "computed" effect from any previously computed variables.
for (i=0; i<allInputBoxesIncludingAdvancedParams.length; i++) {
	allInputBoxesIncludingAdvancedParams[i].addEventListener("change", function() {
		inputBoxChangeHandler();
	});
}

function formatInputBoxes(boxToFormat) {
	if (boxToFormat == 'equity' || boxToFormat == 'all') {
		equityNumBox.value = formatNumber(equityNumBox.value, 3);
	}

	if (boxToFormat == 'salary' || boxToFormat == 'all') {
		salaryNumBox.value = formatNumber(salaryNumBox.value, 0);
	}

	if (boxToFormat == 'valuation' || boxToFormat == 'all') {
		valueNumBox.value = formatNumber(valueNumBox.value, 0);
	}

	if (boxToFormat == 'vMultiplier' || boxToFormat == 'all') {
		vMultiplierBox.value = formatNumber(vMultiplierBox.value, 3);
	}

}

// Add another, individual click listener to each input box to format the number after every change.
equityNumBox.addEventListener("change", function() {
	formatInputBoxes('equity');
	this.classList.remove("errorGlow");
});

salaryNumBox.addEventListener("change", function() {
	formatInputBoxes('salary');
	this.classList.remove("errorGlow");
});

valueNumBox.addEventListener("change", function() {
	formatInputBoxes('valuation');
	this.classList.remove("errorGlow");
});

vMultiplierBox.addEventListener("change", function() {
	formatInputBoxes('vMultiplier');
	this.classList.remove("errorGlow");
});




// The error that pops up when users have left boxes unfilled offers them a link they can click to set all empty boxes to zero.  THis is the function that link calls.
function setUnfilledInputBoxesToZero() {
	for (i=0; i<allInputBoxesIncludingAdvancedParams.length; i++) {
		if (allInputBoxesIncludingAdvancedParams[i].value == "") {
			allInputBoxesIncludingAdvancedParams[i].value = 0;
		}
	}
	solveGrahamEquation(true);
}


calculateButton.addEventListener("click", function() {solveGrahamEquation(true)});


// This function appends a new error-message paragraph to the "errorTextBox" div.
function appendErrorMessage(errorMessage) {
	var newErrorP = document.createElement('p');
	newErrorP.innerHTML = errorMessage;
	errorTextBox.appendChild(newErrorP);
}


// Apparently Javascript is pretty awful at rounding variables.  This function gets around that.  Kudos to Jack Moore for the code: http://www.jacklmoore.com/notes/rounding-in-javascript/
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

// Format a number n using: 
//   p decimal places (two by default)
//   ts as the thousands separator (comma by default) and
//   dp as the  decimal point (period by default).
//
//   If p < 0 or p > 20 results are implementation dependent.
function formatNumber(n, p, ts, dp) {

	if (isNaN(n)) {
		return n;
	}

  var t = [];
  // Get arguments, set defaults
  if (typeof p  == 'undefined') p  = 2;
  if (typeof ts == 'undefined') ts = ',';
  if (typeof dp == 'undefined') dp = '.';

  // Get number and decimal part of n
  n = Number(n).toFixed(p).split('.');

  // Add thousands separator and decimal point (if requied):
  for (var iLen = n[0].length, i = iLen? iLen % 3 || 3 : 0, j = 0; i <= iLen; i+=3) {
    t.push(n[0].substring(j, i));
    j = i;
  }
  // Insert separators and return result
  return t.join(ts) + (n[1]? dp + n[1] : '');
}

function deFormatNumber(n) {
	return Number(n.replace(/\,/g,''));
}



// This is the big one.  Let's try solving the equation for the user!
function solveGrahamEquation(verboseErrors) {

	var thereIsAnError = false;
	var notNumberError = false;
	var thereAreUnfilledBoxes = false;

	errorTextBox.innerHTML = ""  // Clear all currently displayed error messages from the error text box.



// If the user hasn't chosen an output via a radio button yet, we check to see if he did so implicitly by filling in all boxes except for one.  If they have, we click that radio button on their behalf - but only if they've clicked the "calculate!" button (as demonstrated through the verboseErrors flag being true)
// This code is partially obsolete now that the input boxes are hidden until the user clicks a radio button. However, the code in the "ELSE" statement is now used to throw an error explaining that the user needs to click a radio button.
	if (!hasTheUserChosenAnOutput && verboseErrors) {
	var numberOfInputsWithoutValues = 0;
	var implicitlyChosenRadioButton = null;

		for (i=0; i<allVarInputBoxes.length; i++) {

			if (allVarInputBoxes[i].value == "") {
				numberOfInputsWithoutValues++; // keep track of how many variables are filled in.
				implicitlyChosenRadioButton = i; // Keep track of the index of the one-chosen variable.
			}
		}

		if (numberOfInputsWithoutValues == 1) {
			allOutputRadioButtons[implicitlyChosenRadioButton].click(); // If only one variable is unfulled, we assume that's what they want to calculate, and we click that radio button for the user.
		}
		else {
			// We ask the user to choose a radio button, and highlight them
			appendErrorMessage('Please select the value that you want to calculate.'); 

			for (i = 0; i < allOutputRadioButtons.length; i++) {
				allOutputRadioButtons[i].classList.remove('glowingUntilClicked');
				allOutputRadioButtons[i].classList.add('errorGlow');
			}

			return

		}

	}




// Check the equity input box for errors.
	if (equityRadio.checked){ //If this box is checked, do nothing except clear the current value. We don't need to error-chek the current contents because they're being assigned.
		equityNumBox.value = "";
	}
	else if(equityNumBox.value > 100) {
		thereIsAnError = true;

		if (verboseErrors) {
			thereIsAnError = true;
			equityNumBox.classList.add('errorGlow');
			appendErrorMessage("Sorry, you can't own more than 100% of the company. <a href='https://en.wikipedia.org/wiki/The_Producers_(1967_film)'>Not even Mel Brooks</a> could pull that off.");

		}
	}
	else if (equityNumBox.value < 0) {
		thereIsAnError = true;
		if (verboseErrors) {
			equityNumBox.classList.add('errorGlow');
			appendErrorMessage("The 'equity' number should be more than zero.");
		}
	}
	else if (equityNumBox.value == "") {
		thereIsAnError = true;
		thereAreUnfilledBoxes = true;
		if (verboseErrors) {
			equityNumBox.classList.add('errorGlow');
		}
	}
	else if (isNaN(deFormatNumber(equityNumBox.value))) {
		thereIsAnError = true;
		notNumberError = true;
		if (verboseErrors) {
			equityNumBox.classList.add('errorGlow');
		}
	}
	else {equityNumBox.classList.remove('errorGlow');} // if all is well, remove any previous warning animation.

// Check the salary input box for errors.
	if (salaryRadio.checked){  //If this box is checked, do nothing except clear the current value. We don't need to error-chek the current contents because they're being assigned.
		salaryNumBox.value = "";
		}
	else if (salaryNumBox.value < 0) {
		if (verboseErrors) {
			appendErrorMessage("Heads up: You specified a negative number for your salary.  That's weird and maybe an error, but I calculated the equation with your negative number anyway, in case you mean that you're paying cash into the company that you're joining.");
		}
	}
	else if (salaryNumBox.value == "") {
		thereIsAnError = true;
		thereAreUnfilledBoxes = true;
		console.log('salary unfilled');

		if (verboseErrors) {
			salaryNumBox.classList.add('errorGlow');
		}
	}
	else if (isNaN(deFormatNumber(salaryNumBox.value))) {
		thereIsAnError = true;
		notNumberError = true;
		if (verboseErrors) {
			salaryNumBox.classList.add('errorGlow');
		}
	}
	else {salaryNumBox.classList.remove('errorGlow');} // if all is well, remove any previous warning animation.


// Check the valuation input box for errors.
	if (valueRadio.checked){  //If this box is checked, do nothing except clear the current value. We don't need to error-chek the current contents because they're being assigned.
		valueNumBox.value = "";
		}
	else if (valueNumBox.value < 0) {
		if (verboseErrors) {
			appendErrorMessage("Heads up: You specified a negative number for the value of the company.  That's weird - I'm guessing you made a typo, but I calculated the equation with your negative number anyway, in case you're trying something... creative.");
		}
	}
	else if (valueNumBox.value == "0") {
		thereIsAnError = true;
		if (verboseErrors) {
			valueNumBox.classList.add('errorGlow');
			appendErrorMessage("The company's valuation should be more than zero.");
		}
	}
	else if (valueNumBox.value == "") {
		thereIsAnError = true;
		thereAreUnfilledBoxes = true;
		
		if (verboseErrors) {
			valueNumBox.classList.add('errorGlow');
		}
	}
	else if (isNaN(deFormatNumber(valueNumBox.value))) {
		thereIsAnError = true;
		notNumberError = true;
		if (verboseErrors) {
			valueNumBox.classList.add('errorGlow');
		}
	}
	else {valueNumBox.classList.remove('errorGlow');} // if all is well, remove any previous warning animation.

// Check the valuation multiplier input box for errors.
	if (vMultiplierRadio.checked){  //If this box is checked, do nothing except clear the current value. We don't need to error-chek the current contents because they're being assigned.
		vMultiplierBox.value = "";
	}
	else if (vMultiplierBox.value < 0 || vMultiplierBox.value == "0") {
		thereIsAnError = true;
		if (verboseErrors) {
			vMultiplierBox.classList.add('errorGlow');
			appendErrorMessage("The 'Valuation Multiplier' number should be more than zero.");
		}
	}
	else if (vMultiplierBox.value == "") {
		thereIsAnError = true;
		thereAreUnfilledBoxes = true;
		if (verboseErrors) {
			vMultiplierBox.classList.add('errorGlow');
		}
	}
	else if (isNaN(deFormatNumber(vMultiplierBox.value))) {
		thereIsAnError = true;
		notNumberError = true;
		if (verboseErrors) {
			vMultiplierBox.classList.add('errorGlow');
		}
	}
	else {vMultiplierBox.classList.remove('errorGlow');} // if all is well, remove any previous warning animation.


// Check the salary multiplier input box for errors.
	if (salaryMultiplierBox.value < 0) {
		thereIsAnError = true;
		if (verboseErrors) {
			salaryMultiplierBox.classList.add('errorGlow');
			appendErrorMessage("The 'Salary Multiplier' number should be zero or greater.  If you're in a lazy mood, <a id=setBlanksToZero onclick='setUnfilledInputBoxesToZero()' href='javascript:void(0);'>click here</a> to set all unfilled boxes to zero.");
		}
	}
	else if (salaryMultiplierBox.value == "") {
		thereIsAnError = true;
		if (verboseErrors) {
			salaryMultiplierBox.classList.add('errorGlow');
			appendErrorMessage("Please fill in the 'salary multiplier' box.");
		}
	}
	else if (isNaN(deFormatNumber(salaryMultiplierBox.value))) {
		thereIsAnError = true;
		notNumberError = true;
		if (verboseErrors) {
			salaryMultiplierBox.classList.add('errorGlow');
		}
	}
	else {salaryMultiplierBox.classList.remove('errorGlow');} // if all is well, remove any previous warning animation.

// Check the profit input box for errors.
	if (companyProfitBox.value < 0) {
		thereIsAnError = true;
		if (verboseErrors) {
			companyProfitBox.classList.add('errorGlow');
			appendErrorMessage("The 'company's profit' number should be zero or greater.  If you're in a lazy mood, <a id=setBlanksToZero onclick='setUnfilledInputBoxesToZero()' href='javascript:void(0);'>click here</a> to set all unfilled boxes to zero.");
		}
	}
	else if (companyProfitBox.value == "") {
		thereIsAnError = true;
		if (verboseErrors) {
			companyProfitBox.classList.add('errorGlow');
			appendErrorMessage("Please fill in the 'company's profit' box.");
		}
	}
	else if (isNaN(deFormatNumber(companyProfitBox.value))) { 
		thereIsAnError = true;
		notNumberError = true;
		if (verboseErrors) {
			companyProfitBox.classList.add('errorGlow');
		}
	}
	else {companyProfitBox.classList.remove('errorGlow');} // if all is well, remove any previous warning animation.




	if (verboseErrors && thereAreUnfilledBoxes) {
		appendErrorMessage('Please fill in 3 of the four numbers above in order to run the equation, or <a id=setBlanksToZero onclick="setUnfilledInputBoxesToZero()" href="javascript:void(0);">click here</a> to set all the unfilled boxes to zero.');
	}

	if (notNumberError && verboseErrors) {
		appendErrorMessage("Numbers only please.");
	}

	if (thereIsAnError) {
		return; // If there was an error, we end the function here without actually calculating anything.
	}


// OK, if we've gotten this far, we're ready to actually run the numbers and make our calculation.  Let's get started by pulling all the inputs, and - as needed - converting them from percentages to decimal values.
// Also, we need to 'deformat' the numbers - remove commas, dollar signs, and percent signs.  Otherwise we'll get NaN errors when we try to do math.
	equity = deFormatNumber(equityNumBox.value)/100;
	salary = deFormatNumber(salaryNumBox.value);
	companyValue = deFormatNumber(valueNumBox.value);
	vMultiplier = deFormatNumber(vMultiplierBox.value)/100;
	salaryMultiplier = deFormatNumber(salaryMultiplierBox.value)/100;
	companyProfit = deFormatNumber(companyProfitBox.value)/100;

	// One last bit of housekeeping before we start crunching numbers - let's permanently remove any tooltips, and unhide all input text boxes:
	hasCalculationSuccessfullyOccuredYet = true;
	for (i = 0; i < allHintParas.length; i++) {
		allHintParas[i].classList.add('hiddenPara'); // Hide any tooltips that were visible
	}

	for (i = 0; i < allInputGroups.length; i++) {
		allInputGroups[i].classList.remove('hiddenPara') // Unhide all the input boxes
	}

	

	// run this version of the equuation if the 'equity' button is checked
	if (equityRadio.checked) {
		equity = (1 - (1/(1 + vMultiplier)))/(1+companyProfit) - salary*(salaryMultiplier+1)/companyValue;

		equityNumBox.value = round(equity*100, 3);
		pulseElement(equityNumBox);
		equityNumBox.classList.add('thisNumberWasComputed'); // Basically just makes computed text bold, to make it clear that it wasn't typed by the user, it was actually calculated.
		equityNumBox.classList.remove('thisNumberNotComputed');

	} else if (salaryRadio.checked) { // run this version of the equuation if the 'salary' button is checked
		salary = (equity - (1 - (1/(1 + vMultiplier)))/(1+companyProfit))*companyValue*-1/(1+salaryMultiplier);

		salaryNumBox.value = round(salary, 0);
		pulseElement(salaryNumBox);
		salaryNumBox.classList.add('thisNumberWasComputed'); // Basically just makes computed text bold, to make it clear that it wasn't typed by the user, it was actually calculated.
		salaryNumBox.classList.remove('thisNumberNotComputed');

	} else if (valueRadio.checked) { // run this version of the equuation if the 'value' button is checked
		companyValue = 1/(equity - (1 - (1/(1 + vMultiplier)))/(1+companyProfit))*-1*salary*(1+salaryMultiplier);

		valueNumBox.value = round(companyValue, 0);
		pulseElement(valueNumBox);
		valueNumBox.classList.add('thisNumberWasComputed'); // Basically just makes computed text bold, to make it clear that it wasn't typed by the user, it was actually calculated.
		valueNumBox.classList.remove('thisNumberNotComputed');

	} else if (vMultiplierRadio.checked) { // run this version of the equuation if the 'valuation multiplier' button is checked
		vMultiplier = 1/(((equity + salary*(salaryMultiplier+1)/companyValue)*(companyProfit+1) - 1)*(-1))-1;

		vMultiplierBox.value = round(vMultiplier*100, 2);
		pulseElement(vMultiplierBox);
		vMultiplierBox.classList.add('thisNumberWasComputed'); // Basically just makes computed text bold, to make it clear that it wasn't typed by the user, it was actually calculated.
		vMultiplierBox.classList.remove('thisNumberNotComputed');
	}

	formatInputBoxes('all');

}


