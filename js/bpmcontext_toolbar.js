/*
functions to support page actions toolbar
 */

function bpm_show_action_button(title, action){

    jQuery('#bpm_toolbar_action_button').text(title);
    jQuery('#bpm_toolbar_action_button_holder').show();
    bpm_action_button_val = action;

}

function bpm_open_add_page(selected_object, type, page_name){

    if(type == 1){
        bpm_current_create_page = selected_object;
    }else {
        bpm_current_create_page = selected_object.id.substr(13);
        page_name = selected_object.text;
    }

    if(bpm_page_naming[bpm_current_create_page]) {
        jQuery('#bpm_add_page_window').foundation('reveal', 'open');
        jQuery('#bpm_add_page_title').text(bpm_trans_array['bpm_lng_add'] + ' ' + page_name + ' ' + bpm_trans_array['bpm_lng_page']);

        jQuery('#bpm_add_page_content').html(bpm_create_add_page_name(bpm_page_naming[bpm_current_create_page]));
        setTimeout(function() {
            jQuery('#' + bpm_first_field).focus();
        },500);
    }else{
        bpm_create_new_page(0,0);
    }

    //add handler to publish_on_create checkbox to change button name

    jQuery('#publish_on_create').click(function() {
        var $this = jQuery(this);
        if ($this.is(':checked')) {
            // the checkbox was checked
            jQuery('#bpm_add_page_button').text(bpm_trans_array['bpm_lng_publish']);
        } else {
            // the checkbox was unchecked
            jQuery('#bpm_add_page_button').text(bpm_trans_array['bpm_lng_create_draft']);
        }
    });

}

function bpm_create_add_page_name(this_content, is_quick_doc){

    var this_html = '';
    var pub_now = 0;
    bpm_first_field = '';
    var is_first = 0;

    jQuery.each(this_content,function(index, value) {

        var field_name = value['field_name'];
        if(bpm_trans_array['bpm_infobox_name_'+value['field_name'].replace(' ','_')]){
            field_name = bpm_trans_array['bpm_infobox_name_'+value['field_name'].replace(' ','_')];
        }

        this_html = this_html.concat('<div class="bpm-row" style="margin-bottom:5px;">');
        this_html = this_html.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns text-left">' + field_name + '</div>');
        this_html = this_html.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns text-right"> <input class="bpm_add_page_field error" id="InfoField_' + value['field_index'] + '" type="text"></div>');
        this_html = this_html.concat('</div>');
        if(is_first==0) bpm_first_field = 'InfoField_' + value['field_index'];
        is_first = 1;
        if(value['pub_immediate']== 1 ) pub_now = 1;
    });

    if(pub_now == 1){
        this_html = this_html.concat('<div class="bpm-row" style="margin-bottom:5px;">');
        this_html = this_html.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns">' + bpm_trans_array['bpm_lng_pub_now'] + '</div>');
        if(is_quick_doc==1) {
            this_html = this_html.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns text-right"> <input class="bpm_add_page_field error" id="quick_doc_publish_on_create" type="checkbox" value="0"/></div>');
        }else {
            this_html = this_html.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns text-right"> <input class="bpm_add_page_field error" id="publish_on_create" type="checkbox" value="0"/></div>');
        }
        this_html = this_html.concat('</div>');
    }



    return this_html;
}

