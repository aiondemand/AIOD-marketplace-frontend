jQuery(document).ready(function ($) {
    $('#firstStep input[name="radio-request"]').change(function () {
        $('.divForm').addClass("d-none");
        if ($(this).val() === '1') {
            $('#projectAcronym').removeClass("d-none");
        } else if ($(this).val() === '0') {
            $('#organization').removeClass("d-none");
        }
        $('#typeContent').removeClass("d-none");
    });

    $('#typeContent input[name="radio-communicate[]"]').change(function () {
        const val = $(this).val();
        var $divsToHide = $('.divForm').not('#typeContent').filter(function () {
            return $(this).index() > $('#typeContent').index();
        });

        // Now you can do whatever you want with $divsToHide, e.g., hide them
        $divsToHide.addClass("d-none");
        if (val === 'event') {
            $('#eventInformation').removeClass("d-none");
            // $('#additionalContentEvents').removeClass("d-none");
            $('#additionalContent').removeClass("d-none");
        } else {
            $('#additionalContent').removeClass("d-none");
            $('#aiodChannels').removeClass("d-none");
            $('#timeFrame').removeClass("d-none");
        }
        $('#submitButton').removeClass("d-none");
    });

    $('#customFormCommunication').on('submit', function (e) {
        e.preventDefault();

        if (validateFormsGeneral($(this))) {
            grecaptcha.ready(function () {
                grecaptcha.execute(recaptcha_site_key, { action: 'submit' }).then(function (tokenCaptcha) {

                    var formulario = document.getElementById("customFormCommunication");
                    var formData = new FormData(formulario);
                    console.log(formData);
                    formData.append("action", 'communication_form');
                    formData.append("grecaptcharesponse", tokenCaptcha);
                    $.ajax({
                        beforeSend: function () {
                            //disable form and show loading
                            $('#customFormCommunication :input').prop('disabled', true);
                            $('.loading').show();
                        },
                        type: 'POST',
                        dataType: 'json',
                        url: ajax_object.ajax_url,
                        cache: false,
                        contentType: false,
                        processData: false,
                        data: formData,
                        success: function (response) {
                            if (response.success) {
                                $(".warnings__error").hide();
                                $(".warnings__success").html(response.data.message);
                                $(".warnings__success").show();

                            } else {
                                $(".warnings__success").hide();
                                $(".warnings__error").html(response.data.message);
                                $(".warnings__error").show();
                            }
                        },
                        error: function (xhr, status, error) {
                            $(".warnings__success").hide();
                            $(".warnings__error").show();
                        },
                        complete: function () {
                            // Enable form and hide loading
                            $('#customFormCommunication :input').prop('disabled', false);
                            $('.loading').hide();

                            // $('#customFormCommunication').removeClass("was-validated");
                            // $('#customFormCommunication').removeClass("valid");
                        }
                    });


                });
            });
        } else {
            $(".warnings__success").hide();
            $(".warnings__error").show();
        }


    });


})