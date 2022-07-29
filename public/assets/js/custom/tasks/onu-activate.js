const TKOnuActivate = function () {
    let div_element;
    let stepper;

    function handle() {
        stepper = new KTStepper(div_element)
        stepper.on("kt.stepper.next", function (stepper) {
            stepper.goNext(); // go next step
        });

        stepper.on("kt.stepper.previous", function (stepper) {
            stepper.goPrevious(); // go previous step
        });
    }

    return {
        init: function () {
            div_element = document.querySelector('#onu_stepper_activate');
            handle();
        }
    }
}();