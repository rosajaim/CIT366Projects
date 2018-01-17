

function testGetSubTotal() {
	
	messageArea = 'testArea';
	
	var testShoppingCart = new ShoppingCart();
	var success = true;

	clearMessageArea();
	displayStartMessage("Running test cases for getSubTotal");

	
	try {

		// test for valid values
		subTotal = testShoppingCart.getSubTotal([ 2, 5, 3, 1, 4 ], [ 5.99, 1.99, 4.99, 15.00, 8.00 ]);
		if ( subTotal != 83.9) {
			displayTestFailedMessage("getSubTotals - Test 1 for valid quantities and unitPrices arrays failed."); 
			success = false;
		}
		
		// test null quantities array
		var subTotal = testShoppingCart.getSubTotal(null, new Array());
		if ( subTotal != -1 ) {
			displayTestFailedMessage("getSubTotals - Test 2 for null quantities array failed");
			success = false;
		}
	
	
		// test null quantities array
		subTotal = testShoppingCart.getSubTotal(new Array(), null);
		if ( subTotal != -1) {
			displayTestFailedMessage("getSubTotals - Test 3 for null unitPrices array failed");
			success = false;
		}
	
		
		// test for unequal size arrays
		subTotal = testShoppingCart.getSubTotal([5, 2], [1.99, 2.99, 3.99]);
		if ( subTotal != -1) {
			displayTestFailedMessage("getSubTotals - Test 4 for unequal lengths for quantites and unitPrices arrays failed");
			success = false;
		}
		
		if (success) {
			displayTestSuccessMessage('getSubTotals - Congratulations!!! All test successfully passed');
			messageArea = 'messageArea';
			return 0;
		}
		else {
			messageArea = 'messageArea';
			return -1;
		}
					
	} catch(e) {
		displayTestFailedMessage("getShippingCost - Exception: " + e);
		return -1;
	}
	
}




function testGetTotalTax() {
	messageArea = 'testArea';
	
	var testShoppingCart = new ShoppingCart();
	var success = true;

	clearMessageArea();
	displayStartMessage("Running test cases for getTotalTax()");

	try {
	
	
		
		// test for valid values
		var totalTax = testShoppingCart.getTotalTax(100, "AZ");
		totalTax = roundNumber(totalTax, 2);
		if ( totalTax < 9.10  ||  totalTax >= 9.11) {
			displayTestFailedMessage("getTotalTax failed - Test 1 for valid state, AZ. ");
			success = false;
		}
				
		// test for valid values
		totalTax = testShoppingCart.getTotalTax(100, "CA");
		totalTax = roundNumber(totalTax, 2);
		if ( totalTax < 7.25  ||  totalTax >= 7.26) {
			displayTestFailedMessage("getTotalTax failed - Test 2 for valid state, CA. ");
			success = false;
		}
				
		// test for valid values
		totalTax = testShoppingCart.getTotalTax(100, "CO");
		totalTax = roundNumber(totalTax, 2);
		if ( totalTax < 2.90  ||  totalTax >= 2.91) {
			displayTestFailedMessage("getTotalTax failed - Test 3 for valid state, CO. ");
			success = false;
		}
		
				
		// test for valid values
		totalTax = testShoppingCart.getTotalTax(100, "ID");
		totalTax = roundNumber(totalTax, 2);
		if ( totalTax < 6.00  ||  totalTax >= 6.01) {
			displayTestFailedMessage("getTotalTax failed - Test 4 for valid state, ID. ");
			success = false;
		}
		
				
		// test for valid values
		totalTax = testShoppingCart.getTotalTax(100, "MT")
		totalTax = roundNumber(totalTax, 2);
		if ( totalTax != 0.0) {
			displayTestFailedMessage("getTotalTax failed - Test 5 for valid state, MT. ");
			success = false;
		}
				
		// test for valid values
		totalTax = testShoppingCart.getTotalTax(100, "UT");
		totalTax = roundNumber(totalTax, 2);
		if ( totalTax < 5.25  ||  totalTax >= 5.26 ) {
			displayTestFailedMessage("getTotalTax failed - Test 6 for valid state, UT. ");
			success = false;
		}
					
		// test for valid values
		totalTax = testShoppingCart.getTotalTax(100, "WY");
		totalTax = roundNumber(totalTax, 2);
		if ( totalTax < 4.00  ||  totalTax >= 4.01) {
			displayTestFailedMessage("getTotalTax failed - Test 7 for valid state, WY. ");
			success = false;
		}
	
		// test subTotal is not a number quantities array
		totalTax = testShoppingCart.getTotalTax("abc", "CO");
		if ( totalTax != -1) {
			displayTestFailedMessage("getTotalTax failed - Test 8 subTotal is not a number.");
			success = false;
		}
	
		
		// test for negative subTotal
		totalTax = testShoppingCart.getTotalTax(-1, "CO");
		if ( totalTax != -1) {
			displayTestFailedMessage("getTotalTax failed - Test 9 for subTotal less than zero.");
			success = false;
		}
				
	
		// test for invalid state
		totalTax = testShoppingCart.getTotalTax(100, "ZZ");
		if ( totalTax != -1) {
			displayTestFailedMessage("getTotalTax failed - Test 10 for invalid state. ");
			success = false;
		}
				
		// test lower boundary value for subTotal
		totalTax = testShoppingCart.getTotalTax(0, "CO");
		if ( totalTax != 0 ) {
			displayTestFailedMessage("getTotalTax failed - Test 11 for subTotal = 0 subTotal");
			success = false;
		}
	


		if (success) {
			displayTestSuccessMessage('getTotalTax - Congratulations!!! All test successfully passed');
			messageArea = 'messageArea';
			return 0;
		}
		else {
			messageArea = 'messageArea';
			return -1;
		}
					
	} catch(e) {
		displayTestFailedMessage("getShippingCost - Exception: " + e);
		return -1;
	}

	
}





