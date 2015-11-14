//this js library contains the functinos needed to support the left menu

function bpm_remove_talat_user(this_id){

    jQuery(bpm_talat_list).each(function(index, value){
        if (value === this_id) {
            bpm_talat_list.splice(index, 1);
            jQuery('#bpm_talat_user_' + this_id).remove();
        }
    });

    jQuery('#bpm_talat_user_'+this_id).remove();
}

function bpm_open_modal(selected_object) {

    bpm_is_loading = 0;

    jQuery('#bpm_widget_disc_bar').hide();
    jQuery('#bpm_widget_sub_bar').hide();
    jQuery('#bpm_page_type_tabs').hide();
    jQuery('#bpm_left_widget_content').show().html('');;
    jQuery('#bpm_left_customers_content').hide();
    jQuery('#bpm_left_suppliers_content').hide();
    jQuery('#bpm_account_manager').hide();

    switch (selected_object.id) {
        case 'left_prefmgr':
            if(bpm_is_loading==0) {
                bpm_is_loading = 1;

                jQuery('#bpm_left_widget_window').foundation('reveal', 'close');

                bpm_refresh_page_loading();

                jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', 'pageid='+bpm_my_page+'&action=bpmcontext', function (result) {
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

            break;
        case 'left_talat_messages':
            jQuery('#bpm_widget_title').html('<span class="fi-mail"></span>&nbsp;&nbsp;Messages');
            jQuery('#bpm_left_widget_content').html(bpm_make_talat_window());
            jQuery('#bpm_left_widget_window').foundation('reveal', 'open');
            break;
        case 'left_bpmmgr':
            jQuery('#bpm_widget_title').html('<span class="fa fa-tachometer"></span>&nbsp;BPM Admin');

            jQuery('#bpm_left_widget_window').foundation('reveal', 'open');
            break;
        case 'left_notifications':

            jQuery('#bpm_widget_title').html('<span class="fa fa-bell-o"></span>&nbsp;&nbsp;Notifications');
            if(bpm_dashboard[12].wfdocs.length > 0 || bpm_dashboard[12].DRAFTS.length > 0) {
                jQuery('#bpm_left_widget_content').html(bpm_make_notifications_window());
                jQuery('#'+bpm_first_notification).parent().addClass('active');
                jQuery('#'+bpm_first_notification).click();
            }else {
                jQuery('#bpm_left_widget_content').text(bpm_trans_array['bpm_lng_message_up_to_date']);
            }
            jQuery('#bpm_left_widget_window').foundation('reveal', 'open');
            break;
        case 'left_logout':
            bpm_logout_bpmcontext();
            return;
            break;
        case 'bpm_toolbar_talat':
            var suggestions = [];
            bpm_talat_list = [];
            jQuery('.bpm_talat_user').remove();
            jQuery('#bpm_talat_alert').hide();
            bpm_dashboard[98] = null;
            jQuery('#bpm_talat_window').foundation('reveal', 'open');
            jQuery('#bpm_form_talat').on('keyup keypress', function(e) {
                var code = e.keyCode || e.which;
                if (code == 13) {
                    e.preventDefault();
                    return false;
                }
            });
            jQuery('#bpm_talat_window').css('max-height', jQuery('#bpm_talat_window').css('height'));

            jQuery.each(bpm_dashboard[99], function(i, val) {
                suggestions.push({ label: val.real_name, value: val.user_id });

            });

            //jQuery('#bpm_talat_to').css('z-index','1016');
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
                            span = jQuery("<span>").text(' '+ ui.item.label).prop('id', 'bpm_talat_user_' + ui.item.value).addClass("bpm_talat_user"),
                            a = jQuery("<a>").addClass("remove").attr({
                                onclick: "bpm_remove_talat_user(" + ui.item.value + ")",
                                title: "Remove " + ui.item.label
                            }).text(" x ").appendTo(span);
                        span.insertBefore("#bpm_talat_list");
                        bpm_talat_list.push(ui.item.value);
                        jQuery('#bpm_talat_alert').html('').hide();
                        jQuery('#bpm_talat_send_group').show();
                    }

                },
                close: function(){
                    jQuery("#bpm_talat_to").val('');
                },
            change: function() {
                jQuery("#bpm_talat_to").val("").css("top", 2);
            }
            });

            break;
        case 'left_bookmarks':
            jQuery('#bpm_widget_title').html('<span class="fi-bookmark"></span>&nbsp;&nbsp;Bookmarks');
            jQuery('#bpm_left_widget_content').html(bpm_make_left_report(bpm_dashboard[0],'bookmarks'));
            jQuery('#bpm_left_widget_window').foundation('reveal', 'open');
            break;
        case 'left_history':
            jQuery('#bpm_widget_title').html('<span class="fa fa-history"></span>&nbsp;&nbsp;My History');
            jQuery('#bpm_left_widget_content').html(bpm_make_left_report(bpm_dashboard[1]));
            jQuery('#bpm_left_widget_window').foundation('reveal', 'open');
            break;
        case 'left_recent':
            jQuery('#bpm_widget_title').html('<span class="fi-clock"></span>&nbsp;&nbsp;Recent Activity');
            jQuery('#bpm_left_widget_content').html(bpm_make_left_report(bpm_dashboard[2],'recent'));
            jQuery('#bpm_left_widget_window').foundation('reveal', 'open');
            break;
        case 'left_subscriptions':
            jQuery('#bpm_widget_title').html('<span class="fi-mail"></span>&nbsp;&nbsp;'+bpm_trans_array['bpm_lng_subscriptions']);
            var page_links = bpm_make_left_report(bpm_dashboard[3]);
            jQuery('#bpm_left_widget_content').html(page_links);
            if(page_links){
                jQuery('#bpm_widget_title').html('<span class="fi-mail"></span>&nbsp;&nbsp;'+bpm_trans_array['bpm_lng_subscriptions']+'&nbsp;&nbsp;<a class="bpm_nodecoration fi-widget bpm_links" style="font-size: .4em" onclick="bpm_left_action('+"'bpm_clear_all_subs'"+');">&nbsp;'+ bpm_trans_array['bpm_lng_clear_all'] +'</a>&nbsp;<a id="bpm_sub_config_link" class="bpm_nodecoration bpm_links" style="font-size: .4em" onclick="bpm_left_action('+"'bpm_configure_subs'"+');">&nbsp;'+ bpm_trans_array['bpm_lng_configure'] +'</a>&nbsp;<span id="bpm_sub_config_message" class="hide" style="font-size: .5em;color:green;">'+bpm_trans_array['bpm_lng_saved']+'</span>');
                jQuery('#bpm_widget_disc_bar').hide();
                jQuery('#bpm_widget_sub_bar').show();
            }else{
                jQuery('#bpm_widget_title').html('<span class="fi-mail"></span>&nbsp;&nbsp;'+bpm_trans_array['bpm_lng_subscriptions']+'&nbsp;&nbsp;<a id="bpm_sub_config_link" class="bpm_nodecoration fi-widget bpm_links" style="font-size: .4em" onclick="bpm_left_action('+"'bpm_configure_subs'"+');">&nbsp;'+ bpm_trans_array['bpm_lng_configure'] +'</a>&nbsp;<span id="bpm_sub_config_message" class="hide" style="font-size: .5em;color:green;">'+bpm_trans_array['bpm_lng_saved']+'</span>');
                jQuery('#bpm_left_widget_content').html(bpm_trans_array['bpm_lng_message_up_to_date']);
            }
            jQuery('#bpm_left_widget_window').foundation('reveal', 'open');
            break;
        case 'left_discussions':
            jQuery('#bpm_widget_title').html('<span class="fi-comment"></span>&nbsp;&nbsp;Discussions');
            var page_links = bpm_get_discussion_list(bpm_dashboard[4], 'none');
            if(!page_links){
                page_links = bpm_trans_array['bpm_lng_no_discussions'];
            }
            jQuery('#bpm_left_widget_content').html(page_links);
            jQuery('#bpm_left_widget_window').foundation('reveal', 'open');
            break;
        case 'left_directory':
            jQuery('#bpm_widget_title').html('<span class="fi-torsos-all"></span>&nbsp;&nbsp;Directory');
            var page_links = bpm_make_directory(bpm_dashboard[5]);
            jQuery('#bpm_left_widget_content').html(page_links);
            jQuery('#bpm_left_widget_window').foundation('reveal', 'open');
            break;
        case 'left_pagetypes':
            jQuery('#bpm_widget_title').html('<span class="fi-page-multiple"></span>&nbsp;&nbsp;Page Types');

            if(!bpm_dashboard[6]) {
                //show loading overview
                jQuery('#bpm_left_widget_content').html(bpm_trans_array['bpm_lng_loading']+'...');
                jQuery('#bpm_left_widget_window').foundation('reveal', 'open');

                jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + '&action=dashboard_ptl', function (dashboard) {

                    bpm_current_domain = dashboard.CURRENTCONTEXT;
                    if (dashboard.LOGGEDIN == '1') {
                        bpm_dashboard[6] = [];
                        bpm_dashboard[7] = [];
                        if(dashboard.PTLTAGGED) bpm_dashboard[6] = dashboard.PTLTAGGED;
                        if(dashboard.PTLALL) bpm_dashboard[7] = dashboard.PTLALL;
                        jQuery('#bpm_left_widget_content').hide();
                        jQuery('#bpm_page_type_tabs_content').show().html(bpm_page_type_tabs());
                        jQuery('#bpm_page_type_tabs').show();
                    }
                });
            }else {
                jQuery('#bpm_left_widget_content').hide();
                jQuery('#bpm_page_type_tabs_content').show().html(bpm_page_type_tabs());
                jQuery('#bpm_page_type_tabs').show();
                jQuery('#bpm_left_widget_window').foundation('reveal', 'open');
            }
            break;
        case 'left_customers':
            jQuery('#bpm_widget_title').html('<span class="fi-torsos"></span>&nbsp;&nbsp;Customers');
            if(!bpm_dashboard[8] || bpm_dashboard[9]) {
                jQuery('#bpm_left_widget_content').html(bpm_trans_array['bpm_lng_loading']+'...');
                jQuery('#bpm_left_widget_window').foundation('reveal', 'open');

                jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + '&action=dashboard_cust', function (dashboard) {
                    bpm_current_domain = dashboard.CURRENTCONTEXT;
                    if (dashboard.LOGGEDIN == '1') {
                        bpm_dashboard[8] = dashboard.LIST['listinfo'];
                        bpm_dashboard[9] = dashboard.CONTACT['listinfo'];
                        jQuery('#bpm_left_widget_content').hide();
                        jQuery('#bpm_left_customers_tab_content').show().html(bpm_cust_supp_tabs(1));
                        jQuery('#bpm_left_customers_content').show();
                        bpm_set_url_links();
                    }
                });
            }else {

                jQuery('#bpm_left_widget_content').hide();
                jQuery('#bpm_left_customers_tab_content').show().html(bpm_cust_supp_tabs(1));
                jQuery('#bpm_left_customers_content').show();
            }
            break;
        case 'left_suppliers':
            jQuery('#bpm_widget_title').html('<span class="fi-torsos"></span>&nbsp;&nbsp;Suppliers');
            if(!bpm_dashboard[10] || bpm_dashboard[11]) {
                jQuery('#bpm_left_widget_content').html(bpm_trans_array['bpm_lng_loading']+'...');
                jQuery('#bpm_left_widget_window').foundation('reveal', 'open');

                jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + '&action=dashboard_supplier', function (dashboard) {
                    bpm_current_domain = dashboard.CURRENTCONTEXT;
                    if (dashboard.LOGGEDIN == '1') {
                        bpm_dashboard[10] = dashboard.LIST['listinfo'];
                        bpm_dashboard[11] = dashboard.CONTACT['listinfo'];
                        jQuery('#bpm_left_widget_content').hide();
                        jQuery('#bpm_left_suppliers_tab_content').show().html(bpm_cust_supp_tabs(2));
                        jQuery('#bpm_left_suppliers_content').show();
                        bpm_set_url_links();
                    }
                });
            }else {

                jQuery('#bpm_left_widget_content').hide();
                jQuery('#bpm_left_suppliers_content').show().html(bpm_cust_supp_tabs(2));
                jQuery('#bpm_left_suppliers_content').show();
            }
            break;
        case 'left_quick_docs':
            jQuery('#bpm_widget_title').html('<span class="fi-plus"></span>&nbsp;&nbsp;Quick Docs&nbsp;&nbsp;<a class="bpm_nodecoration fi-widget bpm_links" style="font-size: .4em" id="bpm_create_quick_doc_0" onclick="bpm_create_quick_doc_target(this);">&nbsp;'+ bpm_trans_array['bpm_lng_add_remove'] +'</a>&nbsp;<span id="bpm_config_message" class="hide" style="font-size: .5em;color:green;">'+bpm_trans_array['bpm_lng_saved']+'</span> ');
            jQuery('#bpm_left_widget_content').html(bpm_create_quick_docs());

            jQuery('#bpm_left_widget_window').foundation('reveal', 'open');
            break;
        case 'left_acctmgr':
            bpm_set_admin_buttons();

            jQuery('#bpm_widget_title').html('<span class="fi-widget"></span>&nbsp;&nbsp;Account Manager');
            jQuery('#bpm_left_widget_content').hide();
            jQuery('#bpm_left_widget_window').foundation('reveal', 'open');
            jQuery('#bpm_acct_manager_users').click();
            jQuery('#bpm_account_manager').show();

            break;
        case 'left_prefmgr':
            jQuery('#bpm_widget_title').html('<span class="fi-widget"></span>&nbsp;&nbsp;My Preferences');
            jQuery('#bpm_left_widget_window').foundation('reveal', 'open');
            jQuery('#bpm_left_widget_content').html(jQuery('#bpm_pref_manager').html());

            break;
        default:
            jQuery('#bpm_left_widget_window').foundation('reveal', 'open');
            jQuery('#bpm_left_widget_content').html("test content " + selected_object.id);
    }

    bpm_set_url_links();

}

