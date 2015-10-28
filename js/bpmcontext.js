var server = 'bpm.bpmcontext.com';
var bpm_login_status = 0;
var bpm_pageid, bpm_current_domain, bpm_current_user_id, bpm_template_lib;
var bpm_get_string = '';
var bpm_current_section = 0;
var bpm_current_disc = 0;
var bpm_text_history = [];
var bpm_user_role = 0;
var bpm_page_has_children = 0;
var bpm_selected_folder = 0;
var bpm_reflow = 0;
var bpm_template, bpm_mobile_template, bpm_medium_template;
var bpm_current_screen = 1;
var bpm_confirm_option = 0;
var bpm_dashboard = [];
var bpm_route_users, bpm_route_back_users;
var bpm_action_button_val;
var bpm_page_naming = [];
var bpm_current_create_page = 0;
var bpm_quick_docs;
var bpm_is_root;
var bpm_disc_list = [];
var bpm_child_links_data = [];
var bpm_first_field = '';
var bpm_context_map_count = 0;
var bpm_is_loading = 0;
var bpm_is_error = 0;
var bpm_current_page_name = '';
var bpm_user_list = '';
var bpm_talat_list = [];
var bpm_sharing_list = [];
var bpm_current_message_id = 0;
var bpm_my_page = 0;
var bpm_folder_list = [];
var bpm_first_notification = '';
var bpm_reload_type = 0;
var bpm_page_status = 0;
var bpm_delete_from = 0;
var bpm_start;
var bpm_child_link_create_id = 0;
var bpm_child_link_create_name = '';
var bpm_is_processing = 0;
var bpm_storage_avail = 0;
var bpm_version_files = [];
var bpm_delete_from_source = '';
var bpm_trans_array = [];
var bpm_is_back_button = 0;
var bpm_infobox_data, bpm_infobox_data_users;
var bpm_user_details;
var bpm_window_mobile = 0;
var bpm_window_medium = 0;
var bpm_page_links_title = '';
var bpm_reply_talat_page_id = 0;
var bpm_reply_talat_message_id = 0;

jQuery.noConflict();
jQuery(document).ready(bpm_open_bpmcontext);

jQuery(window).on("popstate", function () {
    // if this is a bpmcontext page then load it
    if (history.state && "BPMContext_Page" === history.state.page) {
        bpm_is_back_button = 1;
        bpm_refresh_page_loading();

        jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', history.state.name, function(result){
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
        });
    }
});

window.addEventListener("orientationchange", bpm_update_screen , false);

var bpm_rtime;
var bpm_timeout = false;
var bpm_delta = 200;
jQuery(window).resize(function() {
    bpm_rtime = new Date();
    if (bpm_timeout === false) {
        bpm_timeout = true;
        setTimeout(bpm_resizeend, bpm_delta);
    }
});

function bpm_resizeend() {
    if (new Date() - bpm_rtime < bpm_delta) {
        setTimeout(bpm_resizeend, bpm_delta);
    } else {
        bpm_timeout = false;
        bpm_update_screen();
    }
}

function bpm_update_screen(){

    var new_screen;

    var window_width = parseInt(jQuery( "#bpm_content_area").css('width'), 10);

    if(window_width < bpm_window_mobile){
        new_screen = 2;
    }else if(window_width < bpm_window_medium){
        new_screen = 3;
    }else{
        new_screen = 1;
    }

    if(bpm_current_screen != new_screen) {
        bpm_current_screen = new_screen;
        bpm_load_page(bpm_get_string + '&action=bpmcontext', 1);
    }
}

function bpm_build_doc_template(){

    //build mobile template
    jQuery('#bpm_left_mobile_menu').html(jQuery('#bpm_left_menu').html());
    jQuery('#bpm_right_mobile_menu').html(jQuery('#bpm_right_menu').html());
    jQuery('#bpm_mobile_objects').html(jQuery('#bpm_objects').html());

    jQuery('#bpm_left_medium_menu').html('<li class="bpm_ul_li"><label>Left Menu</label></li>' + jQuery('#bpm_left_menu').html());
    jQuery('#bpm_right_medium_menu').html(jQuery('#bpm_right_menu').html());
    jQuery('#bpm_medium_objects').html(jQuery('#bpm_objects').html());

    bpm_mobile_template = jQuery('#bpm_mobile_content_area').html();
    bpm_medium_template = jQuery('#bpm_medium_content_area').html();

    jQuery('#bpm_mobile_content_area').remove();
    jQuery('#bpm_medium_content_area').remove();
    //build desktop template
    bpm_template = jQuery('#bpm_content_area').html();

}

