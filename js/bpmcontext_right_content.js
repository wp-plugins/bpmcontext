/*
functions to build the right accordions

 */

function bpm_create_right_side(result) {
    bpm_create_infobox(result);
    bpm_create_subscribers(result);
    bpm_create_routing_history(result);
    bpm_create_sharing(result);
    bpm_create_change_log(result);
    bpm_create_context_map(result);
    bpm_create_tutorial(result);
    bpm_create_cust_supp(result);

    jQuery('#bpm_show_user_info').hide();
    if(result.USERDETAILS && (bpm_my_page == bpm_pageid || bpm_user_role == 'admin')) bpm_create_user_page(result);
}

function bpm_create_cust_supp(result) {
    jQuery('#bpm_show_cust_loc').hide();

    if(result.SHOWCUSTMENU==1 && bpm_page_status > 0){
        jQuery('#right_acc_2_title').text(bpm_trans_array['bpm_lng_cust_loc_message_title']);
        jQuery('#right_acc_2').text(bpm_trans_array['bpm_lng_cust_loc_message']);
        jQuery('#bpm_show_cust_loc').show();
    }
    if(result.SHOWSUPPMENU==1 && bpm_page_status > 0){
        jQuery('#right_acc_2_title').text(bpm_trans_array['bpm_lng_supp_loc_message_title']);
        jQuery('#right_acc_2').text(bpm_trans_array['bpm_lng_supp_loc_message']);
        jQuery('#bpm_show_cust_loc').show();
    }
}

function bpm_prep_for_lng( str) {
    return str.replace(/[^0-9.a-zA-Z]/g,'');
}

function bpm_create_user_page(result){

    jQuery('#bpm_toolbar_owner').show().html('');
    bpm_user_details = result;
    bpm_is_error = 0;
    var html_line = '';

    jQuery('#bpm_user_real_name').html('<div class=" bpm_text_medium text-left" id="bpm_user_pref_1">' + result.USERDETAILS['name'] + '</div>');
    jQuery('#bpm_user_email').html('<div  class=" bpm_text_medium text-left" id="bpm_user_pref_2">' + result.USERDETAILS['email'] + '</div>');
    jQuery('#bpm_user_type').html('<div  class=" bpm_text_medium text-left" id="bpm_user_pref_3"><strong>' + bpm_trans_array['bpm_lng_user_type'] + ': </strong>' + result.USERDETAILS['user_type'] + '</div>');
    var display_journal = 'No';
    if(result.USERDETAILS['daily_journal']==1){
        display_journal = 'Yes';
    }
    var time_zone = result.USERDETAILS['time_zone'];
    var time_zone_lng = bpm_prep_for_lng(result.USERDETAILS['time_zone']);
    if(bpm_trans_array['bpm_lng_tz_'+time_zone_lng]) time_zone = bpm_trans_array['bpm_lng_tz_'+time_zone_lng];


    jQuery('#bpm_user_journal').html('<div class=" bpm_text_medium text-left" id="bpm_user_pref_4"><strong>' + bpm_trans_array['bpm_lng_daily_journal'] + ': </strong>' + display_journal + '</div>');

    jQuery('#bpm_user_time_zone').html('<div class=" bpm_text_medium text-left" id="bpm_user_pref_5"><strong>' + bpm_trans_array['bpm_lng_time_zone'] + ': </strong>'  + time_zone + '</div>');

    if(bpm_my_page != bpm_pageid){
        jQuery('#bpm_user_password_topbar').hide();
    }else{
        jQuery('#bpm_user_password_topbar').show();
    }

    jQuery('#bpm_show_user_info').show();
}