function bpm_set_admin_buttons(){
    jQuery('#bpm_acct_manager_cart_item').hide();
    jQuery.each(bpm_settings['acctmgr'], function (index, value) {
        if (value['cart_qty']) {
            jQuery('#bpm_acct_manager_cart_item').show();
        }
    });
}

function bpm_add_talat_users(selected_process){

    if(selected_process==2){
        jQuery("#bpm_upload_talat_to").autocomplete("search", " ");
    }else {
        jQuery("#bpm_talat_to").autocomplete("search", " ");
    }
}

function bpm_create_notifications_target(selected_object){

    var this_html = '';

    if(selected_object == '999999') {
        jQuery.each(bpm_dashboard[12].WORKFLOW_MESSAGES, function (index, value) {
            this_html = this_html.concat('<div class="bpm-row">');
            this_html = this_html.concat('  <div class="bpm-small-12 bpm-large-12 bpm-columns text-left"><a class="url_links grid_links bpm_links bpm_text_medium" href="?pageid=' + value['page_id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['page_title'] + '">' + value['page_title'] + '</a></div>');
            this_html = this_html.concat('</div>');
        });
    }else if(selected_object == '999998'){
        jQuery.each(bpm_dashboard[12].DRAFTS, function (index, value) {
            this_html = this_html.concat('<div class="bpm-row">');
            this_html = this_html.concat('  <div class="bpm-small-12 bpm-large-12 bpm-columns text-left"><a class="url_links grid_links bpm_links bpm_text_medium" href="?pageid=' + value['page_id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['page_title'] + '">' + value['page_title'] + '</a></div>');
            this_html = this_html.concat('</div>');
        });
    }else {
        jQuery.each(bpm_dashboard[12].wfdocs, function (index, value) {
            if (value['template_index'] == selected_object && value['wfm_status'] > 0) {
                this_html = this_html.concat('<div class="bpm-row">');
                this_html = this_html.concat('  <div class="bpm-small-12 bpm-large-12 bpm-columns text-left"><a class="url_links grid_links bpm_links bpm_text_medium" href="?pageid=' + value['page_id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['page_title'] + '">' + value['page_title'] + '</a></div>');
                this_html = this_html.concat('</div>');
            }
        });
    }

    jQuery('#bpm_notification_target').html(this_html);
    bpm_set_url_links();
}

function bpm_SortByName(a, b){
    var aName = a.name.toLowerCase();
    var bName = b.name.toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

function bpm_make_talat_window(){

    var this_html = '<div class="bpm-row full-width" style="margin-bottom:5px;max-height:400px;overflow-x:hidden">';
    jQuery.each(bpm_dashboard[12].WORKFLOW_MESSAGES, function (index, value) {


        if(value['recipients'].length > 0) {
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

        this_html = this_html.concat('<div class="bpm-row ">');
        this_html = this_html.concat('  <div id="bpm_talat_message_item_'+value['id']+'" class="bpm-small-12 bpm-large-12 bpm-columns">');

        this_html = this_html.concat('<div class="bpm-row">');
        this_html = this_html.concat('  <div class="bpm-small-12 bpm-large-12 bpm-columns text-left"><a class="url_links grid_links bpm_links bpm_text_medium" href="?pageid=' + value['page_id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['page_title'] + '">' + value['page_title'] + '</a></div>');;
        this_html = this_html.concat('</div>');

        this_html = this_html.concat('<div class="bpm-row">');
        this_html = this_html.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-left">');

        this_html = this_html.concat('<div class="bpm-row">');
        this_html = this_html.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left">' + value['real_name'] + '</div>');
        this_html = this_html.concat('</div>');

        this_html = this_html.concat('<div class="bpm-row">');
        this_html = this_html.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left">&nbsp;</div>');
        this_html = this_html.concat('</div>');

        this_html = this_html.concat('<div class="bpm-row">');
        this_html = this_html.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left">' + value['send_date'] + '</div>');
        this_html = this_html.concat('</div>');

        this_html = this_html.concat('</div>');

        this_html = this_html.concat('<div class="bpm-small-7 bpm-large-7 bpm-columns text-left">');
        this_html = this_html.concat('<div class="bpm-row">');
        this_html = this_html.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left" id="bpm_talat_message_text_' + value['id'] + '">' + value['message'] + '</div>');
        this_html = this_html.concat('</div>');

        this_html = this_html.concat('</div>');

        this_html = this_html.concat('<div class="bpm-small-2 bpm-large-2 bpm-columns text-left">');

        this_html = this_html.concat('<div class="bpm-row">');
        this_html = this_html.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left"><a class="bpm_versions_button bpm_nodecoration" onclick="bpm_talat_reply(0, '+ value['id'] + ', ' + value['page_id'] +')">Reply</a></div>');
        this_html = this_html.concat('</div>');
        this_html = this_html.concat('<div class="hide" id="bpm_talat_reply_to_'+value['id']+'">'+value['uad_user_id']+'</div>')

        if(reply_all) {
            this_html = this_html.concat('<div class="bpm-row">');
            this_html = this_html.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left"><a class="bpm_versions_button bpm_nodecoration" onclick="bpm_talat_reply(1, '+ value['id']  + ', ' + value['page_id'] +')">Reply All</a></div>');
            this_html = this_html.concat('</div>');
            this_html = this_html.concat('<div class="hide" id="bpm_talat_reply_all_'+value['id']+'">'+reply_all+'</div>')

        }

        this_html = this_html.concat('<div class="bpm-row">');
        this_html = this_html.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left"><a class="bpm_versions_button bpm_nodecoration" onclick="bpm_talat_dismiss('+ value['id']  + ', ' + value['page_id'] +')">Dismiss</a></div>');
        this_html = this_html.concat('</div>');
        this_html = this_html.concat('</div>');

        this_html = this_html.concat('</div>');

        if(value['recipients'].length > 0) {

            this_html = this_html.concat('<div class="bpm-row">');
            this_html = this_html.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left">' + recipients + '</div>');
            this_html = this_html.concat('</div>');
        }
        this_html = this_html.concat('</div>');
        this_html = this_html.concat('</div>');

        this_html = this_html.concat('<hr class="bpm_hr_gray">');
    });
    this_html = this_html.concat('</div>');

    return this_html;
}

function bpm_make_notifications_window(){

    var this_html = '';
    bpm_first_notification = '';

    this_html = this_html.concat('<div class="bpm-row full-width" style="margin-bottom:5px;max-height:400px;">');
    this_html = this_html.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-left">');
    this_html = this_html.concat('<ul class="side-nav">');

    if(bpm_dashboard[12].DRAFTS) {
        if(bpm_dashboard[12].DRAFTS.length > 0) {
            if (bpm_first_notification.length == 0) bpm_first_notification = 'bpm_create_notification_999998';
            this_html = this_html.concat(' <li>');
            this_html = this_html.concat('<a class="bpm_nodecoration  side-nav-item" id="bpm_create_notification_999998" onclick="bpm_create_notifications_target(999998);">' + bpm_trans_array['bpm_lng_drafts'] + ' &nbsp;(' + bpm_dashboard[12].DRAFTS.length + ')</a>');
            this_html = this_html.concat('</li>');
        }
    }

    jQuery.each(bpm_dashboard[12].wfdocstotals,function(index, value) {
        if (bpm_first_notification.length == 0) bpm_first_notification = 'bpm_create_notification_' + value['id'];
        var this_count = '';
        if (value['totalrecs']) {
            this_count = '(' + value['totalrecs'] + ')';
            this_html = this_html.concat(' <li>');
            this_html = this_html.concat('<a class="bpm_nodecoration  side-nav-item" id="bpm_create_notification_' + value['id'] + '" onclick="bpm_create_notifications_target(' + value['id'] + ');">' + value['name'] + '&nbsp;' + this_count + '</a>');
            this_html = this_html.concat('</li>');
        }
    });

    this_html = this_html.concat('</ul>');

    this_html = this_html.concat('</div>'); //end of left column div

    this_html = this_html.concat('<div class="bpm-small-9 bpm-large-9 bpm-columns bpm_gray_border" id="bpm_notification_target">');

    this_html = this_html.concat('</div>'); //end of right column div
    this_html = this_html.concat('</div>');

    return this_html;

}

function bpm_make_subscriptions_window(){

    var this_html = '';

    this_html = this_html.concat('<div class="bpm-row full-width" style="margin-bottom:5px;max-height:400px;">');
    this_html = this_html.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns">');
    this_html = this_html.concat('<ul class="side-nav">');

    jQuery.each(bpm_dashboard[3],function(index, value) {
        this_html = this_html.concat(' <li class="bpm_ul_li">');
        this_html = this_html.concat('<a class="bpm_nodecoration" id="bpm_create_subscription_' + value['id'] + '" onclick="bpm_create_notifications_target('+value['id']+');">' + value['name'] + '&nbsp;('+value['totalrecs']+')</a>');
        this_html = this_html.concat('</li>');

    });

    this_html = this_html.concat('</ul>');

    this_html = this_html.concat('</div>'); //end of left column div

    this_html = this_html.concat('<div class="bpm-small-9 bpm-large-9 bpm-columns bpm_gray_border" id="bpm_notification_target">');

    this_html = this_html.concat('</div>'); //end of right column div
    this_html = this_html.concat('</div>');

    return this_html;

}

function bpm_create_quick_docs(){

    var this_html = '';

    this_html = this_html.concat('<div class="bpm-row full-width" style="margin-bottom:5px;max-height:400px;">');
    this_html = this_html.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-left">');
    this_html = this_html.concat('<ul class="side-nav" id="bpm_quick_docs_list">');

    jQuery.each(bpm_quick_docs,function(index, value) {
        this_html = this_html.concat(' <li class="bpm_ul_li">');
        this_html = this_html.concat('<a class="bpm_nodecoration side-nav-item " id="bpm_create_quick_doc_' + value['id'] + '" onclick="bpm_create_quick_doc_target(this);">' + value['name'] + '</a>');
        this_html = this_html.concat('</li>');
    });

    this_html = this_html.concat('</ul>');

    this_html = this_html.concat('</div>'); //end of left column div

    this_html = this_html.concat('<div class="bpm-small-9 bpm-large-9 bpm-columns bpm_gray_border" id="bpm_quick_doc_target" style="height:330px;overflow: auto;">');

    this_html = this_html.concat('<div class="bpm-row">');
    this_html = this_html.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns">&nbsp;</div>');
    this_html = this_html.concat('<div class="bpm-large-10 bpm-small-10 bpm-columns text-left" style="height:100px;">' + jQuery('#bpm_quick_docs_message').text() + '</div>');
    this_html = this_html.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns">&nbsp;</div>');
    this_html = this_html.concat('</div>');

    this_html = this_html.concat('</div>'); //end of right column div
    this_html = this_html.concat('<div class="bpm-small-9 bpm-large-9 bpm-columns bpm_gray_border hide" id="bpm_quick_doc_target_message" ><br>' + bpm_trans_array['bpm_lng_quick_doc_parents'] + '</div>');
    this_html = this_html.concat('</div>');

    return this_html;
}

function bpm_create_quick_docs_config(){

    var new_page_string = '&action=get_quick_doc_config';
    var html_string = '';

    jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + new_page_string, function (result) {

        if (result) {

            jQuery.each(result['QUICKDOCS'],function(index, value) {

                html_string = html_string.concat('<div class="bpm-row full-width">');
                html_string = html_string.concat('<div class="bpm-small-10 bpm-large-10 bpm-columns text-left">' + value['template_name'] + '</div>');
                if(value['quick_doc_id']) {
                    html_string = html_string.concat('<div class="bpm-small-2 bpm-large-2 bpm-columns text-right"><input onclick="bpm_add_to_quick_doc_list(' + value['template_index'] + ',' + value['section_index'] + ')" type="checkbox" id="bpm_quick_doc_select_' + value['template_index'] + '" value="bpm_quick_doc_select_' + value['template_index']+'" checked></div>');
                }else{
                    html_string = html_string.concat('<div class="bpm-small-2 bpm-large-2 bpm-columns text-right"><input onclick="bpm_add_to_quick_doc_list(' + value['template_index'] + ',' + value['section_index'] + ')" type="checkbox" id="bpm_quick_doc_select_' + value['template_index'] + '" value="bpm_quick_doc_select_' + value['template_index']+'" ></div>');
                }
                html_string = html_string.concat('</div>');

            });

            jQuery('#bpm_quick_doc_target').html(html_string);
            jQuery('#bpm_quick_doc_target_message').show();
        }
    });

}

function bpm_add_to_quick_doc_list(selected_template, selected_section){

    var this_state = 'false';
    var n = jQuery( '#bpm_quick_doc_select_' + selected_template + ':checked' ).length;
    if(n) this_state = 'true';
    var this_html = '';

    var new_page_string = '&action=save_quick_docs&template_id=' + selected_template + '&sec_ids=' + selected_section + '&state=' + this_state;

    jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + new_page_string, function (result) {

        if (result) {
            jQuery('#bpm_config_message').hide();

            //reload the dashboard array
            bpm_quick_docs = result.QUICKDOCS;

            //add or remove from the quick docs list
            jQuery.each(bpm_quick_docs,function(index, value) {
                this_html = this_html.concat(' <li>');
                this_html = this_html.concat('<a class="bpm_nodecoration side-nav-item" id="bpm_create_quick_doc_' + value['id'] + '" onclick="bpm_create_quick_doc_target(this);">' + value['name'] + '</a>');
                this_html = this_html.concat('</li>');
            });

            jQuery('#bpm_config_message').show().fadeOut(2000);
            jQuery('#bpm_quick_docs_list').html(this_html);

        }
        bpm_set_url_links();
    });

}

function bpm_create_quick_doc_target(selected_object){

    var this_html = '';
    var this_dropdown = '';
    var show_dropdown = 1;
    var hidden_field = '';
    var this_id = selected_object.id.substr(21);

    bpm_current_create_page = this_id;

    jQuery('#bpm_quick_doc_target_message').hide();

    if(bpm_current_create_page == 0){
        bpm_create_quick_docs_config();
        return '';
    }

    var new_page_string = '&action=get_quick_doc_parents&docid=' + bpm_current_create_page;

    jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + new_page_string, function (result) {

        if(result) {

            bpm_page_naming[this_id] = result['PAGENAMING'];

            //setup template title
            this_html = this_html.concat('<div class="bpm-row full-width" style="margin-bottom:15px;">');
            this_html = this_html.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left">');
            this_html = this_html.concat('<span class="bpm_bold">'+jQuery('#bpm_create_quick_doc_'+this_id).text()+'</span>');
            this_html = this_html.concat('</div>');
            this_html = this_html.concat('</div><br><br>');

            //setup parent page selector
            this_dropdown = this_dropdown.concat('<div class="bpm-row full-width">');
            this_dropdown = this_dropdown.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left">');
            this_dropdown = this_dropdown.concat('Select Parent Page');
            this_dropdown = this_dropdown.concat('<select id="bpm_quick_doc_page_id">');

            jQuery.each(result['PAGEINFO'],function(index, value) {
                this_dropdown = this_dropdown.concat('<option value="' + value['page_id'] + '">' + value['page_title'] + '</option>');
                if(value['main_page']==25) {
                    show_dropdown = 0;
                    hidden_field = '<input type="hidden" value="' + value['page_id'] + '" id="bpm_quick_doc_page_id">';
                }
            });

            this_dropdown = this_dropdown.concat('</select>');
            this_dropdown = this_dropdown.concat('</div>');
            this_dropdown = this_dropdown.concat('</div><br>');

            if(show_dropdown==1){
                this_html = this_html.concat(this_dropdown);
            }else{
                this_html = this_html.concat(hidden_field);
            }

            //setup fields selector
            this_html = this_html.concat('<div class="bpm-row full-width" style="margin-bottom:2em">');
            this_html = this_html.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left">');
            this_html = this_html.concat(bpm_create_add_page_name(bpm_page_naming[this_id], 1));
            this_html = this_html.concat('</div>');
            this_html = this_html.concat('</div>');

            //setup send button
            var bpm_quick_doc_buttons = '<br><br><div class="bpm-row full-width">';
            bpm_quick_doc_buttons = bpm_quick_doc_buttons.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left">');
            bpm_quick_doc_buttons = bpm_quick_doc_buttons.concat('<div class="bpm-row" style="margin-bottom:5px;">');
            bpm_quick_doc_buttons = bpm_quick_doc_buttons.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns">&nbsp;</div>');
            bpm_quick_doc_buttons = bpm_quick_doc_buttons.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns text-right">');
            bpm_quick_doc_buttons = bpm_quick_doc_buttons.concat('<a id="bpm_quick_docs_add_page_button" onclick="bpm_create_new_page(1,1);" class="button bpm_nodecoration small" >' + bpm_trans_array['bpm_lng_create_draft']+ '</a>');
            bpm_quick_doc_buttons = bpm_quick_doc_buttons.concat('</div>');
            bpm_quick_doc_buttons = bpm_quick_doc_buttons.concat('</div>');
            bpm_quick_doc_buttons = bpm_quick_doc_buttons.concat('</div>');
            bpm_quick_doc_buttons = bpm_quick_doc_buttons.concat('</div>');

            this_html = this_html.concat(bpm_quick_doc_buttons);

            jQuery('#bpm_quick_doc_target').html(this_html);

            jQuery('#quick_doc_publish_on_create').click(function() {
                var $this = jQuery(this);
                if ($this.is(':checked')) {
                    // the checkbox was checked
                    jQuery('#bpm_quick_docs_add_page_button').text(bpm_trans_array['bpm_lng_publish']);
                } else {
                    // the checkbox was unchecked
                    jQuery('#bpm_quick_docs_add_page_button').text(bpm_trans_array['bpm_lng_create_draft']);
                }
            });
        }else{
            this_html = this_html.concat('<div class="bpm-row full-width">');
            this_html = this_html.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left">');
            this_html = this_html.concat('<No parent pages for this template type.');
            this_html = this_html.concat('</div>');
            this_html = this_html.concat('</div>');
            jQuery('#bpm_quick_doc_target').html(this_html);
        }
    });

}

function bpm_cust_supp_tabs( type){

    var tab_1, tab_2, content_1, content_2;
    tab_1 = 'bpm_left_customers_loc';
    tab_2 = 'bpm_left_customers_contact';

    if(type == 1){
        content_1 = bpm_dashboard[8];
        content_2 = bpm_dashboard[9];
    }else{
        content_1 = bpm_dashboard[10];
        content_2 = bpm_dashboard[11];
    }

    var tab_content = '';

    tab_content = tab_content.concat('<div class="content active" id="' + tab_1 + '" style="min-height:300px;max-height:250px;width:100%">');
    tab_content = tab_content.concat(bpm_make_cust_supplier_list(content_1, 1, type));
    tab_content = tab_content.concat('</div>');
    tab_content = tab_content.concat(' <div class="content" id="' + tab_2 + '" style="min-height:300px;max-height:250px;">');
    tab_content = tab_content.concat(bpm_make_cust_supplier_list(content_2, 2, type));
    tab_content = tab_content.concat('</div>');
    //tab_content = tab_content.concat('</div>');

    return tab_content;

}

function bpm_make_cust_supplier_list(this_list, list_type, c_or_s){

    var tag_content = '';
    if(list_type==1){
        if(!this_list && c_or_s==1) return bpm_trans_array['bpm_lng_no_cust'];
        if(!this_list && c_or_s==2) return bpm_trans_array['bpm_lng_no_supp'];
        //make location list
        jQuery.each(this_list,function(index, value) {
            tag_content = tag_content.concat('<div class="bpm-row full-width">');
            tag_content = tag_content.concat('  <div class="bpm-small-12 bpm-large-12 bpm-columns text-left"><a class="grid_links url_links bpm_links" href="?pageid=' + value['companyid'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['company'] + '">' + value['company'] + '</a></div>');
            tag_content = tag_content.concat('</div>');
        });
    }else{
        if(!this_list && c_or_s==1) return bpm_trans_array['bpm_lng_no_cust'];
        if(!this_list && c_or_s==2) return bpm_trans_array['bpm_lng_no_supp'];
        //make contact list

        tag_content = tag_content.concat('<div class="bpm-row">');
        tag_content = tag_content.concat('  <div class="bpm-small-3 bpm-large-3 bpm-columns bpm_bold text-left">' + bpm_trans_array['bpm_lng_name'] + '</div>');
        tag_content = tag_content.concat('  <div class="bpm-small-3 bpm-large-3 bpm-columns text-left">' + bpm_trans_array['bpm_lng_company'] + '</div>');
        tag_content = tag_content.concat('  <div class="bpm-small-2 bpm-large-2 bpm-columns text-left" >' + bpm_trans_array['bpm_lng_title'] + '</div>');
        tag_content = tag_content.concat('  <div class="bpm-small-2 bpm-large-2 bpm-columns text-left" >' + bpm_trans_array['bpm_lng_phone'] + '</div>');
        tag_content = tag_content.concat('  <div class="bpm-small-2 bpm-large-2 bpm-columns text-left" >' + bpm_trans_array['bpm_lng_email'] + '</div>');
        tag_content = tag_content.concat('</div>');

        jQuery.each(this_list,function(index, value) {
            var title = '&nbsp;';
            var email = '&nbsp;';
            var phone = '&nbsp;';
            if(value['contactTitle']) title = '<span class="span_text">' + value['contactTitle'] + '</span>';
            if(value['contactPhone']) phone = '<span class="span_text">' + value['contactPhone'] + '</span>';
            if(value['contactEmail']) email = '<a class="grid_links bpm_links" href="mailto:' + value['contactEmail'] + '">Email</a>';

            if(value['contactName']) {
                tag_content = tag_content.concat('<div class="bpm-row">');
                tag_content = tag_content.concat('  <div class="bpm-small-3 bpm-large-3 bpm-columns text-left"><a class="url_links grid_links bpm_links" href="?pageid=' + value['contactid'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['contactName'] + '">' + value['contactName'] + '</a></div>');
                tag_content = tag_content.concat('  <div class="bpm-small-3 bpm-large-3 bpm-columns text-left"><a class="url_links grid_links bpm_links" href="?pageid=' + value['parentid'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['company'] + '">' + value['company'] + '</a></div>');
                tag_content = tag_content.concat('  <div class="bpm-small-2 bpm-large-2 bpm-columns text-left" >' + title + '</div>');
                tag_content = tag_content.concat('  <div class="bpm-small-2 bpm-large-2 bpm-columns text-left" >' + phone + '</div>');
                tag_content = tag_content.concat('  <div class="bpm-small-2 bpm-large-2 bpm-columns text-left" >' + email + '</div>');
                tag_content = tag_content.concat('</div>');
            }
        });

    }

    return tag_content;
}

function bpm_page_type_tabs(){

    var page_types = '';
    jQuery('#bpm_tab_list').hide();
    jQuery('#bpm_tab_tagged').hide();
    jQuery('#bpm_page_types_fav').hide();

    if(bpm_dashboard[6].length > 0){
        page_types = page_types.concat('<div class="content active" id="bpm_page_types_fav" style="height:300px;width:100%">');
        jQuery('#bpm_tab_tagged').addClass('active ').show();
        jQuery('#bpm_tab_all').removeClass('active ');
        page_types = page_types.concat(bpm_make_page_type_list(bpm_dashboard[6]));
        page_types = page_types.concat('</div>');
        page_types = page_types.concat(' <div class="content" id="bpm_page_types_all" style="min-height:300px;max-height:300px;">');
        if(bpm_dashboard[7].length > 0) page_types = page_types.concat(bpm_make_page_type_list(bpm_dashboard[7]));
        page_types = page_types.concat('</div>');
    }else {
        page_types = page_types.concat(' <div class="content active" id="bpm_page_types_all" style="min-height:300px;max-height:300px;">');
        if (bpm_dashboard[7].length > 0) page_types = page_types.concat(bpm_make_page_type_list(bpm_dashboard[7]));
        page_types = page_types.concat('</div>');
    }
    page_types = page_types.concat(' <div class="content" id="bpm_page_types_res" style="min-height:300px;max-height:300px;">');
    page_types = page_types.concat(' ');
    page_types = page_types.concat('</div>');

    return page_types;
}

function bpm_load_page_type(this_id){

    var this_html = '';

//    jQuery('#bpm_page_types_res').show();

    jQuery('#bpm_tab_all').removeClass('active ');
    jQuery('#bpm_tab_tagged').removeClass('active ');
    jQuery('#bpm_tab_list').addClass('active ').show();

    jQuery('#bpm_page_types_all').removeClass('active');
    jQuery('#bpm_page_types_fav').removeClass('active');
    jQuery('#bpm_page_types_res').addClass('active').show();

    jQuery('#bpm_tab_list').click();

    jQuery('#bpm_page_types_res').html(bpm_trans_array['bpm_lng_loading'] + '...');

    var new_page_string = '&action=get_page_types&docid=' + this_id;

    jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + new_page_string, function (result) {

        if (result.PAGES) {
            jQuery.each(result.PAGES,function(index, value) {
                this_html = this_html.concat('<div class="bpm-row">');
                this_html = this_html.concat('<div class="bpm-small-10 bpm-large-10 bpm-columns text-left"><a class="url_links bpm_links" href="?pageid=' + value['page_id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['page_title'] + '">' + value['page_title'] + '</a></div>');
                this_html = this_html.concat('</div>');
            });
            jQuery('#bpm_page_types_res').html(this_html);
            bpm_set_url_links();
        }else{
            jQuery('#bpm_page_types_res').html(bpm_trans_array['bpm_lng_no_results']);
        }
    });
    bpm_set_url_links();
}

function bpm_make_page_type_list(this_list){

    var tag_content = '';

    jQuery.each(this_list,function(index, value) {
        tag_content = tag_content.concat('<div class="bpm-row">');
        tag_content = tag_content.concat('  <div class="bpm-small-10 bpm-large-10 bpm-columns bpm_border-gray  text-left"><a  class="bpm_links bpm_nodecoration" onclick="bpm_load_page_type(' + value['template_index'] + ')">' + value['template_name'] + '</a></div>');
        tag_content = tag_content.concat('  <div class="bpm-small-2 bpm-large-2 bpm-columns bpm_border-gray  text-left"  style="text-align:right;">' + value['template_count'] + '</div>');
        tag_content = tag_content.concat('</div>');
    });

    return tag_content;
}

function bpm_add_to_sub_list(selected_template){
    var this_state = 'false';
    var n = jQuery( '#bpm_sub_select_' + selected_template + ':checked' ).length;
    if(n) this_state = 'true';
    var this_html = '';

    var new_page_string = '&action=save_sub&template_id=' + selected_template + '&state=' + this_state;
    jQuery('#bpm_sub_config_message').hide();
    jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + new_page_string, function (result) {
        jQuery('#bpm_sub_config_message').show().fadeOut(2000);
    });
}

function bpm_left_action(this_action){
    switch(this_action){
        case 'bpm_configure_subs':

            if(jQuery('#bpm_sub_config_link').html() == '&nbsp;' + bpm_trans_array['bpm_lng_configure']) {
                jQuery('#bpm_sub_config_link').html('&nbsp;' + bpm_trans_array['bpm_lng_show_list']);
                var new_page_string = '&action=get_subscription_config';
                var html_string = '';

                jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + new_page_string, function (result) {

                    if (result) {

                        jQuery.each(result['SUBPAGES'], function (index, value) {

                            html_string = html_string.concat('<div class="bpm-row full-width">');
                            html_string = html_string.concat('<div class="bpm-small-10 bpm-large-10 bpm-columns text-left">' + value['template_name'] + '</div>');
                            if (value['this_index']) {
                                html_string = html_string.concat('<div class="bpm-small-2 bpm-large-2 bpm-columns text-left"><input onclick="bpm_add_to_sub_list(' + value['template_index'] + ')" type="checkbox" id="bpm_sub_select_' + value['template_index'] + '" value="bpm_sub_select_' + value['template_index'] + '" checked></div>');
                            } else {
                                html_string = html_string.concat('<div class="bpm-small-2 bpm-large-2 bpm-columns text-left"><input onclick="bpm_add_to_sub_list(' + value['template_index'] + ')" type="checkbox" id="bpm_sub_select_' + value['template_index'] + '" value="bpm_sub_select_' + value['template_index'] + '" ></div>');
                            }
                            html_string = html_string.concat('</div>');
                        });

                        jQuery('#bpm_left_widget_content').html(html_string);
                    }
                });
            }else{
                jQuery('#bpm_sub_config_link').html('&nbsp;' + bpm_trans_array['bpm_lng_configure']);
                var page_links = bpm_make_left_report(bpm_dashboard[3]);
                if(page_links) {
                    jQuery('#bpm_left_widget_content').html(page_links);
                }else{
                    jQuery('#bpm_left_widget_content').html(bpm_trans_array['bpm_lng_message_up_to_date']);
                }
            }

            break;
        case 'bpm_clear_all_subs':
            jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + '&action=clear_all_subs', function(result){
                jQuery('#bpm_left_widget_content').html(bpm_trans_array['bpm_lng_message_up_to_date']);
                jQuery('#bpm_widget_title').html('<span class="fi-mail"></span>&nbsp;&nbsp;'+bpm_trans_array['bpm_lng_subscriptions']+'&nbsp;&nbsp;<a id="bpm_sub_config_link" class="bpm_nodecoration fi-widget bpm_links" style="font-size: .4em" onclick="bpm_left_action('+"'bpm_configure_subs'"+');">&nbsp;'+ bpm_trans_array['bpm_lng_configure'] +'</a>&nbsp;<span id="bpm_sub_config_message" class="hide" style="font-size: .5em;color:green;">'+bpm_trans_array['bpm_lng_saved']+'</span>');
                bpm_update_dashboard();
            });
            break;
    }

}

function bpm_make_directory(this_content) {

    if (bpm_dashboard[5].length == 0) {
        jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + '&action=getEmployeeDirectory', function (result) {
            if (result) {
                if (result.DIRECTORY) {
                    bpm_dashboard[5] = result.DIRECTORY;
                    jQuery('#bpm_left_widget_content').html(bpm_make_directory_html(result.DIRECTORY));
                }
            }
        });
    }else{
        return bpm_make_directory_html(this_content);
    }

}

function bpm_make_directory_html(this_content){
    var links_list = '';
    if(this_content) {

        var bpm_link_string = '';

        jQuery.each(this_content,function(index, value) {
            if (value['page_id']) {
                var title = '&nbsp;';
                var email = '&nbsp;';
                var department = '&nbsp;';
                var phone = '&nbsp;';
                var mobile = '&nbsp;';
                if(value['title']) title = value['title'];
                if(value['department']) department = value['department'];
                if(value['phone']) phone = bpm_trans_array['bpm_lng_phone']+': '+ value['phone'];
                if(value['mobile']) mobile = bpm_trans_array['bpm_lng_mobile']+': '+ value['mobile'];

                if(value['email']) email = '<a href="mailto:' + value['email'] + '" class="bpm_links">'+value['email']+'</a>';

                bpm_link_string = '<a class="url_links bpm_links" href="?pageid=' + value['page_id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['name'] + '">' + value['name'] + '</a>';

                links_list = links_list.concat('<div class="bpm-row">');
                links_list = links_list.concat('<div class="bpm-small-4 bpm-large-4 bpm-columns bpm_text_medium text-left">'+bpm_link_string+'</div>');
                links_list = links_list.concat('<div class="bpm-small-4 bpm-large-4 bpm-columns bpm_text_medium text-left">'+phone+'&nbsp;</div>');
                links_list = links_list.concat('<div class="bpm-small-4 bpm-large-4 bpm-columns bpm_text_medium text-right">'+mobile+'&nbsp;</div>');
                links_list = links_list.concat('</div>');

                links_list = links_list.concat('<div class="bpm-row">');
                links_list = links_list.concat('<div class="bpm-small-4 bpm-large-4 bpm-columns bpm_text_medium text-left">'+title+'</div>');
                links_list = links_list.concat('<div class="bpm-small-8 bpm-large-8 bpm-columns bpm_text_medium text-right">'+email+'&nbsp;</div>');
                links_list = links_list.concat('</div>');

                links_list = links_list.concat('<hr class="bpm_hr_gray">');

            }

        });

    }

    return links_list;
}

function bpm_make_left_report(this_content, report_type){
    var links_list = '';

    if(this_content) {

        var links_array = [];
        var bpm_link_string = '';
        var bpm_wfm_status = '';

        jQuery.each(this_content,function(index, value) {

            if (value['page_id']) {
                switch (value['wfm_status']) {
                    case '0':
                        bpm_wfm_status = bpm_trans_array['bpm_lng_draft'];
                        if(value['wfm_current_id'] != bpm_settings['userid']) display = 0;
                        break;
                    case '1':
                        bpm_wfm_status = bpm_trans_array['bpm_lng_open'];
                        if(value['real_name']) bpm_wfm_status = bpm_trans_array['bpm_lng_open'] + ' - ' + value['real_name'];
                        break;
                    case '2':
                        bpm_wfm_status = bpm_trans_array['bpm_lng_closed'];
                        break;
                }
                var page_touched = '';
                if(report_type=='recent' && value['page_touched']) {

                    page_touched = value['page_touched'];
                }

                bpm_link_string = '<a class="url_links bpm_links " href="?pageid=' + value['page_id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext"  title="' + value['page_title'] + '">' + value['page_title'] + '</a>';

                links_array.push({
                    col_1: bpm_link_string, col_2:page_touched, col_3: bpm_wfm_status,  col_4: value['real_name']
                });
            }

        });

        if(report_type=='recent') {
            links_list = bpm_make_section_links_grid(links_array);
        }else {
            links_list = bpm_make_links_grid(links_array, 1);
        }
    }

    if(links_list.length == 0 && report_type == 'bookmarks'){
        links_list = links_list.concat('<div class="bpm-row">');
        links_list = links_list.concat('  <div class="bpm-small-12 bpm-large-12 bpm-columns text-left">' + bpm_trans_array['bpm_bookmarks_message'] + '</div>');
        links_list = links_list.concat('</div>');
    }

    return links_list;
}
/**
function bpm_hours_am_pm(page_touched) {
    page_touched = page_touched.replace('-','/');
    var this_time = page_touched.split(' ');
    if(this_time.length < 2) return page_touched.replace('-','/');
    var time = this_time[1].split(':');
    var hours = Number(time[0]);
    var min = time[1];
    if (hours < 12) {
        hours=(hours < 10) ? '&nbsp;'+hours:hours;
        var date_string = this_time[0].substr(0,6) + this_time[0].substr(8,2) + " " + hours + ':' + min + ' AM';
        return date_string.replace('-','/');
    } else {
        hours=hours - 12;
        if(hours==0) hours = 12;
        hours=(hours < 10) ? '&nbsp;'+hours:hours;
        var date_string =  this_time[0].substr(0,6) + this_time[0].substr(8,2) + " " + hours+ ':' + min + ' PM';
        return date_string.replace('-','/');
    }
}
**/
function bpm_acct_mgr(selected_object){

    jQuery('#bpm_admin_users_topbar').hide();
    bpm_settings['acctmgrpage'] = jQuery(selected_object).prop('id');

    switch(bpm_settings['acctmgrpage']){
        case 'bpm_acct_manager_users':
            bpm_create_user_list();
            return;
            break;
        case 'bpm_acct_manager_features':
            bpm_display_extension_list(1);
            break;
        case 'bpm_acct_manager_cart':
            bpm_create_cart();
            return;
            break;
        case 'bpm_acct_manager_payment':
            bpm_create_payment();
            break;
        case 'bpm_acct_manager_statement':
            bpm_create_statement_list(1);
            break;
        case 'bpm_acct_manager_storage':
            bpm_create_storage();
            break;
        case 'bpm_acct_manager_invoices':
            bpm_create_inv_list();
            break;
        case 'bpm_acct_manager_login_url':
            bpm_create_login_url();
            break;
    }


}

function bpm_cancel_create_user(){
    jQuery('#bpm_account_manager_content').show();
    jQuery('#bpm_add_intranet_user_alert').hide();
    jQuery('#bpm_add_intranet_user_form').hide();
    bpm_set_url_links();
}

function bpm_admin_action(selected_object){

    switch(jQuery(selected_object).prop('id')){
        case 'bpm_admin_add_intranet_user':
            //show a panel with a form to add users
            jQuery('#bpm_add_intranet_user_alert').hide();
            jQuery('#bpm_add_intranet_user_form').show();
            jQuery('#bpm_account_manager_content').hide();
            break;
    }
}

function bpm_create_user(user_type){

    var status = 0;

    var message = jQuery('#bpm_email_new_intranet_message').val();;
    var name = jQuery('#bpm_new_intranet_user_name').val();
    var email = jQuery('#bpm_new_intranet_user_email').val();

    switch(user_type){
        case 2:
            jQuery('#bpm_new_intranet_user_email').css("border","1px solid clear");
            jQuery('#bpm_new_intranet_user_name').css("border","1px solid clear");
            //validate email field
            if (email == '' || !bpm_validateEmail(email)){
                jQuery('#bpm_new_intranet_user_email').css("border","1px solid red");
                status = 1;
            }

            //validate name field
            if (name == ''){
                jQuery('#bpm_new_intranet_user_name').css("border","1px solid red");
                status = 1;
            }

            break;
    }

    if(status==1) return;

    var querystring = 'domain=' + bpm_current_domain + "&action=add_user&pageid=" + bpm_pageid + "&name=" + name + '&email='+ email + '&message=' + message + '&userType=' + user_type;

    jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result){

        switch(result.TRANSTATUS['code']){
            case 0:
                bpm_user_list = null;
                jQuery('#bpm_add_intranet_user_form').hide();
                bpm_create_user_list();
                jQuery('#bpm_account_manager_content').show();
                break;
            default:
                //show error message
                var error_message = result.TRANSTATUS['message'];

                if(bpm_trans_array['bpm_lng_msg_'+error_message.replace(/ /g, '_')]) error_message = bpm_trans_array['bpm_lng_msg_'+error_message.replace(/ /g, '_')];
                jQuery('#bpm_add_intranet_user_alert').text(error_message).show();

        }
    });

}

function bpm_create_user_list(){
    jQuery('#bpm_admin_users_topbar').show();
    this_html = 'Loading...';
    if(bpm_user_list){
        jQuery('#bpm_account_manager_content').html(bpm_user_list);
    }else {
        var new_page_string = '&action=get_users';
        var links_array = [];

        jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + new_page_string, function (result) {

            jQuery.each(result.USERS, function (index, value) {
                links_array.push({
                    col_1: '<a class="url_links bpm_links" href="?domain='+bpm_current_domain+'&pageid='+value['user_page']+'&action=bpmcontext" >&nbsp;'+value['real_name']+'</a>',
                    col_2: value['email'],
                    col_3: value['user_type'],
                    col_4: value['status']
                });
            });

            this_html = bpm_make_links_grid(links_array, 4);
            bpm_user_list = this_html;
            jQuery('#bpm_account_manager_content').html(this_html);
            bpm_set_url_links();
        });
    }
}

function bpm_add_to_cart(selected_object, add_type){

    var cart_action;

    if(jQuery(selected_object).text()==bpm_trans_array['bpm_lng_remove_from_cart']){
        cart_action = 'remove_cart';
    }else{
        cart_action = 'add_cart';
    }

    var querystring = bpm_get_string + "&action="+cart_action+"&item_id=" + add_type;
    jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result){
        bpm_settings['acctmgr'] = result['ACCTMGR'];
        bpm_create_products();

        if(result.TRANSTATUS == 1) {
            if (jQuery(selected_object).text() == bpm_trans_array['bpm_lng_remove_from_cart']) {
                jQuery(selected_object).text(bpm_trans_array['bpm_lng_add_to_cart']);
                jQuery('#bpm_checkout_'+add_type).hide();
            } else {
                jQuery(selected_object).text(bpm_trans_array['bpm_lng_remove_from_cart']);
                jQuery('#bpm_checkout_'+add_type).show();
            }
            if(bpm_settings['acctmgrpage'] == 'bpm_acct_manager_cart') bpm_load_admin_page(3);
            bpm_set_admin_buttons();
        }
    });




    //bpm_settings['acctmgr'] =


}

function bpm_load_admin_page(page_id){
    switch(page_id){
        case 1:
            jQuery('#bpm_acct_manager_features').click();
            break;
        case 2:
            jQuery('#bpm_acct_manager_statement').click();
            break;
        case 3:
            jQuery('#bpm_acct_manager_cart').click();
            break;
        case 4:
            jQuery('#bpm_acct_manager_storage').click();
            break;
    }

}

function bpm_create_storage(){

    var html_line = '';
//    html_line = html_line.concat('<div class="bpm-row">');
//    html_line = html_line.concat('<div class="bpm-small-9 bpm-large-9 bpm-columns text-left"><strong>'+bpm_trans_array['bpm_lng_account_storage_message']+'</strong><br><br></div>');
//    html_line = html_line.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-left">&nbsp;</div>');
//    html_line = html_line.concat('</div>');

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-left">'+bpm_trans_array['bpm_lng_account_storage']+':</div>');
    html_line = html_line.concat('<div class="bpm-small-9 bpm-large-9 bpm-columns text-left">'+ bpm_settings['storagedetails']['avail'] + 'GB of ' + bpm_settings['storagedetails']['storage_limit']+' GB '+bpm_trans_array['bpm_lng_storage_available']+'</div>');
    html_line = html_line.concat('</div>');

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-small-9 bpm-large-9 bpm-columns text-left"><br><strong>'+bpm_trans_array['bpm_lng_account_storage_add_plan_message']+'</strong></div>');
    html_line = html_line.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-left">&nbsp;</div>');
    html_line = html_line.concat('</div>');


    html_line = html_line.concat('<br><hr class="bpm_hr_gray"><br>');

    html_line = html_line.concat(bpm_display_extension_list(null, 'Storage'));

    jQuery('#bpm_account_manager_content').html(html_line);
}


function bpm_create_statement_list(){

    var html_line = '';

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns text-left bpm_bold">' + bpm_trans_array['bpm_lng_feature_name'] + '</div>');
    html_line = html_line.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-left bpm_bold">' + bpm_trans_array['bpm_lng_next_bill_date'] + '</div>');
    html_line = html_line.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-right bpm_bold">' + bpm_trans_array['bpm_lng_next_bill_amount'] + '</div>');
    html_line = html_line.concat('</div>');

    jQuery.each(bpm_settings['acctmgr'], function (index, value) {
        if((value['is_installed']=='yes' || value['prod_type']=='Storage') && value['prod_qty'] > 0){
            var next_bill_amount = value['prod_price'] * value['prod_qty'];
            var prod_desc = value['prod_desc'];
            if(bpm_trans_array['bpm_lng_'+value['prod_desc'].replace(/ /g,'_')]) prod_desc = bpm_trans_array['bpm_lng_'+value['prod_desc'].replace(/ /g,'_')];
            prod_desc = '<a onclick="bpm_display_extension('+value['product_id']+', 2)">'+prod_desc+'</a>';
            html_line = html_line.concat('<div class="bpm-row">');
            html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns text-left ">' + prod_desc + '</div>');
            html_line = html_line.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-left ">' + value['next_bill_date'] + '</div>');
            html_line = html_line.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-right ">' + bpm_format_number(next_bill_amount) + '.00</div>');
            html_line = html_line.concat('</div>');
        }
    });

    jQuery('#bpm_account_manager_content').html(html_line);
//    return html_line;
}

function bpm_create_cart_list(){

    var html_line = '';
    var total_amount = 0;

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns text-left bpm_bold">' + bpm_trans_array['bpm_lng_feature_name'] + '</div>');
    html_line = html_line.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-right bpm_bold">' + bpm_trans_array['bpm_lng_price'] + '</div>');
    html_line = html_line.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-right bpm_bold">&nbsp;</div>');
    html_line = html_line.concat('</div>');

    jQuery.each(bpm_settings['acctmgr'], function (index, value) {
        if(value['cart_qty']){
            var next_bill_amount = value['prod_price'] * value['cart_qty'];
            total_amount = total_amount + next_bill_amount;
            var prod_desc = value['prod_desc'];
            if(bpm_trans_array['bpm_lng_'+value['prod_desc'].replace(/ /g,'_')]) prod_desc = bpm_trans_array['bpm_lng_'+value['prod_desc'].replace(/ /g,'_')];
            prod_desc = '<a onclick="bpm_display_extension('+value['product_id']+',3)">'+prod_desc+'</a>';
            html_line = html_line.concat('<div class="bpm-row">');
            html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns text-left ">' + prod_desc + '</div>');
            html_line = html_line.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-right ">$' + bpm_format_number(next_bill_amount) + '.00</div>');
            html_line = html_line.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-left "><a class="button bpm-small-button" onclick="bpm_add_to_cart(this,' + value['product_id'] + ')">' + bpm_trans_array['bpm_lng_remove_from_cart'] + '</a></div>');
            html_line = html_line.concat('</div>');
        }
    });

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-small-6 bpm-large-6 bpm-columns text-right ">' + bpm_trans_array['bpm_lng_total_to_pay'] + ':</div>');
    html_line = html_line.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-right ">$' + bpm_format_number(total_amount) + '.00</div>');
    html_line = html_line.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-left "> US Dollars</div>');
    html_line = html_line.concat('</div>');

    return html_line;
}

function bpm_format_number (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}



function bpm_create_inv_list(){

    var html_line = '';

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-small-4 bpm-large-4 bpm-columns text-left bpm_bold">' + bpm_trans_array['bpm_lng_invoice_number'] + '</div>');
    html_line = html_line.concat('<div class="bpm-small-2 bpm-large-2 bpm-columns text-left bpm_bold bpm_no_wrap">' + bpm_trans_array['bpm_lng_invoice_date'] + '</div>');
    html_line = html_line.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-right bpm_bold">' + bpm_trans_array['bpm_lng_invoice_amount'] + '</div>');
    html_line = html_line.concat('</div>');

    jQuery.each(bpm_settings['invoices'], function (index, value) {

        var invoice_link = '<a target="_blank" href="https://bpmtest.bpmcontext.com/openfile_s3.php?d='+bpm_current_domain+'&invoice=' + value['invnumber']+'"><span class="fa fa-file-pdf-o"></span></a>';

        html_line = html_line.concat('<div class="bpm-row">');
        html_line = html_line.concat('<div class="bpm-small-4 bpm-large-4 bpm-columns text-left bpm_no_wrap">'+invoice_link+'&nbsp; ' + value['invnumber'] + '</div>');
        html_line = html_line.concat('<div class="bpm-small-2 bpm-large-2 bpm-columns text-left">' + value['invdate'] + '</div>');
        html_line = html_line.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns text-right">' + value['invamount'] + '</div>');
        html_line = html_line.concat('</div>');
    });

    jQuery('#bpm_account_manager_content').html(html_line);

}

function bpm_create_products(){

    var html_line = '';

    jQuery.each(bpm_settings['acctmgr'], function (index, value) {

        var ext_type = 1;
        if(value['prod_type']=='Storage') ext_type = 4;
        html_line = html_line.concat('<div id="bpm_extension_'+value['product_id']+'" class="bpm-hide">');
        html_line = html_line.concat('<div class="bpm-row">');
        html_line = html_line.concat('<div class="bpm-large-12 bpm-small-12 bpm-columns text-left"><a onclick="bpm_display_extension('+value['product_id']+','+ext_type+')">'+value['product_name']+'</a></div>');
        html_line = html_line.concat('</div>');
        html_line = html_line.concat('<div class="bpm-row">');
        html_line = html_line.concat('<div class="bpm-large-4 bpm-small-4 bpm-columns text-left"><span class="fa '+value['product_image']+' bpm_product_icon"></span></div>');
        html_line = html_line.concat('<div class="bpm-large-8 bpm-small-8 bpm-columns text-left">'+value['short_desc']+'</div>');
        html_line = html_line.concat('</div>');
        html_line = html_line.concat('</div>');

        html_line = html_line.concat('<div id="bpm_extension_details_'+value['product_id']+'" class="bpm-hide">');
        html_line = html_line.concat('<div class="bpm-row">');
        html_line = html_line.concat('<div class="bpm-large-12 bpm-small-12 bpm-columns text-left">'+value['long_desc']+'</div>');
        html_line = html_line.concat('</div>');
        html_line = html_line.concat('</div>');

    });

    jQuery('#bpm_extension_info').html(html_line);

}

function bpm_reinstall(this_id){

    var querystring = bpm_get_string + "&action=reinstall_templates&product_id=" + this_id;

    jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result) {

        bpm_create_context_map(result);
        bpm_settings['acctmgr'] = result['ACCTMGR'];
        bpm_create_products();
        bpm_update_dashboard();
        bpm_load_admin_page(1);
    });
}

function bpm_uninstall(this_id){

    var querystring = bpm_get_string + "&action=uninstall_templates&product_id=" + this_id;

    jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result) {

        bpm_create_context_map(result);
        bpm_settings['acctmgr'] = result['ACCTMGR'];
        bpm_create_products();
        bpm_update_dashboard();
        bpm_load_admin_page(1);
    });
}

