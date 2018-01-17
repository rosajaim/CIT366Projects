/*--------------------------------------------------------------------------------------------
    The Security class
  --------------------------------------------------------------------------------------------*/
function Security() {

    // Define the attributes in the Securities class 
   this.maxTerm = 60;
   this.maxInterestRate = 0.10;


   // Define the functions (methods) in the Securities class 
   // add a function (method) called getTotal to calculate the monthly payment, total interest paid on the loan and the total cost 
   this.get = function() {
		// hide output area and message area
		document.getElementById('investedAmount').style.display = 'none';
		document.getElementById('message').style.display = 'none';
		document.getElementById('loanPayoffOutput').style.display = 'none';
		
		// get inputs
		var purchasePrice = document.getElementById('purchasePrice').value;
		var downPayment = document.getElementById('downPayment').value;
		var interestRate = document.getElementById('interestRate').value;
		var months = document.getElementById('months').value;
		
		if (isNaN(purchasePrice) || purchasePrice <= 0) {
			this.displayError('The purchase price must be a number > 0'); 
			document.getElementById('message').style.display = 'block';
			return;
		}
		
		if (isNaN(downPayment) || downPayment < 0) {
			this.displayError('The down payment must be a number > 0'); 
			document.getElementById('message').style.display = 'block';
			return;
		}
		
		if (isNaN(interestRate) || interestRate <= 0  || interestRate > 100) {