function bpm_open_bpmcontext(){

    if(jQuery('#bpm_options_fields').length){
        jQuery('#bpm_options_fields').html(jQuery('#bpm_settings').html());
        if(bpm_params.has_full_width==1){
            jQuery('#bpm_has_full_width').show();
        }else{
            jQuery('#bpm_has_no_full_width').show();
        }
        return;
    };

    if(!jQuery('#bpm_content_area').length) return;

    bpm_start = Date.now();
    bpm_build_trans_array();
//    console.log("Transarray end " + (Date.now() - bpm_start) + ' milliseconds.  ');

    jQuery('#bpm_page_loading_alert').show();
    jQuery('#bpm_page_area').hide();

    bpm_make_get_string();

    if(jQuery('#bpm_content_area') !== null) {

        bpm_build_doc_template();

        jQuery('#bpm_content_area').css('z-index','1000');

        if(bpm_login_status==1) {
            jQuery('#bpm_login_area').hide();
        }

//        console.log(jQuery( "#bpm_content_area").css('width'));
        var window_width = parseInt(jQuery( "#bpm_content_area").css('width'), 10);

        if(window_width < bpm_window_mobile){
            bpm_current_screen = 2;
        }else if(window_width < bpm_window_medium){
            bpm_current_screen = 3;
        }else{
            bpm_current_screen = 1;
        }

        if(bpm_current_screen == 2){
            jQuery('#bpm_content_area').html(bpm_mobile_template);
        }else if(bpm_current_screen == 3){
            jQuery('#bpm_content_area').html(bpm_medium_template);
        }else{
            jQuery('#bpm_content_area').html(bpm_template);
        }

        jQuery('#bpm_content_area').css('z-index','1000');

        var this_url = window.location.href.split('?');
        var query_string = 'url=' + this_url[0];
        if(bpm_get_string) query_string = query_string.concat('&' + bpm_get_string);

        bpm_start = Date.now();

        jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', query_string, function(result){
            bpm_login_status = Number(result.LOGGEDIN);
//            console.log('loaded');
            jQuery('#bpm_page_loading_alert').hide();

            if(bpm_login_status==1) {
                jQuery('#bpm_page_area').show();
                bpm_build_page(result);
                bpm_update_dashboard()
            }else {
                if(result.HASACCT == 1){
                    jQuery('#bpm_create_account_button').hide();
                }
                bpm_show_login();
            }
        });

    }else{
        //not a bpmcontext content page
        jQuery.getJSON('https://'+server+'/login_check.php?callback=?', function(result){
            bpm_login_status = Number(result.login);
        });
    }

}

function bpm_update_notifications(){

    jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + '&action=notifications', function(dashboard) {
        bpm_dashboard[12] = dashboard.NOTIFICATIONS;
        var talat_messages = '';
        var total_messages = bpm_dashboard[12].wfdocs.length;
        if(bpm_dashboard[12].WORKFLOW_MESSAGES) talat_messages = bpm_dashboard[12].WORKFLOW_MESSAGES.length;
        jQuery('#bpm_notification_count').text('(' + total_messages + ')');
        if(talat_messages) {
            jQuery('#bpm_talat_messages_count').text('(' + talat_messages + ')');
            jQuery('#left_talat_messages').show();
        }else{
            jQuery('#left_talat_messages').hide();
        }
    });
}

function bpm_make_get_string(){

    if(bpm_getQueryVariable('action')){

        bpm_get_string = '';

        if(bpm_getQueryVariable('action')=='bpmcontext') {

            jQuery('#bpm_login_area').hide();
            jQuery('#bpm_page_area').show();

            if (bpm_getQueryVariable('domain')) {
                bpm_current_domain = bpm_getQueryVariable('domain');
                bpm_get_string = 'domain='+bpm_current_domain;
            }
            if (bpm_getQueryVariable('pageid')) {
                bpm_pageid = bpm_getQueryVariable('pageid');
                bpm_get_string = bpm_get_string.concat('&pageid='+bpm_pageid);
            }
            if (bpm_getQueryVariable('viewas')) {
                var bpm_viewas = bpm_getQueryVariable('viewas');
                bpm_get_string = bpm_get_string.concat('&viewas='+bpm_viewas);
            }
        }
    }
}

function bpm_scroll_top(){

return;
    var tag = jQuery('.bpm_content_area_top');
    if(tag.offset()) {
        jQuery('html,body').animate({scrollTop: tag.offset().top}, 'fast');
    }
}

function bpm_show_login(){

    bpm_scroll_top();

    jQuery('#bpm_login_area').show();
    jQuery('#bpm_page_area').hide();

    if(bpm_getQueryVariable('newacct')){
        jQuery('#bpm_new_account_email').val(bpm_getQueryVariable('newacct'));
        bpm_show_new_account();
    }


    jQuery('.bpm_password_login').keypress(function (e) {
        if (e.which == 13) {
            bpm_submitLogIn(this, 3);
            return false;
        }
    });

    jQuery('.bpm_email_login').keypress(function (e) {
        if (e.which == 13) {
            bpm_submitLogIn(this, 2);
            return false;
        }
    });
}