function bpm_display_extension_list(this_action, this_type){

    var html_line = '';
    if(!this_type){
        this_type = 'Templates';
    }

    jQuery.each(bpm_settings['acctmgr'], function (index, value) {
        var extension_content = '';
        if(jQuery('#bpm_extension_'+value['product_id']).length) {
            if (value['prod_type'] == this_type) {
                extension_content = jQuery('#bpm_extension_' + value['product_id']).html();

                html_line = html_line.concat('<div class="bpm-row ">');
                html_line = html_line.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left" >' + extension_content + '</div>');
                html_line = html_line.concat('</div><br>');
                if(value['is_installed']=='yes'){
                    html_line = html_line.concat('<div class="bpm-row">');
                    html_line = html_line.concat('<div class="bpm-large-11 bpm-small-11 bpm-columns text-right"><a class="button bpm-small-button" onclick="bpm_uninstall('+value['product_id']+')">'+bpm_trans_array['bpm_lng_uninstall']+'</a></div>');
                    html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-right">&nbsp;</div>');
                    html_line = html_line.concat('</div>');
                }else{
                    if(value['reinstall'] == 1 && this_type == 'Templates') {
                        html_line = html_line.concat('<div class="bpm-row">');
                        html_line = html_line.concat('<div class="bpm-large-7 bpm-small-7 bpm-columns text-left">'+bpm_trans_array['bpm_lng_reinstall_until']+ ' ' + value['next_bill_date']+'</div>');
                        html_line = html_line.concat('<div class="bpm-large-4 bpm-small-4 bpm-columns text-right"><a class="button bpm-small-button" onclick="bpm_reinstall(' + value['product_id'] + ')">' + bpm_trans_array['bpm_lng_reinstall'] + '</a></div>');
                        html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-right">&nbsp;</div>');
                        html_line = html_line.concat('</div>');
                    }else if(value['prod_price'] > 0 && value['cart_qty']) {
                        html_line = html_line.concat('<div class="bpm-row">');
                        html_line = html_line.concat('<div class="bpm-large-4 bpm-small-4 bpm-columns text-left">$' + value['prod_price'] + ' US Dollars billed ' + value['bill_period'] + '</div>');
                        html_line = html_line.concat('<div class="bpm-large-5 bpm-small-5 bpm-columns text-right"><a class="button bpm-small-button" onclick="bpm_add_to_cart(this,' + value['product_id'] + ')">' + bpm_trans_array['bpm_lng_remove_from_cart'] + '</a>&nbsp;</div>');
                        html_line = html_line.concat('<div class="bpm-large-2 bpm-small-2 bpm-columns text-right"><div id="bpm_checkout_'+value['product_id']+'" ><a class="button bpm-small-button" onclick="bpm_load_admin_page(3)">' + bpm_trans_array['bpm_lng_checkout'] + '</a></div></div>');
                        html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-right">&nbsp;</div>');
                        html_line = html_line.concat('</div>');
                    }else if(value['prod_price'] > 0) {
                        html_line = html_line.concat('<div class="bpm-row">');
                        html_line = html_line.concat('<div class="bpm-large-4 bpm-small-4 bpm-columns text-left">$' + value['prod_price'] + ' US Dollars billed ' + value['bill_period'] + '</div>');
                        html_line = html_line.concat('<div class="bpm-large-5 bpm-small-5 bpm-columns text-right"><a class="button bpm-small-button" onclick="bpm_add_to_cart(this,' + value['product_id'] + ')">' + bpm_trans_array['bpm_lng_add_to_cart'] + '</a></div>');
                        html_line = html_line.concat('<div class="bpm-large-2 bpm-small-2 bpm-columns text-right"><div id="bpm_checkout_'+value['product_id']+'" class="bpm-hide"><a class="button bpm-small-button" onclick="bpm_load_admin_page(3)">' + bpm_trans_array['bpm_lng_checkout'] + '</a></div></div>');
                        html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-right">&nbsp;</div>');
                        html_line = html_line.concat('</div>');
                    }else{
                        html_line = html_line.concat('<div class="bpm-row">');
                        html_line = html_line.concat('<div class="bpm-large-11 bpm-small-11 bpm-columns text-right"><a class="button bpm-small-button" onclick="bpm_install(' + value['product_id'] + ')">' + bpm_trans_array['bpm_lng_install'] + '</a></div>');
                        html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-right">&nbsp;</div>');
                        html_line = html_line.concat('</div>');
                    }
                }
                html_line = html_line.concat('<hr class="bpm_hr_gray">');
            }
        }
    });

    if(this_action==1) {
        jQuery('#bpm_account_manager_content').html(html_line);
    }else{
        return html_line;
    }

}

