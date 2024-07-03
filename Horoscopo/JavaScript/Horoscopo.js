function Consultar(event) {
	event.preventDefault();

	let fecha = document.getElementById('Fecha').value;
	let signoTexto = document.getElementById('SignoTexto');

	// Extrae el mes y el día de la fecha
	let mes = fecha.substring(5, 7);
	let dia = fecha.substring(8);
	let fechaFormato = mes + '-' + dia; // Convierte a formato MM-DD

	let signo = '';

    if (fechaFormato >= '01-21' && fechaFormato <= '02-19') {
        signo = '♒️ Acuario';
    } else if (fechaFormato >= '02-20' && fechaFormato <= '03-20') {
		signo = '♓️ Piscis';
    } else if (fechaFormato >= '03-21' && fechaFormato <= '04-20') {
		signo = '♈️ Aries';
	} else if (fechaFormato >= '04-21' && fechaFormato <= '05-20') {
		signo = '♉️ Tauro';
	} else if (fechaFormato >= '05-21' && fechaFormato <= '06-21') {
		signo = '♊️ Géminis';
	} else if (fechaFormato >= '06-22' && fechaFormato <= '07-22') {
		signo = '♋️ Cáncer';
	} else if (fechaFormato >= '07-23' && fechaFormato <= '08-22') {
		signo = '♌️ Leo';
	} else if (fechaFormato >= '08-23' && fechaFormato <= '09-22') {
		signo = '♍️ Virgo';
	} else if (fechaFormato >= '09-23' && fechaFormato <= '10-22') {
		signo = '♎️ Libra';
	} else if (fechaFormato >= '10-23' && fechaFormato <= '11-22') {
		signo = '♏️ Escorpio';
	} else if (fechaFormato >= '11-23' && fechaFormato <= '12-21') {
		signo = '♐️ Sagitario';
	} else if (fechaFormato >= '12-22' || fechaFormato <= '01-20') {
		signo = '♑️ Capricornio';
	} else {
		signo = '❌ Fecha no válida';
	}

    signoTexto.innerHTML = 'Tu signo zodiacal es: ' + signo;
    
    // Limpia el campo de fecha
    document.getElementById('Fecha').value = '';
}