function bpm_build_page(result){

    jQuery('#bpm_login_area').hide();
    jQuery('#bpm_page_area').show();

    bpm_refresh_page_loading();

    bpm_page_naming = [];
    bpm_is_loading = 0;
//    console.log("Page download took " + (Date.now() - bpm_start) + " milliseconds.  Server time was: " + result.EXECUTETIME);

    jQuery('#bpm_confirm_password_html').html('');
    jQuery('#bpm_password_html').html('');

    var bpm_add_pages = '';

    if(bpm_login_status==1) {
        jQuery('#bpm_content_area').show();

        //refresh TALAT content to null
        jQuery('#bpm_edit_TALAT_text').html('');

        //update domain
        if(result.CURRENTCONTEXT) {
            if(bpm_current_domain != result.CURRENTCONTEXT){
                //unset dashboard data to get updated data
                bpm_dashboard = [];

            }
            bpm_current_domain = result.CURRENTCONTEXT;
            if(bpm_is_back_button==0) {
                var name = 'domain=' + bpm_current_domain + '&pageid=' + result.PAGEID + '&action=bpmcontext';
                var state = {name: name, page: 'BPMContext_Page'};
                window.history.pushState(state, "BPMContext", '?' + name);
            }
            bpm_is_back_button = 0;
        }

        bpm_make_get_string();

        if(result.USERID) {
            bpm_current_user_id = result.USERID;
        }

        if(result.STORAGEDETAILS) {
            bpm_storage_avail = result.STORAGEDETAILS['avail'];
        }

        if(result.TEMPLATELIBID) {
            bpm_template_lib = result.TEMPLATELIBID;
        }

        if(result.USERTYPE){
            bpm_user_role = result.USERTYPE;
            if(bpm_user_role == 'admin') {
                jQuery('#left_acctmgr').show();
            }else{
                jQuery('#left_acctmgr').hide();
            }
        }

        if(result.WFSTATUS){
            bpm_page_status = result.WFSTATUS;
        }

        if(result.SHOWCUSTMENU == '1'){
            jQuery('#left_customers').show();
        }else{
            jQuery('#left_customers').hide();
        }

        if(result.SHOWSUPPMENU == '1'){
            jQuery('#left_suppliers').show();
        }else{
            jQuery('#left_suppliers').hide();
        }

        //setup breadcrumbs
        var i = 1;
        var bpm_breadcrumb_size = result.BREADCRUMBS.length;
        if(result.USERPAGE){
            bpm_my_page = result.USERPAGE;
        }
        var bpm_breadcrum_string = '';

        jQuery.each(result.BREADCRUMBS,function(index, value){
            if(i==1){
                bpm_is_root = 1;
                //first breadcrumb
                bpm_breadcrumb_string = '<li class="bpm_ul_li"><a style="color:#333;font-weight:bold;font-size:1.5em;" class="url_links fi-home bpm-home" href="?pageid=' + value['id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" data-dropdown="bpm_context_change" data-options="is_hover:true; hover_timeout:100"></a></li>';
                bpm_breadcrumb_string = bpm_breadcrumb_string.concat('<li class="bpm_ul_li"><a style="color:#333;font-weight:bold;font-size: 1.1em" class="url_links" href="?pageid=' + value['id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext">' + value['name'] + '</a></li>');

            }else {
                bpm_is_root = 0;
                bpm_breadcrumb_string = bpm_breadcrumb_string.concat('<li class="bpm_ul_li"><a style="color:#333;font-weight:bold;font-size: 1.1em"  class="url_links" href="?pageid='+value['id']+'&domain=' + bpm_current_domain + '&action=bpmcontext">'+ value['name'] +'</a></li>');
            }
            bpm_current_page_name = value['name'];
            i++;
       });
        jQuery('#bpm_breadcrumbs').prepend(bpm_breadcrumb_string);

        if(result.QUICKDOCS) {
            bpm_quick_docs = result.QUICKDOCS;
        }

        if(Number(result.CUSTPANEL) > 0) {
            jQuery('#bpm_show_cust_loc').show();
        }
        if(Number(result.SUPPPANEL) > 0) {
            jQuery('#bpm_show_cust_loc').show();
        }
        //setup toolbar
        bpm_set_toolbar_options(result);

        //setup right side
//        bpm_set_right_content_options(result);

        //add context list
        if(result.CONTEXTLIST) {
            var bpm_context_list = '<div style="padding-left: .3em;padding-bottom: .3em;padding-top: .3em;border-bottom:solid 1px gray;color:white;background-color:gray;">&nbsp;'+bpm_trans_array['bpm_lng_select_account']+':</div>';

            jQuery.each(result.CONTEXTLIST, function (index, value) {
                bpm_context_list = bpm_context_list.concat('<li class="bpm_ul_li"><a class="url_links bpm_context_change bpm_nodecoration" href="?domain=' + value['id'] + '&action=bpmcontext">'+value['name']+'</a></li>');
            });

            jQuery('#bpm_context_change').html(bpm_context_list);
        }

        //hide options on toolbar if draft
        if(result.WFSTATUS == 0) {
            jQuery('#bpm_toolbar_options').hide();
        }

        //add 'add pages' to the toolbar
        if(result.TOOLBAR_ADD && result.WFSTATUS > 0) {
            jQuery.each(result.TOOLBAR_ADD, function (index, value) {
                var this_title = '';
                if(bpm_trans_array['bpm_template_name_'+ value['name'].replace(' ','_')]){
                    this_title = bpm_trans_array['bpm_template_name_'+ value['name'].replace(' ','_')];
                }else{
                    this_title = value['name'];
                }

                bpm_add_pages = bpm_add_pages.concat('<li class="bpm_ul_li"><a class="bpm_nodecoration" id="bpm_add_page_' + value['id'] + '" onclick="bpm_open_add_page(this);">' + this_title + '</a></li>');
            });
            jQuery('#bpm_toolbar_add_page').prepend(bpm_add_pages);
        }else{
            jQuery('#bpm_add_pages_dd').hide();
        }
        //add view as dropview values

        if(result.VIEWAS) {
            var bpm_add_viewas = '';
            jQuery.each(result.VIEWAS,function(index, value){
                bpm_add_viewas = bpm_add_viewas.concat('<li class="bpm_ul_li"><a class="bpm_action bpm_nodecoration url_links" id="bpm_view_as_'+value['id']+'" href="?pageid='+bpm_pageid+'&viewas=' + value['id'] + '&action=bpmcontext">'+bpm_trans_array['bpm_lng_'+value['name'].replace(' ','_')]+'</a></li>');
            });
            jQuery('#bpm_view_as_dd').prepend(bpm_add_viewas);
        }else{
            //hide toolbar button
            jQuery('#bpm_view_as_dd_button').hide();
        }

        //stop sharing button
        if(result.STOPSHARING) {
            switch(result.STOPSHARING){
                case 0:
                    //show restart sharing button
                    jQuery('#bpm_stop_sharing').hide();
                    jQuery('#bpm_restart_sharing').show();
                    break;
                case 1:
                    if(result.WFSTATUS > 0){
                        //show stop sharing button
                        jQuery('#bpm_stop_sharing').show();
                        jQuery('#bpm_restart_sharing').hide();
                    }else{
                        //hide stop sharing button
                        jQuery('#bpm_stop_sharing').hide();
                        jQuery('#bpm_restart_sharing').hide();
                    }
                    break;
                default:
                    //hide sharing button
                    jQuery('#bpm_stop_sharing').hide();
                    jQuery('#bpm_restart_sharing').hide();
            }
        }

        var bpm_folder_trees = [];
        var bpm_folder_trees_folders = [];

        if(result.SECTIONINFO){
            var bpm_sections = '';
            var bpm_sections_last  = '';
            var bpm_has_links = 0;
            var bpm_links_id = 0;
            var bpm_link_count = [];
            var bpm_links_content = [];
            var bpm_links_sections = [];
            var bpm_links_ids = [];
            var bpm_links_title = '';
            bpm_disc_list = [];
            bpm_text_history = [];

            jQuery.each(result.SECTIONINFO['sections'],function(index, value){

                var this_title = '';
                if(bpm_trans_array['bpm_section_name_'+ value['title'].replace(' ','_')]){
                    this_title = bpm_trans_array['bpm_section_name_'+ value['title'].replace(' ','_')];
                }else{
                    this_title = value['title'];
                }

                switch(Number(value['SecType'])){
                    case 1:
                    case 14:
                        //text section
                        bpm_text_history[value['THISID']] = value['history'];
                        bpm_sections = bpm_sections.concat('<ul class="accordion"  id="bpm_acc_'+value['THISID']+'" data-accordion><li class="accordion-navigation"><a href="#acc_'+value['THISID']+'" id="bpm_top_bar_' + value['THISID']+'" class="bpm_top_bar bpm_nodecoration fi-clipboard-pencil bpm_text_section">&nbsp;'+this_title+'<div style="float:right;display: inline;" class="fi-pencil"></div> </a> <div id="acc_'+value['THISID']+'" class="active bpm_text_section"> ' + bpm_create_text(value['THISID'], value['content']) +  '</div> </li>  </ul>');
                        break;
                    case 6:
                        //discussion section
                        bpm_disc_list.push(value['THISID']);
                        bpm_sections = bpm_sections.concat('<ul class="accordion" id="bpm_acc_'+value['THISID']+'" data-accordion><li class="accordion-navigation"><a href="#acc_'+value['THISID']+'" id="bpm_top_bar_' + value['THISID']+'" class="bpm_nodecoration fi-comments">&nbsp;'+this_title+'</a> <div id="acc_'+value['THISID']+'" class="active bpm_discussion_section">' + bpm_create_discussion(value['THISID'], value['content']) +  '</div> </li>  </ul>');
                        break;
                    case 10:
                        //attachments section
                        if(value['THISID']) bpm_folder_trees.push(value['THISID']);
                        if(value['folders']) bpm_folder_trees_folders[value['THISID']] = value['folders'];
                        bpm_sections = bpm_sections.concat('<ul class="accordion" id="bpm_acc_'+value['THISID']+'" data-accordion><li class="accordion-navigation"><a href="#acc_'+value['THISID']+'" id="bpm_top_bar_' + value['THISID']+'" class="bpm_nodecoration bpm_top_bar fi-folder">&nbsp;'+this_title+'<div style="float:right;display: inline;" class="fi-pencil"></div></a> <div id="acc_'+value['THISID']+'" class="active bpm_attachments_section"> ' + bpm_create_attachment(value['THISID'],value['content'], value['folders']) +  ' </div> </li>  </ul>');
                        break;
                    case 12:
                        //read-only text section
                        bpm_sections = bpm_sections.concat('<ul class="accordion"  id="bpm_acc_'+value['THISID']+'" data-accordion><li class="accordion-navigation"><a href="#acc_'+value['THISID']+'" id="bpm_top_bar_' + value['THISID']+'" class="bpm_nodecoration bpm_top_bar fi-lock">&nbsp;'+this_title+'</a> <div id="acc_'+value['THISID']+'" class="active bpm_text_section"> ' + bpm_create_readonly_text(value['THISID'], value['content']) +  '</div> </li>  </ul>');
                        break;
                    case 9:
                        //add page name definitions to array
                        if(value['naming']) {
                            bpm_page_naming[value['THISID']] = value['naming'];
                        }
                        //links section
                        if(value['favorite']==1){
                            var bpm_content_array = [];
                            bpm_content_array.push(value['content']);
                            var this_count = value['linkCount'];
                            bpm_sections_last = bpm_sections_last.concat('<ul class="accordion" id="bpm_acc_'+value['THISID']+'" data-accordion><li class="accordion-navigation"><a href="#acc_'+value['THISID']+'" id="bpm_top_bar_' + value['THISID']+'" class="bpm_nodecoration bpm_top_bar fi-list-thumbnails">&nbsp;'+this_title+'&nbsp;('+ this_count + ')<div style="float:right;display: inline;" class="fi-pencil"></div></a> <div id="acc_'+value['THISID']+'" class="active bpm_links_section"> ' + bpm_create_tagged_page_links(value['THISID'], bpm_content_array, this_title, this_count) +  ' </div></li> </ul>');
                        }else{
                            bpm_links_id = value['THISID'];
                            bpm_links_title = this_title;
                            bpm_links_content.push(value['content']);
                            bpm_has_links++;
                            bpm_links_sections.push(this_title);
                            bpm_links_ids.push(value['THISID']);
                            bpm_link_count.push(value['linkCount']);
                    }
                        break;
                    case 5:
                        //spreadsheet section
                        bpm_sections = bpm_sections.concat('<ul class="accordion"  id="bpm_acc_'+value['THISID']+'" data-accordion><li class="accordion-navigation"><a href="#acc_'+value['THISID']+'" id="bpm_top_bar_' + value['THISID']+'" class="bpm_nodecoration bpm_top_bar fi-thumbnails">&nbsp;'+this_title+'<div style="float:right;display: inline;" class="fi-pencil"></div></a> <div id="acc_'+value['THISID']+'" class="active bpm_text_section"> ' + bpm_create_spreadsheet(value['THISID'], value['content']) +  '</div> </li>  </ul>');
                        break;

                }
            });

            if(bpm_has_links == 1){
                bpm_sections_last = bpm_sections_last.concat('<ul class="accordion" id="bpm_acc_'+bpm_links_id+'" data-accordion><li class="accordion-navigation"><a href="#acc_'+bpm_links_id+'" id="bpm_top_bar_' + bpm_links_id +'" class="bpm_nodecoration bpm_top_bar fi-list-thumbnails">&nbsp;'+bpm_links_title+'</a> <div id="acc_'+bpm_links_id+'" class="active bpm_links_section"> ' + bpm_create_tagged_page_links(bpm_links_id, bpm_links_content, bpm_links_title) +  ' </div> </li>  </ul>');
            }else if(bpm_has_links > 1){
                bpm_page_links_title = '';
                var bpm_sections_last_final = '<ul class="accordion" data-accordion><li class="accordion-navigation"><a data-dropdown="bpm_page_type_list" data-options="is_hover:true; hover_timeout:100" href="#acc_links"  id="bpm_top_bar_999999" class="bpm_top_bar bpm_nodecoration fi-list-thumbnails">&nbsp;'+bpm_trans_array['bpm_lng_page_links']+'<div style="float:right;display: inline;" class="fi-pencil"></div></a> <div id="acc_links" class="active bpm_links_section">  ' + bpm_create_child_links(bpm_links_id, bpm_links_content, bpm_links_sections, bpm_link_count, bpm_links_ids) +  ' </div> </li>  </ul>';
            }

            if(bpm_sections_last) bpm_sections = bpm_sections.concat(bpm_sections_last);

            if(bpm_page_has_children > 0){
                if(bpm_sections_last_final) bpm_sections = bpm_sections.concat(bpm_sections_last_final);
            }

            jQuery('#bpm_main_content').prepend(bpm_sections);
            jQuery('#bpm_top_bar_999999').html(bpm_page_links_title);

            if(bpm_params.admin_bar == 1){
                jQuery('#bpm_admin_bar_header').show();
            }
            jQuery('#bpm_content_area').show();

            bpm_create_right_side(result);

            jQuery('#bpm_content').height( jQuery("#bpm_pageBarLeft").height() + 20 );
  //          console.log("Page load until before foundation took " + (Date.now() - bpm_start) + " milliseconds");
            if(bpm_reflow==0) {
                jQuery(document).foundation();


                bpm_reflow++;
            }else{

                jQuery(document).foundation('topbar', 'reflow');
                jQuery(document).foundation('tab', 'reflow');
                jQuery(document).foundation('dropdown', 'reflow');
                jQuery(document).foundation('tooltip', 'reflow');
                if(bpm_current_screen > 1) {
                    jQuery(document).foundation('offcanvas', 'reflow');
                }

            }
 //           console.log("Page load to test point took " + (Date.now() - bpm_start) + " milliseconds");

            jQuery(document).on('closed.fndtn.reveal', '.reveal-modal', function () {
                jQuery('.bpm_toolbar_options_dd').show();
            });

            //setup history buttons
            bpm_update_history_button();

            jQuery('#bpm_new_account').foundation('reveal', 'close');

            //setup discussion expand buttons
            jQuery.each(bpm_disc_list,function(index, value) {
                bpm_set_disc_expand_button(value);
            });

            jQuery.each(bpm_folder_trees,function(index, value) {
                bpm_make_folder_tree(value, bpm_folder_trees_folders[value]);
            });

            jQuery('#bpm_main_loading_alert').hide();
            jQuery('#bpm_context_loading_alert').hide();
            jQuery('#bpm_main_publishing_alert').hide();
            jQuery('#bpm_main_routing_alert').hide();

            if(bpm_user_role != 'admin'){
                jQuery('.bpm_admin_only').hide();
            }

            if(result.RESETPASSWORD == 1){
                jQuery('#bpm_cancel_password').hide();
                jQuery('#bpm_confirm_password_html').html('<input id="bpm_confirm_password_field" type="password" size="20" /> <small id="bpm_password_error" class="error" style="display: none;">'+bpm_trans_array['bpm_lng_password_no_match']+'</small>');
                jQuery('#bpm_password_html').html('<input id="bpm_password_field" type="password" size="20" />');

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
                bpm_scroll_top();

                jQuery('#bpm_reset_password_window').foundation('reveal', 'open');
            }

            jQuery( "#bpm_content_area li" ).each(function( index ) {
                jQuery( this ).addClass('bpm_ul_li');
            });

            if(bpm_current_screen==3){
                var position = jQuery('#bpm_main_content').children().position();
                if(position.left > 0) {
                    jQuery( ".accordion" ).each(function( index ) {
                        //jQuery( this ).css('margin-left', '-'+position.left+'px');
                    });

                }
            }


            jQuery( ".title-header" ).hide();
            jQuery('.bpm_hide_button').hide();

            bpm_set_url_links();
  //          console.log("Total page load took " + (Date.now() - bpm_start) + " milliseconds");


        }//end of build page routine



        //handler setup
        jQuery('#bpm_edit_TALAT_text').on('keyup keypress', function(e) {
            var code = e.keyCode || e.which;
            if (code == 13) {
                if(bpm_is_processing==0) {
                    bpm_is_processing = 1;
                    jQuery(this).val(jQuery(this).val() + '\n');
                    setTimeout(function() {
                        bpm_is_processing = 0;
                    },200);
                }
                e.preventDefault();
                return false;
            }
        });

        jQuery('.bpm_quick_post_input').on('keydown', function(e){
           if(e.which == 13){
               var el = jQuery(this);
               var this_id = jQuery(this).prop('id');
               bpm_send_post(this_id.substring(20));
           }
        });

        jQuery('.bpm_search_pages_input').on('keydown', function(e){
            if(e.which == 13){
                var el = jQuery(this);
                var this_id = jQuery(this).prop('id');
                bpm_search_grid(this_id.substring(23));
            }
        });


        jQuery('#bpm_admin_rename_field').on('keydown', function(e){
            if(e.which == 13){
                bpm_change_name();
            }
        });

        jQuery('.bpm_add_folder_input').on('keydown', function(e){
            if(e.which == 13){
                var el = jQuery(this);
                var this_id = jQuery(this).prop('id').substring(15);
                bpm_file_button(this_id,4);
            }
        });

        jQuery('.bpm_rename_folder_input').on('keydown', function(e){
            if(e.which == 13){
                var el = jQuery(this);
                var this_id = jQuery(this).prop('id').substring(18);
                bpm_file_button(this_id,9);
            }
        });

    }else{
        if(result.HASACCT == 1){
            jQuery('#bpm_create_account_button').hide();
        }
        bpm_show_login();
    }
}

function bpm_set_url_links(){

    jQuery( ".side-nav-item" ).click(function() {
        //set side-nav active
        var el = jQuery(this);
        var this_id = jQuery(this).prop('id');

        jQuery(this).parent().siblings().removeClass('active');
        jQuery(this).parent().addClass('active');
    });

    jQuery( ".bpm_top_bar" ).click(function() {

        if(bpm_is_processing==0) {
            bpm_is_processing = 1;

            var this_id = jQuery(this).prop('id').substr(12);
            var open_status = jQuery("#bpm_section_top_bar_bpm_acc_" + this_id).css('display');
            jQuery('.bpm_section_top_bar_bpm_acc_all').hide();
            if (open_status == 'none') {
                jQuery("#bpm_section_top_bar_bpm_acc_" + this_id).show();
                if(jQuery(this).hasClass('bpm_text_section')){
                    //bpm_edit_text(this_id);
                }
            } else {
                jQuery("#bpm_section_top_bar_bpm_acc_" + this_id).hide();
            }
            setTimeout(function() {
                bpm_is_processing = 0;
            },500);
        }
    });

    jQuery( ".url_links" ).click(function() {

        if(bpm_is_loading==0) {
            bpm_is_loading = 1;

            jQuery('#bpm_left_widget_window').foundation('reveal', 'close');
            var this_address = jQuery(this).prop('href').split("?");

            if(jQuery(this).hasClass('bpm_context_change')){
                bpm_reload_type = 3;
            }

            bpm_refresh_page_loading();
            bpm_start = Date.now();

            jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', this_address[1], function (result) {

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

            });
        }
         return false;

    });

}

