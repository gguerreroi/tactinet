"use strict";

var TNOnuInfo = function () {
    let onu_div_info;
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

    var get_onu_info = function () {
        submit_button.setAttribute('data-kt-indicator', 'on');
        submit_button.disabled = true;

        $.ajax({
            url: `${url}/onu/${onu_id}/status/administrative`,
            type: 'GET'
        }).done(function (status_admin) {
            console.log('done', status_admin);

        }).fail(function (status_admin_fail) {
            console.log('fail', status_admin_fail);

        })

        $.ajax({
            url: `${url}/onu/${onu_id}/status`,
            type: 'GET'
        }).done(function (status) {
            const { onu_status} = status.data;
            set_onu_status(status.data);
            if (onu_status == 'Offline'){
                onu_signal_tx_input.value = 'N/A';
                onu_signal_rx_input.value = 'N/A';
                onu_signal_tx_icon.html('').html(svg_signal_muted());
                onu_signal_rx_icon.html('').html(svg_signal_muted());
            }else{
                $.ajax({
                    url: `${url}/onu/${onu_id}/signal`,
                    type: 'GET'
                }).done(function (signal) {
                    set_onu_signal(signal.data);
                }).fail(function (error) {
                    console.log(error);
                })
            }

        }).fail(function (status_fail) {
            console.log(status_fail);
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
            onu_div_info = document.getElementById('div-onu-info');
            onu_status_icon = $("#onu-status-icon");
            onu_status_input = document.getElementById('onu-status-input');
            onu_signal_rx_icon = $("#onu-signal-rx-icon");
            onu_signal_rx_input = document.getElementById('onu-signal-rx-input');
            onu_signal_tx_icon = $("#onu-signal-tx-icon");
            onu_signal_tx_input = document.getElementById('onu-signal-tx-input');
            onu_signal_catv_input = document.getElementById('onu-signal-catv-input');
            onu_signal_catv_icon = $("#onu-signal-catv-icon");
            onu_id = document.getElementById('input-codservicio').value;

            handle();
        }
    };
}();