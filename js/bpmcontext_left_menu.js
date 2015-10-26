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
                            span = jQuery("<span>").text(ui.item.label).prop('id', 'bpm_talat_user_' + ui.item.value).addClass("bpm_talat_user"),
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
//            var page_links = bpm_make_subscriptions_window();
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
            jQuery('#bpm_widget_title').html('<span class="fi-widget"></span>&nbsp;&nbsp;Account Manager');
            jQuery('#bpm_left_widget_content').hide();
            jQuery('#bpm_left_widget_window').foundation('reveal', 'open');
            bpm_acct_mgr({id:'bpm_acct_manager_users'});
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
            this_html = this_html.concat('<div class="row">');
            this_html = this_html.concat('  <div class="small-12 large-12 columns"><a class="url_links grid_links bpm_links bpm_text_medium" href="?pageid=' + value['page_id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['page_title'] + '">' + value['page_title'] + '</a></div>');
            this_html = this_html.concat('</div>');
        });
    }else if(selected_object == '999998'){
        jQuery.each(bpm_dashboard[12].DRAFTS, function (index, value) {
            this_html = this_html.concat('<div class="row">');
            this_html = this_html.concat('  <div class="small-12 large-12 columns"><a class="url_links grid_links bpm_links bpm_text_medium" href="?pageid=' + value['page_id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['page_title'] + '">' + value['page_title'] + '</a></div>');
            this_html = this_html.concat('</div>');
        });
    }else {
        jQuery.each(bpm_dashboard[12].wfdocs, function (index, value) {
            if (value['template_index'] == selected_object && value['wfm_status'] > 0) {
                this_html = this_html.concat('<div class="row">');
                this_html = this_html.concat('  <div class="small-12 large-12 columns"><a class="url_links grid_links bpm_links bpm_text_medium" href="?pageid=' + value['page_id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['page_title'] + '">' + value['page_title'] + '</a></div>');
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

    var this_html = '<div class="row full-width" style="margin-bottom:5px;max-height:400px;overflow-x:hidden">';
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

        this_html = this_html.concat('<div class="row bpm_file_bottom_border">');
        this_html = this_html.concat('  <div id="bpm_talat_message_item_'+value['id']+'" class="small-12 large-12 columns">');

        this_html = this_html.concat('<div class="row">');
        this_html = this_html.concat('  <div class="small-12 large-12 columns"><a class="url_links grid_links bpm_links bpm_text_medium" href="?pageid=' + value['page_id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['page_title'] + '">' + value['page_title'] + '</a></div>');;
        this_html = this_html.concat('</div>');

        this_html = this_html.concat('<div class="row">');
        this_html = this_html.concat('<div class="small-3 large-3 columns">');

        this_html = this_html.concat('<div class="row">');
        this_html = this_html.concat('<div class="small-12 large-12 columns">' + value['real_name'] + '</div>');
        this_html = this_html.concat('</div>');

        this_html = this_html.concat('<div class="row">');
        this_html = this_html.concat('<div class="small-12 large-12 columns">&nbsp;</div>');
        this_html = this_html.concat('</div>');

        this_html = this_html.concat('<div class="row">');
        this_html = this_html.concat('<div class="small-12 large-12 columns">' + value['send_date'] + '</div>');
        this_html = this_html.concat('</div>');

        this_html = this_html.concat('</div>');

        this_html = this_html.concat('<div class="small-7 large-7 columns">');
        this_html = this_html.concat('<div class="row">');
        this_html = this_html.concat('<div class="small-12 large-12 columns" id="bpm_talat_message_text_' + value['id'] + '">' + value['message'] + '</div>');
        this_html = this_html.concat('</div>');

        this_html = this_html.concat('</div>');

        this_html = this_html.concat('<div class="small-2 large-2 columns">');

        this_html = this_html.concat('<div class="row">');
        this_html = this_html.concat('<div class="small-12 large-12 columns"><a class="bpm_versions_button bpm_nodecoration" onclick="bpm_talat_reply(0, '+ value['id'] + ', ' + value['page_id'] +')">Reply</a></div>');
        this_html = this_html.concat('</div>');
        this_html = this_html.concat('<div class="hide" id="bpm_talat_reply_to_'+value['id']+'">'+value['uad_user_id']+'</div>')

        if(reply_all) {
            this_html = this_html.concat('<div class="row">');
            this_html = this_html.concat('<div class="small-12 large-12 columns"><a class="bpm_versions_button bpm_nodecoration" onclick="bpm_talat_reply(1, '+ value['id']  + ', ' + value['page_id'] +')">Reply All</a></div>');
            this_html = this_html.concat('</div>');
            this_html = this_html.concat('<div class="hide" id="bpm_talat_reply_all_'+value['id']+'">'+reply_all+'</div>')

        }

        this_html = this_html.concat('<div class="row">');
        this_html = this_html.concat('<div class="small-12 large-12 columns"><a class="bpm_versions_button bpm_nodecoration" onclick="bpm_talat_dismiss('+ value['id']  + ', ' + value['page_id'] +')">Dismiss</a></div>');
        this_html = this_html.concat('</div>');
        this_html = this_html.concat('</div>');

        this_html = this_html.concat('</div>');

        if(value['recipients'].length > 0) {

            this_html = this_html.concat('<div class="row">');
            this_html = this_html.concat('<div class="small-12 large-12 columns">' + recipients + '</div>');
            this_html = this_html.concat('</div>');
        }
        this_html = this_html.concat('</div>');
        this_html = this_html.concat('</div>');
    });
    this_html = this_html.concat('</div>');

    return this_html;
}

function bpm_make_notifications_window(){

    var this_html = '';
    bpm_first_notification = '';

    this_html = this_html.concat('<div class="row full-width" style="margin-bottom:5px;max-height:400px;">');
    this_html = this_html.concat('<div class="small-3 large-3 columns">');
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

    this_html = this_html.concat('<div class="small-9 large-9 columns bpm_gray_border" id="bpm_notification_target">');

    this_html = this_html.concat('</div>'); //end of right column div
    this_html = this_html.concat('</div>');

    return this_html;

}

function bpm_make_subscriptions_window(){

    var this_html = '';

    this_html = this_html.concat('<div class="row full-width" style="margin-bottom:5px;max-height:400px;">');
    this_html = this_html.concat('<div class="small-3 large-3 columns">');
    this_html = this_html.concat('<ul class="side-nav">');

    jQuery.each(bpm_dashboard[3],function(index, value) {
        this_html = this_html.concat(' <li class="bpm_ul_li">');
        this_html = this_html.concat('<a class="bpm_nodecoration" id="bpm_create_subscription_' + value['id'] + '" onclick="bpm_create_notifications_target('+value['id']+');">' + value['name'] + '&nbsp;('+value['totalrecs']+')</a>');
        this_html = this_html.concat('</li>');

    });

    this_html = this_html.concat('</ul>');

    this_html = this_html.concat('</div>'); //end of left column div

    this_html = this_html.concat('<div class="small-9 large-9 columns bpm_gray_border" id="bpm_notification_target">');

    this_html = this_html.concat('</div>'); //end of right column div
    this_html = this_html.concat('</div>');

    return this_html;

}

function bpm_create_quick_docs(){

    var this_html = '';

    this_html = this_html.concat('<div class="row full-width" style="margin-bottom:5px;max-height:400px;">');
    this_html = this_html.concat('<div class="small-3 large-3 columns">');
    this_html = this_html.concat('<ul class="side-nav" id="bpm_quick_docs_list">');

    jQuery.each(bpm_quick_docs,function(index, value) {
        this_html = this_html.concat(' <li class="bpm_ul_li">');
        this_html = this_html.concat('<a class="bpm_nodecoration side-nav-item" id="bpm_create_quick_doc_' + value['id'] + '" onclick="bpm_create_quick_doc_target(this);">' + value['name'] + '</a>');
        this_html = this_html.concat('</li>');
    });

    this_html = this_html.concat('</ul>');

    this_html = this_html.concat('</div>'); //end of left column div

    this_html = this_html.concat('<div class="small-9 large-9 columns bpm_gray_border" id="bpm_quick_doc_target" style="height:330px;overflow: auto;">');

    this_html = this_html.concat('<div class="row">');
    this_html = this_html.concat('<div class="large-1 small-1 columns">&nbsp;</div>');
    this_html = this_html.concat('<div class="large-10 small-10 columns" style="height:100px;">' + jQuery('#bpm_quick_docs_message').text() + '</div>');
    this_html = this_html.concat('<div class="large-1 small-1 columns">&nbsp;</div>');
    this_html = this_html.concat('</div>');

    this_html = this_html.concat('</div>'); //end of right column div
    this_html = this_html.concat('<div class="small-9 large-9 columns bpm_gray_border hide" id="bpm_quick_doc_target_message" ><br>' + bpm_trans_array['bpm_lng_quick_doc_parents'] + '</div>');
    this_html = this_html.concat('</div>');

    return this_html;
}

function bpm_create_quick_docs_config(){

    var new_page_string = '&action=get_quick_doc_config';
    var html_string = '';

    jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + new_page_string, function (result) {

        if (result) {

            jQuery.each(result['QUICKDOCS'],function(index, value) {

                html_string = html_string.concat('<div class="row full-width">');
                html_string = html_string.concat('<div class="small-10 large-10 columns">' + value['template_name'] + '</div>');
                if(value['quick_doc_id']) {
                    html_string = html_string.concat('<div class="small-2 large-2 columns text-right"><input onclick="bpm_add_to_quick_doc_list(' + value['template_index'] + ',' + value['section_index'] + ')" type="checkbox" id="bpm_quick_doc_select_' + value['template_index'] + '" value="bpm_quick_doc_select_' + value['template_index']+'" checked></div>');
                }else{
                    html_string = html_string.concat('<div class="small-2 large-2 columns text-right"><input onclick="bpm_add_to_quick_doc_list(' + value['template_index'] + ',' + value['section_index'] + ')" type="checkbox" id="bpm_quick_doc_select_' + value['template_index'] + '" value="bpm_quick_doc_select_' + value['template_index']+'" ></div>');
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
            this_html = this_html.concat('<div class="row full-width" style="margin-bottom:15px;">');
            this_html = this_html.concat('<div class="small-12 large-12 columns">');
            this_html = this_html.concat('<span class="bpm_bold">'+jQuery('#bpm_create_quick_doc_'+this_id).text()+'</span>');
            this_html = this_html.concat('</div>');
            this_html = this_html.concat('</div>');

            //setup parent page selector
            this_dropdown = this_dropdown.concat('<div class="row full-width">');
            this_dropdown = this_dropdown.concat('<div class="small-12 large-12 columns">');
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
            this_html = this_html.concat('<div class="row full-width">');
            this_html = this_html.concat('<div class="small-12 large-12 columns">');
            this_html = this_html.concat(bpm_create_add_page_name(bpm_page_naming[this_id], 1));
            this_html = this_html.concat('</div>');
            this_html = this_html.concat('</div><br>');

            //setup send button
            var bpm_quick_doc_buttons = '<div class="row full-width">';
            bpm_quick_doc_buttons = bpm_quick_doc_buttons.concat('<div class="small-12 large-12 columns">');
            bpm_quick_doc_buttons = bpm_quick_doc_buttons.concat('<div class="row" style="margin-bottom:5px;">');
            bpm_quick_doc_buttons = bpm_quick_doc_buttons.concat('<div class="small-6 large-6 columns">&nbsp;</div>');
            bpm_quick_doc_buttons = bpm_quick_doc_buttons.concat('<div class="small-6 large-6 columns text-right">');
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
            this_html = this_html.concat('<div class="row full-width">');
            this_html = this_html.concat('<div class="small-12 large-12 columns">');
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
            tag_content = tag_content.concat('<div class="row full-width">');
            tag_content = tag_content.concat('  <div class="small-12 large-12 columns"><a class="grid_links url_links bpm_links" href="?pageid=' + value['companyid'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['company'] + '">' + value['company'] + '</a></div>');
            tag_content = tag_content.concat('</div>');
        });
    }else{
        if(!this_list && c_or_s==1) return bpm_trans_array['bpm_lng_no_cust'];
        if(!this_list && c_or_s==2) return bpm_trans_array['bpm_lng_no_supp'];
        //make contact list

        tag_content = tag_content.concat('<div class="row">');
        tag_content = tag_content.concat('  <div class="small-3 large-3 columns bpm_bold">' + bpm_trans_array['bpm_lng_name'] + '</div>');
        tag_content = tag_content.concat('  <div class="small-3 large-3 columns">' + bpm_trans_array['bpm_lng_company'] + '</div>');
        tag_content = tag_content.concat('  <div class="small-2 large-2 columns" >' + bpm_trans_array['bpm_lng_title'] + '</div>');
        tag_content = tag_content.concat('  <div class="small-2 large-2 columns" >' + bpm_trans_array['bpm_lng_phone'] + '</div>');
        tag_content = tag_content.concat('  <div class="small-2 large-2 columns" >' + bpm_trans_array['bpm_lng_email'] + '</div>');
        tag_content = tag_content.concat('</div>');

        jQuery.each(this_list,function(index, value) {
            var title = '&nbsp;';
            var email = '&nbsp;';
            var phone = '&nbsp;';
            if(value['contactTitle']) title = '<span class="span_text">' + value['contactTitle'] + '</span>';
            if(value['contactPhone']) phone = '<span class="span_text">' + value['contactPhone'] + '</span>';
            if(value['contactEmail']) email = '<a class="grid_links bpm_links" href="mailto:' + value['contactEmail'] + '">Email</a>';

            if(value['contactName']) {
                tag_content = tag_content.concat('<div class="row">');
                tag_content = tag_content.concat('  <div class="small-3 large-3 columns"><a class="url_links grid_links bpm_links" href="?pageid=' + value['contactid'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['contactName'] + '">' + value['contactName'] + '</a></div>');
                tag_content = tag_content.concat('  <div class="small-3 large-3 columns"><a class="url_links grid_links bpm_links" href="?pageid=' + value['parentid'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['company'] + '">' + value['company'] + '</a></div>');
                tag_content = tag_content.concat('  <div class="small-2 large-2 columns" >' + title + '</div>');
                tag_content = tag_content.concat('  <div class="small-2 large-2 columns" >' + phone + '</div>');
                tag_content = tag_content.concat('  <div class="small-2 large-2 columns" >' + email + '</div>');
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
                this_html = this_html.concat('<div class="row">');
                this_html = this_html.concat('<div class="small-10 large-10 columns"><a class="url_links bpm_links" href="?pageid=' + value['page_id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['page_title'] + '">' + value['page_title'] + '</a></div>');
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
        tag_content = tag_content.concat('<div class="row">');
        tag_content = tag_content.concat('  <div class="small-10 large-10 columns bpm_border-gray"><a  class="bpm_links bpm_nodecoration" onclick="bpm_load_page_type(' + value['template_index'] + ')">' + value['template_name'] + '</a></div>');
        tag_content = tag_content.concat('  <div class="small-2 large-2 columns bpm_border-gray"  style="text-align:right;">' + value['template_count'] + '</div>');
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

                            html_string = html_string.concat('<div class="row full-width">');
                            html_string = html_string.concat('<div class="small-10 large-10 columns">' + value['template_name'] + '</div>');
                            if (value['this_index']) {
                                html_string = html_string.concat('<div class="small-2 large-2 columns text-left"><input onclick="bpm_add_to_sub_list(' + value['template_index'] + ')" type="checkbox" id="bpm_sub_select_' + value['template_index'] + '" value="bpm_sub_select_' + value['template_index'] + '" checked></div>');
                            } else {
                                html_string = html_string.concat('<div class="small-2 large-2 columns text-left"><input onclick="bpm_add_to_sub_list(' + value['template_index'] + ')" type="checkbox" id="bpm_sub_select_' + value['template_index'] + '" value="bpm_sub_select_' + value['template_index'] + '" ></div>');
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
        var links_array = [];
        var bpm_link_string = '';
        var bpm_wfm_status = '';

        links_array.push({
            col_1: '<span class="bpm_bold">' + bpm_trans_array['bpm_lng_name'] + '</span>', col_2: '<span class="bpm_bold">' + bpm_trans_array['bpm_lng_title'] + '</span>', col_3: '<span class="bpm_bold">' + bpm_trans_array['bpm_lng_phone'] + '</span>', col_4: '<span class="bpm_bold">' + bpm_trans_array['bpm_lng_mobile'] + '</span>', col_5: '<span class="bpm_bold">' + bpm_trans_array['bpm_lng_email'] + '</span>'
        });
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

                links_list = links_list.concat('<div class="row full-width bpm_file_bottom_border">');
                links_list = links_list.concat('<div class="small-12 large-12 columns">');

                links_list = links_list.concat('<div class="row">');
                links_list = links_list.concat('<div class="small-4 large-4 columns bpm_text_medium">'+bpm_link_string+'</div>');
                links_list = links_list.concat('<div class="small-4 large-4 columns bpm_text_medium">'+phone+'</div>');
                links_list = links_list.concat('<div class="small-4 large-4 columns bpm_text_medium text-right">'+mobile+'</div>');
                links_list = links_list.concat('</div>');

                links_list = links_list.concat('<div class="row">');
                links_list = links_list.concat('<div class="small-4 large-4 columns bpm_text_medium">'+title+'</div>');
                links_list = links_list.concat('<div class="small-8 large-8 columns bpm_text_medium text-right">'+email+'</div>');
                links_list = links_list.concat('</div>');

                links_list = links_list.concat('</div>');
                links_list = links_list.concat('</div>');

                links_array.push({
                    col_1: bpm_link_string, col_2: title, col_3: phone, col_4: mobile, col_5: email
                });
            }

        });

//        links_list = bpm_make_links_grid(links_array, 5);
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
                        if(value['wfm_current_id'] != bpm_current_user_id) display = 0;
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
        links_list = links_list.concat('<div class="row">');
        links_list = links_list.concat('  <div class="small-12 large-12 columns text-left">' + bpm_trans_array['bpm_bookmarks_message'] + '</div>');
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

    var this_html = '';

    switch(jQuery(selected_object).prop('id')){
        case 'bpm_acct_manager_users':
            bpm_create_user_list();
            return;
            break;
        case 'bpm_acct_manager_features':
            jQuery('#bpm_admin_users_topbar').hide();
            this_html = 'features';
            break;
        case 'bpm_acct_manager_billing':
            jQuery('#bpm_admin_users_topbar').hide();
            this_html = '<form id="checkout" method="post" action=""><div id="dropin"></div><br><button type="submit"  id="bpm_save_pmt">Buy</button></form>';
            jQuery('#bpm_account_manager_content').html(this_html);

            var new_page_string = '&action=get_payment_info';

            jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', bpm_get_string + new_page_string, function (result) {
                braintree.setup(result.PAYMENT, 'dropin', {
                    container: 'dropin',
                    onPaymentMethodReceived: function (obj) {
                    }
                });
            });
            return;
            break;
        case 'bpm_acct_manager_invoices':
            jQuery('#bpm_admin_users_topbar').hide();
            this_html = 'invoices';
            break;
    }

    jQuery('#bpm_account_manager_content').html(this_html);

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