function bpm_build_trans_array(){

    jQuery('.bpm_lang').each(function(index, value) {
        bpm_trans_array[jQuery(this).prop('id')] = jQuery(this).text();
        jQuery('.'+jQuery(this).prop('id')).text(jQuery(this).text());
    });
}

function bpm_show_new_account(){
    jQuery('#bpm_new_account_image').html('<img src="' + bpm_params.html_dir + 'banner-772x250.jpg">');
    jQuery('#bpm_new_acct_password_html').html('<input id="bpm_password_field" class="bpm_new_account_field" type="password" />');
    jQuery('#bpm_new_account').foundation('reveal', 'open');
}

function bpm_validateEmail(mail)
{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    {
        return (true)
    }
    return (false)
}

function bpm_create_account_process(screen_name){
    //create account...on success, show homepage
    //validate form fields

    jQuery('#bpm_new_acct_setup_alert').hide();

    var bpm_email = jQuery('#bpm_new_account_email').val();
    var bpm_name = jQuery('#bpm_new_account_real_name').val();
    var bpm_company = jQuery('#bpm_new_account_company_name').val();
    var bpm_password = jQuery('#bpm_password_field').val();

    jQuery('#bpm_new_account_email').css("border","0px solid black");
    jQuery('#bpm_new_account_real_name').css("border","0px solid black");
    jQuery('#bpm_new_account_company_name').css("border","0px solid black");
    jQuery('#bpm_password_field').css("border","0px solid black");

    jQuery('#bpm_new_acct_error_alert').hide();

    var error_status = 0;
    if (bpm_email == '' || !bpm_validateEmail(bpm_email)){
        jQuery('#bpm_new_account_email').css("border","1px solid red");
        error_status = 1;
    }
    if (bpm_name == ''){
        jQuery('#bpm_new_account_real_name').css("border","1px solid red");
        error_status = 1;
    }
    if (bpm_company == ''){
        jQuery('#bpm_new_account_company_name').css("border","1px solid red");
        error_status = 1;
    }

    if(bpm_name == bpm_company && bpm_name.length > 0){
        error_status = 1;
        jQuery('#bpm_new_acct_error_alert').show();
    }
    if (bpm_password == ''){
        jQuery('#bpm_password_field').css("border","1px solid red");
        error_status = 1;
    }

    if(error_status) return;

    //all good - create the account
    jQuery('#bpm_page_loading_new_acct_button').hide();
    jQuery('#bpm_page_loading_new_acct_alert').show();

    var main_url = '';
    if(screen_name=='admin'){
        main_url = bpm_params.login_url;
    }else {
        var this_url = window.location.href.split('?');
        main_url = this_url[0];
    }

    var query_string = 'action=create_account&BPM_Email='+bpm_email+'&BPM_Password='+bpm_password+'&BPM_CompanyName='+bpm_company+'&BPM_FirstName='+bpm_name+'&token=f990d185-e7bf-11e4-b43f-878390a1d9ca0&url=' + main_url;

    jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', query_string, function (result) {
        bpm_login_status = Number(result.LOGGEDIN);

        if(bpm_login_status==1){
            //no errors
            if(screen_name=='admin'){
                //change html to go to intranet page
                jQuery('#bpm_admin_create_account').html('<a target="_blank" href="' + bpm_params.login_url + '">Go to your intranet</a>');
            }
            if(screen_name!='admin'){
                if (bpm_current_screen == 2) {
                    jQuery('#bpm_content_area').html(bpm_mobile_template);
                } else if (bpm_current_screen == 3) {
                    jQuery('#bpm_content_area').html(bpm_medium_template);
                } else {
                    jQuery('#bpm_content_area').html(bpm_template);
                }
                jQuery('#bpm_page_loading_alert').hide();
                bpm_build_page(result);
                bpm_update_dashboard();
            }
        }else{
            //some error occurred
            if(screen_name=='admin'){
                jQuery('#bpm_admin_create_account').html('An error occurred when trying to create your account');
            }else{
                jQuery('#bpm_page_loading_new_acct_button').show();
                var error_message = result.MESSAGE;
                error_message = error_message.replace(/ /g,'_');
                if(bpm_trans_array['bpm_lng_'+error_message]) {
                    jQuery('#bpm_new_acct_setup_alert').show().text(bpm_trans_array['bpm_lng_' + error_message]);
                }else{
                    jQuery('#bpm_new_acct_setup_alert').show().text(result.MESSAGE);
                }
                jQuery('#bpm_page_loading_new_acct_alert').hide();

            }
        }


    });


}

