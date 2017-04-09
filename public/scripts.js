function initialize() {
    // Everything here will be called after the site loads
    
    // Add listeners
    
    var info_panel_closer = document.querySelector('.info-panel-closer');
    info_panel_closer.addEventListener("click", closeInfoPanel);
}