function bpm_create_new_page(name_type, is_quick_doc){

    var new_page_string;

    if(is_quick_doc==1){
        var quick_doc_page_id = jQuery('#bpm_quick_doc_page_id').val();
        new_page_string = '&pageid=' + quick_doc_page_id + '&domain=' + bpm_current_domain + '&action=create_new_page&docid=' + bpm_current_create_page;
        if(jQuery('#quick_doc_publish_on_create').prop('checked')){
            new_page_string = new_page_string.concat('&publish_on_create=on');
        }
    }else {
        new_page_string = '&pageid=' + bpm_pageid + '&domain=' + bpm_current_domain + '&action=create_new_page&docid=' + bpm_current_create_page;
        if(jQuery('#publish_on_create').prop('checked')){
            new_page_string = new_page_string.concat('&publish_on_create=on');
        }
    }

    var error_status = 0;



    if(name_type==1){
        //add fields
        jQuery('.bpm_add_page_field').each(function(i, obj) {
            if(obj.id != 'publish_on_create' && obj.id != 'quick_doc_publish_on_create') {
                if (jQuery(this).val().length == 0 || jQuery.trim(jQuery(this).val()).length === 0) {
                    error_status = 1;
                    jQuery(this).css('border', 'solid 1px red');
                } else {
                    jQuery(this).css('border', '');
                    new_page_string = new_page_string.concat('&' + obj.id + '=' + jQuery(this).val());
                }
            }
        });

        if(error_status==1){
            return;
        }

        jQuery('#bpm_add_page_window').foundation('reveal', 'close');

    }
    bpm_refresh_page_loading();

    jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', new_page_string, function (result) {

        if(result.PAGEINFO['page_id']){
            //refresh page to parent
            bpm_load_page('pageid=' + result.PAGEINFO['page_id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext');
        }else{
            //show error message
            //jQuery('#bpm_main_error_alert').html(result.response['ERROR']).show().fadeOut(5000);

        }
    });


}