function bpm_refresh_page_loading(){

    bpm_scroll_top()

    if (bpm_reload_type == 1) {
        jQuery('#bpm_main_publishing_alert').show();
    } else if (bpm_reload_type == 2) {
        jQuery('#bpm_main_routing_alert').show();
    } else if (bpm_reload_type == 3) {
        jQuery('#bpm_context_loading_alert').show();
    } else if (bpm_reload_type == 4) {
        jQuery('#bpm_context_deleting_alert').show();
    } else {
        jQuery('#bpm_main_loading_alert').show();
    }
    bpm_reload_type = 0;

}

function bpm_update_dashboard(){

    jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + '&action=dashboard', function(dashboard){
        if(dashboard.LOGGEDIN==0) return;
 //       console.log('dashboard loaded');
        bpm_current_domain = dashboard.CURRENTCONTEXT;
        bpm_dashboard[0] = dashboard.BOOKMARKS;
        bpm_dashboard[1] = dashboard.MYHISTORY;
        bpm_dashboard[2] = dashboard.RECENT;
        bpm_dashboard[3] = dashboard.SUBSCRIBED;
        bpm_dashboard[4] = dashboard.DISCUSSIONS;
        bpm_dashboard[5] = dashboard.DIRECTORY;
        bpm_dashboard[12] = dashboard.NOTIFICATIONS;

        var talat_messages = '';
        if(bpm_dashboard[12]) {
            var total_messages = bpm_dashboard[12].wfdocs.length;
            if(bpm_dashboard[12].WORKFLOW_MESSAGES) talat_messages = bpm_dashboard[12].WORKFLOW_MESSAGES.length;
            jQuery('#bpm_talat_messages_count').text('(' + talat_messages + ')');
            jQuery('#left_talat_messages').show();
        }else{
            var total_messages = 0;
        }
        jQuery('#bpm_notification_count').text('(' + total_messages + ')');

        if(!talat_messages){
            jQuery('#left_talat_messages').hide();
        }

        jQuery('#bpm_subscription_count').text('(' + bpm_dashboard[3].length + ')');

        setInterval(function(){
           bpm_update_notifications();
        }, 300000);


    });
}