function bpm_display_extension(extension_id, return_to){

    var html_line = '';
    html_line = html_line.concat('<div class="bpm-row ">');
    switch(return_to){
        case 1:
            html_line = html_line.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left" ><a onclick="bpm_load_admin_page(1)">'+bpm_trans_array['bpm_lng_back_to_extensions']+'</a></div>');
            break;
        case 2:
            html_line = html_line.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left" ><a onclick="bpm_load_admin_page(2)">'+bpm_trans_array['bpm_lng_back_to_statement']+'</a></div>');
            break;
        case 3:
            html_line = html_line.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left" ><a onclick="bpm_load_admin_page(3)">'+bpm_trans_array['bpm_lng_back_to_cart']+'</a></div>');
            break;
        case 4:
            html_line = html_line.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left" ><a onclick="bpm_load_admin_page(4)">'+bpm_trans_array['bpm_lng_back_to_storage']+'</a></div>');
            break;
    }

    html_line = html_line.concat('</div>');

    if(jQuery('#bpm_extension_details_'+extension_id).length)  html_line = html_line.concat(jQuery('#bpm_extension_details_'+extension_id).html());

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-large-12 bpm-small-12 bpm-columns text-right">&nbsp;</div>');
    html_line = html_line.concat('</div>');

    jQuery.each(bpm_settings['acctmgr'], function (index, value) {
        if(value['product_id'] == extension_id){
            if(value['reinstall'] == 1 && return_to == 1) {
                html_line = html_line.concat('<div class="bpm-row">');
                html_line = html_line.concat('<div class="bpm-large-7 bpm-small-7 bpm-columns text-left">'+bpm_trans_array['bpm_lng_reinstall_until']+ ' ' + value['next_bill_date']+'</div>');
                html_line = html_line.concat('<div class="bpm-large-4 bpm-small-4 bpm-columns text-right"><a class="button bpm-small-button" onclick="bpm_reinstall(' + value['product_id'] + ')">' + bpm_trans_array['bpm_lng_reinstall'] + '</a></div>');
                html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-right">&nbsp;</div>');
                html_line = html_line.concat('</div>');
            }else if(value['is_installed']=='yes'){
                html_line = html_line.concat('<div class="bpm-row">');
                html_line = html_line.concat('<div class="bpm-large-12 bpm-small-12 bpm-columns text-right"><a class="button bpm-small-button" onclick="bpm_uninstall('+value['product_id']+')">'+bpm_trans_array['bpm_lng_uninstall']+'</a></div>');
                html_line = html_line.concat('</div>');
            }else{
                if(value['prod_price'] > 0 && value['cart_qty']) {
                    html_line = html_line.concat('<div class="bpm-row">');
                    html_line = html_line.concat('<div class="bpm-large-5 bpm-small-5 bpm-columns text-left">$' + value['prod_price'] + ' US Dollars billed ' + value['bill_period'] + '</div>');
                    html_line = html_line.concat('<div class="bpm-large-4 bpm-small-4 bpm-columns text-right"><a class="button bpm-small-button" onclick="bpm_add_to_cart(this,' + value['product_id'] + ')">' + bpm_trans_array['bpm_lng_remove_from_cart'] + '</a></div>');
                    html_line = html_line.concat('<div class="bpm-large-2 bpm-small-2 bpm-columns text-right"><div id="bpm_checkout_'+value['product_id']+'" ><a class="button bpm-small-button" onclick="bpm_load_admin_page(3)">' + bpm_trans_array['bpm_lng_checkout'] + '</a></div></div>');
                    html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-right">&nbsp;</div>');
                    html_line = html_line.concat('</div>');
                }else if(value['prod_price'] > 0) {
                    html_line = html_line.concat('<div class="bpm-row">');
                    html_line = html_line.concat('<div class="bpm-large-5 bpm-small-5 bpm-columns text-left">$' + value['prod_price'] + ' US Dollars billed ' + value['bill_period'] + '</div>');
                    html_line = html_line.concat('<div class="bpm-large-4 bpm-small-4 bpm-columns text-right"><a class="button bpm-small-button" onclick="bpm_add_to_cart(this,' + value['product_id'] + ')">' + bpm_trans_array['bpm_lng_add_to_cart'] + '</a></div>');
                    html_line = html_line.concat('<div class="bpm-large-2 bpm-small-2 bpm-columns text-right"><div id="bpm_checkout_'+value['product_id']+'" class="bpm-hide"><a class="button bpm-small-button" onclick="bpm_load_admin_page(3)">' + bpm_trans_array['bpm_lng_checkout'] + '</a></div></div>');
                    html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-right">&nbsp;</div>');
                    html_line = html_line.concat('</div>');
                }else{
                    html_line = html_line.concat('<div class="bpm-row">');
                    html_line = html_line.concat('<div class="bpm-large-11 bpm-small-11 bpm-columns text-right"><a class="button bpm-small-button" onclick="bpm_install(' + value['product_id'] + ')">' + bpm_trans_array['bpm_lng_add_to_cart'] + '</a></div>');
                    html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-right">&nbsp;</div>');
                    html_line = html_line.concat('</div>');
                }
            }
        }
    });


    jQuery('#bpm_account_manager_content').html(html_line);
}

