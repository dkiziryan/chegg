/*
Promise to get data from url and return.
http://randomword.setgetgo.com/
*/
function getPromise(string) {
    console.log('in promise');
    var deferredObject = $.Deferred();
    var url = 'https://chegg-tutors.appspot.com/coding-challenge/api/user/?username=' + string;
    var promise =
        $.ajax({
            type: 'GET',
            url: url
        }).success(function(data) {
            deferredObject.resolve(data);
        }).error(function(data) {
            deferredObject.reject(data);
        });
    return deferredObject;
}
/*
Function that gets suggestions for new name.
Used a library called chance.js to generate random last names.
Used Math.random to generate 4 digits.
*/

function getSuggestions() {
    var input = $("#chg-balloon-input").val();
    var suggestionArray = [];

    while (suggestionArray.length < 15) {
        suggestionArray.push(input+chance.last());
    }

    while (suggestionArray.length < 30) {
        suggestionArray.push(input + (Math.floor(Math.random() * 9000) + 1000));
    }
    return suggestionArray;
}

/*
Function that filters the results by eliminating usernames that are taken.
*/
function filterSuggestions(input, data) {

    Array1 = input.split(',');
    Array2 = [];
    data.forEach(function(info) {
        Array2.push(info.username);
    });

    Array1 = Array1.filter(function(val) {
        return Array2.indexOf(val) == -1;
    });
    $("#showNA").show();
    document.getElementById('notavailable').innerHTML = $("#chg-balloon-input").val() + " is not available. How about one of these: "

    for (var i = 0; i < 3; i++) {
        document.getElementById('options').innerHTML += Array1[i] + "<div class='divider'></div><br>";
        document.getElementById('options').innerHTML += Array1[Array1.length -1] + "<div class='divider'></div><br>";
    }

}

/*
Function which handles the promise. If the name was taken we call the same function recursively
with 30 randomly generated user names. 
*/
function getAutoCompleteValues(input) {
    $("#showimage").show();
    document.getElementById('error').innerHTML = "";
    var array = [];
    var suggestions = '';
    if (input) {
        var promise = getPromise(input);
        promise.then(function(data) {
            if (data && data.length == 0) {
                $("#showimage").hide();
                $("#successImage").show();
                document.getElementById('success').innerHTML = "Congrats! " + input + " is available";
            } else if (data && data.length != 0) {

                if (data.length == 1 || data.length % 2 == 0) {
                    suggestions = getSuggestions();
                    console.log((data.length % 2 == 0), '???');
                    getAutoCompleteValues(suggestions.toString());
                } else {
                    filterSuggestions(input, data);
                }
            }
            $("#showimage").hide();

        }, function error(data) {
            document.getElementById('error').innerHTML = "Couldn't return any options";
        });
    } else {
        $("#showimage").hide();
        document.getElementById('error').innerHTML = "Invalid input";
    }
}
/*
Document ready function that verifies input (via regex) 
is alphanumeric with hyphens, dashes and spaces.
*/
$(document).ready(function() {
    $("#chg-balloon-submit").click(function() {
        var inputValue = $("#chg-balloon-input").val();

        var checkString = /^[a-zA-Z\d\-_][a-zA-Z\d\-_\s]+$/.test(inputValue);
        if (checkString) {
            getAutoCompleteValues(inputValue);
        } else {
            document.getElementById('error').innerHTML = "Invalid input";
        }
    });
});