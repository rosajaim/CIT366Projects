var frontController;
var loan;
var set;
var shoppingCart;
var messageArea = 'messageArea';
var listA = ['Bill','Mary','Peter','Sam','Mark','Ann','Susan', 'Mike', 
			 'James', 'Steve', 'Joseph', 'Jane', 'Bob', 'Wayne', 'Connie',
             'Jim', 'Bridger', 'Luke', 'Issac', 'Emma', 'Ruth'];
             
             
var listB = ['Mary','Sam','Ann', 'Peter', 'Annabelle', 'Harriet', 'Bridger', 'Issac', 
					 'Emma', 'Luke', 'Ruth', 'Joseph', 'James', 'Jean' ];

function startPage() {
	
	frontController = new FrontController();	
	
	loan = new Loan();

    set = new Set();
					 
}

