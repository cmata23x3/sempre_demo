var ESresults = [];
var currentQuery = '';

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

// Function takes the result from SEMPRE & formats it to make it useful
var handleSempreResponse = function(data){
  console.log('handling sempre response');
  // Figure out what which type of response we got

  //Take the result & get the ids out
  data = data.split("\n");
  console.log('data:', data);
  var re = new RegExp(/.*Top value.*\{(.*)\}.*/);
  // var re = new RegExp(/.*Top value(.*)/);
  // var re = new RegExp('(.*)');
  var names = re.exec(data);
  names = names[1].split("   ");
  var stringMatches = names[1].match(/\(string/); // ** Hacky way to check if the result has Strings that we want to display
  console.log(names);

  if(!stringMatches){
    // Case that we're going to need to make some ES queries to get the rest of the data
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
  else{
    // Case that we have strings that we want to render on the screen
    re = new RegExp(/string ([0-9a-z]*)/); //First change in the code
    var strings = [];
    for (var i = 1; i < names.length; i++) {

      var matches = re.exec(names[i]);
      strings.push(matches[1]); // Push the string into the display array
    }
    // Now render the results onto the DOM
    addTextResult(strings);
  }
}

// Function that takes an array of strings and adds them
// to the DOM and display the result.
var addTextResult = function(entries){
  console.log('appending some strings: ', entries);
  entries.forEach(function(resultString) {
    console.log('Adding this string: ', resultString);
    var span = '<h4 class="resultString">'+ resultString +'<h4><legend><br>'
    $('.resultsTable').append(span);
  })
}

var addResult = function(entries){
  //add the result to the DOM
  console.log('appending something', entries);
  entries.docs.forEach(function(entry){
    console.log('adding one entry to DOM ', entry);
    var img = '<img class="resultImg" src="' + entry._source.image.url + '" height="100" width="80">'
    var title = '<h3>'+entry._source.title+'</h3>'
    var year = '<h4><i>Year: </i></h4><span>'+entry._source.year+'</span>';
    var cast = '<h4><i>Cast: </i></h4><span>'+entry._source.cast+'</span>';
    var directors = '<h4><i>Directors: </i></h4><span><'+entry._source.directors+'/span>';
    var genres = '<h4><i>Genres: </i></h4><span>'+entry._source.genres+'</span>';
    var dom = '<p>' + img + '<br>' + title + '<br>' + cast+ directors + genres + year + '</p><legend><br>';
    $('.resultsTable').append(dom);
  })
}

//***** Action listener *****

// Function to make the call to SEMPRE
$("form").submit(function(event){
  console.log('user submitted the form', $("input:first").val() );
  currentQuery = $("input:first").val();
  var query = currentQuery.split(' ').join('+');
  console.log('Heres the parsed query', query);

  // empty the previous results
  $('#queryString').empty()
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

  // Add the currentQuery as a title to the DOM
  $('#queryString').append('<h2><i>query: </i> '+ currentQuery +'</h2><br>');

  event.preventDefault();
});
