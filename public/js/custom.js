jQuery(document).ready(function () {
  $('body').on('click', '.with-sub', function (event) {
    if ($('.nav-item').not($(this).parent()).hasClass('show')) {
      $('.nav-item').removeClass('show');
    }
    $(this).parent().toggleClass('show');
    /*$('.nav-item').toggleClass('open');*/
  });

  $('body').on('click', '.profile-img', function (event) {
    $(this).toggleClass('show');
    /*$('.nav-item').toggleClass('open');*/
  });

  // $('body').on('click', '.main-header-menu-icon', function (event) {
  //   $(this).toggleClass('main-sidebar-hide');
  //   /*$('.nav-item').toggleClass('open');*/
  // });

  $('body').on('click', '.header-settings', function (event) {
    $(this).toggleClass('open');
    /*$('.nav-item').toggleClass('open');*/
  });

  // $('body').on('click', '.main-header-menu-icon', function (event) {
  //   $(this).toggleClass('open');
  //   $('html body').toggleClass('main-sidebar-hide');
  //   /*$('.nav-item').toggleClass('open');*/
  // });


  // Js for SVG
  jQuery('img.svg').each(function () {
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');
    jQuery.get(imgURL, function (data) {
      // Get the SVG tag, ignore the rest
      var $svg = jQuery(data).find('svg');

      // Add replaced image's ID to the new SVG
      if (typeof imgID !== 'undefined') {
        $svg = $svg.attr('id', imgID);
      }
      // Add replaced image's classes to the new SVG
      if (typeof imgClass !== 'undefined') {
        $svg = $svg.attr('class', imgClass + ' replaced-svg');
      }

      // Remove any invalid XML tags as per http://validator.w3.org
      $svg = $svg.removeAttr('xmlns:a');

      // Check if the viewport is set, else we gonna set it if we can.
      if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
        $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
      }

      // Replace image with new SVG
      $img.replaceWith($svg);

    }, 'xml');
  });

  if (document.getElementById("uploadBtn")) {
    document.getElementById("uploadBtn").onchange = function () {
      document.getElementById("uploadFile").value = this.value;
    };
  }

  // $('#starttime,#endtime').datetimepicker({
  //   format: 'HH:mm'
  // });

  // var start_time = $('#Start_Time').val();

  // var end_time = $('#End_Time').val();

  // if (Date.parse(start_time) > Date.parse(end_time)) {
  //   alert('start time should be smaller');
  // }

  // $(function() {
  //   $( "#datepicker" ).datepicker();
  // });
})