function bpm_create_cart(display_type){
    var html_line = '';

    var total_amount = 0;
    jQuery.each(bpm_settings['acctmgr'], function (index, value) {
        if(value['cart_qty']){
            var next_bill_amount = value['prod_price'] * value['cart_qty'];
            total_amount = total_amount + next_bill_amount;
        }
    });

    var total_amount = 0;
    jQuery.each(bpm_settings['acctmgr'], function (index, value) {
        if (value['cart_qty']) {
            var next_bill_amount = value['prod_price'] * value['cart_qty'];
            total_amount = total_amount + next_bill_amount;
        }
    });
    if(total_amount>0) {
        html_line = html_line.concat('<div class="bpm-row">');
        html_line = html_line.concat('<div class="bpm-large-12 bpm-small-12 bpm-columns text-left"><strong>' + bpm_trans_array['bpm_lng_review_purchase'] + '</strong><br></div>');
        html_line = html_line.concat('</div>');

        html_line = html_line.concat('<hr class="bpm_hr_gray">');

        html_line = html_line.concat(bpm_create_cart_list());

        if (display_type == 1) {

            var buy_message = bpm_trans_array['bpm_lng_your_card_will_be_charged'] + ' $' + bpm_format_number(total_amount) + '.00 US Dollars&nbsp;&nbsp;&nbsp;&nbsp;';

            var braintree_message = '<div id="bpm_braintree_message"><a href="https://www.braintreegateway.com/merchants/y63q3b26k33cztnf/verified" target="_blank">';
            braintree_message = braintree_message.concat('<img src="https://s3.amazonaws.com/braintree-badges/braintree-badge-dark.png" width="164px" height ="44px" border="0"/></a>');
            braintree_message = braintree_message.concat('</a></div>');


            var we_accept = '<span class="fa fa-cc-visa bpm_file_icon"></span>&nbsp;<span class="fa fa-cc-mastercard bpm_file_icon"></span>&nbsp;<span class="fa fa-cc-paypal bpm_file_icon"></span>&nbsp;<span class="fa fa-cc-amex bpm_file_icon"></span>&nbsp;<span class="fa fa-cc-discover bpm_file_icon"></span>&nbsp;<span class="fa fa-cc-jcb bpm_file_icon"></span>';

            html_line = html_line.concat('<br>');
            html_line = html_line.concat(bpm_create_address_html());

            //credit card failed notice
            html_line = html_line.concat('<div class="bpm-row bpm-hide" id="bpm_card_failed">');
            html_line = html_line.concat('<div class="bpm-large-11 bpm-small-11 bpm-columns text-left"><div data-alert class="alert-box alert radius">' + bpm_trans_array['bpm_lng_card_declined'] + '</div></div>');
            html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-left">&nbsp;</div>');
            html_line = html_line.concat('</div>');

            html_line = html_line.concat('<div class="bpm-row bpm-hide" id="bpm_card_not_valid">');
            html_line = html_line.concat('<div class="bpm-large-11 bpm-small-11 bpm-columns text-left"><div data-alert class="alert-box alert radius">' + bpm_trans_array['bpm_lng_card_not_valid'] + '</div></div>');
            html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-left">&nbsp;</div>');
            html_line = html_line.concat('</div>');

            html_line = html_line.concat('<br>' + we_accept + '<br><form id="checkout" method="post" action="">');
            html_line = html_line.concat('<div class="bpm-row">');
            html_line = html_line.concat('<div class="bpm-large-11 bpm-small-11 bpm-columns text-left">');
            html_line = html_line.concat('<div id="bpm_alert_load_cart_form" data-alert class="alert-box success radius bpm-hide">' + bpm_trans_array['bpm_lng_loading_payment_form'] + '</div><div id="dropin"></div>');
            html_line = html_line.concat('</div>');
            html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-left">&nbsp;</div>');
            html_line = html_line.concat('</div>');

            html_line = html_line.concat('<div class="bpm-row">');
            html_line = html_line.concat('<div class="bpm-large-3 bpm-small-3 bpm-columns text-left">' + braintree_message + '&nbsp;</div>');
            html_line = html_line.concat('<div class="bpm-large-8 bpm-small-8 bpm-columns text-right">');
            html_line = html_line.concat('<div id="bpm_alert_processing_form" data-alert class="alert-box success radius bpm-hide">' + bpm_trans_array['bpm_lng_processing_payment_form'] + '</div>' + buy_message + "<button type='submit' style='margin-top:.5em;' class='bpm-small-button' id='bpm_save'>Buy</button>");
            html_line = html_line.concat('</div>');
            html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-left">&nbsp;</div>');
            html_line = html_line.concat('</div>');
            html_line = html_line.concat('</form>');

            html_line = html_line.concat('<div class="bpm-row">');
            html_line = html_line.concat('<div class="bpm-large-11 bpm-small-11 bpm-columns text-left">');
            html_line = html_line.concat(bpm_trans_array['bpm_lng_purchase_terms']);
            html_line = html_line.concat('</div>');
            html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-left">&nbsp;</div>');
            html_line = html_line.concat('</div>');
        } else {
            html_line = html_line.concat('<br><br><div class="bpm-row">');
            html_line = html_line.concat('<div class="bpm-large-11 bpm-small-11 bpm-columns text-right">');
            html_line = html_line.concat('<a class="button bpm-small-button" onclick="bpm_create_cart(1)">' + bpm_trans_array['bpm_lng_proceed_to_checkout'] + '</a>');
            html_line = html_line.concat('</div>');
            html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-right">&nbsp;</div>');
            html_line = html_line.concat('</div>');
        }
    }else{
        html_line = html_line.concat('<div class="bpm-row">');
        html_line = html_line.concat('<div class="bpm-large-12 bpm-small-12 bpm-columns text-left"><strong>' + bpm_trans_array['bpm_lng_cart_empty'] + '</strong><br></div>');
        html_line = html_line.concat('</div>');
    }

    jQuery('#bpm_account_manager_content').html(html_line);

    jQuery('#bpm_save').click(function() {
        jQuery('#bpm_card_failed').hide();
        jQuery('#bpm_braintree_message').hide();
        jQuery('#bpm_alert_processing_form').show();
        jQuery('#bpm_save').hide();
        jQuery('#bpm_card_not_valid').hide();
    });

    jQuery('#bpm_save').hide();

    if(display_type==1) {
        jQuery('#bpm_alert_load_cart_form').show();
        braintree.setup(bpm_payment, 'dropin', {
            container: 'dropin',
            onError: function (payload) {
                jQuery('#bpm_card_not_valid').show();
                jQuery('#bpm_braintree_message').show();
                jQuery('#bpm_alert_processing_form').hide();
                jQuery('#bpm_save').show();

            },
            onReady: function(){
                jQuery('#bpm_alert_load_cart_form').hide();
                jQuery('#bpm_save').show();
                //jQuery('#bpm_acct_manager_payment_item').show();
            },
            onPaymentMethodReceived: function (obj) {
                bpm_save_address();
                setTimeout(function() {
                    bpm_cart_purchased(obj);
                },500);
            }
        });
    }
}

