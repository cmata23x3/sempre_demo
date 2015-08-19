var ESresults = [];

var requestES = function(id){
  console.log('making request to ES');

  $.ajax({
    type: 'GET',
    url: //TODO: ES query url
  }).done(function(data){
    console.log('This is the result: ', data);
    addResult(data);
  });
}

var handleSempreResponse = function(data){
  console.log('handling sempre response');
  //Take the result & get the ids out
  var re = new RegExp('.*Top Value \{(.*)\}.*');
  var names = re.exec(data);
  //make array of the results
  var ids = result.split('(name ');
  //each will have a id); remove the ) when processing
  ids.forEach(function(id){
    requestES(id.replace(')', ''));
  });
}

var addResult = function(entry){
  //add the result to the DOM
  console.log('appending something', entry);
  var dom = '<p>' + entry + '</p>';
  $('.resultsTable').append(dom);
}

$("form").submit(function(event){
  console.log('user submitted the form', $("input:first").val() );
  var query = $("input:first").val().split(' ').join('+');
  console.log('Heres the parsed query', query);

  // empty the previous results
  $('.resultsTable').empty();

  // begin the process
  $.ajax({
    type: 'GET',
    url: 'http://localhost:8400/sempre?q=' + query,
    success: function(data){
      console.log('This is the result: ', data);
      handleSempreResponse(data);
      $("input:first").val('');
    }
  })

  event.preventDefault();
});
