$("form").submit(function(event){
  console.log('user submitted the form', $("input:first").val() );
  var query = $("input:first").val().split(' ').join('+');
  console.log('Heres the parsed query', query);

  $.ajax({
    type: 'GET',
    url: 'http://localhost:8400/sempre?q=' + query
  }).done(function(data){
    console.log('This is the result: ', data);
    $("input:first").val('');
  });
  event.preventDefault();
});
