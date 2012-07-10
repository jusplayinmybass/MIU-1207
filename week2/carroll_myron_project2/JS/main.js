// Author: Myron Carroll
// Title: Assignment 1 JavaScript
// Class: Mobile Interfaces and Usability
// Wait until the DOM is Ready
window.addEventListener("DOMContentLoaded", function () {
      

    //getElementByID Function
    function ge(x) {
        var theElement = document.getElementById(x);
        return theElement;
       
    };
     //variable Defaults
    var studentLevel = ['--Choose One--', 'Beginner', 'Intermediate', 'Advanced', 'Seasoned_Professional'],
        readValue = "No",
        errMsg = ge('errors'),
        save = ge('submit');
    //Create Select Field Elements

    function makeLevel () {
        var formTag = document.getElementsByTagName('form'),
            selectLi = ge('levels'),
            makeSelect = document.createElement('select');
            makeSelect.setAttribute('id', 'level');
        for(var i=0, j=studentLevel.length; i<j; i++){
            var makeOption = document.createElement('option');
            var optText = studentLevel[i];
            makeOption.setAttribute("value", optText);
            makeOption.innerHTML = optText;
            makeSelect.appendChild(makeOption);
            
        }
        selectLi.appendChild(makeSelect);
        
    };
    
    //Find value of Checked Boxes
    function getCheckedBoxValues(){
        if (ge("reading").checked){
            readValue = ge("reading").value
        }else{
            readValue = "No"
        }
    };

    
    //Toggle Controls
    function toggleControls(n){
        switch(n){
            case "on":
                ge('contactForm').style.display = "none";
                ge('clearLink').style.display = "inline";
                ge('displayLink').style.display = "none";
                ge('addNew').style.display = "inline";
                break;
            case "off":
                ge('contactForm').style.display = "block";
                ge('clearLink').style.display = "inline";
                ge('displayLink').style.display = "inline";
                ge('addNew').style.display = "none";
                ge('items').style.display = "none";
                break;
            default:
                return false;
        }
    }
    //storeData function
     function storeData(key){
        //If there is no key, this means this is a brand new item and we need a new key.
        if(!key){
            var id = Math.floor(Math.random()*100000001);
        }else{
            //Set the id to the existing key that we are editing so it will save over the data
            //Same key that was passed from editSubmit event handler
            //to the validate function and then passed here, into the storeData function.
            id = key;
        }
        //Gather up all form field values in an object
        //Object contains an array that contains form label and input value
        getCheckedBoxValues();
           var item            = {};
            item.fname      = ["First Name:", ge('fname').value];
            item.lname      = ["Last Name:", ge('lname').value];
            item.email      = ["Email:", ge('email').value];
            item.birth      = ["Birthday:", ge('birth').value];
            item.level      = ["Level:", ge('level').value]; 
            item.reading     = ["Sight Read:", readValue];
            item.other      = ["Other:", ge('other').value];
            item.time       = ["Time:", ge('time').value];
        //Save the data into Local Storage. Use Stringify to convert object to string
        localStorage.setItem(id, JSON.stringify(item)); 
        alert("Contact Saved!");
    }

        function getData(){
            toggleControls("on");
            if(localStorage.length === 0){
                alert("There is no Data In Local Storage so Default Data Was Added!");
                autoFillData();
            };
          //Write Data from local storage to the browser
          var makeDiv = document.createElement('div');
          makeDiv.setAttribute('id', 'items');
          var makeList = document.createElement('ul');
          makeDiv.appendChild(makeList);
          document.body.appendChild(makeDiv);
          ge('items').style.display = "display"; 
          for(var i=0, j=localStorage.length; i<j; i++){
            var makeLi = document.createElement('li');
            var linksLi = document.createElement('li');
            makeList.appendChild(makeLi);
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);
            var obj = JSON.parse(value); //Convert string from localStorage back into an object with JSON.parse.
            var makeSubList = document.createElement('ul');
            makeLi.appendChild(makeSubList);
            getImage(obj.level[1], makeSubList);
            for (var n in obj){
                var makeSubLi = document.createElement('li');
                makeSubList.appendChild(makeSubLi);
                var optSubText = obj[n][0] + " " + obj[n][1];
                makeSubLi.innerHTML = optSubText;
                makeSubList.appendChild(linksLi);
            }
            
            makeItemLinks(localStorage.key(i), linksLi); //Create edit and delete buttons for each item in Local Storage
            
          }
          
            
          
        }
        //Get the image for the right category
        function getImage(catName, makeSubList){
            var imageLi = document.createElement('li');
            makeSubList.appendChild(imageLi);
            var newImg = document.createElement('img');
            var setSrc = newImg.setAttribute("src", "images/"+ catName +".png");
            imageLi.appendChild(newImg);
        }
        //Auto Populate Local Storage
        function autoFillData(){
            //The actual JSON Object data required for this to work is coming form our json.js file which is loaded form the HTML page
            //Store JSON Object into Local Storage
            for(var n in json){
                var id = Math.floor(Math.random()*100000001);
                localStorage.setItem(id, JSON.stringify(json[n]));
            }
        }
        //Create Edit and Delete links for each stored item when displayed
        function makeItemLinks(key, linksLi ){
            //Add edit single item link
            var editLink = document.createElement('a');
            editLink.href= '#';
            editLink.key = key;
            var editText = "Edit Contact";
            editLink.addEventListener('click', editItem);
            editLink.innerHTML = editText;
            linksLi.appendChild(editLink);
          
            //Add Line Break
            var breakTag = document.createElement('br');
            linksLi.appendChild(breakTag);
            
            //Add Delete Single Item Link
            var deleteLink = document.createElement('a');
            deleteLink.href = '#';
            deleteLink.key = key;
            var deleteText = "Delete Contact";
            deleteLink.addEventListener('click', deleteItem);
            deleteLink.innerHTML = deleteText;
            linksLi.appendChild(deleteLink);
            
            
        };
        
        function editItem(){
            //Grab Item from Local Storage
            var value = localStorage.getItem(this.key);
            var item = JSON.parse(value);
            
            //Show the form
            toggleControls('off');
            
            //Populate form with stored values
            ge('fname').value = item.fname[1];
            ge('lname').value = item.lname[1];
            ge('email').value = item.email[1];
            ge('birth').value = item.birth[1];
            ge('level').value = item.level[1];
            if(item.reading[1] == "Yes"){
                ge('reading').setAttribute("checked", "checked");
            };
            ge('other').value = item.other[1];
            ge('time').value = item.time[1];
            
            //Remove initial Listener
            save.removeEventListener('click', storeData);
            
            //change submit button to edit button
            ge('submit').value = 'Edit Contact';
            var editSubmit = ge('submit');
            //Save key value in this functionas a property of the editSubmit event so we can use the value when we dave the data we edited.
            editSubmit.addEventListener('click', validate);
            editSubmit.key = this.key;
        };
        
        function deleteItem(){
            var ask = confirm("Are You Sure You Want To Delete This Contact?");
            if(ask){
                localStorage.removeItem(this.key);
                window.location.reload();
            }else{
                alert("Contact Was NOT Deleted.");
            }
        }
        function clearLocal(){
            if (localStorage.length ===0){
                alert("There is no Data to Clear!");
            } else {
                localStorage.clear();
                alert("All Contacts are Deleted!");
                window.location.reload();
                return false;
            }
        };
        
        function validate(e){
            //Define the elements that we want to check
            var getFname = ge('fname');
            var getLname = ge('lname');
            var getEmail = ge('email');
            
            //reset error messages
            errMsg.innerHTML = "";
            getFname.style.border = "1px solid black";
            getLname.style.border = "1px solid black";
            getEmail.style.border = "1px solid black";
            //Get Error Messages
            var messageAry = [];
            //First Name Validation
            if (getFname.value === ""){
                var fNameError = "Please Enter Your First Name";
                getFname.style.border = "3px solid red";
                messageAry.push(fNameError);
            }
            //Last Name Validation
            if (getLname.value === ""){
                var lNameError = "Please Enter Your Last Name";
                getLname.style.border = "3px solid red";
                messageAry.push(lNameError);
            }
            //Email Validation
            var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}ge/;
            if(!(re.exec(getEmail.value))){
                var emailError = "Please Enter A Valid Email Address";
                getEmail.style.border = "3px solid red";
                messageAry.push(emailError);
            }
             //If there were errors display them on the screen
             if (messageAry.length >=1){
                for (var i = 0, j = messageAry.length; i < j; i++){
                     var txt = document.createElement('li');
                     txt.innerHTML = messageAry[i];
                     errMsg.appendChild(txt);
                }
                e.preventDefault();
                return false; 
             }else{
                //If all is ok Save our Data. Send the key value from editData function
                //Remember this key value was passed through the editSubmit listener as a property.
                 storeData(this.key);
             }
            
        };
   
    makeLevel();

    //Set Links and Submit Click events
    var displayLink = ge('displayLink');
    displayLink.addEventListener('click', getData);
    var clearLink = ge('clearLink');
    clearLink.addEventListener('click', clearLocal);
    
    save.addEventListener('click', validate);
});
