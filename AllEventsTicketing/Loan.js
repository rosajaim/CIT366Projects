// The Loan class
function Loan() {
	

	
	this.getSalesCommission = function() {
		
		// GET loanAmount
		var amount = document.getElementById("amount").value;
		
		if (isNaN(amount)) {
			displayError('Invalid sales amount. The amount must be a number');
			return;
		}

		amount = parseFloat(amount);
		
		// Check for invalid loan amount (amount < 0 OR amount > 100000000)
		if (amount < 0  ||  amount >= 100000000 )  {
			displayError('Invalid sales amount. The amount must be between 0 and 100,000,000');
			return;
		}
		
		// get the commission rate based from the commission rate table
		var commissionRate;
		if ( amount < 1000 ) {
			commissionRate = 0.00;
		}
		else if ( amount < 20000) {
			commissionRate = 0.02;
		}
		else if (amount < 100000) {
			commissionRate = 0.025;
		}
		else if (amount < 1000000) {
			commissionRate = 0.025;
		}
		else {
			commissionRate = 0.03;
		}
		
		var commission = amount * commissionRate; // calculate sales commission
		
		// call formatCurrency function to change from number format to currency format
		commission = this.formatCurrency(commission); 
		
		// DISPLAY the commission rate
		displayAnswer('The sales commission is ' + commission);
	}

			
	this.calcMonthlyPayment = function() {
		
		// GET amount, interestRate and months from the sceen
		var seasonPassAmt = document.getElementById("amount").value;
		var intRate = document.getElementById("interestRate").value;
		var noMonths = document.getElementById("months").value;
		
		// example of calling the monthly payment function
		var monPayment = this.getMonthlyPayment( intRate, noMonths, seasonPassAmt);
		if (monPayment < 0) // checks to see if the monthly payment function failed and displayed an error message
			return;

		monPayment = this.formatCurrency(monPayment); // formats monthly payment function as currency
		displayAnswer('The monthly payment is ' + monPayment); // displays the monthly payment function							
	}	
	
																															
	this.getMonthlyPayment = function(interestRatePerYear, months, seasonPassAmount) {
		var monthlyPayment = -1;
		
		// insert code here
		// NOTE: if an invalid input then display error and return -1; else, return the monthlyPayment value
		
		return monthlyPayment;	
	}
	
	
	this.getSeasonPassCommission = function() {	
		// insert code here     
	}
	
		
	this.getPayOffAmount = function() {
		// insert code here		
	}

	
	this.getTotalInterestPaid = function() {
		// insert code here
	}
		
	
	this.getTotalLoanCost = function() {
		// insert code here	
	}
		
	
	this.getFutureValue = function() {
		
			
	}
		
	
	this.getNetPresentValue = function() {
		// insert code here
	}

	
    this.item1 = function(aList) {
        var total = 0;
        for (var i=0; i<aList.size; i++) {
            total = total + aList[i];
        }
    
        return total;
    }
    
    this.item2 = function(aList) {
        var sumTotal = sum(aList);
        var avg = sumTotal / aList.size;
        
        return avg;
    }
    
    
    this.item3 = function(aList) {
        var minimum = aList[0];
        for (var i=1; i < aList.size; i++) {
            if (aList[i] < minimum) {
                minimum = aList[i];
            }
        }
    
        return minimum;
    }
	
	this.item4 = function(aList) {
        var maximum = aList[0];
        for (var i=1; i < aList.size; i++) {
            if (aList[i] > maximum) {
                maximum = aList[i];
            }
        }
    
        return maximum;
    }

    
	this.item5 = function(aList, value) {
        var maximum = aList[0];
        for (var i=0; i < aList.size; i++) {
            if (aList[i] == value) {
                return i;
            }
        }
    
        return -1;
    }
    
    
        
    this.case8 = function() {
        var numList = [15, 22, 10, 5, 4, 2, 7];
        
        
    
    
    }

	
	
	// formats a number to currency format
	this.formatCurrency = function(numValue) 
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
	
	// clear all input fields
	this.clear = function() {
		var inputList = document.getElementsByTagName("input");	
		for (var i=0; i < inputList.length; i++) {
			if (inputList[i].type == 'text') {
				inputList[i].value = "";
			}
		}
		
		document.getElementById('messageArea').innerHTML = '';
		document.getElementById('outputArea').innerHTML = '';
		document.getElementById('outputArea').style.display = 'none';
		document.getElementById('messageArea').style.display = 'none';		
	}
	
	
}