function bpm_update_history_button(){
    jQuery.each(bpm_text_history,function(index, value) {
        if(value){
            if(bpm_text_history[index].length > 1) {
                jQuery('#bpm_history_button_' + index).show();
            }else{
                jQuery('#bpm_history_button_'+index).hide();
            }
        }else{
            jQuery('#bpm_history_button_'+index).hide();
        }
    });
}
function bpm_save_password(){

    jQuery('#bpm_password_error').hide();

    var password = jQuery('#bpm_password_field').val();
    var password_conf = jQuery('#bpm_confirm_password_field').val();

    if(password != password_conf){
        //error - passwords do not match
        jQuery('#bpm_password_error').text('Passwords do not match').show();
        return;
    }

    if(password.length > 0) {
        var query_string = '&action=reset_password&password=' + password;

        jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + query_string, function (result) {
            jQuery('#bpm_reset_password_window').foundation('reveal', 'close');
        });
    }else{
        jQuery('#bpm_password_error').text('Please enter a password').show();
    }

}

function bpm_reshow_login(){

    jQuery('#bpm_error_message_5').hide();
    jQuery('#bpm_reset_password_4').hide();
    jQuery('#bpm_header_main_4').show();
}

function bpm_showGetPassword(){

    jQuery('#bpm_reset_password_4').show();
    jQuery('#bpm_header_main_4').hide();
}