function bpm_set_toolbar_options(this_content){

    var has_workflow = 0;
    var has_close = 0;
    var has_button =0;
    jQuery('#bpm_toolbar_action_button_holder').hide();

    if(this_content.STOPSHARING == 1){
        jQuery('#bpm_restart_sharing').hide();
        jQuery('#bpm_stop_sharing').show();
    }else{
        jQuery('#bpm_restart_sharing').show();
        jQuery('#bpm_stop_sharing').hide();
    }

    if(this_content.TOOLBAR_BOOKMARKED == 0){
        jQuery('#bpm_toolbar_bookmark').show();
        jQuery('#bpm_toolbar_unbookmark').hide();
    }else{
        jQuery('#bpm_toolbar_bookmark').hide();
        jQuery('#bpm_toolbar_unbookmark').show();
    }
    if(this_content.TOOLBAR_SUBSCRIBED == 0){
        jQuery('#bpm_toolbar_subscribe_page').show();
        jQuery('#bpm_toolbar_unsubscribe_page').hide();
    }else{
        jQuery('#bpm_toolbar_subscribe_page').hide();
        jQuery('#bpm_toolbar_unsubscribe_page').show();
    }
    if(this_content.TOOLBAR_TAGGED == 0){
        jQuery('#bpm_toolbar_tag_page').show();
        jQuery('#bpm_toolbar_untag_page').hide();
    }else{
        jQuery('#bpm_toolbar_tag_page').hide();
        jQuery('#bpm_toolbar_untag_page').show();
    }
    if(bpm_is_root==1) jQuery('#bpm_toolbar_tag_page').hide();
    if(this_content.TOOLBAR_HOMEPAGE == 0){
        jQuery('#bpm_toolbar_homepage').hide();
    }else{
        jQuery('#bpm_toolbar_homepage').hide();
    }
    if(this_content.CANTALAT == 0){
        jQuery('#bpm_toolbar_talat').hide();
    }else{
        bpm_dashboard[99] = this_content.TALATALL;
        jQuery('#bpm_toolbar_talat').show();
    }
    if(this_content.CANPUBLISH == 0){
        jQuery('#bpm_toolbar_publish').hide();
    }else{
        jQuery('#bpm_toolbar_publish').show();
        bpm_show_action_button('Publish', 'bpm_toolbar_publish');
        has_workflow = 1;
    }
    if(this_content.CANCLOSE == 0){
        jQuery('#bpm_toolbar_close').hide();
    }else{
        jQuery('#bpm_toolbar_close').show();
        has_close = 1;
        bpm_show_action_button('Close', 'bpm_toolbar_close');
        has_button = 1;
        has_workflow = 1;
    }

    if(this_content.USERCANTERMINATE == 0){
        jQuery('#bpm_toolbar_terminate').hide();
        jQuery('#bpm_toolbar_admin_close').hide();
    }else{
        if(has_close == 1){
            jQuery('#bpm_toolbar_terminate').hide();
        }else{
            jQuery('#bpm_toolbar_terminate').show();
            if(bpm_user_role=='admin') jQuery('#bpm_toolbar_admin_close').show();
        }
        has_workflow = 1;
    }
    if(this_content.USERCANDELETE == 0){
        jQuery('#bpm_toolbar_cancel_delete').hide();
        jQuery('#bpm_toolbar_admin_delete').hide();
    }else{
        jQuery('#bpm_toolbar_cancel_delete').show();
        jQuery('#bpm_toolbar_admin_delete').show();
        has_workflow = 1;
    }
    if(this_content.ADMINCANDELETE==1){
        jQuery('#bpm_toolbar_admin_delete').show();
    }
    if(this_content.USERCANRECALL == 0){
        jQuery('#bpm_toolbar_recall').hide();
    }else{
        jQuery('#bpm_toolbar_recall').show();
        has_workflow = 1;
    }
    if(this_content.USERCANROUTEBACK){
        bpm_route_back_users = this_content.USERCANROUTEBACK;
        jQuery('#bpm_toolbar_can_route_back').show();
        has_workflow = 1;
    }else{
        jQuery('#bpm_toolbar_can_route_back').hide();
    }
    jQuery('#bpm_toolbar_can_route_to').hide();
    jQuery('#bpm_toolbar_can_subroute').hide();
    if(this_content.USERCANSUBROUTE){
        bpm_route_users = this_content.USERCANSUBROUTE;
        if(this_content.USERCANSUBROUTE['type']=='route_doc_to'){
            jQuery('#bpm_toolbar_can_route_to').show();
            if(has_button==0){
                bpm_show_action_button('Route to...', 'bpm_toolbar_can_route_to');
                has_button = 1;
            }
        }else {
            jQuery('#bpm_toolbar_can_subroute').show();
        }
        has_workflow = 1;
    }

    if(this_content.CANROUTE==0) {
        jQuery('#bpm_toolbar_can_route_next').hide();
    }else{
        jQuery('#bpm_toolbar_can_route_next').show();
        has_workflow = 1;
        var this_html = jQuery('#bpm_toolbar_can_route_next').html();
        this_html = this_html.replace(/{name}/g,this_content.ROUTETO);
        jQuery('#bpm_toolbar_can_route_next').html(this_html);
        bpm_show_action_button(this_html, 'bpm_toolbar_can_route_next');
        has_button = 1;
    }

    if(this_content.USERCANROUTEOWNER){
        //setup route to owner toolbar option
        var this_html = jQuery('#bpm_toolbar_can_route_owner').html();
        this_html = this_html.replace(/{name}/g,this_content.ROUTETO);
        jQuery('#bpm_toolbar_can_route_owner').html(this_html);
        bpm_show_action_button(this_html);
        has_button = 1;
        jQuery('#bpm_toolbar_can_route_owner').show();
        has_workflow = 1;
    }else{
        jQuery('#bpm_toolbar_can_route_owner').hide();
    }
    if(this_content.USERCANSUBROUTEBACK){
        var this_html = jQuery('#bpm_toolbar_can_subroute_back').html();
        this_html = this_html.replace(/{name}/g,this_content.USERCANSUBROUTEBACK);
        jQuery('#bpm_toolbar_can_subroute_back').html(this_html);
        bpm_show_action_button(this_html);
        has_button = 1;
        jQuery('#bpm_toolbar_can_subroute_back').show();
        has_workflow = 1;
    }else{
        jQuery('#bpm_toolbar_can_subroute_back').hide();
    }
    if(has_workflow==0){
        jQuery('#bpm_workflow_menu').hide();
    }else{
        jQuery('#bpm_workflow_menu').show();
    }
    if(has_button == 0 && this_content.DOCOWNER){
        jQuery('#bpm_toolbar_owner').show().text('Current owner: ' + this_content.DOCOWNER );
    }

    if(this_content.WFSTATUS == 2 && bpm_is_root == 0){
        if(this_content.WORKFLOWTYPE==1) {
            jQuery('#bpm_toolbar_owner').show().html(bpm_trans_array['bpm_lng_is_published']);
        }else{
            jQuery('#bpm_toolbar_owner').show().html(bpm_trans_array['bpm_lng_is_closed']);
        }
    }

    if(this_content.WFSTATUS == 2) {
        jQuery('#bpm_toolbar_admin_close').hide();
    }else{
        if(bpm_user_role=='admin') jQuery('#bpm_toolbar_admin_close').show();
    }
    //if(this_content.ADMINCANDELETE == 0) jQuery('#bpm_toolbar_admin_move').hide();
    jQuery('#bpm_toolbar_admin_move').hide();

}

