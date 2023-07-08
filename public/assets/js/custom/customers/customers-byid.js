"use strict";
const KTCustomer = function () {
    let form_customer;
    let cif;
    function handle() {

    }

    return {
        init: function () {
            cif = document.getElementById('CODCLIENTE').value;
            handle();
        },
        initNewCustomer: function () {

        },
        initEditCustomer: function () {

        }
    }
}();