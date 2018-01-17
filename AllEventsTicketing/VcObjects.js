	var headingHeight = 22;
	
	/*
	*  Custom server error display
	*/
	function ErrorHandlerVCO(){//updates the page when the data arives
		this.notify = function(data){
			alert('An error has happened. '+data);
		}
	}
	
	function HomeVCO(){ 
		var html = "";
		showForm(area, html);
		
	}


	function DisplayCheckoutVCO(area) {
		
		var html = 
		'<div id="scPanel">' +
			'<div id="formTitle">' +     	
				'<h2>Checkout and Purchase Tickets</h2>' +
			'</div>' +
			
			'<div id="scTitleDiv">' +
				'<div class="scRow">' +
					'<div id="scii1" class="scItemDescTitle">Description</div>' +
					'<div id="sciqt" class="scItemQuantityTitle">Quantity</div>' +
					'<div id="scipt" class="scItemPriceTitle">Price</div>' +
				'</div>' +
			'</div>' +
			
			'<div id="scDiv">' +
				'<div class="scRow">' +
					'<div id="scid0" class="scItemDesc">Tron - Cinema 4, Oct. 17, 4:00 PM</div>' +
					'<div id="sciq0" class="scItemQuantity"></div>' +
					'<div id="scip0" class="scItemUnitPrice"></div>' +
				'</div>' +
				'<div class="scRow">' +
					'<div id="scid1" class="scItemDesc">Playmill Season Pass</div>' +
					'<div id="sciq1" class="scItemQuantity"></div>' +
					'<div id="scip1" class="scItemUnitPrice"></div>' +
				'</div>' +
				'<div class="scRow">' +
					'<div id="scid2" class="scItemDesc">Phantom of the Opera - Oct. 31</div>' +
					'<div id="sciq2" class="scItemQuantity"></div>' +
					'<div id="scip2" class="scItemUnitPrice"></div>' +
				'</div>' +
				'<div class="scRow">' +
					'<div id="scid3" class="scItemDesc">BYU vs. Utah - Sept. 17</div>' +
					'<div id="sciq3" class="scItemQuantity"></div>' +
					'<div id="scip3" class="scItemUnitPrice"></div>' +
				'</div>' +
				'<div class="scRow">' +
					'<div id="scid4" class="scItemDesc">Contagion - BigScreen Theaters, Nov. 2, 7:00 PM</div>' +
					'<div id="sciq4" class="scItemQuantity"></div>' +
					'<div id="scip4" class="scItemUnitPrice"></div>' +
				'</div>' +
				'<div class="scRow">' +
					'<div id="subTotalLabel" class="scSummDesc">Sub-Total&nbsp; </div>' +
					'<div id="subTotal" class="scSummAmount">&nbsp;</div>' +
				'</div>' +
				'<div class="scRow">' +
					'<div id="taxDescLabel" class="scSummDesc">Tax&nbsp; </div>' +
					'<div id="taxAmount" class="scSummAmount">&nbsp;</div>' +
				'</div>' +
				'<div class="scRow">' +
					'<div id="shCostLabel" class="scSummDesc">Shipping Cost&nbsp;</div>' +
                    '<div id="shippingCost" class="scSummAmount">&nbsp;</div>' +                 
				'</div>' +
				'<div class="scRow">' +
					'<div id="totalDescLabel" class="scSummDesc">Total Cost&nbsp; </div>' +
					'<div id="totalCost" class="scSummAmount">&nbsp;</div>' +
				'</div>' +
			'</div>' +
		
			'<br />' +
			
			'<div id="smpm">' +

        
				'<div id="shDiv">' +
					'<span class="label">Ship Method:&nbsp;</span>' +
					'<input id="shippingMethod" class="inputField" type="text" size="3"/><br />' +
					'<span">' +
						'UPS - United Parcel Service<br />' + 
						'USM - United States Mail<br />' +
						'FEO - Federal Express Overnight<br />' +
					'</span><br .>' + 
				'</div>' +
					
        
				'<div id="saDiv">' + 
					'<span class="label">Ship To:</span><br />' +
					'<span class="label">Name</span><input id="shippingName" class="inputField" type="text" size="30"/><br />' +
					'<span class="label">Street</span><input id="shippingStreet" class="inputField" type="text"  size="30"/><br />' +
					'<span class="label">City</span>' +
					'<span class="label" style="position: relative; left: 65px">State</span>' +
					'<span class="label" style="position: relative; left: 72px">Zipcode</span><br />' +
					'<input id="shippingCity" class="inputField" type="text"  size="10"/>' +
					'<input id="shippingState" class="inputField" type="text"  size="2"/>' +
					'<input id="shippingZipcode" class="inputField" type="text"  size="5"/>' +
				'</div>' +
									
					
				'<div id="pmDiv">' +
					'<span class="label">Payment Method:</span><br />' +
					'<select id="paymentMethod" class="dropDown">' +
						'<option value="American Express">American Express</option>' +
						'<option value="Discovery">Discovery</option>' +
						'<option value="MasterCard">MasterCard</option>' +
						'<option value="Visa">Visa</option>' +
					'</select>' +     
					'<br />' +
					'<span class="label">Credit Card No.:</span><br />' +
					'<input id="ccNo" class="inputField" size="16" /><br />' +
					'<span class="label">Expiration Date:</span><br />' +
					'<div id="expDate">' +
						'<span >Month</span>' +
						'<span style="position:relative; left: 10px;">Year</span> <br />' + 
						'<input id="ccEDMonth" class="inputField" size="2" />' +
						'<input id="ccEDYear" class="inputField" size="2" style="position:relative; left: 4px;" />' +
					'</div>' +           
				'</div>' +
			'</div>' +
		
			'<div id="buttonsDiv">' +
				'<input id="calculateTotal" value="Calculate Total" onclick="getTotalPricesBCO()" type="button">' +   
				'<input id="purchaseButton" value="Purchase Tickets" onclick="shoppingCart.checkout()" type="button">' +
				'<input id="cancelButton" value="Clear" type="button" onclick="shoppingCart.clear()">' +
			'</div>' +
		'</div>';
		
		showForm(area, html);
		
		shoppingCart = new ShoppingCart();
		
		shoppingCart.quanityOfItemsPurchased = [ 2, 5, 3, 1, 4 ];
		shoppingCart.unitPricesOfItems = [ 5.99, 1.99, 4.99, 15.00, 8.00 ];	
		
		var elementPrefix = 'sciq';
		var elementId;
		for (var i=0; i< shoppingCart.quanityOfItemsPurchased.length; i++) {
			
			elementId = elementPrefix + i;
			var quantitiesDiv = document.getElementById(elementId).innerHTML = shoppingCart.quanityOfItemsPurchased[i];	
		}
		
		elementPrefix = 'scip';
		for (var j=0; j< shoppingCart.unitPricesOfItems.length; j++) {
			elementId = elementPrefix + j;
			var quantitiesDiv = document.getElementById(elementId).innerHTML = shoppingCart.unitPricesOfItems[j];		
		}

	}
	
	
	function testGetSubTotalVCO(area) {
		document.getElementById('testArea').innerHTML = '';
		testGetSubTotal();
	}
	
		
	function testGetTotalTaxVCO(area) {
		document.getElementById('testArea').innerHTML = '';
		testGetTotalTax();
	}
	
		
	function testGetShippingCostVCO(area) {
		document.getElementById('testArea').innerHTML = '';
		testGetShippingCost();
	}
	
	
	function DisplaySalesCommissionVCO(area) {
		var html = 
				   "<div id='formTitle'>" +
				   "     <h2>Calculate Sales Commission</h2>" +
				   "</div>" +
				   "<span class='caption' style='top: 44px;'>Amount:</span>" +
				   "<input id='amount' class='inputFields' size='10' style='top: 40px; width: 50px;'>" +
				   "<input id='calculateButton' type='button' value='Get Sales Commission' onClick='loan.getSalesCommission()' > " +
				   "<input id='clearAllButton' type='button' value='Clear'  onclick='loan.clear()'>";
		showForm(area, html);
	}
	

	function DisplayMonthlyPaymentVCO(area) {
		var html = 
				   "<div id='formTitle' >" +
				   "     <h2>Calculate Monthly Payment</h2>" +
				   "</div>" +
				   "<span class='caption' style='top: 44px;'>Amount:</span>" +
				   "<input id='amount' class='inputFields' size='10' style='top: 40px; width: 100px;'>" +
				   "<span class='caption' style='top: 66px;'>Interest Rate:</span>" +
				   "<input id='interestRate' class='inputFields' size='10' style='top: 62px; width: 100px;'>" +
				   "<span class='caption' style='top: 88px;'>months:</span>" +
				   "<input id='months' class='inputFields' size='10' style='top: 84px; width: 100px;'>" +
				   "<input id='calculateButton' type='button' value='Monthly Payment' onClick='loan.calcMonthlyPayment()' > " +
				   "<input id='clearAllButton' type='button' value='Clear'  onclick='loan.clear()'>";
		showForm('testArea', html);
	}


	function DisplayPayOffAmountVCO(area) {
		var html = 
				   "<div id='formTitle'>" +
				   "     <h2>Calculate Pay Off Amount</h2>" +
				   "</div>" +
				   "<span class='caption' style='top: 44px;'>Amount:</span>" +
				   "<input id='amount' class='inputFields' size='10' style='top: 40px; width: 100px;'>" +
				   "<span class='caption' style='top: 66px;'>Interest Rate:</span>" +
				   "<input id='interestRate' class='inputFields' size='10' style='top: 62px; width: 100px;'>" +
				   "<span class='caption' style='top: 88px;'>Months:</span>" +
				   "<input id='months' class='inputFields' size='10' style='top: 84px; width: 100px;'>" +
				   "<span class='caption' style='top: 110px;'>Pay off month:</span>" +
				   "<input id='payOffMonth' class='inputFields' size='10' style='top: 106px; width: 100px;'>" +
				   "<input id='calculateButton' type='button' value='Pay off amount' onClick='loan.getPayOffAmount()' > " +
				   "<input id='clearAllButton' type='button' value='Clear'  onclick='loan.clear()'>";
		showForm(area, html);
	}
	
	
	
	function DisplayTotaInterestPaidVCO(area) {
		var html =
				   "<div id='formTitle'>" +
				   "     <h2>Calculate Total Interest Paid</h2>" +
				   "</div>" +
				   "<span class='caption' style='top: 44px;'>Amount:</span>" +
				   "<input id='amount' class='inputFields' size='10' style='top: 40px; width: 100px;'>" +
				   "<span class='caption' style='top: 66px;'>Interest Rate:</span>" +
				   "<input id='interestRate' class='inputFields' size='10' style='top: 62px; width: 100px;'>" +
				   "<span class='caption' style='top: 88px;'>months:</span>" +
				   "<input id='months' class='inputFields' size='10' style='top: 84px; width: 100px;'" +
				   "<input id='calculateButton' type='button' value='Total interest paid' onClick='loan.getTotalInterestPaid()' >" + 
				   "<input id='clearAllButton' type='button' value='Clear'  onclick='loan.clear()'>";
		showForm(area, html);;
	}
	
	
	
	
	function DisplayTotalLoanCostVCO(area) {
		var html =
				   "<div id='formTitle'>" +
				   "      <h2>Calculate Total Loan Cost</h2>" +
				   "</div>" +
				   "<span class='caption' style='top: 44px;'>Amount:</span>" +
				   "<input id='amount' class='inputFields' size='10' style='top: 40px; width: 100px;'>" +
				   "<span class='caption' style='top:66px;'>Interest Rate:</span>" +
				   "<input id='interestRate' class='inputFields' size='10' style='top: 62px; width: 100px;'>" +
				   "<span class='caption' style='top: 88px;'>Months:</span>" +
				   "<input id='months' class='inputFields' size='10' style='top: 84px; width: 100px;'>" +
				   "<span class='caption' style='top: 110px;'>Special fees:</span>" +
				   "<input id='specialFees' class='inputFields' size='10' style='top: 106px; width: 100px;'>" +
				   "<input id='calculateButton' type='button' value='Total  cost' onClick='loan.getTotalLoanCost()' > " +
				   "<input id='clearAllButton' type='button' value='Clear' onclick='loan.clear()'>";
		showForm(area, html);
	}
	
	
	
	
	function DisplayFutureValueVCO(area) {
		var html =
				   "<div id='formTitle'>" +
				   "     <h2>Calculate Future Value of Loan</h2>" +
				   "</div>" +
				   "<span class='caption' style='top: 44px;'>Amount:</span>" +
				   "<input id='amount' class='inputFields' size='10' style='top: 40px; width: 100px;'>" +
				   "<span class='caption' style='top: 66px;'>Interest Rate:</span>" +
				   "<input id='interestRate' class='inputFields' size='10' style='top: 62px; width: 100px;'>" +
				   "<span class='caption' style='top: 88px;'>months:</span>" +
				   "<input id='months' class='inputFields' size='10' style='top: 84px; width: 100px;'>" +
				   "<input id='calculateButton' type='button' value=Future Value of Loan' onClick='loan.getFutureValue()' >" + 
				   "<input id='clearAllButton' type='button' value='Clear'  onclick='loan.clear()'>";
		showForm(area, html);
	}
	
		
	
	function DisplayPresentValueVCO(area) {
		var html =
				   "<div id='formTitle'>" +
				   "     <h2>Calculate the Present Value of Loan</h2>" +
				   "</div>" +
				   "<span class='caption' style='top: 44px;'>Amount:</span>" +
				   "<input id='amount' class='inputFields' size='10' style='top: 40px; width: 100px;'>" +
				   "<span class='caption' style='top: 66px;'>Interest Rate:</span>" +
				   "<input id='interestRate' class='inputFields' size='10' style='top: 62px; width: 100px;'>" +
				   "<span class='caption' style='top: 88px;'>months:</span>" +
				   "<input id='months' class='inputFields' size='10' style='top: 84px; width: 100px;'>" +
				   "<input id='calculateButton' type='button' value='Present Value' onClick='loan.getNetPresentValue()' >" + 
				   "<input id='clearAllButton' type='button' value='Clear'  onclick='loan.clear()'>";
		showForm(area, html);
	}
	
	
	function DisplaySeasonPassCommissionVCO(area) {
		var html =
				   "<div id='formTitle'>" +
				   "     <h2>Calculate Season Pass Commission</h2>" +
				   "</div>" +
				   "<span class='caption' style='top: 44px;'>Amount:</span>" +
				   "<input id='amount' class='inputFields' size='10' style='top: 40px; width: 100px;'>" +
				   "<span class='caption' style='top: 66px;'>Interest Rate:</span>" +
				   "<input id='interestRate' class='inputFields' size='10' style='top:62px; width: 100px;'>" +
				   "<span class='caption' style='top: 88px;'>Event Type:</span>" +
				   "<input id='eventType' class='inputFields' size='10' style='top: 84px; width: 100px;'>" +
				   "<input id='calculateButton' type='button' value='Season Pass Commission' onClick='loan.getSeasonPassCommission()' >" + 
				   "<input id='clearAllButton' type='button' value='Clear' onclick='loan.clear()'>";
		showForm(area, html);
	}
			
	
	function DisplayIntersectionVCO(area) {
		var resultList = set.intersection(listA, listB); // call and get the intersection
		var html = getListAHtml() + getListBHtml() + getResultListHtml(resultList);
		setMarketingAreaHeight(listA, listB, resultList);
		showForm(area, html);
	}
	
	
	
	function DisplayRelativeComplementVCO(area) {
		var resultList = set.relativeComplement(listA, listB); // call and get the intersection
		var html = getListAHtml() + getListBHtml() + getResultListHtml(resultList);
		setMarketingAreaHeight(listA, listB, resultList);
		showForm(area, html);
	}
	
	function DisplaySymmetricDifferenceVCO(area) {
		var resultList = set.symmetricDifference(listA, listB); // call and get the intersection
		var html = getListAHtml() + getListBHtml() + getResultListHtml(resultList);
		setMarketingAreaHeight(listA, listB, resultList);	
		showForm(area, html);
	}
		
	function DisplayUnionVCO(area) {
		var resultList = set.union(listA,listB); // call and get the intersection
		var html = getListAHtml() + getListBHtml() + getResultListHtml(resultList);
		setMarketingAreaHeight(listA, listB, resultList);
		showForm(area, html);;
	}
	
	function getListAHtml() {
		var listHeight =  headingHeight + (listA.length * 15);
		var html = "<div id='twoList' style='margin-top: 0.25in; margin-left: 0.25in'>" + "<div id='listA' style='height:" + listHeight + "px;'>";
		html = html + buildList("List A", listA);			
		html = html + "</div>";
		return html;
	}
			
	function getListBHtml() {
		var listHeight =  headingHeight + (listB.length * 15);
		var html = "<div id='listB' style='height:" + listHeight + "px;'>";
		html = html + buildList("List B", listB);			
		html = html + "</div>" + "</div>";
		return html;	
	}
	
	function getResultListHtml(resultList) {
		var listHeight = headingHeight + (resultList.length * 15);
		var html = "<div id='answer' style='float:left; margin-top: 0.25in;'>" + 
                    "<div id='resultList' style='height:" + listHeight + "px;'>";	
		html = html + buildList("Result", resultList);			
		html = html + "</div>" + "</div>"; 
		return html;	
	}
	

	function buildList(title, list) {
	   var outputStr = '';
	   outputStr = "<div class='colHeading'>" + title + "</div>";

	   for (var i=0; i< list.length ; i++) {
		  outputStr = outputStr + "<span class='listItem'>" + list[i] + "</span><br>";
	   }

	   return outputStr;
	} 
	
	function setMarketingAreaHeight(listA, listB, resultList) {
		var maxLength = listA.length;
		if (listB.length > maxLength)
			maxLength = listB.length;
		if (resultList.length > maxLength)
			maxLength = resultList.length;
		document.getElementById('marketingArea').style.height = (maxLength * 15) + 32 + 'px';
		document.getElementById('middle').style.height = (maxLength * 15) + 52 + 'px';
	}
	
	function cleaVCO() {
				
		var element;
		element = document.getElementById('amount');
		if (element != null)
			element.value = '';
			
		element = document.getElementById('interestRate');
		if (element != null)
			element.value = '';
			
		element = document.getElementById('months');
		if (element != null)
			element.value = '';
		
		element = document.getElementById('payOffMonth');
		if (element != null)
			element.value = '';
		
		element = document.getElementById('eventType');
		if (element != null)
			element.value = '';
		
		element = document.getElementById('specialFees');
		if (element != null)
			element.value = '';
        
        
		element = document.getElementById('taxAmount');
		if (element != null)
			element.value = '';
		element = document.getElementById('scAmount');
		if (element != null)
			element.value = '';
		element = document.getElementById('totalPrice');
		if (element != null)
			element.value = '';
        

        element = document.getElementById('shippingMethod');
		if (element != null)
			element.value = '';
        
        element = document.getElementById('shippingName');
		if (element != null)
			element.value = '';
        element = document.getElementById('shippingStreet');
		if (element != null)
			element.value = '';
        element = document.getElementById('shippingCity');
		if (element != null)
			element.value = '';
        element = document.getElementById('shippingState');
		if (element != null)
			element.value = '';
        element = document.getElementById('shippingZipcode');
		if (element != null)
			element.value = '';
        
        element = document.getElementById('paymentMethod');
		if (element != null)
			element.selectedIndex=-1;
        element = document.getElementById('ccNo');
		if (element != null)
			element.value = '';
        element = document.getElementById('expDate');
		if (element != null)
			element.value = '';
        
				
		document.getElementById('outputArea').style.display = 'none';
		document.getElementById('messageArea').style.display = 'none';
	}

	
var showForm = function(area, html) {
		document.getElementById(area).innerHTML = html;
		document.getElementById(area).style.display = 'block';	
	}	