function bpm_submitLogIn() {

    jQuery('#bpm_lost_password_message').show();
    jQuery('#bpm_error_message_4').hide();
    jQuery('#bpm_error_message_5').hide();

    var name = jQuery('#bpm_email_3').val();
    var pass = jQuery('#bpm_password1_4').val();
    var security = "private";

    jQuery("#bpm_password1_4").css("border","0px solid black");
    jQuery("#bpm_email_3").css("border","0px solid black");

    if (name == ''){
        jQuery("#bpm_email_3").css("border","1px solid red");
        return;
    }

    if (pass == ''){
        jQuery("#bpm_password1_4").css("border","1px solid red");
        return;
    }

    jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', 'act=login&BPM_Email='+name+'&BPM_Password='+pass+'&security='+security, function(result){
        bpm_validate_login(result.login);
    });
}

function bpm_validate_login(code) {

    if (code == '3' || code == '2' || code == '0') {
        location.reload();
    }else if (code == '999'){
        //bad password
        jQuery("#bpm_password1_4").css("border","1px solid red");
        bpm_showError(bpm_trans_array['bpm_lng_wrong_password'], 1);
    }else if( code == '500'){
        //bad email
        jQuery("#bpm_email_4").css("border","1px solid red");
        bpm_showError(bpm_trans_array['bpm_lng_wrong_email'],1);
    }else{
        //account disabled
        bpm_showError(bpm_trans_array['bpm_lng_account_disabled'],1);
    }
}

