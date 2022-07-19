"use strict";

const TNDairyInfo = function(){
    let di_date;
    let di_submit_button;
    let tb_dairy_resume;
    let tb_dairy_detail;

    const get_dairy_info = function(){
        di_submit_button.setAttribute("data-kt-indicator", "on");
        di_submit_button.disabled = true;
        const dairy_resume = $.ajax({
            url: `${url}/cash/dairy/resume`,
            type: "GET"
        });
        const dairy_detail = $.ajax({
            url: `${url}/cash/dairy/detail`,
            type: "GET"
        });
        Promise.all([dairy_resume, dairy_detail]).then(values => {
            render_tb_dairy_resume(values[0].data);
            render_tb_dairy_detail(values[1].data);
            di_submit_button.setAttribute("data-kt-indicator", "off");
            di_submit_button.disabled = false;
        }).catch(error => {
            console.error("error", error);
            di_submit_button.setAttribute("data-kt-indicator", "off");
            di_submit_button.disabled = false;
        });
    }

    const render_tb_dairy_resume = function (resume_data){

    }

    const render_tb_dairy_detail = function (detail_data){

    }

    const handle = function() {
        di_submit_button.addEventListener('click', function(e){
            e.preventDefault();
            get_dairy_info();
        });
    }
    return {
        init: function(){
            di_date = document.getElementById('date-start');
            di_submit_button = document.getElementById('btn-show-dairy');
            tb_dairy_resume = document.getElementById('tb-dairy-resume');
            tb_dairy_detail = document.getElementById('tb-dairy-detail');

            handle();
        } 
    }
}();