// The ShoppingCart class
function ShoppingCart() {

			
	this.getTotalTax = function(subTotal, state) {
		
        /*-------------------------------Insert your code here -------------------------------------*/


        /*-------------------------------Insert your code here -------------------------------------*/
        								
	}	
	
	
			
	this.getShippingCost = function(subTotal, shippingMethod) {
		
        /*-------------------------------Insert your code here -------------------------------------*/


        /*-------------------------------Insert your code here -------------------------------------*/
        								
	}	
		

	this.getSubTotal = function(quantities, unitPrices) {
    
        /*-------------------------------Insert your code here -------------------------------------*/


        /*-------------------------------Insert your code here -------------------------------------*/
        					
	}	


	
	this.getTotalPrices = function() {
    
        /*-------------------------------Insert your code here -------------------------------------*/


        /*-------------------------------Insert your code here -------------------------------------*/
        
	}
	
																															
	// clear all input fields
	this.clear = function() {
		var inputList = document.getElementsByTagName("input");	
		for (var i=0; i < inputList.length; i++) {
			if (inputList[i].type == 'text') {
				inputList[i].value = "";
			}
		}
		document.getElementById('subTotal').innerHTML = '&nbsp;';
		document.getElementById('taxAmount').innerHTML = '&nbsp;';
		document.getElementById('shippingCost').innerHTML = '&nbsp;';
		document.getElementById('totalCost').innerHTML = '&nbsp;';
		document.getElementById('messageArea').style.display = 'none';		
	}
	
	
	
	
}