function bpm_showError(message, screenid){

    if(screenid==1) {
        jQuery('#bpm_error_message_4').text(message).show();
    }
    return false;
}

function bpm_logout_bpmcontext(){

    var this_url = window.location.href.split('?');
    var query_string = 'logout=1&url=' + this_url[0];

    jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', query_string, function(result){
        bpm_login_status = Number(result.login);

        var name = 'action=bpmcontext';
        var state = {name: name, page: 'BPMContext_Page'};
        window.history.pushState(state, "BPMContext", '?' + name);
        if(result.HASACCT == 1){
            jQuery('#bpm_create_account_button').hide();
        }
        bpm_show_login();
    });
}

function bpm_set_email(){

    if(jQuery('#bpm_email_forgot_4').val() != "") bpm_password_change(jQuery('#bpm_email_forgot_4').val());
}

function bpm_password_change(str){

    jQuery('#bpm_lost_password_message').show();
    jQuery('#bpm_error_message_6').hide();
    jQuery('#bpm_error_message_5').hide();

    jQuery.getJSON('https://'+server+'/ajax/forgot_password.php?callback=?', 'email='+str, function(result){

        if(result.email_result == '1'){
            jQuery('#bpm_error_message_6').show();
        }

        if(result.email_error){
            jQuery('#bpm_lost_password_message').hide();
            jQuery('#bpm_error_message_5').show();
        }
    });
}

function bpm_getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}