//untuk handle event document

var doc = $(document);

doc.on('pageshow', '#insert', function() {
	$('#insertForm').submit(function(e) {

		e.preventDefault();

		if(!$('#potato').is(':checked') && !$('#corn').is(':checked')){
			alert('Choose starch!');
		}else{
			var starch = '';

			if($('#potato').is(':checked') && $('#corn').is(':checked'))
				starch = 'Potato & Corn';
			else if($('#potato').is(':checked'))
				starch = 'Potato';
			else
				starch = 'Corn';

			$.ajax({

				type: 'POST',
				url: '/doInsert',
				data: {
					name: $('#name').val(),
					type: $('#type').val(),
					price: $('#price').val(),
					starch: starch,
					duration: $('#duration').val()
				},
				success: function (data) {
					if(data.message){
						alert(data.message);
						window.location='/powders';
					}
				}
			});
		}
	});


});

doc.on('pageshow', '#powders', function() {
	$("[id^='edit_']").click(function(e) {

		var id = $(this).attr('id').substr(5);
		if(parseInt($('#price_'+id).text()) === NaN){
			alert('Price must be numeric!');
		}else if(parseInt($('#duration_'+id).text()) === NaN){
			alert('Duration must be numeric!');
		}else{
			$.ajax({

				type: 'POST',
				url: '/edit',
				data: {
					id: id,
					name: $('#name_'+id).text(),
					type: $('#type_'+id).text(),
					price: $('#price_'+id).text(),
					starch: $('#starch_'+id).text(),
					duration: $('#duration_'+id).text()
				},
				success: function (data) {
					if(data.message){
						alert(data.message);
					}
				}
			});
		}
		e.preventDefault();
	});
	$("[id^='delete_']").click(function(e) {

		var id = $(this).attr('id').substr(7);

			$.ajax({

				type: 'POST',
				url: '/delete',
				data: {
					id: id
				},
				success: function (data) {
					if(data.message){
						alert(data.message);
						location.reload();
					}
				}
			});

		e.preventDefault();
	});
});

doc.on('pageshow', '#login', function() {
	$('#loginForm').submit(function(e) {
		e.preventDefault();

		$.ajax({
			type: 'POST',
			url: '/doLogin',
			dataType: 'json',
			data: {
				username: $('#username').val(),
				password: $('#pass').val()
			},
			success: function(data) {
				if(data.success) {
					alert(data.message);
					$('#message').html('');
					$('body').pagecontainer('change', '/home');
				}else {
					$('#message').html(data.message);
				}

			}
		});

	});
});

doc.on('pageshow', '#signUp', function () {
	$('#signUpForm').submit(function (e) {

		$.ajax({
			type: 'POST',
			url: '/doSignUp',
			dataType: 'json',
			data: {
				name: $('#name').val(),
				username: $('#username').val(),
				email: $('#email').val(),
				password: $('#pass').val()
			},
			success: function(data) {
				if(data.success) {
					alert(data.message);

					$('#message').html('');
					$('body').pagecontainer('change', '/home');
				}else {
					$('#message').html(data.message);
				}

			}
		});

		e.preventDefault();
	});
});