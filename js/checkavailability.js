/*
Promise to get data from url and return values.
*/
function getPromise(string) {
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
Appended last names and digits to a suggested user name array.
Generated 30 suggestions so that we call url only once to provide suggestions.
*/

function getSuggestions() {
    var input = $("#chg-balloon-input").val();
    var suggestionArray = [];

    while (suggestionArray.length < 6) {
        suggestionArray.push(input+chance.last());
    }

    while (suggestionArray.length < 30) {
        suggestionArray.push(input + (Math.floor(Math.random() * 9000) + 1000));
    }
    return suggestionArray;
}

/*
Function that filters the results by eliminating usernames that are not available.
*/
function filterSuggestions(input, data) {

    document.getElementById('options').innerHTML = "";

    suggestedUserNames = input.split(',');
    unavailableUserNames = [];
    data.forEach(function(info) {
        unavailableUserNames.push(info.username);
    });

    suggestedUserNames = suggestedUserNames.filter(function(val) {
        return unavailableUserNames.indexOf(val) == -1;
    });
    $("#showNA").show();
    document.getElementById('notavailable').innerHTML = $("#chg-balloon-input").val() + " is not available. How about one of these: "

    for (var i = 0; i < 3; i++) {
        document.getElementById('options').innerHTML += suggestedUserNames[i] + "<div class='divider'></div><br>";
    }

}

/*
Function which handles the promise. If the name was taken we call the same function recursively
with 30 randomly generated user names. 
*/
function verifyUsernameAvailability(input) {
    $("#showLoader").show();
    document.getElementById('error').innerHTML = "";
    var suggestions = '';
    if (input) {
        var promise = getPromise(input);
        promise.then(function(data) {
            if (data && data.length == 0) {
                $("#showLoader").hide();
                $("#successImage").show();
                document.getElementById('success').innerHTML = "Congrats! " + input + " is available";
            } else if (data && data.length != 0) {
                document.getElementById('success').innerHTML ="";
                if (data.length == 1 || data.length % 2 == 0 || data.length == 29) {
                    suggestions = getSuggestions();
                    verifyUsernameAvailability(suggestions.toString());
                } else {
                    filterSuggestions(input, data);
                }
            }
            $("#showLoader").hide();
        }, function error(data) {
            document.getElementById('error').innerHTML = "Couldn't return any options";
        });
    } else {
        $("#showLoader").hide();
        document.getElementById('error').innerHTML = "Invalid input";
    }
}
/*
Document ready function that verifies input (via regex) 
is alphanumeric with hyphens, dashes and spaces. 
*/
$(document).ready(function() {
    $("#chg-balloon-input").val('');
    $("#chg-balloon-submit").click(function() {
        $("#showNA").hide();
        $("#successImage").hide();

        var inputValue = $("#chg-balloon-input").val();

        var checkString = /^[a-zA-Z\d\-_][a-zA-Z\d\-_\s]+$/.test(inputValue);
        if (checkString) {
            verifyUsernameAvailability(inputValue);
        } else {
            document.getElementById('error').innerHTML = "Invalid input";
        }
    });
});