"use strict";

const TNDairyInfo = function(){
    let di_date;
    let btn_submit;
    let tb_dairy_resume;
    let tb_dairy_detail;
    let form_dairy;

    const get_dairy_info = function(){
        btn_submit.setAttribute("data-kt-indicator", "on");
        btn_submit.disabled = true;
        const form_data = $("#form-dairy").serializeArray();

        const dairy_resume = $.ajax({
            url: `${url}/cash/dairy/resume`,
            method: "GET",
            data: form_data
        });
        const dairy_detail = $.ajax({
            url: `${url}/cash/dairy/details`,
            method: "GET",
            dataType: "json",
            contentType: "application/json",
            data: form_data
        });
        Promise.all([dairy_resume, dairy_detail]).then(values => {
            render_tb_dairy_resume(values[0].data);
            render_tb_dairy_detail(values[1].data);
            btn_submit.setAttribute("data-kt-indicator", "off");
            btn_submit.disabled = false;
        }).catch(error => {
            console.error("error", error);
            btn_submit.setAttribute("data-kt-indicator", "off");
            btn_submit.disabled = false;
        });
    }

    const render_tb_dairy_resume = function (resume_data){
        console.log("resume_data", resume_data);
    }

    const render_tb_dairy_detail = function (detail_data){
        console.log("detail_data", detail_data);
    }

    const handle = function() {
        form_dairy.addEventListener('submit', function(e){
            e.preventDefault();
            get_dairy_info();
        });
    }
    return {
        init: function(){
            form_dairy = document.getElementById('form-dairy');
            btn_submit = document.getElementById('btn-submit-dairy');
            tb_dairy_resume = document.getElementById('tb-dairy-resume');
            tb_dairy_detail = document.getElementById('tb-dairy-detail');
            handle();
        } 
    }
}();