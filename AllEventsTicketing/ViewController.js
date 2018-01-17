function ViewController() {
		
	this.execute = function(vcoObject, area, initFunction) {
		this.clearMiddle(); // close any existing form	
	
		//use reflection to instantiate the appropriate control object
		var vcoObjectClass = vcoObject + "VCO";	
		var vcoObject = new window[vcoObjectClass](area);
		
		this.clearMenus(); // hide the drop down menu
	}
	
	
	this.clearMenus = function () {
		document.getElementById('testMenu').style.display = 'none';
		document.getElementById('loanMenu').style.display = 'none';
		document.getElementById('marketingMenu').style.display = 'none';
	}
	
	this.clearMiddle = function() {
		document.getElementById('inputArea').style.display = 'none';
		document.getElementById('testArea').style.display = 'none';
		document.getElementById('testArea').innerHTML = '';
		document.getElementById('outputArea').style.display = 'none';
		document.getElementById('outputArea').innerHTML = '';
		document.getElementById('messageArea').style.display = 'none';
		document.getElementById('messageArea').innerHTML = '';
		document.getElementById('marketingArea').style.display = 'none';
		
	}	
	
}