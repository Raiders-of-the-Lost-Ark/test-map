// Handle add/remove buttons
document.querySelector(".add-row").addEventListener("click", function() {
  var editMode = document.getElementById("unsaved");
  // Toggle add mode
  if (editMode.classList.contains("active")) {
    this.innerHTML = "ADD";
    editMode.classList.remove("active");
  } else {
    this.innerHTML = "CANCEL ADD";
    editMode.classList.add("active");
  }
})

// Validate user input
function validateNewUser(event) {
  var form = event.target;
  var firstName = form.elements['firstName'].value;
  var lastName = form.elements['lastName'].value;
  var email = form.elements['email'].value;

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

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

// Old jQuery stuff below, commented if unused

// Add new row
// function addNewRow() {
//   var _row = $(".mdl-data-dynamictable tbody").find('tr');
//   var template = $('#basketItemTemplate').html();
//   var _newRow = template.replace(/{{id}}/gi, 'checkbox-' + new Date().getTime());

//   $(".mdl-data-dynamictable tbody").append(_newRow);
//   componentHandler.upgradeAllRegistered();
// }

// Handle add/remove buttons - deprecated (see further down)
// $(".add-row").on("click", function() {
//   $(".mdl-dialog__addContent").remove();
//   addNewRow();
// });
$(".remove-row").on("click", function() {
  $(".mdl-dialog__addContent").remove(); 
  if ($(".mdl-data-dynamictable tbody").find('tr.is-selected').length != 0)
    {
      var dialog = document.querySelector('dialog');
      dialog.showModal();
    }
});

// Handle checkboxes
$(document).on("click", ".mdl-checkbox", function() {
  var _tableRow = $(this).parents("tr:first");
  if ($(this).hasClass("is-checked") === false) {
    _tableRow.addClass("is-selected");
  } else {
    _tableRow.removeClass("is-selected");
  }

});
$(document).on("click", "#checkbox-all", function() {
  _isChecked = $(this).parent("label").hasClass("is-checked");
  if (_isChecked === false) {
    $(".mdl-data-dynamictable").find('tr').addClass("is-selected");
    $(".mdl-data-dynamictable").find('tr td label').addClass("is-checked");
  } else {
    $(".mdl-data-dynamictable").find('tr').removeClass("is-selected");
    $(".mdl-data-dynamictable").find('tr td label').removeClass("is-checked");
  }

});

// Handle label clicks
// $(document).on("click", "span.mdl-data-table__label.add-table-content", function() {
//   var _modal, _pattern, _error = "";
//   var template = $('#addContentDialogTemplate').html();
//   _modal = template.replace(/{{title}}/, $(this).attr("title")).replace(/{{pattern}}/, _pattern).replace(/{{error}}/, _error);
//   $(this).parent().prepend(_modal);
//   componentHandler.upgradeDom();
//   $(".mdl-textfield__input").focus();
// });

// // Handle close label
// $(document).on("click", ".close", function() {
//   $(this).parents(".mdl-dialog__addContent").remove();
// });

// // Modify value - Keydowns
// $(document).on("keydown", ".mdl-dialog__addContent", function(e) {
//   var code = (e.keyCode ? e.keyCode : e.which);
//   switch (code) {
//     case 13:
//       $(".save.mdl-button").click();
//       break;
//     case 27:
//       $(".close.mdl-button").click();
//       break;
//     default:
//   }
// });
// // Modify value - Save button
// $(document).on("click", ".save", function() {
//   var _textfield = $(this).parents("td").find(".mdl-textfield");
//   var _input = $(this).parents("td").find("input");
//   if (_textfield.hasClass("is-invalid") === false && $.trim(_input.val()) !== "") {
//     var _col = $(this).parents("td:first");
//     var value = _col.hasClass("lastlogin") ? "₺ " : "";
//     _col.html(value + _input.val());
//   }
// });

// Delete dialog
var dialog = document.querySelector('dialog');
dialog.querySelector('.close').addEventListener('click', function() {
      dialog.close();
});
dialog.querySelector('.remove').addEventListener('click', function() {
       $(".mdl-data-dynamictable tbody").find('tr.is-selected').remove();
  $(".mdl-data-dynamictable thead tr").removeClass("is-selected");
  $(".mdl-data-dynamictable thead tr th label").removeClass("is-checked");
  componentHandler.upgradeDom();
  var _row = $(".mdl-data-dynamictable tbody").find('tr');
  console.log("_row.length", _row.length);
  if (_row.length < 1) {
    addNewRow();
  } dialog.close();
});