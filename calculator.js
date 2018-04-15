//Known issues
// starting with minus not handled correctly
// missing chaining functionality

var currentNumber = "",
	oldNumber = "",
	operator,
	currentInput,
	dotAlreadyUsedInCurrentNumber = false,
	operatorElement = document.getElementById('operator')
	operatorsList = document.querySelectorAll('.operator'),
	resultElement = document.getElementById('result'),
	equalsElement = document.getElementById('equals'),
	clearElement = document.getElementById('clear'),
	digitsList = document.querySelectorAll('.digit')

	
	function addHandler(element, func, isElementNodeList){
		if(isElementNodeList === true){
			Array.from(element).forEach(function(element){
				element.addEventListener('click', func)
			})
		} else {
			element.addEventListener('click', func);
		}
	}

	function digitHandler(event, isKeyboardEvent){
		currentInput = event.target.textContent;
		
		if(isKeyboardEvent === true){
			currentInput = event.key;
		}
		
		if(currentNumber.length >= 10){
			return;
		}
		if(resultElement.textContent && currentInput === '.' && !dotAlreadyUsedInCurrentNumber){
			resultElement.textContent = '';
			currentNumber += currentInput;
			dotAlreadyUsedInCurrentNumber = true;
		} else if(currentInput === '.' && dotAlreadyUsedInCurrentNumber){
			return;
		} else if(resultElement.textContent){
			resultElement.textContent = '';
			currentNumber += currentInput;
		} else {
			currentNumber += currentInput;
		}
		
		if(currentNumber.length > 1 && currentNumber[0] === '0'){
			currentNumber = currentNumber.slice(1);
		}

		resultElement.textContent = currentNumber;
	}	

	function operatorAction(event, isKeyboardEvent){
		currentInput = event.target.textContent;
		
		if(isKeyboardEvent === true){
			currentInput = event.key;
		}

		if(!currentNumber && !oldNumber){
			console.warn('select a number first');
			return;
		} else if(operator){
			operator = currentInput;
			operatorElement.textContent = currentInput;
		} else {
			oldNumber = currentNumber;
			currentNumber = "";
			operator = currentInput;
			operatorElement.textContent = currentInput;
			dotAlreadyUsedInCurrentNumber = false;
		}
	}
	
	function equalsAction(){
		if(oldNumber && currentNumber && operator){
			oldNumber = parseFloat(oldNumber);
			currentNumber = parseFloat(currentNumber);

			switch(operator){
				case "+":
					resultElement.textContent = oldNumber + currentNumber;
					break;

				case "-":
					resultElement.textContent = oldNumber - currentNumber;
					break;

				case "*":
					resultElement.textContent = oldNumber * currentNumber;
					break;

				case "/":
					if(currentNumber === 0){
						resultElement.textContent = 'Cannot divide by zero';
					} else {
						resultElement.textContent = oldNumber / currentNumber;
					}
					break;

				default:
					resultElement.textContent = '';
					break;

			}
		}

		oldNumber = "";
		currentNumber = "";
		operator = "";
		operatorElement.textContent = '';
		dotAlreadyUsedInCurrentNumber = false;
		if(resultElement.textContent.length > 10){
			resultElement.style.fontSize = "large";
		}
	}
	
	function clearAction(){
		oldNumber = "";
		currentNumber = "";
		operator = "";
		operatorElement.textContent = '';
		resultElement.textContent = '';
		dotAlreadyUsedInCurrentNumber = false;
	}

window.addEventListener("load",function() {

	addHandler(digitsList, digitHandler, true);
	
	addHandler(operatorsList, operatorAction, true);
	
	addHandler(equalsElement, equalsAction);

	addHandler(clearElement, clearAction);
	
	//KEYBOARD FUNCTIONALITY
	window.addEventListener('keyup', function(e){
		/*keycodes legend:
		48-57 upper keyboard digits
		96-105 numpad digits
		110 . (dot)
		8 backspace
		13 enter
		187 upper keyboard equals
		107 + numpad
		109 - numpad
		106 * numpad
		111 / numpad*/

		
		//upper keyboard digits OR numpad digits OR dot codes
		if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 110){
			digitHandler(e, true);
		}
		
		//operators codes
		if([107,109,106,111].indexOf(e.keyCode) >= 0){
			operatorAction(e, true)
		}
	
		//backspace code
		if(e.keyCode === 8){
			clearAction();
		}
		
		//enter OR equals 
		if(e.keyCode === 13 || e.keyCode === 187){
			equalsAction()
		}
	});
});