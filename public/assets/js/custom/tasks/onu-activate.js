const TKOnuActivate = function () {
	let div_element;
	let stepper;
	let btn_search;
	let onu_id;
	let onus_available;
	let radio_onu;

	let inputsConfirm = [];


	function onu_checkbox(row){
		return `<div class="mb-10 form-check form-check-custom form-check-solid">
                    <input type="radio" class="form-check-input h-40px w-40px" name="radio_onu" value="${row.sn}" required/>
                    <label class="form-check-label" >Numero de Serie: <span class="fw-bold">${row.sn}</span></label>
                </div>`
	}


	function handle() {
		stepper = new KTStepper(div_element)
		stepper.on("kt.stepper.next", function (stepper) {
			stepper.goNext(); // go next step
		});

		stepper.on("kt.stepper.previous", function (stepper) {
			stepper.goPrevious(); // go previous step
		});

		btn_search.addEventListener("click", function(e){
			e.preventDefault();
			onus_searchs()
		})
	}

	function onus_searchs(){
		btn_search.setAttribute('data-kt-indicator', 'on')
		btn_search.disabled = true;
		onus_available.html('');

		$.ajax({
			url: `${url}/onu/${onu_id}/unconfigured`,
			type: 'GET'
		}).done(function(res){
			const {response} = res.data;
			global_onus_available = response;
			response.forEach(function(row, index, array){
				onus_available.append(onu_checkbox(row))
			})

			radio_onu = document.getElementsByName("radio_onu")
			radio_onu.forEach(function(current, index){
				current.addEventListener('change', function(e){
					// console.log('value', e.target.value)
					const onuselect = global_onus_available.filter(row => row.sn === e.target.value)

					fillInputsConfirm(onuselect)
				})
			})

		}).fail(function(fail){
			console.log("onu search faild", fail)
		}).always(function(){
			btn_search.removeAttribute('data-kt-indicator')
			btn_search.disabled = false;
		})
	}

	function fillInputsConfirm(row){
		inputsConfirm.forEach(function(currentValue, index, array){
			const tmp = row[0];

			console.log('tmp', tmp, 'tmp.sn', tmp.sn, 'tmp[sn]', tmp['sn'], 'tmp[sn]', tmp[`${currentValue.name}`])
			console.log('currentValue: ', currentValue.name)

			//console.log('name value', row[0][currentValue.name])
			//currentValue.value = row[currentValue.value];
		})
	}

	return {
		init: function () {

			inputsConfirm.push(document.getElementById('olt_id'))
			inputsConfirm.push(document.getElementById('pon_type'))
			inputsConfirm.push(document.getElementById('board'))
			inputsConfirm.push(document.getElementById('port'))
			inputsConfirm.push(document.getElementById('sn'))
			inputsConfirm.push(document.getElementById('vlan'))
			inputsConfirm.push(document.getElementById('onu_type'))
			inputsConfirm.push(document.getElementById('zone'))
			inputsConfirm.push(document.getElementById('odb'))
			inputsConfirm.push(document.getElementById('name'))
			inputsConfirm.push(document.getElementById('address_or_comment'))
			inputsConfirm.push(document.getElementById('onu_mode'))
			inputsConfirm.push(document.getElementById('onu_external_id'))

			btn_search = document.getElementById("btn_search");
			div_element = document.querySelector('#onu_stepper_activate');
			onu_id = document.getElementById('input-codservicio').value;
			onus_available = $("#onus_available")
			handle();
		}
	}
}();