function bpm_create_user_page_reveal(){

    var result = bpm_user_details;
    bpm_is_error = 0;
    var html_line = '';
    var dd_html = '';

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-large-4 bpm-small-4 bpm-columns text-left bpm">Name</div>');
    html_line = html_line.concat('<div class="bpm-large-8 bpm-small-8 bpm-columns text-right"><div ><input style="margin-bottom:.3em;" class="bpm_profile_editing bpm_type_text" type="text" id="bpm_user_pref_edit_1" value="' + result.USERDETAILS['name'] + '" /></div></div>');
    html_line = html_line.concat('</div>');
    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-large-4 bpm-small-4 bpm-columns text-left">Email</div>');
    html_line = html_line.concat('<div class="bpm-large-8 bpm-small-8 bpm-columns text-right"><div ><input style="margin-bottom:.3em" class="bpm_profile_editing bpm_type_user_email" type="text" id="bpm_user_pref_edit_2" value="' + result.USERDETAILS['email'] + '" /></div></div>');
    html_line = html_line.concat('</div>');

    if(bpm_user_role == 'admin') {
        var admin_selected = '';
        var user_selected = '';
        var intranet_selected = '';
        if (result.USERDETAILS['user_type'] == 'Administrator') admin_selected = 'selected';
        if (result.USERDETAILS['user_type'] == 'Business User') user_selected = 'selected';
        if (result.USERDETAILS['user_type'] == 'Intranet User') intranet_selected = 'selected';

        if (result.USERDETAILS['user_type']) {
            if ((!admin_selected && !user_selected && !intranet_selected) || bpm_my_page == bpm_pageid ){
                //external user - view only

            } else {

                dd_html = dd_html.concat('<select style="margin-bottom:.3em" class="bpm_profile_dropdown bpm_type_dropdown bpm_profile_editing" type="text" id="bpm_user_pref_edit_3">');
                dd_html = dd_html.concat('<option value="admin" ' + admin_selected + '>'+bpm_trans_array['bpm_lng_Administrator']+'</option>');
                dd_html = dd_html.concat('<option value="user" ' + user_selected + '>'+bpm_trans_array['bpm_lng_Business_User']+'</option>');
                dd_html = dd_html.concat('<option value="intranet" ' + intranet_selected + '>'+bpm_trans_array['bpm_lng_Intranet_User']+'</option>');
                dd_html = dd_html.concat('</select>');

                html_line = html_line.concat('<div class="bpm-row">');
                html_line = html_line.concat('<div class="bpm-large-4 bpm-small-4 bpm-columns text-left">' + bpm_trans_array['bpm_lng_user_type'] + '</div>');
                html_line = html_line.concat('<div class="bpm-large-8 bpm-small-8 bpm-columns text-right" >' + dd_html + '</div>');
                html_line = html_line.concat('</div>');
            }
        }
    }

    //daily journal
    var sel_yes = '';
    var sel_no = 'selected';
    var display_journal = 'No';
    dd_html = '';
    if(result.USERDETAILS['daily_journal']==1){
        sel_yes = 'selected';
        sel_no = '';
        display_journal = 'Yes';
    }
    dd_html = dd_html.concat('<select  style="margin-bottom:.3em" class="bpm_profile_dropdown bpm_type_dropdown bpm_profile_editing" type="text" id="bpm_user_pref_edit_4">');
    dd_html = dd_html.concat('<option value="1" ' + sel_yes + '>Yes</option>');
    dd_html = dd_html.concat('<option value="0" ' + sel_no + '>No</option>');
    dd_html = dd_html.concat('</select>');
    dd_html = dd_html.concat('</div>');

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-large-4 bpm-small-4 bpm-columns  text-left">' + bpm_trans_array['bpm_lng_daily_journal'] + '</div>');
    html_line = html_line.concat('<div class="bpm-large-8 bpm-small-8 bpm-columns text-right">'+dd_html+'</div>');
    html_line = html_line.concat('</div>');

    //time zone
    dd_html = '';

    dd_html = dd_html.concat('<select  style="margin-bottom:.3em" class="bpm_profile_dropdown bpm_type_dropdown bpm_profile_editing" type="text" id="bpm_user_pref_edit_5">');

    jQuery.each(result.USERDETAILS['timezones'],function(index, value) {
        if(result.USERDETAILS['time_zone']==value) {
            dd_html = dd_html.concat('<option value="' + value + '" selected>' + value + '</option>');
        }else {
            dd_html = dd_html.concat('<option value="' + value + '" >' + value + '</option>');
        }
    });

    dd_html = dd_html.concat('</select>');

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-large-4 bpm-small-4 bpm-columns text-left">Time Zone</div>');
    html_line = html_line.concat('<div class="bpm-large-8 bpm-small-8 bpm-columns text-right">'+dd_html+'</div>');
    html_line = html_line.concat('</div>');

    jQuery('#bpm_edit_user_profile_list').html(html_line);

    jQuery('.bpm_type_user_email').keypress(function (e) {
        this_id = jQuery(this).prop('id');

        if(!bpm_validateEmail(jQuery(this).val())){
            jQuery(this).css('border', 'solid 1px red');
            jQuery('#bpm_save_user_prefs_button').hide();
        }else{
            jQuery(this).css('border', 'solid 1px black');
            jQuery('#bpm_save_user_prefs_button').show();
        }
    });

    jQuery(".bpm_type_user_email").blur(function () {

        this_id = jQuery(this).prop('id');

        if(!bpm_validateEmail(jQuery(this).val())){
            jQuery(this).css('border', 'solid 1px red');
            jQuery('#bpm_save_user_prefs_button').hide();
        }else{
            jQuery(this).css('border', 'solid 1px black');
            jQuery('#bpm_save_user_prefs_button').show();
        }
    });
}

function bpm_save_user_pref(){

    jQuery('#bpm_user_profile_save_message').show();
    var querystring = 'domain=' + bpm_current_domain + "&action=save_user_details&pageid=" + bpm_pageid;

    var val_1 = 'real_name';
    var val_2 = jQuery('#bpm_user_pref_edit_1').val();
    querystring = querystring.concat('&c1[]=' + val_2+ '&gr_id[]=' +val_1);

    val_1 = 'email';
    val_2 = jQuery('#bpm_user_pref_edit_2').val();
    querystring = querystring.concat('&c1[]=' + val_2+ '&gr_id[]=' +val_1);

    if(jQuery('#bpm_user_pref_edit_3'),length) {
        val_1 = 'user_type';
        val_2 = jQuery('#bpm_user_pref_edit_3 option:selected').text();
        querystring = querystring.concat('&c1[]=' + val_2 + '&gr_id[]=' + val_1);
    }

    val_1 = 'daily_journal';
    val_2 = jQuery('#bpm_user_pref_edit_4 option:selected').text();

    if(val_2=='Yes'){
        val_2 = '1';
    }else{
        val_2 = '0';
    }
    querystring = querystring.concat('&c1[]=' + val_2+ '&gr_id[]=' +val_1);

    val_1 = 'human_timezone';
    val_2 = jQuery('#bpm_user_pref_edit_5 option:selected').text();
    querystring = querystring.concat('&c1[]=' + val_2+ '&gr_id[]=' +val_1);

    jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result){
        if(result){
            bpm_create_user_page(result);
        }
        jQuery('#bpm_user_profile_save_message').hide();
        jQuery('#bpm_edit_user_profile').foundation('reveal', 'close');


    });

}

function bpm_run_tutorial(selected_object){

    var this_id = jQuery(selected_object).prop('id').substr(18);
    jQuery('#bpm_tutorial').html(jQuery('#bpm_tutorial_'+this_id).html());

    bpm_scroll_top();
    jQuery(document).foundation('joyride', 'reflow');

    jQuery(document).foundation({
        joyride: {
            abort_on_close : false,
            post_ride_callback : function () {
                var querystring = 'domain=' + bpm_current_domain + "&action=update_tutorial&tutorialid=" + this_id;
                jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?',  querystring, function(result) {
                    if(this_id==11){
                        jQuery('#bpm_main_loading_alert').show();
                        bpm_load_page(bpm_get_string + '&action=bpmcontext', 1);
                    }else {
                        bpm_create_tutorial(result);
                    }
                });
            }
        }
    }).foundation('joyride', 'start');

}

function bpm_in_array(lookup_array, applied_to_array){

    var this_result = false;
    jQuery(applied_to_array).each(function(i, obj) {
        if(obj==0) this_result = true;
        if(jQuery.inArray(obj, lookup_array) > -1) this_result = true;
    });
    return this_result;
}