function bpm_purchase_confirm(){

    jQuery('#bpm_account_manager_content').html(jQuery('#bpm_thank_you_message').html());
    jQuery('#bpm_acct_manager_cart_item').hide();
}

function bpm_cart_purchased(bt_obj){

    var querystring = bpm_get_string + "&action=cart_purchased&braintree_token="+ bt_obj.nonce;
    jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result){

        if(result.TRANSTATUS['code']){
            if(result.TRANSTATUS['code']==1){
                jQuery('#bpm_card_failed').show();
                jQuery('#bpm_braintree_message').show();
                jQuery('#bpm_alert_processing_form').hide();
                jQuery('#bpm_save').show();
            }else{
                bpm_settings['acctmgr'] = result['ACCTMGR'];
                bpm_create_products();
                bpm_create_context_map(result);
                bpm_purchase_confirm();
                bpm_update_dashboard();
            }
        }
    });
}

function bpm_save_address(){

    var company = jQuery('#bpm_company_name').val();
    var address = jQuery('#bpm_company_address').val();
    var city = jQuery('#bpm_company_city').val();
    var state = jQuery('#bpm_company_state').val();
    var postal = jQuery('#bpm_company_postal').val();

    var querystring = bpm_get_string + "&action=update_billing_address&addr_action=update&company_name="+ company +'&street='+address+'&city='+city+'&state='+state+'&postal='+postal;
    jQuery('#bpm_alert_save_address').show();
    jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result) {
        if(result.BILLINGADDRESS) bpm_settings['BILLINGADDRESS'] = result.BILLINGADDRESS;

        setTimeout(function() {
            jQuery('#bpm_alert_save_address').hide();
        },1000);
    });

}

