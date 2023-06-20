"use strict"

const TKCustomers = function (){
    let table_customers;
    let filterSearch;

    function search_table(event){
        table_customers.search(event.target.value).draw();
    }
    const handleTable = function (){
        table_customers.DataTable({
            search: true,
            ajax: `${url}/customers/`,
            columns: [
                {data: "CODCLIENTE"},
                {data: "NOMBRE_COMPLETO"},
                {data: "DIRECCION_RESIDENCIA"},
                {data: "TELEFONO"},
                {data: "MOVIL"},
                {data: "CUI"}

            ],
            columnDefs: [
                {
                    targets: [0],
                    render: function(data, type, row){
                        return `<a href="customers/maintenance/customer/details/${data}">${data}</a>`
                    }
                }
            ],
            order: [[0,'asc']]
        })

        filterSearch.addEventListener('keyup', search_table);
    }

    return {
        initTable: function(tbc){
            //table_customers = document.getElementById(`${el}`);
            table_customers = $(`#${tbc}`);
            filterSearch = document.querySelector('[data-kt-filter="search"]');

            handleTable();
        }

    }
}()