function bpm_create_tutorial(result){

    var html_line = '';
    var show_now = 0;
    var has_tutorials = 0;

    if(bpm_template_lib){
        var lookup_array = [0, bpm_template_lib];
    }else{
        var lookup_array = [0];
    }

    jQuery('.bpm_tutorials').each(function(i, obj) {
        var this_tut_id = jQuery(obj).data('tutorialid');
        var viewed = 0;
        var applied_to_lib = jQuery(obj).data('pagetype').split('_');

        if(result['TUTORIALS']) {
            jQuery.each(result['TUTORIALS'], function (index, value) {
                if (value['tut_id'] == this_tut_id) {
                    viewed = 1;
                }
            });
        }

        if(bpm_in_array(lookup_array, applied_to_lib)==false) return true;
        if(jQuery(obj).data('adminonly')==1 && bpm_user_role != 'admin') return true;
        if(jQuery(obj).data('adminonly')==2 && bpm_user_role == 'admin') return true;

        if(show_now == 0 && jQuery(obj).data('shownow') == 1 && viewed == 0){
            show_now = jQuery(obj).data('tutorialid');
        }

        has_tutorials = 1;
        var tour_name = jQuery('#bpm_tutorial_name_' + this_tut_id).text();
        html_line = html_line.concat('<div class="bpm-row">');
        html_line = html_line.concat('<div class="bpm-small-9 bpm-large-9 bpm-columns text-left">');
        html_line = html_line.concat('&nbsp;<a onClick="bpm_run_tutorial(this);" class="bpm_links bpm_nodecoration bpm_tutorial_text" id="bpm_tutorial_link_' + this_tut_id + '" >' + tour_name + '</a>');
        html_line = html_line.concat('</div>');
        html_line = html_line.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-right">');
        if(viewed==1){
            html_line = html_line.concat('<span class="fi-check bpm-green">&nbsp;</span>');
        }else {
            html_line = html_line.concat('<span class="fi-minus">&nbsp;</span>');
        }
        html_line = html_line.concat('</div>');
        html_line = html_line.concat('</div>');

    });

    jQuery('#right_acc_1').html(html_line);
    if(has_tutorials) jQuery('#bpm_right_tutorial').show();


    if(show_now > 0){
        bpm_run_tutorial({id:'bpm_tutorial_link_'+show_now});
    }
}

function bpm_expand_accord(this_accord){

    if(this_accord==12){
        //show edit profile menu
        if(jQuery('#bpm_user_pref_bar').css('display')=='block'){
            jQuery('#bpm_user_pref_bar').hide();
        }else {
            jQuery('.right_accordion_menu').hide();
            jQuery('#bpm_user_pref_bar').show();
        }
    }

    if(this_accord==3){
        //show infobox menu
        if(jQuery('#bpm_edit_infobox_menu').css('display')=='block'){
            jQuery('#bpm_edit_infobox_menu').hide();
        }else {
            jQuery('.right_accordion_menu').hide();
            jQuery('#bpm_edit_infobox_menu').show();
        }
        return;
    }

    if(this_accord==0){
        if(jQuery('#bpm_talat_menu').css('display')=='block'){
            jQuery('#bpm_talat_menu').hide();
            jQuery('.bpm_talat_message_header').css('border','');
        }
    }
    jQuery( '#right_acc_' + this_accord ).toggleClass( "bpm_infobox_setup bpm_infobox_all" );

}

function bpm_load_context_map(selected_object){

    jQuery('#bpm_context_map_list').html('').hide();
    var querystring = 'domain=' + bpm_current_domain + "&action=get_context_map_suite&pageid=" + bpm_pageid + "&suite_id=" + selected_object;
    jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result) {
        if(result.PAGEDATA) {

            bpm_create_context_map(result.PAGEDATA);
        }
    });

}

function bpm_create_context_map(result){

    if(result['CONTEXTMAP']) {
        var i = 0;
        var root_node;
        bpm_context_map_count = 0;
        var html_line = '';

        if(result.CONTEXTMAPLIST) {
            var context_list = '';
            var context_list_selected = '';

            jQuery.each(result.CONTEXTMAPLIST, function (index, value) {
                if(value['selected']==1) context_list_selected = value['suite_name'];
                context_list = context_list.concat('<li class="bpm_ul_li"><a class="bpm_nodecoration" onClick="bpm_load_context_map('+value['suiteid']+');">&nbsp;'+value['suite_name']+'</a></li>');
            });
            jQuery('#bpm_context_map_list').html(context_list).show();;
            jQuery('#bpm_context_map_list_selected').html(context_list_selected);
        }


        html_line = html_line.concat('<table id="bpm_context_map" style="border-color:white;padding:0;margin:0;">');

        jQuery.each(result.CONTEXTMAP,function(index, value) {

            if(i==0){
                var root_node = index;
                i++;
                html_line = html_line.concat('<tr id="bpm_context_map_branch_' + index + '" data-tt-id="'+index+'">');
                html_line = html_line.concat('<td style="background-color:white;border-color:white;"  class="bpm_tree_row"><a class="bpm_nodecoration bpm_links" onclick="bpm_open_context_map(' + index + ', 1);">' + value['template_name'] + '</a></td>');
                html_line = html_line.concat('</tr>');
            }
                html_line = bpm_add_context_map_child(index, result.CONTEXTMAP, html_line);
        });

        html_line = html_line.concat('</table>');

        jQuery('#right_acc_4').html(html_line);
        jQuery('#bpm_right_context_map').show();
        jQuery("#bpm_context_map").treetable({ expandable: true }).treetable('expandAll');
    }else{
        jQuery('#bpm_right_context_map').hide();
    }

}

function bpm_add_context_map_child(this_index, this_data, html_line){

    if(this_data[this_index]) {
        jQuery.each(this_data[this_index]['childs'], function (index, value) {
            bpm_context_map_count++;
            html_line = html_line.concat('<tr id="bpm_context_map_branch_' + index + '" data-tt-id="' + index + '" data-tt-parent-id="' + this_index + '">');
            html_line = html_line.concat('<td style="background-color:white;border-color:white;" class="bpm_tree_row"><a class="bpm_nodecoration bpm_links" onclick="bpm_open_context_map(' + index + ', 0);">' + value['template_name'] + '</a></td>');
            html_line = html_line.concat('</tr>');
            html_line = bpm_add_context_map_child(index, this_data[this_index]['childs'], html_line);
        });
    }

    return html_line;
}

