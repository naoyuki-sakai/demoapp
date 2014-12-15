ZGN(function() {

    var term = ZGN.term(1);

    var pinNo = '18';

    term.gpio.pinMode(pinNo, ZGN.OUTPUT);

    $(document).on('click', '#on', function() {
        term.gpio.digitalWrite(pinNo, ZGN.HIGH);
    });

    $(document).on('click', '#off', function() {
        term.gpio.digitalWrite(pinNo, ZGN.LOW);
    });
    
    console.log("hello");
});