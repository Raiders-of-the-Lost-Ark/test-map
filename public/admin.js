/*  admin.js
    This file contains the javascript for the admin panel.  The fuctions allow
    the adding, removal, and display of users.*/

// Handle add/remove buttons
document.querySelector("#add-row").addEventListener("click", function() {

    // get information from the document
  var editMode = document.getElementById("unsaved");

    // Toggle add mode
  if (editMode.classList.contains("active")) {
    this.innerHTML = "ADD";
    document.getElementById("remove-row").disabled=false;
    editMode.classList.remove("active");
  } else {
    this.innerHTML = "CANCEL ADD";
    document.getElementById("remove-row").disabled=true;
    editMode.classList.add("active");
  }
})
document.querySelector("#remove-row").addEventListener("click", function() {

    // get mode from the document
  var removeMode = document.getElementById("user-remove-mode");
  var removers = document.getElementsByClassName("user-remover");

    // Toggle remove mode
  if (removeMode.classList.contains("active")) {
    this.innerHTML = "DELETE";
    document.getElementById("add-row").disabled=false;
    removeMode.classList.remove("active");
    for (var i = 0; i < removers.length; i++)
      removers[i].classList.remove("active");
  } else {
    this.innerHTML = "DONE";
    document.getElementById("add-row").disabled=true;
    removeMode.classList.add("active");
    for (var i = 0; i < removers.length; i++)
      removers[i].classList.add("active");
  }
})

// Remove user button
var deleteButtons = document.getElementsByClassName("user-remover");
for (var i = 0; i < deleteButtons.length; i++) {
  if (deleteButtons[i].tagName == "BUTTON") {
    deleteButtons[i].addEventListener("click", function(event) {
      var userId = this.value;


        // show confirmation to delete a user
      showDialog({
          title: 'Remove User',
          text: 'Are you sure you want to remove this user?',
          negative: {
              title: 'No'
          },
          positive: {
              title: 'Yes',
                // onClick send user to be deleted to the server
              onClick: function (e) {
                var deleteReq = new XMLHttpRequest();
                var data = "userId=" + userId;
                deleteReq.open("POST", "deleteuser");
                deleteReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                deleteReq.addEventListener("load", function() {
                  document.getElementById("add-row").disabled=false; // Deal with weird Firefox bug
                  location.reload(); 
                });
                deleteReq.send(data);
              }
          }
      });
    });
  }
}

// Function that makes sure user input is valid
function validateNewUser(event) {

    // get the form data
  var form = event.target;
  var firstName = form.elements['firstName'].value;
  var lastName = form.elements['lastName'].value;
  var email = form.elements['email'].value;

    // Making sure an email, first and last name are entered
  if (firstName == "") {
    alert("Please enter a first name");
    return false;
  } 
  else if (lastName == "") {
    alert("Please enter a last name");
    return false;
  }
  else if (!validateEmail(email)) {
    alert("Please enter a valid email address");
    return false;
  } 
  else {
    return true;
  }
}

  // makes sure the email entered is of valid format
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
