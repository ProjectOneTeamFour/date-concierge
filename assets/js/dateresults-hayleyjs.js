document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, options);
    instance.open();
  });

  // Or with jQuery

  $(document).ready(function(){
    $('.modal').modal();
    instance.open();
  });
          