function bpm_create_address_html(){
    var html_line = '';
    var company = '';
    var address = '';
    var city = '';
    var state = '';
    var postal = '';

    if(bpm_settings['BILLINGADDRESS']['company']) company = bpm_settings['BILLINGADDRESS']['company'];
    if(bpm_settings['BILLINGADDRESS']['address']) address = bpm_settings['BILLINGADDRESS']['address'];
    if(bpm_settings['BILLINGADDRESS']['city']) city = bpm_settings['BILLINGADDRESS']['city'];
    if(bpm_settings['BILLINGADDRESS']['state']) state = bpm_settings['BILLINGADDRESS']['state'];
    if(bpm_settings['BILLINGADDRESS']['postal']) postal = bpm_settings['BILLINGADDRESS']['postal'];

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-large-4 bpm-small-4 bpm-columns text-left">'+bpm_trans_array['bpm_lng_company_name']+'</div>');
    html_line = html_line.concat('<div class="bpm-large-7 bpm-small-7 bpm-columns text-left"><input type="text" id="bpm_company_name" value="'+company+'" /></div>');
    html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-left">&nbsp;</div>');
    html_line = html_line.concat('</div>');

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-large-4 bpm-small-4 bpm-columns text-left">'+bpm_trans_array['bpm_lng_company_street']+'</div>');
    html_line = html_line.concat('<div class="bpm-large-7 bpm-small-7 bpm-columns text-left"><input type="text" id="bpm_company_address" value="'+address+'" /></div>');
    html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-left">&nbsp;</div>');
    html_line = html_line.concat('</div>');

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-large-4 bpm-small-4 bpm-columns text-left">&nbsp;</div>');
    html_line = html_line.concat('<div class="bpm-large-3 bpm-small-3 bpm-columns text-left"><input type="text" id="bpm_company_city" placeholder="'+bpm_trans_array['bpm_lng_company_city']+'" value="'+city+'" /></div>');
    html_line = html_line.concat('<div class="bpm-large-2 bpm-small-2 bpm-columns text-left"><input type="text" id="bpm_company_state" placeholder="'+bpm_trans_array['bpm_lng_company_state']+'" value="'+state+'" /></div>');
    html_line = html_line.concat('<div class="bpm-large-2 bpm-small-2 bpm-columns text-left"><input type="text" id="bpm_company_postal" placeholder="'+bpm_trans_array['bpm_lng_company_postal']+'" value="'+postal+'" /></div>');
    html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-left">&nbsp;</div>');
    html_line = html_line.concat('</div>');

    return html_line;
}

