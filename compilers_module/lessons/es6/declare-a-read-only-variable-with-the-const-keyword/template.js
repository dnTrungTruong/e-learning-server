function printManyTimes(str) {

    // Only change code below this line

    var sentence = str + " is cool!";
    for (var i = 0; i < str.length; i += 2) {
        console.log(sentence);
    }

    // Only change code above this line

}
printManyTimes("freeCodeCamp");