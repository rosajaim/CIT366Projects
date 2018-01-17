function FrontController(){//the constructor
	//a map of approved commands
	this.acceptableCommands = {
			home:'Home', 
			displayCheckout:'DisplayCheckout',
			displaySalesCommission:'DisplaySalesCommission',
			displaySeasonPassCommission: 'DisplaySeasonPassCommission',
			displayMonthlyPayment: 'DisplayMonthlyPayment',
            displayPayOffAmount:'DisplayPayOffAmount',
			displayTotalInterestPaid:'DisplayTotaInterestPaid',
			displayTotalLoanCost:'DisplayTotalLoanCost',
			displayFutureValue:'DisplayFutureValue',
			displayPresentValue:'DisplayPresentValue',
			displayIntersection:'DisplayIntersection',
			displayUnion:'DisplayUnion',
			displayRelativeComplement:'DisplayRelativeComplement',
			displaySymmetricDifference:'DisplaySymmetricDifference',
			testGetSubTotal:'testGetSubTotal',
			testGetTotalTax:'testGetTotalTax',
			testGetShippingCost:'testGetShippingCost'
							
			};
		
	this.applicationController = new ApplicationController();
	this.viewController = new ViewController();
	//this.businessRules = new Loan();
	
	

	
	//the dispatch method is used to handle all requests
	this.dispatch = function(cmd, area, event){
        if(event == null){
            event = window.event;
        }
        //call the method to stop the default behavior of the event
        stopDefault(event);
		//see if the command is valid
		var cmdName = this.acceptableCommands[cmd];
		if(cmdName != null){
			var objName = cmdName;
            //get the target element of the event
            var target = null;//a change made to support history tracking
            if(event != null){
                target = event.currentTarget || event.srcElement;//others or IE
            }
			
			// this.applicationController.execute(cmdName);
			this.viewController.execute(cmdName, area);
		}
	}
}



//stop an event from doing its' default behavior since it will be handled in the BCO and VCO
function stopDefault(event){
    if(event){
        if (event.preventDefault)// non-IE
                event.preventDefault();
        event.returnValue = false;// IE
    }
}

var getTotalPricesBCO = function() {
	document.getElementById(messageArea).style.display = 'none';
	document.getElementById(messageArea).innerHTML = '';
	var rv = shoppingCart.getTotalPrices();
	// if (rv > 0)
		// document.getElementById(messageArea).style.display = 'none'; 
	
}


var getQuantities = function() {
	return shoppingCart.quanityOfItemsPurchased;
}


var getUnitPrices = function() {
	return shoppingCart.unitPricesOfItems;
}

// Display an error message on the screen
var displayError = function(errorMessage) {
	var errorDiv = document.getElementById(messageArea);
	errorDiv.innerHTML += "<span  class='errorMessage'>" + errorMessage + "</span><br />";
	errorDiv.style.display = 'block';
}

// Display the answer
var displayAnswer = function(answer) {
	var answerDiv = document.getElementById('outputArea');
	answerDiv.innerHTML = "<span  class='answerMessage'>" + answer + "</span><br />";
	answerDiv.style.display = 'block';
}




var roundNumber = function(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}


	
	
// formats a number to currency format
var formatCurrency = function(numValue) 
{
    if (numValue == 0)
        return '$0.00';
         
    var strValue = new String(numValue);
    var decimalPos = strValue.indexOf(".");
        
    var decimalValue;
    if (decimalPos < 0)
        decimalValue = "00";
    else {
        decimalValue = strValue.substr(decimalPos+1);
        strValue = strValue.substr(0, decimalPos);
        if (decimalValue.length < 2)
            decimalValue = decimalValue + '0';
        else
            decimalValue = decimalValue.substr(0, 2);
    }
        
    var nextCommaPos = strValue.length % 3;
    if (nextCommaPos == 0)
        nextCommaPos = 3;
    var leftValue = '';
    var idx = 0;
    while (idx < strValue.length) {
        leftValue = leftValue + strValue[idx];
        idx++;
        if (idx == nextCommaPos && idx < strValue.length-1) {
            leftValue = leftValue + ',';
            nextCommaPos = idx + 3;
        }
            
    }
        
    return '$' + leftValue + '.' + decimalValue;
}