function bpm_create_payment(){

    var html_line = bpm_create_address_html();

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-large-8 bpm-small-8 bpm-columns text-left"><div id="bpm_alert_save_address" data-alert class="alert-box success radius bpm-hide">'+bpm_trans_array['bpm_lng_saving']+'</div>&nbsp;</div>');
    html_line = html_line.concat('<div class="bpm-large-3 bpm-small-3 bpm-columns text-right"><a onclick="bpm_save_address();" class="button bpm-small-button" style="text-decoration: none;">'+bpm_trans_array['bpm_lng_save_address']+'</a></div>');
    html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-left">&nbsp;</div>');
    html_line = html_line.concat('</div>');

    html_line = html_line.concat('<br><br><form id="checkout" method="post" action="">');
    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-large-11 bpm-small-11 bpm-columns text-left">');
    html_line = html_line.concat('<div id="bpm_alert_load_payment_form" data-alert class="alert-box success radius">'+bpm_trans_array['bpm_lng_loading_payment_form']+'</div><div id="update_dropin"></div>');
    html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-left">&nbsp;</div>');
    html_line = html_line.concat('</div>');
    html_line = html_line.concat('</div>');

    jQuery('#bpm_account_manager_content').html(html_line);

    braintree.setup(bpm_payment, 'dropin', {
        container: 'update_dropin',
        onReady: function(){
            jQuery('#bpm_alert_load_payment_form').hide();
        },
        onPaymentMethodReceived: function (obj) {
            //do nothing
        }
    });
}

function bpm_create_login_url(){
    var html_line = '';

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-large-11 bpm-small-11 bpm-columns text-left">'+bpm_trans_array['bpm_lng_login_url_message']+'<br><br></div>');
    html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-left">&nbsp;</div>');
    html_line = html_line.concat('</div>');

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-large-11 bpm-small-11 bpm-columns text-left"><strong>'+bpm_trans_array['bpm_lng_login_url_current']+'</strong></div>');
    html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-left">&nbsp;</div>');
    html_line = html_line.concat('</div>');

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-large-11 bpm-small-11 bpm-columns text-left">'+bpm_settings['current_login_url']+'<br></div>');
    html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-left">&nbsp;</div>');
    html_line = html_line.concat('</div><br>');

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-large-11 bpm-small-11 bpm-columns text-left"><strong>'+bpm_trans_array['bpm_lng_login_url_site']+'</strong></div>');
    html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-left">&nbsp;</div>');
    html_line = html_line.concat('</div>');

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-large-11 bpm-small-11 bpm-columns text-left">'+bpm_settings['site_login_url']+'<br><br></div>');
    html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-left">&nbsp;</div>');
    html_line = html_line.concat('</div>');

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-large-8 bpm-small-8 bpm-columns text-left">'+bpm_trans_array['bpm_lng_login_url_update']+'<br></div>');
    html_line = html_line.concat('<div class="bpm-large-3 bpm-small-3 bpm-columns text-right"><a onclick="bpm_update_url();" class="button bpm-small-button" style="text-decoration: none;">'+bpm_trans_array['bpm_lng_update']+'</a></div>');
    html_line = html_line.concat('<div class="bpm-large-1 bpm-small-1 bpm-columns text-left">&nbsp;</div>');
    html_line = html_line.concat('</div>');


    jQuery('#bpm_account_manager_content').html(html_line);
}

function bpm_update_url(){

    var querystring = bpm_get_string + "&action=update_login_url&url=" + bpm_settings['site_login_url'];

    jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result) {
        bpm_update_dashboard();
        jQuery('#bpm_acct_manager_users').click();
    });

}