function bpm_confirm_yes(){

    jQuery('#bpm_confirm_cancel_delete').foundation('reveal', 'close');
    jQuery('#bpm_confirm_admin_close').foundation('reveal', 'close');
    jQuery('#bpm_confirm_terminate').foundation('reveal', 'close');

    if(bpm_confirm_option==0) return;

    switch(bpm_confirm_option){
        case 1:
            //send cancel and delete
            bpm_refresh_page_loading();

            jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + '&action=cancel_delete', function (result) {

                if(result.response['PARENTDOC']){
                    //refresh page to parent
                    bpm_load_page('pageid=' + result.response['PARENTDOC'] + '&domain=' + bpm_current_domain + '&action=bpmcontext');
                }else{
                    //show error message
                    jQuery('#bpm_main_error_alert').html(result.response['ERROR']).show().fadeOut(5000);

                }
            });
            break;
        case 2:
            //publish
            bpm_reload_type = 1;
            bpm_refresh_page_loading();

            jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + '&action=publish', function (result) {

                if(result.response['SUCCESS']){
                    //refresh page
                    bpm_load_page(bpm_get_string + '&action=bpmcontext', 1);
                }else{
                    //show error message
                    jQuery('#bpm_main_error_alert').html(result.response['ERROR']).show().fadeOut(5000);

                }
            });
            break;
        case 3:

            var route_to_user = jQuery("input:radio[name=bpm_route_to_selection]:checked" ).val();

            if(route_to_user) {
                bpm_reload_type = 2;
                bpm_refresh_page_loading();
                jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + '&action=sub_route&subrouteto=' + route_to_user, function (result) {
                    if (result.response['SUCCESS']) {
                        //refresh page
                        bpm_load_page(bpm_get_string + '&action=bpmcontext');
                    } else {
                        //show error message
                        jQuery('#bpm_main_error_alert').html(result.response['ERROR']).show().fadeOut(5000);
                    }
                });
            }
            break;
        case 4:
            bpm_reload_type = 2;
            bpm_refresh_page_loading();
            jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + '&action=route_owner', function (result) {

                if(result.response['SUCCESS']){
                    //refresh page
                    bpm_load_page(bpm_get_string + '&action=bpmcontext');
                }else{
                    //show error message
                    jQuery('#bpm_main_error_alert').html(result.response['ERROR']).show().fadeOut(5000);
                }
            });
            break;
        case 5:
            //recall
            bpm_refresh_page_loading();
            jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + '&action=recall', function (result) {

                if(result.response['SUCCESS']){
                    //refresh page
                    bpm_load_page(bpm_get_string + '&action=bpmcontext');
                }else{
                    //show error message
                    jQuery('#bpm_main_error_alert').html(result.response['ERROR']).show().fadeOut(5000);
                }
            });
            break;
        case 6:
            //terminate or admin close
            bpm_refresh_page_loading();
            jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + '&action=admin_close', function (result) {

                if(result.response['SUCCESS']){
                    //refresh page
                    bpm_load_page(bpm_get_string + '&action=bpmcontext');
                }else{
                    //show error message
                    jQuery('#bpm_main_error_alert').html(result.response['ERROR']).show().fadeOut(5000);
                }
            });
            break;
        case 7:
            //sub_route_back
            bpm_reload_type = 2;
            bpm_refresh_page_loading();
            jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + '&action=sub_route_back', function (result) {

                if(result.response['SUCCESS']){
                    //refresh page
                    bpm_load_page(bpm_get_string + '&action=bpmcontext');
                }else{
                    //show error message
                    jQuery('#bpm_main_error_alert').html(result.response['ERROR']).show().fadeOut(5000);

                }
            });
            break;
        case 8:
            //route next
            bpm_reload_type = 2;
            bpm_refresh_page_loading();
            jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + '&action=next_routing', function (result) {

                if(result.response['SUCCESS']){
                    //refresh page
                    bpm_load_page(bpm_get_string + '&action=bpmcontext');
                }else{
                    //show error message
                    jQuery('#bpm_main_error_alert').html(result.response['ERROR']).show().fadeOut(5000);

                }
            });
            break;
        case 9:
            var route_to_user = jQuery("input:radio[name=bpm_route_to_selection]:checked" ).val();

            if(route_to_user) {
                bpm_reload_type = 2;
                bpm_refresh_page_loading();
                jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + '&action=route_back&subrouteto=' + route_to_user, function (result) {
                    if (result.response['SUCCESS']) {
                        //refresh page
                        bpm_load_page(bpm_get_string + '&action=bpmcontext');
                    } else {
                        //show error message
                        jQuery('#bpm_main_error_alert').html(result.response['ERROR']).show().fadeOut(5000);
                    }
                });
            }
            break;
        case 10:

            var querystring = 'domain=' + bpm_current_domain + "&action=restart_sharing&pageid=" + bpm_pageid;

            jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result){
                if(result.TRANSTATUS){
                    if(result.TRANSTATUS == 1){
                        jQuery('#bpm_restart_sharing').hide();
                        jQuery('#bpm_stop_sharing').show();
                    }else{
                        jQuery('#bpm_main_error_alert').html('Restart sharing failed.  Please try again').show()
                    }
                }
            });

            break;
    }

}

