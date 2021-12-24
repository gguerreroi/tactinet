"use strict";
// const btn = document.getElementById('kt_sign_in_submit');
// btn.disabled = true;
//
const url = `${window.location.origin}/api`;
// $.ajax({
//     url: `${url}/api/failure`,
//     type: 'get',
//
// })
// Class definition
var KTSigninGeneral = function() {
    // Elements
    var form;
    var submitButton;
    var validator;

    // Handle form
    var handleForm = function(e) {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'email': {
                        validators: {
                            notEmpty: {
                                message: 'Email es obligatorio'
                            },
                            emailAddress: {
                                message: 'Los datos ingresados no son un correo valido'
                            }
                        }
                    },
                    'password': {
                        validators: {
                            notEmpty: {
                                message: 'Se necesita un password'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row'
                    })
                }
            }
        );

        // Handle form submit
        submitButton.addEventListener('click', function (e) {
            // Prevent button default action
            e.preventDefault();

            // Validate form
            validator.validate().then(function (status) {
                if (status == 'Valid') {
                    // Show loading indication
                    submitButton.setAttribute('data-kt-indicator', 'on');

                    // Disable button to avoid multiple click
                    submitButton.disabled = true;


                    // // Simulate ajax request
                    // setTimeout(function() {
                    //     // Hide loading indication
                    //     submitButton.removeAttribute('data-kt-indicator');

                    //     // Enable button
                    //     submitButton.disabled = false;

                    //     // Show message popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                    //     Swal.fire({
                    //         text: "You have successfully logged in!",
                    //         icon: "success",
                    //         buttonsStyling: false,
                    //         confirmButtonText: "Ok, got it!",
                    //         customClass: {
                    //             confirmButton: "btn btn-primary"
                    //         }
                    //     }).then(function (result) {
                    //         if (result.isConfirmed) {
                    //             form.querySelector('[name="email"]').value= "";
                    //             form.querySelector('[name="password"]').value= "";
                    //             //form.submit(); // submit form
                    //         }
                    //     });
                    // }, 2000);

                    const split = document.getElementsByName('email')[0].value.split('@')
                    const user = split[0]
                    const entity = split[1]
                    const pass = document.getElementsByName('password')[0].value

                    $.ajax({
                        url: `${url}/auth`,
                        type: 'post',
                        dataType: 'json',
                        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                        data: {
                            username: user,
                            password: pass,
                            database: entity
                        }
                    }).done(function(data){
                        console.log("done", data)
                        // Hide loading indication && Enable button

                    }).fail(function(error){
                        console.log("error fail: ", error)
                        // const {Message} = error.responseJSON.state;
                        // Swal.fire({
                        //     text: `${error.status} - ${Message}`,
                        //     icon: "error",
                        //     buttonsStyling: false,
                        //     confirmButtonText: "Ok",
                        //     customClass: {
                        //         confirmButton: "btn btn-primary"
                        //     }
                        // });
                    }).always(function(){
                        // Hide loading indication && Enable button
                        submitButton.removeAttribute('data-kt-indicator');
                        submitButton.disabled = false;
                    })

                } else {
                    // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                    Swal.fire({
                        text: "Los datos de ingreso estan vacios",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    });
                }
            });
        });
    }

    // Public functions
    return {
        // Initialization
        init: function() {
            form = document.querySelector('#kt_sign_in_form');
            submitButton = document.querySelector('#kt_sign_in_submit');

            handleForm();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTSigninGeneral.init();
});