function bpm_open_context_map(selected_template, is_root){

    var this_html = '';

    this_html = this_html.concat('<div class="bpm-row full-width" style="margin-bottom:5px;max-height:400px;overflow-y:auto;">');
    this_html = this_html.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-left">');
    this_html = this_html.concat('<ul class="side-nav" id="bpm_context_map_list">');

    this_html = this_html.concat(' <li class="active bpm_ul_li">');
    this_html = this_html.concat('<a class="bpm_nodecoration side-nav-item" id="bpm_context_map_page_3" onclick="bpm_create_context_map_target(3, ' + selected_template + ');">Information</a>');
    this_html = this_html.concat('</li>');


    if(is_root == 0) {
//        this_html = this_html.concat(' <li class="bpm_ul_li">');
//        this_html = this_html.concat('<a class="bpm_nodecoration side-nav-item" id="bpm_context_map_page_1" onclick="bpm_create_context_map_target(1, ' + selected_template + ');">Page List&nbsp;<span id="bpm_context_page_count"></span></span></a>');
//        this_html = this_html.concat('</li>');

//        this_html = this_html.concat(' <li class="bpm_ul_li">');
//        this_html = this_html.concat('<a class="bpm_nodecoration side-nav-item" id="bpm_context_map_page_2" onclick="bpm_create_context_map_target(2, ' + selected_template + ');">Create Page</a>');
//        this_html = this_html.concat('</li>');
    }

//    this_html = this_html.concat(' <li class="bpm_ul_li">');
//    this_html = this_html.concat('<a class="bpm_nodecoration side-nav-item" id="bpm_context_map_page_4" onclick="bpm_create_context_map_target(4, ' + selected_template + ');">Routing</a>');
//    this_html = this_html.concat('</li>');

//    this_html = this_html.concat(' <li class="bpm_ul_li">');
//    this_html = this_html.concat('<a class="bpm_nodecoration side-nav-item" id="bpm_context_map_page_5" onclick="bpm_create_context_map_target(5, ' + selected_template + ');">Sharing</a>');
//    this_html = this_html.concat('</li>');

    this_html = this_html.concat('</ul>');

    this_html = this_html.concat('</div>'); //end of left column div

    this_html = this_html.concat('<div class="bpm-small-9 bpm-large-9 bpm-columns bpm_gray_border text-left" id="bpm_context_map_target">');

    this_html = this_html.concat('</div>'); //end of right column div
    this_html = this_html.concat('</div>');

    jQuery('#bpm_context_map_content').html(this_html);

    bpm_create_context_map_target(3, selected_template);

    jQuery('#bpm_context_map_window').foundation('reveal', 'open');
}

function bpm_create_context_map_target(this_action, this_template){

    jQuery('#bpm_context_map_target').html(bpm_trans_array['bpm_lng_loading'] + '...');
    var this_html = '';

    switch(this_action){
        case 1:
            //page list
            var querystring = 'domain=' + bpm_current_domain + "&action=get_context_map_pages&pageid=" + bpm_pageid + "&templateid=" + this_template;

            jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result){

                if(result.PAGELIST['pages'].length > 0) {
                    this_html = bpm_make_left_report(result.PAGELIST['pages'], 'context_pages');
                    jQuery('#bpm_context_page_count').text('('+result.PAGELIST['pages'].length+')')
                }else{
                    this_html = bpm_trans_array['bpm_lng_no_results_context_map'];
                    jQuery('#bpm_context_page_count').text('');
                }
                jQuery('#bpm_context_map_target').html(this_html);
                bpm_set_url_links();
            });

            break;
        case 2:
            //create page

            break;
        case 3:
            //template information
            var querystring = 'domain=' + bpm_current_domain + "&action=get_context_info_page&pageid=" + bpm_pageid + "&templateid=" + this_template;

            jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result){

                if(result.PAGEINFO) {
                    jQuery('#bpm_context_map_target').html(result.PAGEINFO);
                }else{
                    jQuery('#bpm_context_map_target').html(bpm_trans_array['bpm_lng_no_network']);
                }
                bpm_set_url_links();
            });
            break;
        case 4:
            //routing info

            break;
        case 5:
            //sharing info

            break;
    }



}

function bpm_create_change_log(result){

    if(result['CHANGELOG'].length > 0) {
        var html_line = '';

        jQuery.each(result.CHANGELOG,function(index, value) {
            var area_changed = '';
            var item_changed = '';
            if(value['infobox_id']) {
                item_changed = 'Infobox-' + value['infobox_localized_name'];
                area_changed = '1';
            }
            if(value['section_id']){
                item_changed = value['section_localized_name'];
                area_changed = '2';
                if(value['section_type']==10){
                    //attachments
                    if(value['action'] == 'document_deleted'){
                        item_changed = value['section_localized_name'] + '-Deleted';
                        area_changed = '3';
                    }else{
                        item_changed = value['section_localized_name'] + '-Added';;
                        area_changed = '3';
                    }
                }
            }

            var date_parts = value['changed_time'].split(' ');
            date_parts = date_parts[0].split('-');
            var updated_on = date_parts[1] + '/' + date_parts[2] + '/' + date_parts[0];

            html_line = html_line.concat('<div class="bpm-row">');
            if(area_changed==1) {
                html_line = html_line.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left bpm_text_medium text-left">' + item_changed + '</div>');
            }else if(area_changed==3){
                html_line = html_line.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left bpm_text_medium text-left">' + item_changed + '</div>');
            }else {
                html_line = html_line.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left bpm_text_medium text-left">' + item_changed + '-'+bpm_trans_array['bpm_lng_edited']+'</div>');
            }
            html_line = html_line.concat('</div>');
            html_line = html_line.concat('<div class="bpm-row ">');
            html_line = html_line.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns bpm_text_medium text-left" style="color:gray">' + bpm_trans_array['bpm_lng_cap_by'] + ' ' + value['real_name'] + ' ' + bpm_trans_array['bpm_lng_on'] + ' '+ updated_on + '</div>');
            html_line = html_line.concat('</div>');
            html_line = html_line.concat('<hr class="bpm_hr_gray">');

        });

        jQuery('#right_acc_6').html(html_line).css('height', '110px');
        jQuery('#bpm_right_change_log').show();
    }else{
        jQuery('#bpm_right_change_log').hide();
    }
}

function bpm_show_history(type){

    jQuery('#bpm_infobox_history_window').foundation('reveal', 'open');

}