function bpm_load_page(this_address){

    bpm_confirm_option = 0;
    if(bpm_is_loading==0) {
        bpm_is_loading = 1;
        bpm_start = Date.now();

        jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', this_address, function (result) {
            if(result) {

                bpm_login_status = Number(result.LOGGEDIN);
                if(bpm_current_screen ==2){
                    jQuery('#bpm_content_area').html(bpm_mobile_template);
                }else if(bpm_current_screen == 3){
                    jQuery('#bpm_content_area').html(bpm_medium_template);
                }else{
                    jQuery('#bpm_content_area').html(bpm_template);
                }

                jQuery('#bpm_page_loading_alert').hide();
                bpm_build_page(result);
                bpm_update_dashboard();
                bpm_is_loading = 0;
            }
        });
    }
}


function bpm_confirm_no(selected_object){
    bpm_confirm_option = 0;
    bpm_delete_from = 0;
    jQuery('.bpm_toolbar_options_dd').show();
    jQuery('#'+selected_object).foundation('reveal', 'close');
}

function bpm_add_to_talat_list(this_id){

    var this_item = '';
    this_item = this_item.concat('<div class="bpm-row" id="bpm_talat_user_added_' + this_id + '">');
    this_item = this_item.concat(jQuery('#bpm_talat_user_all_'+ this_id).clone().html());
    this_item = this_item.replace(/bpm_add_to_talat_list/g,'bpm_remove_from_talat_list');
    this_item = this_item.concat('</div >');

    jQuery('#bpm_send_to_list').prepend(this_item);
    jQuery('#bpm_talat_user_all_'+ this_id).hide();
    jQuery('#bpm_talat_user_fav_'+ this_id).hide();
}

function bpm_remove_from_talat_list(this_id){

    jQuery('#bpm_talat_select_fav_'+ this_id).prop('checked', false);
    jQuery('#bpm_talat_select_all_'+ this_id).prop('checked', false);
    jQuery('#bpm_talat_user_all_'+ this_id).show();
    jQuery('#bpm_talat_user_fav_'+ this_id).show();
    jQuery('#bpm_talat_user_added_' + this_id).remove();

}

