// JavaScript Document

function validateEmailForm(){
    ValidateEmail(jQuery('#BPM_Email').val());
    return false;
}

function ValidateEmail(inputText) {

    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(inputText.match(mailformat)) {

        var form = jQuery('<form action="https://bpm.bpmcontext.com/index.php?action=newAccount" method="post" target="_top">' +
        '<input type="hidden" name="BPM_Email" value="' + inputText + '" />' +
        '<input type="hidden" name="token" value="'+jQuery('#bpm_token').val()+'">' +
        '</form>');
        jQuery('body').append(form);
        form.submit();

        return true;
    }else {
        jQuery('#newAccount').hide();
        jQuery('#error').fadeIn('slow');

        setTimeout(function() {
            jQuery('#newAccount').fadeIn('slow');
            jQuery('#error').hide();
        }, 2000);

        return false;
    }
}