function bpm_create_sharing(result){

    if(result.INTRANET==1) return;

    if(result['SHARING']) {

        var html_line = '';
        bpm_sharing_list = result['SHARING'];

        jQuery.each(result.SHARING,function(index, value) {
            var this_status = '';

            if(value['status']=='A'){
                if(value['viewed']){
                    this_status = '<span class="fi-check bpm-green"></span>';
                }else{
                    this_status = '<span class="fi-minus"></span>';
                }
            }else{
                if(value['invitation']){
                    this_status = '<a onclick="bpm_invite_user('+value['user_id'] + ')" class="bpm_links">Invited:&nbsp;' + value['invitation'].substr(0,10) +'</a>';
                }else{
                    //this_status = '<input style="padding:0;margin: 0;" id="checkbox2" type="checkbox">';
                    this_status = '<a onclick="bpm_invite_user('+value['user_id'] + ')" class="bpm_links">Invite</a>';

                }
            }

            html_line = html_line.concat('<div class="bpm-row">');
            html_line = html_line.concat('<div class="bpm-small-8 bpm-large-8 bpm-columns bpm_text_medium"><a href="?pageid=' + value['uad_user_page_id'] + '&action=bpmcontext" class="url_links bpm_links">' + value['real_name'] + '</a></div>');
            html_line = html_line.concat('<div class="bpm-small-4 bpm-large-4 bpm-columns text-center bpm_text_medium">'+ this_status +'</div>');
            html_line = html_line.concat('</div>');
        });

        jQuery('#right_acc_5').html(html_line);
        jQuery('#bpm_right_sharing').show();
    }else{
        jQuery('#bpm_right_sharing').hide();
    }
}

function bpm_send_invite(){

    var send_to = jQuery('#bpm_invite_user_id').text();
    var post_text = encodeURIComponent(jQuery('#bpm_invite_external_text').val());

    jQuery('#bpm_send_invite_alert').show();
    var querystring = 'domain=' + bpm_current_domain + "&action=invite_external&pageid=" + bpm_pageid + "&users=" + send_to + "&mes=" + post_text;

    jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result) {
        bpm_create_sharing(result)
        jQuery('#bpm_send_invite_alert').hide();
        jQuery('#bpm_invite_external_window').foundation('reveal', 'close');
    });
}

function bpm_invite_user(this_user){
    var this_user_name = '';
    jQuery.each(bpm_sharing_list,function(index, value) {
        if(value['user_id']==this_user) this_user_name = value['real_name'];
    });

    jQuery('#bpm_invite_user_name').text(this_user_name);
    jQuery('#bpm_invite_user_id').text(this_user);

    jQuery('#bpm_invite_external_window').foundation('reveal', 'open');
}

function bpm_create_routing_history(result) {

    if(result['ROUTINGHISTORY'].length > 0) {

        var html_line = '';
        jQuery.each(result.ROUTINGHISTORY,function(index, value) {
            html_line = html_line.concat('<div class="bpm-row">');
            html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns bpm_text_medium">' + value['real_name'] + '</div>');
            html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns text-center bpm_text_medium">'+ value['date'] +'</div>');
            html_line = html_line.concat('</div>');
        });

        jQuery('#right_acc_7').html(html_line);
        jQuery('#bpm_right_routing_history').show();
    }else{
        jQuery('#bpm_right_routing_history').hide();
    }
}

function bpm_create_subscribers(result) {

    if(result['SUBSCRIBERS'].length > 0) {
        var html_line = '';
        jQuery.each(result.SUBSCRIBERS,function(index, value) {
            var read_in = 'fi-minus';
            if(value['viewed']==0 && bpm_page_status > 0) read_in = 'fi-check bpm-green';
            if(value['user_index']==bpm_current_user_id) read_in = 'fi-check bpm-green';
            html_line = html_line.concat('<div class="bpm-row">');
            html_line = html_line.concat('<div class="bpm-small-9 bpm-large-9 bpm-columns bpm_text_medium">' + value['real_name'] + '</div>');
            html_line = html_line.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-right bpm_text_medium '+read_in+'"></div>');
            html_line = html_line.concat('</div>');

        });

        jQuery('#right_acc_8').html(html_line);
        jQuery('#bpm_right_subscribers').show();
    }else{
        jQuery('#bpm_right_subscribers').hide();
    }
}

function bpm_create_infobox(this_content){

    var this_id = '';
    if(this_content['INFOBOX'].length > 0) {
        bpm_infobox_data = this_content['INFOBOX'];
        bpm_infobox_data_users = this_content['INFOBOXUSERS'];
        var html_line = '';
        html_line = html_line.concat('<div class="bpm-row">');
        html_line = html_line.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns" style="height:.25em;">&nbsp;</div>');
        html_line = html_line.concat('</div>');

        jQuery.each(this_content.INFOBOX,function(index, value) {

            var info_name = value['info_name'];

            if(bpm_trans_array['bpm_infobox_name_'+value['info_name'].replace(' ','_')]){
                info_name = bpm_trans_array['bpm_infobox_name_'+value['info_name'].replace(' ','_')];
            }

            var this_value = '&nbsp;';
            var can_edit_class = 'bpm_read_only';
            if(value['editable']=='yes') can_edit_class = 'bpm_editable';
            if(value['info_value']) this_value = value['info_value'];
            switch(value['info_type']){
                case '3':
                    this_value = this_value.substr(0,10);
                    break;
                case '16':
                    if(value['display_value']) this_value = value['display_value'];
                    break;
                case '19':
                    if(value['real_name']) this_value = value['real_name'];
                    break;
            }
            html_line = html_line.concat('<div class="bpm-row">');
            html_line = html_line.concat('<div class="bpm-small-4 bpm-large-4 bpm-columns bpm_text_medium">' + info_name + '</div>');
            html_line = html_line.concat('<div class="bpm-small-8 bpm-large-8 bpm-columns text-left bpm_text_medium" id="bpm_field_value_' + value['info_index'] + '">' + this_value + '</div>');
            html_line = html_line.concat('</div>');

        });
        jQuery('#bpm_infobox_accordion').show();
        jQuery('#bpm_infobox_accord_content').html(html_line);
        jQuery('#bpm_right_infobox').show();
    }else{
        jQuery('#bpm_infobox_accord_content').html('');
        jQuery('#bpm_right_infobox').hide();
    }

}

