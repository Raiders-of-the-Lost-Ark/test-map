function addNewRow() {

  var _row = (".mdl-data-dynamictable tbody").find('tr');
  var template = ('#basketItemTemplate').html();
  var _newRow = template.replace(/{{id}}/gi, 'checkbox-' + new Date().getTime());

  (".mdl-data-dynamictable tbody").append(_newRow);
  componentHandler.upgradeAllRegistered();
}