function bpm_make_user_list(fav_content, all_content){

    var html_line = '';

    if(fav_content) {
        html_line = html_line.concat('<div class="bpm-row">');
        html_line = html_line.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns">Favorites</div>');
        html_line = html_line.concat('</div >');
    }

    jQuery.each(fav_content,function(index, value) {
        html_line = html_line.concat('<div class="bpm-row" id="bpm_talat_user_fav_' +value['user_id']+'">');
        html_line = html_line.concat('<div class="bpm-small-2 bpm-large-2 bpm-columns" ><input onclick="bpm_add_to_talat_list(' +value['user_id']+')" type="checkbox" name="bpm_talat_select" id="bpm_talat_select_fav_' +value['user_id']+'" value="bpm_talat_select_' + value['user_id']+'"></div >');
        html_line = html_line.concat('<div class="bpm-small-10 bpm-large-10 bpm-columns" >' + value['real_name'] + '</div >');
        html_line = html_line.concat('</div >');
    });

    if(html_line.length > 0) html_line = html_line.concat('<hr>');
    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns">All Users</div>');
    html_line = html_line.concat('</div >');

    jQuery.each(all_content,function(index, value) {
        html_line = html_line.concat('<div class="bpm-row" id="bpm_talat_user_all_' +value['user_id']+'">');
        html_line = html_line.concat('<div class="bpm-small-2 bpm-large-2 bpm-columns" ><input onclick="bpm_add_to_talat_list(' +value['user_id']+')" type="checkbox"  name="bpm_talat_select" id="bpm_talat_select_all_' + value['user_id']+'" value="bpm_talat_select_'+ value['user_id']+'"></div >');
        html_line = html_line.concat('<div class="bpm-small-10 bpm-large-10 bpm-columns" >' + value['real_name'] + '</div >');
        html_line = html_line.concat('</div >');
    });

    return html_line;
}

function bpm_make_route_list(user_list){

    if(user_list) {
        var bpm_grid_data = '';

        jQuery.each(user_list['users'], function (index, value) {
            bpm_grid_data = bpm_grid_data.concat('<div class="bpm-row">');
            bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-2 bpm-large-2 bpm-columns text-left" ><input type="radio" name="bpm_route_to_selection" value="' + value['user_id'] + '" id="bpm_selected_route_to_' + value['user_id'] + '"> </div>');
            bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-10 bpm-large-10 bpm-columns text-left" >' + value['real_name'] + ' </div>');
            bpm_grid_data = bpm_grid_data.concat('</div>');
        });

        jQuery('#bpm_route_to_reveal_list').html(bpm_grid_data);
        jQuery('#bpm_get_route_to_user').foundation('reveal', 'open');
    }
}

function bpm_action_button(){
    bpm_action({id:bpm_action_button_val});
}

function bpm_send_stop_sharing(){

    jQuery('#bpm_stop_sharing_window').foundation('reveal', 'close');

    var post_text = encodeURIComponent(jQuery('#bpm_edit_stop_sharing_text').val());
    if(post_text.length == 0) return;

    //post message
    var querystring = 'domain=' + bpm_current_domain + "&action=stop_sharing&pageid=" + bpm_pageid + "&reason=" + post_text;

    jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result){
        if(result.TRANSTATUS){
            if(result.TRANSTATUS == 1){
                jQuery('#bpm_restart_sharing').show();
                jQuery('#bpm_stop_sharing').hide();
                jQuery('#bpm_edit_stop_sharing_text').val('');
                bpm_set_right_content_options(result);
            }else{
                jQuery('#bpm_main_error_alert').html('Stop sharing failed.  Please try again').show()
            }
        }
    });

}

function bpm_change_name() {

    jQuery('#bpm_rename_error_alert').hide();
    var name_text = jQuery('#bpm_admin_rename_field').val();

    if(name_text.length == 0){
        jQuery('#bpm_rename_error_alert').text(bpm_trans_array['bpm_lng_enter_page_name']).show();
        return;
    }
    var querystring = 'domain=' + bpm_current_domain + "&action=rename_page&pageid=" + bpm_pageid + "&name=" + name_text;

    jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', querystring, function (result) {

        if(result) {
            if (result.TRANSTATUS == 1) {
                jQuery('#bpm_rename_window').foundation('reveal', 'close');
                jQuery('#bpm_main_loading_alert').show();
                bpm_load_page(bpm_get_string + '&action=bpmcontext');
                return;
            } else {
                jQuery('#bpm_rename_error_alert').text(bpm_trans_array['bpm_lng_page_exists']).show();
            }
        }
    });
}