function bpm_info_action(selected_object){

    switch (selected_object.id) {
        case 'bpm_infobox_edit':
            bpm_create_infobox_reveal();
            jQuery('#bpm_edit_infobox').foundation('reveal', 'open');
            break;
        case 'bpm_user_info_edit':
            bpm_create_user_page_reveal();
            jQuery('#bpm_user_profile_save_message').hide();
            jQuery('#bpm_edit_user_profile').foundation('reveal', 'open');
            break;
        case 'bpm_user_info_topbar':
            jQuery('#bpm_delegate_window').foundation('reveal', 'open');
            break;
        case 'bpm_user_password_topbar':
            jQuery('#bpm_confirm_password_html').html('<input id="bpm_confirm_password_field" type="password" size="20" /> <small id="bpm_password_error" class="error" style="display: none;">Passwords do not match</small>');
            jQuery('#bpm_password_html').html('<input id="bpm_password_field" type="password" size="20" />');

            jQuery('#bpm_password_field').val('');
            jQuery('#bpm_confirm_password_field').val('');

            //autocomplete="false" readonly onfocus="this.removeAttribute('readonly');"

            jQuery('.bpm_confirm_password_field').keypress(function (e) {
                if (e.which == 13) {
                    bpm_save_password();
                    return false;
                }
            });

            jQuery('.bpm_password_field').keypress(function (e) {
                if (e.which == 13) {
                    bpm_save_password();
                    return false;
                }
            });
            jQuery('#bpm_cancel_password').show();

            jQuery('#bpm_reset_password_window').foundation('reveal', 'open');
            break;

    }
}

function bpm_create_infobox_reveal(){
    var html_line = '';
    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns" style="height:.25em;">&nbsp;</div>');
    html_line = html_line.concat('</div>');
    jQuery.each(bpm_infobox_data, function(index, value) {

        var info_name = value['info_name'];
        if(bpm_trans_array['bpm_infobox_name_'+value['info_name'].replace(' ','_')]){
            info_name = bpm_trans_array['bpm_infobox_name_'+value['info_name'].replace(' ','_')];
        }

        var this_value = '';
        var can_edit_class = 'bpm_read_only';
        if(value['editable']=='yes') can_edit_class = 'bpm_editable';
        if(value['info_value']) this_value = value['info_value'];
        html_line = html_line.concat('<div class="bpm-row">');
        html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns text-left">' + info_name + '</div>');
        switch(value['info_type']){
            case '1':
                //text field
                if(value['editable']=='yes'){
                    html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns ' + can_edit_class + '" "><input style="margin-bottom:.25em;" class="bpm_editing bpm_type_text" type="text" id="bpm_infobox_' + value['info_index'] + '" value="' + this_value + '" /></div>');
                }else {
                    html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns ' + can_edit_class + '  text-left" id="bpm_infobox_' + value['info_index'] + '"><span id="bpm_field_value_' + value['info_index'] + '">' + this_value + '</span></div>');
                }
                break;
            case '2':
                //number field
                if(value['editable']=='yes'){
                    html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns ' + can_edit_class + '" "><input style="margin-bottom:.25em;" class="bpm_editing bpm_type_number" type="text" id="bpm_infobox_' + value['info_index'] + '" value="' + this_value + '" /></div>');
                }else {
                    html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns ' + can_edit_class + ' text-left" id="bpm_infobox_' + value['info_index'] + '"><span id="bpm_field_value_' + value['info_index'] + '">' + this_value + '</span></div>');
                }
                break;
            case '3':
                //date field
                this_value = this_value.substr(0,10);
                can_edit_class = '';
                if(value['editable']=='yes') {
                    html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns bpm_editable" ><input readonly style="margin-bottom:.25em;" class="bpm_date_editable" type="text" id="bpm_infobox_' + value['info_index'] + '" value="' + this_value + '" /></div>');
                }else{
                    html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns text-left" id="bpm_field_value_' + value['info_index'] + '">' + this_value + '</div>');
                }
                break;
            case '6':
                //dropdown field
                var cell_data = value['cell_data'];
                html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns ' + can_edit_class + '" id="bpm_infobox_' + value['info_index'] + '">');
                if(value['editable']=='yes') {
                    html_line = html_line.concat('<select style="margin-bottom:.25em;" class="bpm_editing bpm_type_dropdown" type="text" id="bpm_current_edit_' + value['info_index'] + '">');
                    html_line = html_line.concat(cell_data);
                    html_line = html_line.concat('</select>');
                }else{
                    html_line = html_line.concat(this_value);
                }
                html_line = html_line.concat('</div>');
                break;
            case '12':
                //read only field - page ID
                html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns text-left" id="bpm_field_value_' + value['info_index'] + '">' + this_value + '</div>');
                break;
            case '17':
                if(value['editable']=='yes'){
                    html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns ' + can_edit_class + '" "><input style="margin-bottom:.25em;" class="bpm_editing bpm_type_email" type="text" id="bpm_infobox_' + value['info_index'] + '" value="' + this_value + '" /></div>');
                }else {
                    html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns ' + can_edit_class + '" id="bpm_infobox_' + value['info_index'] + '"><span id="bpm_field_value_' + value['info_index'] + '">' + this_value + '</span></div>');
                }
                break;
            case '16':
                //page links
                var cell_data = '';
                if(value['info_value']){
                    cell_data = value['cell_data'];
                }else{
                    cell_data = '<option value="0" selected>' + bpm_trans_array['bpm_lng_Select'] + ' ' + info_name + '</option>' + value['cell_data'];
                }

                html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns ' + can_edit_class + '" id="bpm_infobox_' + value['info_index'] + '">');
                if(value['editable']=='yes') {
                    html_line = html_line.concat('<select style="margin-bottom:.25em;" class="bpm_editing bpm_type_dropdown" type="text" id="bpm_current_edit_' + value['info_index'] + '">');
                    html_line = html_line.concat(cell_data);
                    html_line = html_line.concat('</select>');
                }else{
                    html_line = html_line.concat(value['real_name']);
                }
                html_line = html_line.concat('</div>');
                break;
            case '19':

                //user list
                var cell_data = value['info_value'];
                html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns ' + can_edit_class + ' text-left" id="bpm_infobox_' + value['info_index'] + '">');
                if(value['editable']=='yes') {
                    var dropdown_string = '';
                    var build_string = '';
                    var has_selected = 0;
                    if(bpm_infobox_data_users) {
                        jQuery.each(bpm_infobox_data_users, function (user_index, user_value) {
                            //bpm_infobox_data_users
                            if (user_value['user_page'] == cell_data) {
                                has_selected = 1;
                                build_string = build_string.concat('<option value="' + user_value['user_page'] + '" selected>' + user_value['user_name'] + '</option>');
                            } else {
                                build_string = build_string.concat('<option value="' + user_value['user_page'] + '">' + user_value['user_name'] + '</option>');
                            }
                            if (has_selected == 0) {
                                dropdown_string = '<option value="0" selected></option>';
                            }
                            dropdown_string = dropdown_string.concat(build_string);
                        });
                    }

                    html_line = html_line.concat('<select  style="margin-bottom:.25em;" class="bpm_editing bpm_type_dropdown" type="text" id="bpm_current_edit_' + value['info_index'] + '">');
                    html_line = html_line.concat(dropdown_string);
                    html_line = html_line.concat('</select>');
                }else{
                    html_line = html_line.concat(value['real_name']);
                }
                html_line = html_line.concat('</div>');
                break;
            case '20':
                html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns text-left" id="bpm_field_value_' + value['info_index'] + '">' + value['cell_data'] + '</div>');
                break;
            default:
                //console.log(value);
                break;

        }
        html_line = html_line.concat('</div>');
    });

    html_line = html_line.concat('<br><br>');
    jQuery('#bpm_infobox_content').html(html_line);

    var this_id = '';
    jQuery('.bpm_type_email').keypress(function (e) {
        this_id = jQuery(this).prop('id');

        if(!bpm_validateEmail(jQuery(this).val())){
            jQuery(this).css('border', 'solid 1px red');
            jQuery('#bpm_infobox_reveal_save').hide();
        }else{
            jQuery(this).css('border', 'solid 1px black');
            jQuery('#bpm_infobox_reveal_save').show();
        }
    });

    jQuery(".bpm_type_email").blur(function () {
        this_id = jQuery(this).prop('id');

        if(!bpm_validateEmail(jQuery(this).val())){
            jQuery(this).css('border', 'solid 1px red');
            jQuery('#bpm_infobox_reveal_save').hide();
        }else{
            jQuery(this).css('border', 'solid 1px black');
            jQuery('#bpm_infobox_reveal_save').show();
        }
    });


    jQuery( ".bpm_date_editable" ).datepicker({
        onSelect: function(selectedDate) {
            this_id = jQuery(this).prop('id');
//            jQuery('#bpm_field_value_' + this_id.substr(17)).text(selectedDate).show();
        }
    });

}

