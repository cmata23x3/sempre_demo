var ESresults = [];

var requestES = function(ids){
  console.log('making request to ES');

  $.ajax({
    type: 'POST',
    url: "http://localhost:9200/couchpotato/_mget", //TODO: ES query url
    // url: "http://c3c831e4.ngrok.io/couchpotato/_mget",
    data: JSON.stringify({
      "docs": ids
    })
  }).done(function(data){
    console.log('This is the newest result: ', data);
    addResult(data);
  });
}

var handleSempreResponse = function(data){
  console.log('handling sempre response');
  //Take the result & get the ids out
  data = data.split("\n")
  var re = new RegExp(/.*Top value.*\{(.*)\}.*/);
  // var re = new RegExp(/.*Top value(.*)/);
  // var re = new RegExp('(.*)');
  var names = re.exec(data);
  names = names[1].split("   ");
  console.log(names);
  re = new RegExp(/name ([0-9a-z]*)/);
  var ids = [];
  for (var i = 1; i < names.length; i++) {

    var matches = re.exec(names[i]);
    // ids.push(matches[1]); 
    if(matches){
      console.log(matches)
      entry = {
        _id: matches[1]
      }
      ids.push(entry);
    }
  }
  // console.log(names[1])
  //make array of the results
  //each will have a id); remove the ) when processing
  // ids.forEach(function(id){
  //   requestES(ids);
  // });
  requestES(ids);
}

var addResult = function(entries){
  //add the result to the DOM
  console.log('appending something', entries);
  entries.docs.forEach(function(entry){
    console.log('adding one entry to DOM ', entry); 
    var img = '<img src="' + entry._source.image.url + '">'
    var title = '<h3>'+entry._source.title+'</h3>'
    var dom = '<p>' + img + '<br>' + title + '<br>' + entry + '</p>';
    $('.resultsTable').append(dom);
  })
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