function bpm_action(selected_object){

    var option_string = '';
    var message = '';
    var show_string = '';
    var hide_string = '';

    jQuery('.bpm_toolbar_options_dd').hide();
    hide_string = selected_object.id;

    switch(selected_object.id){

        case 'bpm_toolbar_admin_rename':
            jQuery('#bpm_admin_rename_field').val(bpm_current_page_name)
            jQuery('#bpm_rename_error_alert').hide();
            jQuery('#bpm_rename_window').foundation('reveal', 'open');
            return;
            break;
        case 'bpm_restart_sharing':
            bpm_confirm_option = 10;
            bpm_confirm_yes();
            return;
            break;
        case 'bpm_stop_sharing':
            jQuery('#bpm_stop_sharing_window').foundation('reveal', 'open');
            return;
            break;
        case 'bpm_toolbar_cancel_delete':
            bpm_confirm_option = 1;
            jQuery('#bpm_confirm_cancel_delete').foundation('reveal', 'open');
            return;
            break;
        case 'bpm_toolbar_close':
            bpm_confirm_option = 2;
            bpm_confirm_yes();
            return;
            break;
        case 'bpm_toolbar_publish':
            bpm_confirm_option = 2;
            bpm_confirm_yes();
            return;
            break;
        case 'bpm_toolbar_can_subroute':
            if(!bpm_route_users) return;
            bpm_confirm_option = 3;
            jQuery('#bpm_route_to_reveal_title').text("Sub-Route To");
            bpm_make_route_list(bpm_route_users);
            //jQuery('#bpm_get_route_to_user').foundation('reveal', 'open');
            return;
            break;
        case 'bpm_toolbar_can_route_owner':
            bpm_confirm_option = 4;
            bpm_confirm_yes();
            return;
            break;
        case 'bpm_toolbar_recall':
            bpm_confirm_option = 5;
            bpm_confirm_yes();
            return;
            break;
        case 'bpm_toolbar_terminate':
            bpm_confirm_option = 6;
            jQuery('#bpm_confirm_terminate').foundation('reveal', 'open');
            return;
            break;
        case 'bpm_toolbar_can_route_to':
            if(!bpm_route_users) return;
            bpm_confirm_option = 3;
            jQuery('#bpm_route_to_reveal_title').text("Route To");
            bpm_make_route_list(bpm_route_users);
            //jQuery('#bpm_get_route_to_user').foundation('reveal', 'open');
            return;
            break;
        case 'bpm_toolbar_can_subroute_back':
            bpm_confirm_option = 7;
            bpm_confirm_yes();
            return;
            break;
        case 'bpm_toolbar_can_route_next':
            bpm_confirm_option = 8;
            bpm_confirm_yes();
            return;
            break;
        case 'bpm_toolbar_can_route_back':
            if(!bpm_route_back_users) return;
            bpm_confirm_option = 9;
            jQuery('#bpm_route_to_reveal_title').text("Route Back To");
            bpm_make_route_list(bpm_route_users);
//            jQuery('#bpm_get_route_to_user').foundation('reveal', 'open');
            return;
            break;
        case 'bpm_toolbar_admin_delete':
            bpm_confirm_option = 1;
            jQuery('#bpm_confirm_cancel_delete').foundation('reveal', 'open');
            return;
            break;
        case 'bpm_toolbar_admin_close':
            bpm_confirm_option = 6;
            jQuery('#bpm_confirm_admin_close').foundation('reveal', 'open');
            return;
            break;
        case 'bpm_toolbar_bookmark':
            option_string = '&domain=' + bpm_current_domain + '&action=bookmark';
            message = 'Bookmark Saved';
            show_string = 'bpm_toolbar_unbookmark';
            break;
        case 'bpm_toolbar_unbookmark':
            option_string = '&domain=' + bpm_current_domain + '&action=unbookmark';
            message = 'Bookmark Removed';
            show_string = 'bpm_toolbar_bookmark';
            break;
        case 'bpm_toolbar_subscribe_page':
            option_string = '&domain=' + bpm_current_domain + '&action=subscribe';
            show_string = 'bpm_toolbar_unsubscribe_page';
            message = 'Subscription Saved';
            break;
        case 'bpm_toolbar_unsubscribe_page':
            option_string = '&domain=' + bpm_current_domain + '&action=unsubscribe';
            show_string = 'bpm_toolbar_subscribe_page';
            message = 'Subscription Removed';
            break;
        case 'bpm_toolbar_tag_page':
            option_string = '&domain=' + bpm_current_domain + '&action=tag';
            show_string = 'bpm_toolbar_untag_page';
            message = 'Page Type Favorite Saved';
            break;
        case 'bpm_toolbar_untag_page':
            option_string = '&domain=' + bpm_current_domain + '&action=untag';
            show_string = 'bpm_toolbar_tag_page';
            message = 'Page Type Favorite Removed';
            break;
        case 'bpm_toolbar_homepage':
            option_string = '&domain=' + bpm_current_domain + '&action=makehomepage';
            show_string = '';
            message = 'Homepage Saved';
            break;
    }

    if(option_string.length > 0) {
        jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + option_string, function (result) {
console.log(result);
            if (result.TRANSTATUS == 1) {
                jQuery('#bpm_main_success_alert').html(message).show().fadeOut(1500, function () {
                    jQuery('.bpm_toolbar_options_dd').show();
                    if (show_string.length > 0) jQuery('#' + show_string).show();
                    jQuery('#' + hide_string).hide();

                    bpm_dashboard[6] = null;
                    bpm_dashboard[0] = null;
                    bpm_dashboard[7] = null;

                    if (result.BOOKMARKS) bpm_dashboard[0] = result.BOOKMARKS;
                    if (result.PTLTAGGED) bpm_dashboard[6] = result.PTLTAGGED;
                    if (result.PTLALL) bpm_dashboard[7] = result.PTLALL;
                    if (result.SUBSCRIBERS)  bpm_create_subscribers(result);

                });
            } else {
                //show error message
                jQuery('#bpm_main_error_alert').html(message).show().fadeOut(3000, function () {
                    jQuery('.bpm_toolbar_options_dd').show();
                    if (show_string.length > 0)  jQuery('#' + show_string).hide();
                    jQuery('#' + hide_string).show();
                });
            }
        });
    }

}