function bpm_save_infobox(){

    var trans_string = '&action=save_infobox';

    jQuery.each(bpm_infobox_data, function(index, value) {
        if(value['editable']=='yes') {
            trans_string = trans_string.concat('&infoboxid[]=' + value['info_index']);
            var infoboxnewvalue = jQuery('#bpm_infobox_' + value['info_index']).val();
            switch(value['info_type']) {
                case '3':
                    infoboxnewvalue = infoboxnewvalue.substr(6, 4) + '-' + infoboxnewvalue.substr(0, 2) + '-' + infoboxnewvalue.substr(3, 2) + 'T12:00:00.000Z';
                    trans_string = trans_string.concat('&type[]=dhxCalendar');
                    break;
                case '16':
                case '6':
                case '19':
                    infoboxnewvalue = jQuery('#bpm_infobox_' + value['info_index'] + ' option:selected').val();
                    if(infoboxnewvalue=='0') infoboxnewvalue = '';
                    trans_string = trans_string.concat('&type[]=data');
                    break;
                default:
                trans_string = trans_string.concat('&type[]=data');
                    break;
            }
            trans_string = trans_string.concat('&infoboxnewvalue[]=' + encodeURIComponent(infoboxnewvalue));
        }
    });

    jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + trans_string, function (result) {
        if(result){
            bpm_dashboard[5] = [];
            if(result.TRANSTATUS) {
                if(result.TRANSTATUS['reloadpage']) {
                    bpm_load_page(bpm_get_string + '&action=bpmcontext', 1);
                }
            }else{
                bpm_create_infobox(result);
                jQuery('#bpm_edit_infobox_menu').hide();
                bpm_update_dashboard();
            }
        }
        jQuery('#bpm_edit_infobox').foundation('reveal', 'close');
    });
}

function bpm_cancel_password(){
    jQuery('#bpm_reset_password_window').foundation('reveal', 'close');
}

function bpm_set_right_content_options(this_content) {
    jQuery('#bpm_right_talat').hide();

}

function bpm_show_talat_messages(this_content) {

    var html_line = '';
    var message_count = 0;

    jQuery('#bpm_talat_menu').hide();
    jQuery('.bpm_talat_message_header').css('border','');

    jQuery.each(this_content.TALAT_MESSAGES,function(index, value) {

        if(value['recipients']) {
            var recipients = '';
            var reply_all = '';
            jQuery.each(value['recipients'], function (index, value) {
                if (recipients) {
                    recipients = recipients.concat(', ');
                    reply_all = reply_all.concat(',');
                } else {
                    recipients = 'Also Received: ';
                }
                reply_all = reply_all.concat(value['user_id'])
                recipients = recipients.concat(value['real_name']);
            });
        }

        if(html_line){
            html_line = html_line.concat('<hr>');
        }

        html_line = html_line.concat('<div id="bpm_talat_message_'+value['id']+'" class="bpm_talat_message_header" style="width:100%">');
        html_line = html_line.concat('<div class="bpm-row">');
        html_line = html_line.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns"><span id="bpm_talat_message_text_'+value['id']+'" class="bpm_talat_message">' + value['message'] + '</span></div>');
        html_line = html_line.concat('</div><br>');

        var send_date = '';
        if(value['send_date_2']) send_date = value['send_date_2'].substr(5,2) + '/' + value['send_date_2'].substr(8,2) + '/' + value['send_date_2'].substr(2,2);
        html_line = html_line.concat('<div class="bpm-row full-width">');
        html_line = html_line.concat('<div class="bpm-small-8 bpm-large-8 bpm-columns"><span style="padding-left:1em; font-size: .75em;">' + value['real_name'] + '</span></div>')
        html_line = html_line.concat('<div class="bpm-small-4 bpm-large-4 bpm-columns text-right" style="font-size: .75em;">' + send_date + '</div>')
        html_line = html_line.concat();
        html_line = html_line.concat('</div>');

        if(value['recipients']){

            html_line = html_line.concat('<div class="bpm-row full-width">');
            html_line = html_line.concat('<div id="bpm_talat_recip_list" class="bpm-small-12 bpm-large-12 bpm-columns bpm_talat_message">' + recipients + '</div>')
            html_line = html_line.concat('<div class="hide" id="bpm_talat_reply_all_'+value['id']+'">'+reply_all+'</div>');
            html_line = html_line.concat('<div class="hide" id="bpm_talat_reply_to_'+value['id']+'">'+value['uad_user_id']+'</div>');
            html_line = html_line.concat('</div>');
        }
        html_line = html_line.concat('</div>');
        message_count = 1;
    });

    jQuery('#right_acc_0').html(html_line);

    if(message_count==0) jQuery('#bpm_right_talat').hide();

    jQuery('.bpm_talat_message_header').click(function() {
        jQuery('.bpm_talat_message_header').css('border','');
        jQuery('#bpm_talat_menu').show();
        bpm_current_message_id = jQuery(this).prop('id').substr(18);
        jQuery(this).css('border','solid 1px green');
    });
}

