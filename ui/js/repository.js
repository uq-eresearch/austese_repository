jQuery(document).ready(function(){
   jQuery('.dropdown-toggle').dropdown();
   jQuery('#filter').keyup(function(e) {
     if (e.keyCode == 13 && typeof(loadResults)=="function") {
       loadResults(0,jQuery('#filter').val());
     }
   });
   if (typeof(loadResults)=="function"){
       loadResults(0);
   }
});