function bpm_save_talat(){
console.log(bpm_reply_talat_page_id);
    if(bpm_reply_talat_page_id == 0){
        bpm_reply_talat_page_id = bpm_pageid;
    }

    if(bpm_is_loading==1) return;
    bpm_is_loading = 1;
    jQuery('#bpm_talat_alert').hide();
    if(bpm_talat_list.length == 0){
        //alert no users selected
        jQuery('#bpm_talat_alert').html('Please select one or more users.').show();
        //jQuery('#bpm_talat_send_group').hide();
        bpm_is_loading = 0;
        return;
    }
    var post_text = encodeURIComponent(jQuery('#bpm_edit_TALAT_text').val().replace(/\n/g, "<br>"));
    if(post_text.length == 0){
        //alert no message
        jQuery('#bpm_talat_alert').html('Please enter a message').show();
        //jQuery('#bpm_talat_send_group').hide();
        bpm_is_loading = 0;
        return;
    }

    var send_to = '';
    jQuery(bpm_talat_list).each(function(index, value){
        if(send_to.length > 0) send_to = send_to.concat(',');

        send_to = send_to.concat(value);
    });


    //post message
    var querystring = 'domain=' + bpm_current_domain + "&action=send_talat&pageid=" + bpm_reply_talat_page_id + "&send_to=" + send_to + "&message=" + post_text;

    if(bpm_reply_talat_message_id > 0) {
        querystring = querystring.concat('&respond_message_id='+bpm_reply_talat_message_id);
    }

    jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result){
        jQuery('#bpm_edit_TALAT_text').val('')
        bpm_dashboard[98] = null;
        jQuery('#bpm_talat_window').foundation('reveal', 'close');
        jQuery('#bpm_main_success_alert').html('Take a Look at This message has been sent.').show().fadeOut(4000);
        bpm_is_loading = 0;
        bpm_reply_talat_page_id = 0;
        bpm_reply_talat_message_id = 0;
        bpm_update_dashboard();
    });


}

function bpm_close_talat(){

    jQuery('#bpm_talat_to').autocomplete('close');
    bpm_dashboard[98] = null;
    jQuery('#bpm_talat_window').foundation('reveal', 'close');
    jQuery('#bpm_edit_TALAT_text').val('');

}