function bpm_talat_dismiss(message_id, reply_page_id){

    var querystring = 'domain=' + bpm_current_domain + "&action=dismiss_message&pageid=" + reply_page_id + "&message_id=" + message_id;

    jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result) {
        jQuery('#bpm_talat_menu').hide();
        jQuery('.bpm_talat_message_header').css('border','');
        jQuery('#bpm_talat_message_item_'+message_id).hide();

        if(result.NOTIFICATIONS) {
            bpm_dashboard[12] = result.NOTIFICATIONS;

            if (bpm_dashboard[12]) {
                var total_messages = bpm_dashboard[12].wfdocs.length;
                if(bpm_dashboard[12].WORKFLOW_MESSAGES) var talat_messages = bpm_dashboard[12].WORKFLOW_MESSAGES.length;
                if(talat_messages) {
                    jQuery('#bpm_talat_messages_count').text('(' + talat_messages + ')');
                    jQuery('#left_talat_messages').show();
                }else{
                    jQuery('#left_talat_messages').hide();
                    jQuery('#bpm_left_widget_window').foundation('reveal', 'close');

                }
            } else {
                var total_messages = 0;
                jQuery('#left_talat_messages').hide();
            }
            jQuery('#bpm_notification_count').text('(' + total_messages + ')');
            jQuery('#bpm_subscription_count').text('(' + bpm_dashboard[3].length + ')');
        }


    });
}

function bpm_talat_reply(reply_type, message_id, reply_page_id, try_count){

    if(try_count > 1){
        return;
    }

    if(reply_page_id != bpm_pageid && !bpm_dashboard[98]){
        //reply from different page requires new reply to list
        var querystring = 'domain=' + bpm_current_domain + "&action=get_talat_users&pageid=" + reply_page_id;
        jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result){
            bpm_dashboard[98] = result.TALATALL;
            bpm_talat_reply(reply_type, message_id, reply_page_id, try_count++);
        });

    }else{

        var user_list = [];
        if (bpm_dashboard[98]) {
            user_list = bpm_dashboard[98];
        } else {
            user_list = bpm_dashboard[99];
        }

        bpm_config_talat(user_list);
        var reply_list = [];

        jQuery('#bpm_edit_TALAT_text').val('\n\n' + jQuery('#bpm_talat_message_text_' + message_id).text());

        var reply_to = jQuery('#bpm_talat_reply_to_' + message_id).text();

        if (reply_type == 1) {
            //reply all
            var all_list = jQuery('#bpm_talat_reply_all_' + message_id).text();
            reply_list = all_list.split(",");
        }
        reply_list.push(reply_to);

        jQuery.each(reply_list, function (i, val) {

            jQuery.each(user_list, function (i, value) {

                if (val == value.user_id) {
                    var friend = value.user_id,
                        span = jQuery("<span>").text(value.real_name).prop('id', 'bpm_talat_user_' + value.user_id).addClass("bpm_talat_user"),
                        a = jQuery("<a>").addClass("remove").attr({
                            onclick: "bpm_remove_talat_user(" + value.user_id + ")",
                            title: "Remove " + value.real_name
                        }).text(" x ").appendTo(span);
                    span.insertBefore("#bpm_talat_list");
                    bpm_talat_list.push(value.user_id);
                }
            });
        });
        bpm_reply_talat_page_id = reply_page_id;
        bpm_reply_talat_message_id = message_id;
        bpm_dashboard[98] = null;
        jQuery('#bpm_talat_window').foundation('reveal', 'open');
    }

}

function bpm_config_talat(user_list){
    var suggestions = [];
    bpm_talat_list = [];
    jQuery('.bpm_talat_user').remove();
    jQuery('#bpm_talat_alert').hide();


    jQuery.each(user_list, function(i, val) {
        suggestions.push({ label: val.real_name, value: val.user_id });

    });

    jQuery('#bpm_talat_to').css('z-index','1006');
    jQuery("#bpm_talat_to").autocomplete({

        //define callback to format results
        source: suggestions,
        appendTo: '#bpm_form_talat',

        //define select handler
        select: function(e, ui) {

            var add_item = 0;
            jQuery(bpm_talat_list).each(function(index, value){
                if (value === ui.item.value) {
                    add_item = 1;
                }
            });

            if(add_item==0) {
                var friend = ui.item.value,
                    span = jQuery("<span>").text(ui.item.label).prop('id', 'bpm_talat_user_' + ui.item.value).addClass("bpm_talat_user"),
                    a = jQuery("<a>").addClass("remove").attr({
                        onclick: "bpm_remove_talat_user(" + ui.item.value + ")",
                        title: "Remove " + ui.item.label
                    }).text(" x ").appendTo(span);
                span.insertBefore("#bpm_talat_list");
                bpm_talat_list.push(ui.item.value);
            }

        },
        close: function(){
            jQuery("#bpm_talat_to").val('');
        },
        change: function() {
            jQuery("#bpm_talat_to").val("").css("top", 2);
        }
    });


}