function testGetShippingCost() {
	messageArea = 'testArea';
	
	var testShoppingCart = new ShoppingCart();
	var success = true;
	
	clearMessageArea();
	displayStartMessage("Running test cases for getShippingCost");
	
	try {


		
		// test for valid values
		shippingCost = testShoppingCart.getShippingCost(10, "UPS");
		shippingCost = roundNumber(shippingCost, 2);
		if ( shippingCost < 5.95  ||  shippingCost >= 5.96) {
			displayTestFailedMessage("getShippingCost failed - Test 1 for valid shipping method, UPS, and subTotal < 20. ");
			success = false;
		}
		
		// test for valid values
		shippingCost = testShoppingCart.getShippingCost(25, "USM");
		shippingCost = roundNumber(shippingCost, 2);
		if ( shippingCost < 2.79  ||  shippingCost >= 2.80) {
			displayTestFailedMessage("getShippingCost failed - Test 2 for valid shipping method, USM, and subTotal < 50. ");
			success = false;
		}
		
				
		// test for valid values
		shippingCost = testShoppingCart.getShippingCost(60, "FEO");
		shippingCost = roundNumber(shippingCost, 2);
		if ( shippingCost < 3.97  ||  shippingCost >= 3.99) {
			displayTestFailedMessage("getShippingCost failed - Test 3 for valid shipping method, FEO, and subTotal < 75. ");
			success = false;
		}
				
		// test for valid values
		shippingCost = testShoppingCart.getShippingCost(80, "FEO");
		shippingCost = roundNumber(shippingCost, 2);
		if ( shippingCost < 1.98  ||  shippingCost >= 2.00) {
			displayTestFailedMessage("getShippingCost failed - Test 4 for valid shipping method, FEO, and subTotal < 100. ");
			success = false;
		}
		
				
		// test for valid values
		shippingCost = testShoppingCart.getShippingCost(100, "FEO");
		shippingCost = roundNumber(shippingCost, 2);
		if ( shippingCost != 0.00 ) {
			displayTestFailedMessage("getShippingCost failed - Test 5 for valid shipping method, FEO, and subTotal >= 100. ");
			success = false;
		}
		
			
		// test subTotal is not a number quantities array
		totalTax = testShoppingCart.getShippingCost("abc", "UPS");
		if ( totalTax != -1) {
			displayTestFailedMessage("getTotalTax - Test 6 subTotal is not a number.");
			success = false;
		}
	
		
		// test for unequal size arrays
		shippingCost = testShoppingCart.getShippingCost(-1, "UPS");
		if ( shippingCost != -1) {
			displayTestFailedMessage("getShippingCost - Test 7 for subTotal less than zero failed");
			success = false;
		}
				
	
		// test for valid values
		shippingCost = testShoppingCart.getShippingCost(100, "ZZ");
		if ( shippingCost != -1) {
			displayTestFailedMessage("getShippingCost - Test 8 for invalid shippingMethod failed. ");
			success = false;
		}
		
		
		if (success) {
			displayTestSuccessMessage('getShippingCost - Congratulations!!! All test successfully passed');
			messageArea = 'messageArea';
			return 0;
		}
		else {
			messageArea = 'messageArea';
			return -1;
		}
					
	} catch(e) {
		displayTestFailedMessage("getShippingCost - Exception: " + e);
		return -1;
	}
	
}



// Display an start message on the screen
var displayStartMessage = function(message) {
	var testDiv = document.getElementById('testArea');
	testDiv.style.display = 'none';
	var html = '<span class="startMessage">' + message + '</span><br /><br />' +
	    	   '<span class="errorMessage" style = "color: black">Messages:</span><br />';
	testDiv.innerHTML += html;
	testDiv.style.display = 'block'
}

	
// Display an error message on the screen
var displayTestFailedMessage = function(message) {
	var testDiv = document.getElementById('testArea');
	testDiv.style.display = 'none';
	var html = '<br /><span class="testFailMessage">' + message + '</span><br />';
	testDiv.innerHTML += html;
	testDiv.style.display = 'block'
}




	
// Display a success message on the screen
var displayTestSuccessMessage = function(message) {
	var testDiv = document.getElementById('testArea');
	testDiv.style.display = 'none';
	var html = '<br /><span class="testSuccessMessage">' + message + '</span><br />';
	testDiv.innerHTML += html;
	testDiv.style.display = 'block';
}


// clear message area
var clearMessageArea = function() {
	document.getElementById(messageArea).innerHTML = '';	
	
}


