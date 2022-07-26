"use strict";

var TNOnuInfo = function () {
    let onu_div_alert;
    let onu_id;
    let submit_button;

    let onu_status_icon;
    let onu_status_input;

    let onu_signal_rx_icon;
    let onu_signal_rx_input;
    let onu_signal_tx_icon;
    let onu_signal_tx_input;
    let onu_signal_catv_input;
    let onu_signal_catv_icon;

    const onu_alert = function(title, description, type) {
        return `<div class="alert alert-dismissible bg-light-${type} border border-${type} d-flex flex-column flex-sm-row p-5 mb-10 mt-4">      
                    <span class="svg-icon svg-icon-2hx svg-icon-${type} me-4 mb-5 mb-sm-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                        </svg>
                    </span>                                                       
                    <div class="d-flex flex-column pe-0 pe-sm-10">
                        <h5 class="mb-1">${title}</h5>                                                        
                        <span>${description}</span>
                    </div>                                                       
                    <button type="button" class="position-absolute position-sm-relative m-2 m-sm-0 top-0 end-0 btn btn-icon ms-sm-auto" data-bs-dismiss="alert">
                        <i class="bi bi-x fs-1 text-${type}"></i>
                    </button>                                                      
                </div>`};

    let svg_signal_muted = function(){
        return `<span class="svg-icon svg-icon-5x svg-icon-muted" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16"
                         height="16" fill="none"
                         class="bi bi-reception-0" viewBox="0 0 16 16">
                        <path d="M0 13.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm4 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm4 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm4 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"
                                fill="currentColor"/>
                    </svg>
                </span>`
    }

    let svg_signal_danger = function(){
        return `<span class="svg-icon svg-icon-5x svg-icon-danger">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16"
                        height="16" fill="none"
                        class="bi bi-reception-1" viewBox="0 0 16 16">
                        <path d="M0 11.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2zm4 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm4 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm4 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"
                                fill="currentColor"/>
                    </svg>
                </span>`
    }

    let svg_signal_warning = function(){
        return `<span class="svg-icon svg-icon-5x svg-icon-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" class="bi bi-reception-2" viewBox="0 0 16 16">
                      <path d="M0 11.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2zm4-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-5zm4 5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm4 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"
                      fill="currentColor"/>
                    </svg>
                </span>`
    }

    let svg_signal_success = function(){
        return `<span class="svg-icon svg-icon-5x svg-icon-success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" class="bi bi-reception-4" viewBox="0 0 16 16">
                      <path d="M0 11.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2zm4-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-5zm4-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-8zm4-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-11z"
                      fill="currentColor"/>
                    </svg>
                </span>`
    }

    var set_onu_status = function (status_data) {
        onu_status_icon.removeClass('svg-icon-success');
        onu_status_icon.removeClass('svg-icon-success');
        onu_status_icon.removeClass('svg-icon-danger');
        onu_status_icon.removeClass('svg-icon-dark');
        onu_status_icon.removeClass('svg-icon-muted');

        if (status_data.onu_status === 'Online')
            onu_status_icon.addClass('svg-icon-success');
        else if (status_data.onu_status === 'LOS')
            onu_status_icon.addClass('svg-icon-danger');
        else if (status_data.onu_status === 'Power fail')
            onu_status_icon.addClass('svg-icon-dark');
        else if (status_data.onu_status === 'Offline')
            onu_status_icon.addClass('svg-icon-muted');

        onu_status_input.value = status_data.onu_status;
    }

    var set_onu_signal = function (signal_data) {

        onu_signal_tx_input.value = signal_data.onu_signal_1490;
        onu_signal_rx_input.value = signal_data.onu_signal_1310;
        // 'Critical', 'Warning', 'Very good'
        if (signal_data.onu_signal === 'Critical') {
            onu_signal_tx_icon.html('').html(svg_signal_danger());
            onu_signal_rx_icon.html('').html(svg_signal_danger());
        } else if (signal_data.onu_signal === 'Warning') {
            onu_signal_tx_icon.html('').html(svg_signal_warning());
            onu_signal_rx_icon.html('').html(svg_signal_warning());
        } else if (signal_data.onu_signal === 'Very good') {
            onu_signal_tx_icon.html('').html(svg_signal_success());
            onu_signal_rx_icon.html('').html(svg_signal_success());
        } else {
            onu_signal_tx_icon.html('').html(svg_signal_muted());
            onu_signal_rx_icon.html('').html(svg_signal_muted());
        }
    }

    const get_onu_info = function () {
            submit_button.setAttribute('data-kt-indicator', 'on')
            submit_button.disabled = true;
 
            $.ajax({
                url: `${url}/onu/${onu_id}/status/administrative`,
                type: 'GET'
            }).done(function (status_admin) {
                const {administrative_status} = status_admin.data;
                if (administrative_status == "Disabled"){
                    var e = {code: 'ONU_DISABLED', message: 'la ONU fue desactivada'}
                    onu_div_alert.html('').html(onu_alert(`${e.code}`, `${e.message}`, 'danger'));
                }
                
                if (administrative_status != "Disabled")
                $.ajax({
                    url: `${url}/onu/${onu_id}/status`,
                    type: 'GET'
                }).done(function (status) {
                    const {onu_status} = status.data;
                    set_onu_status(status.data);
                    if (onu_status == 'Offline'){
                        onu_signal_tx_input.value = 'N/A';
                        onu_signal_rx_input.value = 'N/A';
                        onu_signal_catv_input.value = 'N/A';
                        onu_signal_tx_icon.html('').html(svg_signal_muted());
                        onu_signal_rx_icon.html('').html(svg_signal_muted());
                        onu_signal_catv_icon.html('').html(svg_signal_muted());
                        var e = {code: 'ONU_OFFLINE', message: 'la ONU esta apagada o sin señal'}
                        onu_div_alert.html('').html(onu_alert(`${e.code}`, `${e.message}`, 'danger'));
                    }
                   
                    if (onu_status != 'Offline')
                    $.ajax({
                        url: `${url}/onu/${onu_id}/signal`,
                        type: 'GET'
                    }).done(function (signal) {
                        set_onu_signal(signal.data);
                    }).fail(function (signal_error) {
                        console.log('signal_error', signal_error);
                    })

                }).fail(function (status_fail) {
                    console.log('status_fail', status_fail);
                })

            }).fail(function (status_admin_fail) {
                var e =  {code: 'ONU_NOT_FOUND', message: 'ONU pendiente de asociar al servicio en el OLT'};
                onu_div_alert.html('').html(onu_alert(`${e.code}`, `${e.message}`, 'danger'));
            }).always(function () {
                submit_button.removeAttribute('data-kt-indicator');
                submit_button.disabled = false;
            })   
    };

    const handle = function () {
        submit_button.addEventListener('click', function (e) {
            e.preventDefault();
            get_onu_info();
        })
    }


    return {
        init: function () {
            submit_button = document.getElementById('btn-get-info');
           
            onu_status_icon = $("#onu-status-icon");
            onu_status_input = document.getElementById('onu-status-input');
            onu_signal_rx_icon = $("#onu-signal-rx-icon");
            onu_signal_rx_input = document.getElementById('onu-signal-rx-input');
            onu_signal_tx_icon = $("#onu-signal-tx-icon");
            onu_signal_tx_input = document.getElementById('onu-signal-tx-input');
            onu_signal_catv_input = document.getElementById('onu-signal-catv-input');
            onu_signal_catv_icon = $("#onu-signal-catv-icon");
            onu_id = document.getElementById('input-codservicio').value;
            onu_div_alert = $("#div-onu-alert");

            handle();
        }
    };
}();