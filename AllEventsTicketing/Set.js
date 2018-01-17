function Set() {
	
	
	this.intersection = function(listA, listB) {

	   var resultList = [];

	  if (listA === null || listB === null) {
	  	return null;
	  }

	  for (var i = 0; i < listA.length; i++) {
	  	var nextValue = listA[i];

	  	  for (var j = 0; j < listB.length; j++) {
	  	  	if (listB[j] === nextValue) {
	  	  		resultList.push(listB[j]);
	  	  		break;
			}
		  }
	  }
	   return resultList;
	}
    

	this.union = function(listA, listB) {

        if (listA === null || listB === null) {
            return null;
        }

        return this.intersection(listA, listB).concat(this.symmetricDifference(listA, listB));
	}


	this.relativeComplement = function(listA, listB) {

	   var resultList = [];

        if (listA === null || listB === null) {
            return null;
		}

        for (var i = 0; i < listA.length; i++) {  //for every element in listA
            var nextValue = listA[i];  //get next value in the list
            var found = false;

           //for every element in listB
            for (var j = 0; j < listB.length; j++) {
                if (listB[j] === nextValue) {      //this listB element equals nextValue//
                    found = true;  //add listB element to end of resultList//
                    break;  //break out of (exit) the listB inner loop//
                }
            }
            if (!found) {
                resultList.push(nextValue);
            }
        }

        return resultList;
    }
       

	this.symmetricDifference = function (listA, listB) {

        if (listA === null || listB === null)
            return null;

        return this.relativeComplement(listA, listB).concat(this.relativeComplement(listB,listA));
	}	
	

}
