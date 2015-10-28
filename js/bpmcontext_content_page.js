function bpm_create_discussion(this_id, this_content){

    var discussion_object = jQuery('#bpm_discussion_section').html();
    var discussion_list = '';
    var discText = '';
    var disc_date;
    discussion_object = discussion_object.replace(/DISCINDEX/g,this_id);

    //create discussion divs
    if(this_content){
        discussion_list = bpm_get_discussion_list(this_content, this_id);
        discussion_object = discussion_object.replace('DISCDATA',discussion_list);
    }

    return discussion_object;

}

function bpm_get_discussion_list(this_content, this_id){
    var discussion_list = '';
    jQuery.each(this_content,function(index, value) {
        if(value['disc_text']) {
            discText = value['disc_text'];
            discText = discText.replace(/^\s+|\s+$/g, '');
            if(this_id == 'none'){
                var date_parts = [];
                var date_time = [];
                date_time = value['disc_date_time'].split(' ');
                date_parts = date_time[0].split('-');
                disc_date = bpm_get_date_display(date_parts[1]+'/'+date_parts[2]+'/'+date_parts[0]+ ' '+date_time[1]);
            }else {
                disc_date = bpm_get_date_display(value['disc_date_time']);
            }
            var  page_title = '';

            if(this_id == 'none'){
                discussion_list = discussion_list.concat('<div class="bpm_this_disc  text-left" id="bpm_this_widget_disc_' + value['disc_index'] + '" >');
                var bpm_link_string = '<a class="url_links bpm_links" href="?pageid=' + value['t3_page_id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext"  title="' + value['page_title3'] + '">' + value['page_title3'] + '</a>';
                discussion_list = discussion_list.concat('<div class="bpm_disc_page_title">' + bpm_link_string + '</div>');
            }else {
                discussion_list = discussion_list.concat('<div class="bpm_this_disc  text-left" id="bpm_this_disc_' + value['disc_index'] + '" onclick="bpm_highlight_disc(' + value['disc_index'] + ', ' + this_id + ')">');
            }
            discussion_list = discussion_list.concat('<div class="bpm_disc_left text-left">' + value['real_name'] + '<br><span style="color:gray;font-size: 75%">' + disc_date + '</span></div>');

            if (discText.length > 250) {
                discussion_list = discussion_list.concat("<div id='moreText_" + value['disc_index'] + "' class='bpm_disc_right'>" + discText.substring(0, 250) + "&nbsp;<a onclick='bpm_disc_show_more_less(" + value['disc_index'] + ", 2);return false;' style='text-decoration:none;color:grey;'>&nbsp;(more...)</a></div><div class='bpm_disc_right' style='display:none;' id='allText_" + value['disc_index'] + "'>" + discText + "&nbsp;<a onclick='bpm_disc_show_more_less(" + value['disc_index'] + ",1);return false;' style='text-decoration:none;color:grey;'>&nbsp;(less...)</a></div></div>");
            } else {
                discussion_list = discussion_list.concat('<div class="bpm_disc_right text-left">' + value['disc_text'] + '</div>');
            }
            discussion_list = discussion_list.concat('</div>');
        }
    });

    return discussion_list;
}

function bpm_delete_discussion(selected_object){

    //hide delete, edit, expand
    jQuery('#bpm_disc_delete_button_'+selected_object).hide();
    jQuery('#bpm_disc_edit_button_'+selected_object).hide();
    jQuery('#bpm_disc_expand_button_'+selected_object).hide();
    jQuery('#bpm_disc_menu_left_side').hide();

    //show confirm or cancel
    jQuery('#bpm_disc_delete_confirm_button_'+selected_object).show();
    jQuery('#bpm_disc_delete_cancel_button_'+selected_object).show();

}

function bpm_reset_disc_toolbar(selected_object){

    jQuery('#bpm_disc_delete_button_'+selected_object).hide();
    jQuery('#bpm_disc_edit_button_'+selected_object).hide();
    jQuery('#bpm_disc_expand_button_'+selected_object).show();
    jQuery('#bpm_disc_delete_confirm_button_'+selected_object).hide();
    jQuery('#bpm_disc_delete_cancel_button_'+selected_object).hide();
    bpm_set_disc_expand_button(selected_object);
}

function bpm_confirm_delete_discussion(selected_object, choice){

    if(choice==0){
        //cancel delete
        //show delete, edit, expand
        jQuery('#bpm_disc_delete_button_'+selected_object).show();
        //jQuery('#bpm_disc_edit_button_'+selected_object).show();
        jQuery('#bpm_disc_expand_button_'+selected_object).show();

        //hide confirm or cancel
        jQuery('#bpm_disc_delete_confirm_button_'+selected_object).hide();
        jQuery('#bpm_disc_delete_cancel_button_'+selected_object).hide();
        bpm_reset_disc_toolbar(selected_object);
        bpm_clear_disc_highlight();

    }else{

        var querystring = 'domain=' + bpm_current_domain + "&action=update_disc&act=delete&pageid=" + bpm_pageid + "&sectionid=" + selected_object + '&disc_index=' + bpm_current_disc;

        jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result){

            //add new discussion list
            var discussion_list = bpm_get_discussion_list(result.content, selected_object);

            bpm_dashboard[4] = result.DISCUSSIONS;

            bpm_current_disc = 0;

            jQuery('#bpm_disc_list_' + selected_object).empty().prepend(discussion_list);

            bpm_reset_disc_toolbar(selected_object);

        });
    }

}

function bpm_clear_disc_highlight(){
    bpm_current_disc = 0;
    jQuery('.bpm_this_disc').css('border','solid 1px transparent');
}

function bpm_highlight_disc(selected_id, this_id){

    bpm_current_disc = selected_id;

    jQuery('.bpm_this_disc').css('border','solid 1px transparent');

    //show delete button if this user can delete
    if(this_id > 0) {
        if (bpm_user_role == 'admin') jQuery('#bpm_disc_delete_button_' + this_id).show();
        jQuery('#bpm_this_disc_' + selected_id).css('border','solid 1px green');
    }

}

function bpm_send_post(selected_object){

    if(bpm_is_loading==1) return;
    bpm_is_loading = 1;
    var is_reveal = 0;

    if(selected_object<1){

        is_reveal = 1;
        var post_text = encodeURIComponent(tinymce.activeEditor.getContent());


        selected_object = bpm_current_section;
    }else {
        var post_text = encodeURIComponent(jQuery('#bpm_disc_post_field_' + selected_object).val());
    }

    if(post_text.length > 0){
        //post message
        jQuery('#bpm_saving_disc_alert').show();
        var querystring = 'domain=' + bpm_current_domain + "&action=update_disc&act=save&pageid=" + bpm_pageid + "&sectionid=" + selected_object + "&pageinfo=" + post_text;

        jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result){
            //remove existing discussions

            jQuery('#bpm_disc_list_' + selected_object).empty();

            if(result['CHANGELOG']){
                bpm_create_change_log(result);
            }

            bpm_dashboard[4] = result.DISCUSSIONS;

            //add new discussion list
            var discussion_list = bpm_get_discussion_list(result.content, selected_object);
            jQuery('#bpm_disc_list_' + selected_object).prepend(discussion_list);

            //clean text field and close reveal
            jQuery('#bpm_disc_post_field_' + selected_object).val('');

            jQuery('#bpm_saving_disc_alert').hide();
            jQuery('#bpm_discussion_window').foundation('reveal', 'close');

            bpm_reset_disc_toolbar(selected_object);

            var timeoutId = setTimeout(function() {
                if(is_reveal == 1){
                    //tinymce.activeEditor.setContent('');
                    tinymce.remove();
                }
            }, 500);
        });
        bpm_is_loading = 0;
    }else{
        bpm_is_loading = 0;
    }

}

function bpm_get_date_display(this_date){

    var bpm_date = this_date.split(' ');
    var bpm_cal = bpm_date[0].split('/');
    var prevTime = new Date(Date.parse(this_date));
    var thisTime = new Date();
    var diff = thisTime.getTime() - prevTime.getTime();
    var elapsed = diff / (1000*60);  //minutes since elapsed

    if(elapsed < 61){
        elapsed = Math.max(0, Math.round(elapsed));
        elapsed = elapsed + " m";
    }else if(elapsed < 1440){
        elapsed = Math.round(diff / (1000*60*60));
        elapsed = elapsed + " h";
    }else {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
            "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var elapsed = monthNames[prevTime.getMonth()] + "&nbsp;" + prevTime.getDate() + ",&nbsp;" + bpm_cal[2];

    }
    return elapsed;
}

function bpm_convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
}

function bpm_disc_show_more_less(this_id, more_or_less){
    if(more_or_less == 1){
        //show more text
        jQuery('#moreText_' + this_id).show();
        jQuery('#allText_' + this_id).hide();
    }else{
        jQuery('#moreText_' + this_id).hide();
        jQuery('#allText_' + this_id).show();
    }
}

function bpm_cancel_post(){

    //tinymce.activeEditor.setContent('');
    tinymce.remove();
    jQuery('#bpm_discussion_window').foundation('reveal', 'close');

}

function bpm_open_discussion(selected_index){

    bpm_current_section = selected_index;

    jQuery('#bpm_discussion_window').foundation('reveal', 'open');

    tinymce.init({
        selector: "#bpm_disc_reveal_text",
        menubar: false,
        height : 300,
        statusbar: false,
        content_css : bpm_params.css_dir + "tinymce.content.css",
        plugins: [
            "insertdatetime media table contextmenu paste"
        ],
        toolbar: "bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | styleselect | removeformat ",
        removeformat : [
            {selector : 'b,strong,em,i,font,u,strike', remove : 'all', split : true, expand : false, block_expand : true, deep : true},
            {selector : 'span', attributes : ['style', 'class'], remove : 'empty', split : true, expand : false, deep : true},
            {selector : '*', attributes : ['style', 'class'], split : false, expand : false, deep : true}
        ]
    });


    setTimeout(function() {
        tinymce.activeEditor.setContent('');
        tinymce.activeEditor.focus();
    },500);

}

function bpm_expand_discussion(selected_object, choice){

    if(choice == 1){
        //expand
        jQuery('#bpm_section_top_bar_bpm_acc_disc_'+selected_object).parent().css('height', '500px');
        jQuery('#bpm_disc_list_'+selected_object).css('max-height', '450px');
        jQuery('#bpm_disc_shrink_button_'+selected_object).show();
        jQuery('#bpm_disc_expand_button_'+selected_object).hide();
    }else{
        //shrink
        jQuery('#bpm_section_top_bar_bpm_acc_disc_'+selected_object).parent().css('height', '');
        jQuery('#bpm_disc_list_'+selected_object).css('max-height', '250px');
        jQuery('#bpm_disc_expand_button_'+selected_object).show();
        jQuery('#bpm_disc_shrink_button_'+selected_object).hide();
    }
}

function bpm_edit_discission(){


}

function bpm_close_disc(){

    //tinymce.activeEditor.setContent('');
    tinymce.remove();
    jQuery('#bpm_discussion_window').foundation('reveal', 'close');
}

function bpm_create_text(this_id, this_content){

    var text_object = jQuery('#bpm_text_section').html();
    text_object = text_object.replace(/TEXTINDEX/g,this_id);

    if(this_content){
        text_object = text_object.replace('TEXTDATA',this_content);
    }

    return text_object;

}

function bpm_set_disc_expand_button(selected_id){

    jQuery('#bpm_disc_menu_left_side').show();

    if(jQuery('#bpm_disc_list_'+selected_id).prop("scrollHeight") > 250){
        jQuery('#bpm_disc_expand_button_'+selected_id).show();
    }else{
        jQuery('#bpm_disc_expand_button_'+selected_id).hide();
    }
}

function bpm_create_readonly_text(this_id, this_content){

    var text_object = jQuery('#bpm_readonly_text_section').html();
    text_object = text_object.replace(/TEXTINDEX/g,this_id);

    if(this_content){
        text_object = text_object.replace('TEXTDATA',this_content);
    }

    return text_object;

}

function bpm_edit_text(selected_index) {

    bpm_current_section = selected_index;

    jQuery('#bpm_edit_text_reveal_text').val(jQuery('#bpm_text_' + selected_index).html());
    jQuery('#bpm_edit_text_window').foundation('reveal', 'open');

    tinymce.init({
        selector: "#bpm_edit_text_reveal_text",
        menubar: false,
        height : 300,
        statusbar: false,
        content_css : bpm_params.css_dir + "tinymce.content.css",
        plugins: [
            "insertdatetime media table contextmenu paste"
        ],
        toolbar: "bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | styleselect | removeformat ",
        removeformat : [
            {selector : 'b,strong,em,i,font,u,strike', remove : 'all', split : true, expand : false, block_expand : true, deep : true},
            {selector : 'span', attributes : ['style', 'class'], remove : 'empty', split : true, expand : false, deep : true},
            {selector : '*', attributes : ['style', 'class'], split : false, expand : false, deep : true}
        ]
    });

    setTimeout(function() {
        tinymce.activeEditor.focus();
        tinyMCE.activeEditor.selection.select(tinyMCE.activeEditor.getBody(), true);
        tinyMCE.activeEditor.selection.collapse(false);
    },500);

}

function bpm_view_text_history(selected_index) {

    bpm_current_section = selected_index;

    //jQuery('#bpm_history_button_' + selected_index).show();

    var tab_data = '<ul class="tabs" data-tab>';
    var i = 0;
    var  tab_content = '<div class="tabs-content">';
    var status = 'active';

    jQuery.each(bpm_text_history[selected_index],function(index, value){
        if(i>0){
            status = '';
        }

        if(value['changedate']=='Current'){
            tab_data = tab_data.concat('<li class="tab-title ' + status + '" ><a style="text-decoration:none;" href="#panel' + i + '">' + value['changedate'] + '</a></li>');
        }else {
            tab_data = tab_data.concat('<li class="tab-title ' + status + '" ><a style="text-decoration:none;" href="#panel' + i + '">' + value['changedate'] + '</a></li>');
        }
        tab_content = tab_content.concat('<div class="content ' + status + '" id="panel' + i + '" style="height:400px;">');
        tab_content = tab_content.concat('<div style="height:280px;overflow:auto;margin-bottom:.5em">' + value['pageinfo'] + '</div>');
        tab_content = tab_content.concat('<div style="height:30px;">Edited by:&nbsp;' + value['username'] + '</div>');
        tab_content = tab_content.concat('</div>');
        i++;
        if(i==4) return false;;
    });

    tab_data = tab_data.concat('</ul>');
    tab_content = tab_content.concat('</div>')
    tab_data = tab_data.concat(tab_content);

    jQuery('#bpm_text_history_content').empty().prepend(tab_data);
    jQuery(document).foundation('tab', 'reflow');
    jQuery('#bpm_text_history_window').foundation('reveal', 'open');

}

function bpm_close_text(){

    //tinymce.activeEditor.setContent('');
    tinymce.remove();
    jQuery('#bpm_edit_text_window').foundation('reveal', 'close');
}

function bpm_splitString (string, size) {
    var re = new RegExp('.{1,' + size + '}', 'g');
    return string.match(re);
}

function bpm_save_text(selected_object){

    var is_reveal = 0;
    if(bpm_is_loading==1) return;
    bpm_is_loading = 1;

    if(selected_object<1){
        is_reveal = 1;
        var post_text = encodeURIComponent(tinymce.activeEditor.getContent());
        selected_object = bpm_current_section;
    }

    var post_chunk = [];
     if(post_text.length > 0) {
         if (post_text.length > 2000) {
             //split into an array of strings
             post_chunk = bpm_splitString(post_text, 2000);
         } else {
             post_chunk[0] = post_text;
         }
     }else{
         post_chunk[0] = ' ';
     }

    jQuery('#bpm_saving_text_alert').show();

        //post message
         var querystring = 'total=' + post_chunk.length + '&domain=' + bpm_current_domain + "&action=update_text&is_autosave=0&act=save&pageid=" + bpm_pageid + "&sectionid=" + selected_object + "&reset=1";
         jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', querystring, function (result) {
             if (result) {
                 jQuery.each(post_chunk, function (index, value) {
                     var item_id = index + 1;
                     querystring = 'this_item=' + item_id + '&total=' + post_chunk.length + '&domain=' + bpm_current_domain + "&action=update_text&is_autosave=0&act=save&pageid=" + bpm_pageid + "&sectionid=" + selected_object + "&pageinfo=" + value;

                     jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', querystring, function (result) {

                         if (result.SENDNEXT) {

                             bpm_is_loading = 0;
                             //update existing text view
                             if (result['content']) {
                                 jQuery('#bpm_text_' + selected_object).html(result['content']);
                             }

                             if (result['CHANGELOG']) {
                                 bpm_create_change_log(result);
                             }
                             //update history array
                             bpm_text_history[selected_object] = result['history'];
                             jQuery('#bpm_history_button_' + selected_object).show();

                             //clean text field and close reveal
                             jQuery('#bpm_edit_text_reveal_text').val('')

                             jQuery('#bpm_saving_text_alert').hide();
                             jQuery('#bpm_edit_text_window').foundation('reveal', 'close');
                             bpm_update_history_button();

                             var timeoutId = setTimeout(function () {
                                 if (is_reveal == 1) {
                                     //tinymce.activeEditor.setContent('');
                                     tinymce.remove();
                                 }
                             }, 500);
                         }
                     });
                 });
             }else{
                 //error
                 //jQuery('#bpm_saving_text_alert').hide();
             }
         });

}

function bpm_create_attachment(this_id, this_content, folder_list){

    var file_list = '';
    var has_files = 'style="display:none;"';
    var folders = '<ul class="dropdown" id="bpm_folder_list_dd_' + this_id + '"><li><label>Move to Folder</label></li>';

    folders = folders.concat('<li><a style="text-decoration: none;" onclick="bpm_file_button(' + this_id + ', 13, 0)" class="bpm_action" id="bpm_file_move_to_' + this_id + '_0">' + bpm_trans_array['bpm_lng_main'] + '</a></li>');

    var upload_folders = '<option value="0">' + bpm_trans_array['bpm_lng_main'] + '</option>';

    var attachment_object = jQuery('#bpm_attachment_section').html();
    attachment_object = attachment_object.replace(/FILEINDEX/g,this_id);

    if(this_content) {

        jQuery.each(folder_list, function (index, value) {
            folders = folders.concat('<li><a style="text-decoration: none;" onclick="bpm_file_button(' + this_id + ', 13, ' + value['id'] + ')" class="bpm_action" id="bpm_file_move_to_' + this_id + '_' + value['id'] + '">' + value['name'] + '</a></li>');
            upload_folders = upload_folders.concat('<option value="' + value['id'] + '">' + value['name'] + '</option>');
        });

        bpm_folder_list[this_id] = upload_folders;

        if (folder_list) {
            folders = folders.concat('</ul>');
            jQuery('#bpm_file_move_' + this_id).show();
        } else {
            folders = '';
            jQuery('#bpm_file_move_' + this_id).hide();
        }

        attachment_object = attachment_object.replace(/FILEFOLDERS/g, folders);


        file_list = bpm_create_file_list(this_content, this_id);
    }

    attachment_object = attachment_object.replace(/FILEDATA/g, file_list);
    attachment_object = attachment_object.replace(/FILESEARCH/g, has_files);

    return attachment_object;

}

function bpm_create_file_list(this_content, this_id){
    bpm_version_files = [];
    var file_list = '';
    var file_count = 0;

    if(this_content.length > 0){
        file_list = file_list.concat('<div class="bpm-row" id="bpm_file_header_'+ this_id+'">');
        file_list = file_list.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left"><input type="checkbox" name="bpm_files" onclick="bpm_file_button('+this_id+', 12)" id="bpm_check_all_'+this_id+'"></div>');

        file_list = file_list.concat('</div>');
    }

    jQuery.each(this_content,function(index, value) {

        if (value['file_name']) {
            file_count++;
            if(value['folder_id']!='0'){
                file_list = file_list.concat('<div class="bpm-row bpm_folder text-left bpm_folder_'+this_id+'_'+ value['folder_id'] +' bpm_file_'+this_id+'" style="display:none;">');
            }else{
                file_list = file_list.concat('<div class="bpm-row bpm_folder text-left  bpm_folder_'+this_id+'_0'+ ' bpm_file_'+this_id+'">');
            }
            file_list = file_list.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns">');
            var file_class = 'fa fa-save';

            if(value['file_icon']){
                file_class = bpm_get_file_icon(value['file_icon']);
            }
            //file name row
            file_list = file_list.concat('<div class="bpm-row">');
            file_list = file_list.concat('<div class="bpm-small-1 bpm-large-1 bpm-columns text-left"><input onclick="bpm_file_button('+this_id+', 11)" type="checkbox" name="bpm_file_select_'+this_id+'" value="bpm_file_'+value['file_index']+'"></div>');
            file_list = file_list.concat('<div class="bpm-small-8 bpm-large-8 bpm-columns bpm_grid_section_links bpm_file_text text-left"><span class="'+file_class+' bpm_file_icon bpm_file_text_header">&nbsp;&nbsp;</span><a href="' + value['file_href'] + '" target="_blank" class="bpm_links bpm_file_list_link">' + value['file_name'] + '</a></div>');
            if(value['children'] ) {
                bpm_version_files[value['file_index']] = value;
                file_list = file_list.concat('<div class="bpm-small-3 bpm-columns bpm_grid_section_links text-right"><a onclick="bpm_file_show_versions('+value['file_index']+','+this_id+');" class="bpm_versions_button bpm_nodecoration">'+bpm_trans_array['bpm_lng_versions']+'</a></div>');
            }else {
                file_list = file_list.concat('<div class="bpm-small-3 bpm-columns bpm_file_text">&nbsp;</div>');
            }
            file_list = file_list.concat('</div>');
            //file attributes row
            var file_date = value['file_date'].substring(0,6) + value['file_date'].substring(8);
            file_list = file_list.concat('<div class="bpm-row">');
            file_list = file_list.concat('<div class="bpm-small-1 bpm-columns bpm_file_text">&nbsp;</div>');
            file_list = file_list.concat('<div class="bpm-small-8 bpm-columns bpm_file_text bpm_grid_section_links bpm_sub_line">' + bpm_trans_array['bpm_lng_cap_by'] + ' ' + value['real_name'] + ' ' + bpm_trans_array['bpm_lng_on'] + ' ' + file_date + '</div>');
            file_list = file_list.concat('<div class="bpm-small-3 bpm-columns bpm_file_text bpm_grid_section_links text-right bpm_sub_line">' + value['file_size'] + '</div>');

            file_list = file_list.concat('</div>');

            file_list = file_list.concat('</div>');
            file_list = file_list.concat('<hr class="bpm_hr_gray">');
            file_list = file_list.concat('</div>');

        }
    });

    return file_list;
}

function bpm_file_show_versions(file_id, this_id){

    var html_line = '';
    var child_count = 0;
    var value = bpm_version_files[file_id];
    var file_class = bpm_get_file_icon(value['file_icon']);

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-small-2 bpm-large-2 bpm-columns">'+bpm_trans_array['bpm_lng_current_version']+'</div>');

    html_line = html_line.concat('<div class="bpm-small-10 bpm-large-10 bpm-columns">');

    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-small-1 bpm-large-1 bpm-columns text-left"><input onclick="bpm_file_button('+this_id+', 15)" type="checkbox" name="bpm_file_version_select" value="bpm_file_'+value['file_index']+'"></div>');
    html_line = html_line.concat('<div class="bpm-small-11 bpm-large-11 bpm-columns bpm_file_text"><span class="'+file_class+' bpm_file_icon bpm_file_text_header">&nbsp;&nbsp;</span><a href="' + value['file_href'] + '" target="_blank" class="bpm_links">' + value['file_name'] + '</a></div>');
    html_line = html_line.concat('</div>');
    //file attributes row
    var file_date = value['file_date'].substring(0,6) + value['file_date'].substring(8);
    html_line = html_line.concat('<div class="bpm-row">');
    html_line = html_line.concat('<div class="bpm-small-1 bpm-columns bpm_file_text">&nbsp;</div>');
    html_line = html_line.concat('<div class="bpm-small-8 bpm-columns bpm_file_text bpm_grid_section_links bpm_sub_line">' + bpm_trans_array['bpm_lng_cap_by'] + ' ' + value['real_name'] + ' ' + bpm_trans_array['bpm_lng_on'] + ' ' + file_date + '</div>');
    html_line = html_line.concat('<div class="bpm-small-3 bpm-columns bpm_file_text bpm_grid_section_links text-right bpm_sub_line">' + value['file_size'] + '</div>');
    html_line = html_line.concat('</div>');

    html_line = html_line.concat('</div>');

    html_line = html_line.concat('</div><br>');

    jQuery.each(bpm_version_files[file_id]['children'],function(index, value) {
        var header_display = '&nbsp;';
        if(index == 0){
            header_display = bpm_trans_array['bpm_lng_previous_versions'];
            child_count++;
        }

        html_line = html_line.concat('<div class="bpm-row">');
        html_line = html_line.concat('<div class="bpm-small-2 bpm-large-2 bpm-columns">'+header_display+'</div>');
        html_line = html_line.concat('<div class="bpm-small-10 bpm-large-10 bpm-columns">');

        html_line = html_line.concat('<div class="bpm-row">');
        html_line = html_line.concat('<div class="bpm-small-1 bpm-large-1 bpm-columns text-left"><input onclick="bpm_file_button('+this_id+', 15)" type="checkbox" name="bpm_file_version_select" value="bpm_file_'+value['file_index']+'"></div>');
        html_line = html_line.concat('<div class="bpm-small-11 bpm-large-11 bpm-columns bpm_file_text"><span class="'+file_class+' bpm_file_icon bpm_file_text_header">&nbsp;&nbsp;</span><a href="' + value['file_href'] + '" target="_blank" class="bpm_links">' + value['file_name'] + '</a></div>');
        html_line = html_line.concat('</div>');
        //file attributes row
        var file_date = value['file_date'].substring(0,6) + value['file_date'].substring(8);
        html_line = html_line.concat('<div class="bpm-row">');
        html_line = html_line.concat('<div class="bpm-small-1 bpm-columns bpm_file_text">&nbsp;</div>');
        html_line = html_line.concat('<div class="bpm-small-8 bpm-columns bpm_file_text bpm_grid_section_links bpm_sub_line">' + bpm_trans_array['bpm_lng_cap_by'] + ' ' + value['real_name'] + ' ' + bpm_trans_array['bpm_lng_on'] + ' ' + file_date + '</div>');
        html_line = html_line.concat('<div class="bpm-small-3 bpm-columns bpm_file_text bpm_grid_section_links text-right bpm_sub_line">' + value['file_size'] + '</div>');
        html_line = html_line.concat('</div>');

        html_line = html_line.concat('</div>');

        html_line = html_line.concat('</div>');
    });

    html_line = html_line.concat('<br><br>');

    jQuery('#bpm_attachments_versions_content').html(html_line);
    jQuery('#bpm_attachments_view_versions').foundation('reveal', 'open');
}

function bpm_confirm_version_delete(file_id){

    bpm_delete_from_source = 'versions';
    jQuery('#bpm_confirm_admin_file_delete').foundation('reveal', 'open');

}

function bpm_get_file_icon(file_icon){

    var file_class = 'fa fa-save';

    switch(file_icon){
        case 'save':
            file_class = 'fa fa-save';
            break;
        case 'doc_icon':
        case 'docx_icon':
            file_class = 'fa fa-file-word-o';
            break;
        case 'xls_icon':
        case 'xlsx_icon':
            file_class = 'fa fa-file-excel-o';
            break;
        case 'ppt_icon':
        case 'pptx_icon':
            file_class = 'fa fa-file-powerpoint-o';
            break;
        case 'pdf_icon':
            file_class = 'fa fa-file-pdf-o';
            break;
        case 'png_icon':
            file_class = 'fa fa-file-image-o';
            break;
        case 'zip_icon':
            file_class = 'fa fa-file-zip-o';
            break;
        case 'email_address':
            file_class = 'fa fa-envelope-o​';
            break;
        case 'txt_icon':
            file_class = 'fa fa-file-text-o​';
            break;
        case 'htm_icon':
            file_class = 'fa fa-html5';
            break;
        case 'exe_icon':
            file_class = 'fa fa-download';
            break;
        case 'wmv_icon':
            file_class = 'fa fa-file-movie-o​';
            break;
        case 'mov_icon':
            file_class = 'fa fa-file-movie-o​';
            break;
        case 'pps_icon':
            file_class = 'fa fa-file-powerpoint-o​';
            break;
        case 'rm_icon':
            file_class = 'fa fa-file-movie-o​';
            break;
        case 'rtf_icon':
            file_class = 'fa fa-file-word-o​';
            break;
    }

    return file_class;
}
function bpm_clear_search_grid(this_id){

    jQuery('#bpm_child_links_search_target').hide();
    jQuery('#bpm_links_search_clear_' + this_id).hide();
    jQuery('#bpm_links_search_button_' + this_id).show();
    jQuery('#bpm_text_' + this_id).show();
    jQuery('#bpm_tagged_search_results_'+this_id).html('').hide();
    jQuery('#bpm_links_search_count_' + this_id).text('').hide();
    jQuery('#bpm_links_search_field_'+this_id).val('');

    if(this_id=='999999'){
        jQuery('#bpm_tagged_links_999999').show();
        jQuery('#bpm_child_links_target').show();
    }

}

function bpm_search_grid(this_id){

    var search_string = jQuery('#bpm_links_search_field_'+this_id).val();

    var sectionid = this_id;

    if(this_id == '999999'){
        sectionid = bpm_child_link_create_id;
    }

    var query_string = 'sectionid=' + sectionid + '&domain=' + bpm_current_domain + "&action=search_pages&pageid=" + bpm_pageid + '&search=' + search_string;
    jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', query_string, function(result) {
        jQuery('#bpm_links_search_clear_' + this_id).show();
        jQuery('#bpm_links_search_button_' + this_id).hide();
        jQuery('#bpm_links_search_count_' + this_id).text(bpm_trans_array['bpm_lng_pages_found'] + ': '+ result.SEARCH.length).show();

        if(result.SEARCH.length > 0) {
            jQuery('#bpm_text_' + this_id).hide();
            var links_list = '';
            var links_object = jQuery('#bpm_tagged_page_section').html();
            var links_array = [];
            var bpm_link_string = '';
            var bpm_wfm_status = '';

            jQuery.each(result.SEARCH,function(index, value) {
                display = 1;
                if (value['page_id']) {
                    switch (value['wfm_status']) {
                        case '0':
                            bpm_wfm_status = 'Draft';
                            if(value['wfm_current_id'] != bpm_current_user_id) display = 0;
                            break;
                        case '1':
                            bpm_wfm_status = 'Open - ' + value['real_name'];
                            break;
                        case '2':
                            bpm_wfm_status = 'Closed';
                            break;
                    }
                    if(display==1) {
                        bpm_link_string = '<a class="url_links bpm_links" href="?pageid=' + value['page_id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['page_title'] + '">' + value['page_title'] + '</a>';
                        links_array.push({
                            col_1: bpm_link_string,
                            col_2: value['page_touched'].substr(0, 10),
                            col_3: bpm_wfm_status
                        });
                    }
                }

            });

            links_list = bpm_make_section_links_grid(links_array);

            if(this_id=='999999') {
                jQuery('#bpm_child_links_target').hide();
                jQuery('#bpm_child_links_search_target').html(links_list).show();
            }else{
                jQuery('#bpm_tagged_search_results_'+this_id).html(links_list).show();
            }


           bpm_set_url_links();
        }else{
            //no results found
            if(this_id=='999999'){
                jQuery('#bpm_child_links_target').hide();
                jQuery('#bpm_child_links_search_target').html(bpm_trans_array['bpm_lng_no_results']).show();
            }else{
                jQuery('#bpm_text_' + this_id).hide();
                jQuery('#bpm_tagged_search_results_'+this_id).html(bpm_trans_array['bpm_lng_no_results']).show();
            }

        }
    });


}

function bpm_file_load_files(selected_object, folder_id){

    jQuery('.bpm_folder').hide();
    bpm_selected_folder = folder_id;
    jQuery('.bpm_folder_'+selected_object+'_'+folder_id).show();
    jQuery('.bpm_file_tree_label').css('border-bottom', '');
    jQuery('#bpm_file_tree_'+folder_id).css('border-bottom', 'solid 1px black');
    if(folder_id>0) {
        jQuery('#bpm_file_folder_option_' + selected_object).show();
    }else{
        jQuery('#bpm_file_folder_option_' + selected_object).hide();
    }

}

function bpm_make_folder_tree(selected_object, folder_list){

    var folder_tree = '<ul class="tree"><li><a style="text-decoration: none;border-bottom:solid 1px black;" class="bpm_file_tree_label" id="bpm_file_tree_0" onclick="bpm_file_load_files('+selected_object+', 0)">' + bpm_trans_array['bpm_lng_main'] + '</a>' + '<ul>';
    var dd_folders = '<li><label>'+bpm_trans_array['bpm_lng_move_to_folder']+'</label></li>';
    var upload_folders = '<option value="0">' + bpm_trans_array['bpm_lng_main'] + '</option>';

    dd_folders = dd_folders.concat('<li><a style="text-decoration: none;" onclick="bpm_file_button(' + selected_object + ', 13, 0)" class="bpm_action" id="bpm_file_move_to_' + selected_object + '_0">' + bpm_trans_array['bpm_lng_main'] + '</a></li>');

    jQuery.each(folder_list,function(index, value) {
        folder_tree = folder_tree.concat('<li><a style="text-decoration: none;" class="bpm_file_tree_label" id="bpm_file_tree_' + value['id'] +'" onclick="bpm_file_load_files('+selected_object+', ' + value['id'] +')">' + value['name'] + '</a></li>');
        dd_folders = dd_folders.concat('<li><a style="text-decoration: none;" onclick="bpm_file_button('+selected_object+', 13, ' + value['id'] +')" class="bpm_action" id="bpm_file_move_to_'+selected_object+'_'+ value['id'] + '">' + value['name'] + '</a></li>');
        upload_folders = upload_folders.concat('<option value="' + value['id'] + '">' + value['name'] + '</option>');
    });

    if(folder_list){
        dd_folders = dd_folders.concat('</ul>');
        jQuery('#bpm_file_move_'+selected_object).show();
    }else{
        dd_folders = '';
        jQuery('#bpm_file_move_'+selected_object).hide();
    }


    folder_tree = folder_tree.concat('</ul></li></ul>');

    bpm_folder_list[selected_object] = upload_folders;

    jQuery('#tree_folder_div_' + selected_object).html(folder_tree);
    jQuery('#bpm_folder_list_dd_' + selected_object).html(dd_folders);

    bpm_file_load_files(selected_object, 0);

}

function bpm_file_button(selected_object, choice, file_info){

    switch(choice){
        case 1:

            break;
        case 2:

            break;
        case 3:

            break;
        case 4:
            //add new folder
            jQuery('#bpm_file_folder_option_' + selected_object).hide();
            jQuery('#bpm_file_rename_folder_form_'+selected_object).hide();
            jQuery('#bpm_button_new_folder_'+selected_object).show();
            jQuery('#bpm_file_add_folder_form_'+selected_object).hide();
            var post_text = jQuery('#bpm_add_folder_'+selected_object).val();
            var querystring = 'domain=' + bpm_current_domain + "&action=add_folder&pageid=" + bpm_pageid + "&sectionid=" + selected_object + "&folder_name=" + post_text;
            jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result){
                //update folder list using result
                if(result['content']){
                    bpm_make_folder_tree(selected_object, result['content']);
                }
                jQuery('.bpm_add_folder_input').val('');
            });
            break;

        case 6:
            if(bpm_storage_avail <= 0){
                jQuery('#bpm_attachment_no_storage_window').foundation('reveal', 'open');
            }else {
                var html_line = '';
                var upload_is_processing = 0;
                var file_list = [];
                var message = '';
                var this_folder = 0;
                var this_guid = bpm_guid();

                jQuery('#bpm_file_uploading_no_talat_alert').hide();
                jQuery('#bpm_file_uploading_alert').hide();
                jQuery('#bpm_upload_files').hide();
                jQuery('#bpm_upload_form_details').hide();
                jQuery('#bpm_upload_form').html('');

                jQuery('#bpm_attachment_window').foundation('reveal', 'open');
                var querystring = 'domain=' + bpm_current_domain + "&action=get_file_auth&pageid=" + bpm_pageid;
                jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', querystring, function (result) {
                    if (result) {
                        html_line = html_line.concat('<form action="https://s3.amazonaws.com/bpm-inbound/" method="POST" enctype="multipart/form-data" class="dropzone bpm_dropzone" id="bpm_dropzone" style="max-height:300px;overflow: auto;">');
                        html_line = html_line.concat('<input type="hidden" name="key" value="${filename}-' + this_guid + '">');

                        jQuery.each(result.FILEAUTH['inputs'], function (index, value) {
                            html_line = html_line.concat('<input type="hidden" name="' + index + '" value="' + value + '">');
                        });

                        html_line = html_line.concat('</form>')

                        jQuery('#bpm_upload_form').html(html_line);

                        var folder_dd = '<select id="bpm_upload_folder">';
                        folder_dd = folder_dd.concat(bpm_folder_list[selected_object]);

                        folder_dd = folder_dd.concat('</select>');

                        jQuery('#bpm_upload_folders').html(folder_dd);

                        var myDropzone = new Dropzone("#bpm_dropzone", {
                            autoProcessQueue: false,
                            parallelUploads: 101,
                            maxFiles: 100,
                            addRemoveLinks: true,
                            dictDefaultMessage: '<div class="text-center" style="width:100%">'+bpm_trans_array['bpm_lng_click_files']+'</div>'
                        });

                        myDropzone.on("complete", function (file) {
                            file_list.push(file['name']);
                            //myDropzone.removeFile(file);
                        });

                        myDropzone.on("addedfile", function () {
                            jQuery('#bpm_upload_files').show();
                        });

                        myDropzone.on("removedfile", function (file) {
                            var index = file_list.indexOf(file['name']);
                            if (index >= 0) {
                                file_list.splice( index, 1 );
                            }
                            if (myDropzone.getQueuedFiles().length == 0) {
                                jQuery('#bpm_upload_files').hide();
                            }
                        });

                        myDropzone.on("queuecomplete", function () {
                            if (jQuery('#bpm_edit_upload_text').val().length > 0) {
                                message = '&message=' + encodeURIComponent(jQuery('#bpm_edit_upload_text').val());
                            } else {
                                message = '';
                            }
                            var send_to = '';
                            if (bpm_talat_list.length > 0) {
                                jQuery(bpm_talat_list).each(function (index, value) {
                                    if (send_to.length > 0) send_to = send_to.concat(',');
                                    send_to = send_to.concat(value);
                                });
                            }

                            this_folder = jQuery('#bpm_upload_folder').val();

                            var send_files = '';
                            if (file_list.length > 0) {
                                jQuery(file_list).each(function (index, value) {
                                    send_files = send_files.concat('&files[]=' + encodeURIComponent(value));
                                });
                            }
                            var query_string = 'sectionid=' + selected_object + '&domain=' + bpm_current_domain + "&action=uploaded_files&pageid=" + bpm_pageid + message + '&send_to=' + send_to + '&folder=' + this_folder + send_files + '&fileid=' + this_guid;

                            jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', query_string, function (result) {
                                if (result) {
                                    //update file list
                                    jQuery('#bpm_file_list_' + selected_object).html(bpm_create_file_list(result.FILEINFO['FILELIST'], selected_object));

                                    //update change log
                                    bpm_create_change_log(result.FILEINFO);

                                    //close window
                                    jQuery('#bpm_attachment_window').foundation('reveal', 'close');

                                    //show folder with uploaded files
                                    bpm_file_load_files(selected_object, this_folder);
                                    bpm_update_dashboard();

                                }

                            });

                        });

                        var suggestions = [];
                        bpm_talat_list = [];
                        jQuery('.bpm_talat_user').remove();
                        jQuery('#bpm_upload_talat_alert').hide();
                        jQuery('#bpm_upload_form_talat').css('max-height', jQuery('#bpm_upload_form_talat').css('height'));

                        jQuery('#bpm_upload_form_talat').on('keyup keypress', function(e) {
                            var code = e.keyCode || e.which;
                            if (code == 13) {
                                e.preventDefault();
                                return false;
                            }
                        });
                        if(bpm_page_status == 0){
                            jQuery('#bpm_edit_upload_text').hide();
                            jQuery('#bpm_upload_talat_to').hide();
                            jQuery('#bpm_add_talat_user_button').hide();
                        }

                        if (bpm_page_status > 0) {
                            jQuery('#bpm_edit_upload_text').attr("placeholder", bpm_trans_array['bpm_lng_talat_placeholder_not_draft']).prop("disabled", false).show();
                            jQuery('#bpm_upload_talat_to').prop("disabled", false).show();
                            jQuery('#bpm_add_talat_user_button').prop("disabled", false).show();

                            jQuery.each(bpm_dashboard[99], function (i, val) {
                                suggestions.push({label: val.real_name, value: val.user_id});

                            });

                            jQuery('#bpm_edit_upload_text').val('');
                            jQuery('#bpm_upload_talat_to').css('z-index', '1006');
                            jQuery("#bpm_upload_talat_to").autocomplete({

                                //define callback to format results
                                source: suggestions,
                                appendTo: '#bpm_upload_form_talat',

                                //define select handler
                                select: function (e, ui) {
                                    var add_item = 0;
                                    jQuery(bpm_talat_list).each(function (index, value) {
                                        if (value === ui.item.value) {
                                            add_item = 1;
                                        }
                                    });

                                    if (add_item == 0) {
                                        var friend = ui.item.value,
                                            span = jQuery("<span>").text(ui.item.label).prop('id', 'bpm_talat_user_' + ui.item.value).addClass("bpm_talat_user"),
                                            a = jQuery("<a>").addClass("remove").attr({
                                                onclick: "bpm_remove_talat_user(" + ui.item.value + ", 2)",
                                                title: "Remove " + ui.item.label
                                            }).text(" x ").appendTo(span);
                                        span.insertBefore("#bpm_upload_talat_list");
                                        bpm_talat_list.push(ui.item.value);
                                        jQuery('#bpm_file_uploading_no_talat_alert').hide();
                                    }

                                },
                                close: function () {
                                    jQuery("#bpm_upload_talat_to").val('');
                                },
                                change: function () {
                                    jQuery("#bpm_upload_talat_to").val("").css("top", 2);
                                }
                            });
                            jQuery('#bpm_upload_talat_to').autocomplete('close');
                        } else {
                            //hide talat feature
                            jQuery('#bpm_edit_upload_text').attr("placeholder", bpm_trans_array['bpm_lng_talat_placeholder_draft']).prop("disabled", true);
                            jQuery('#bpm_upload_talat_to').prop("disabled", true);
                            jQuery('#bpm_add_talat_user_button').prop("disabled", true);

                        }

                        //assign handler to button
                        jQuery("#bpm_upload_files").click(function () {
                            if (bpm_talat_list.length == 0 && jQuery("#bpm_edit_upload_text").val().length > 0 && bpm_page_status > 0) {
                                jQuery('#bpm_file_uploading_no_talat_alert').show();

                            }else {
                                jQuery('#bpm_file_uploading_no_talat_alert').hide();
                                jQuery('#bpm_file_uploading_alert').show();
                                jQuery('#bpm_upload_files').hide();
                                myDropzone.processQueue();
                            }
                        });
                    }
                });
            }

            break;
        case 5:
            //show new folder field
            jQuery('#bpm_button_new_folder_'+selected_object).hide();
            jQuery('#bpm_file_add_folder_form_'+selected_object).show();
            document.getElementById('bpm_add_folder_'+selected_object).focus();
            break;
        case 8:
            //show rename form
            jQuery('#bpm_file_folder_option_' + selected_object).hide();
            jQuery('#bpm_file_rename_folder_form_'+selected_object).show();
            jQuery('#bpm_button_new_folder_'+selected_object).hide();
            jQuery('#bpm_file_add_folder_form_'+selected_object).hide();
            jQuery('#bpm_rename_folder_'+selected_object).val(jQuery('#bpm_file_tree_'+bpm_selected_folder).text());
            var rename_text = jQuery('#bpm_rename_folder_'+selected_object);
            var rename_length= rename_text.val().length * 2;
            jQuery('#bpm_rename_folder_'+selected_object).focus();
            rename_text[0].setSelectionRange(rename_length, rename_length);

            break;
        case 9:
            //rename folder
            jQuery('#bpm_file_rename_folder_form_'+selected_object).hide();
            jQuery('#bpm_button_new_folder_'+selected_object).show();
            jQuery('#bpm_file_folder_option_'+selected_object).hide();
            if(bpm_selected_folder==0) return;
            var post_text = jQuery('#bpm_rename_folder_'+selected_object).val();
            var querystring = 'domain=' + bpm_current_domain + "&action=rename_folder&pageid=" + bpm_pageid + "&sectionid=" + selected_object + '&folder_id='+bpm_selected_folder+'&folder_name=' + post_text;
            jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result){
                //update folder list using result
                if(result['content']){
                    bpm_make_folder_tree(selected_object, result['content']);
                }
                jQuery('.bpm_rename_folder_input').val('');
            });
            break;
        case 10:
            //delete folder
            jQuery('#bpm_file_rename_folder_form_'+selected_object).hide();
            jQuery('#bpm_button_new_folder_'+selected_object).show();
            jQuery('#bpm_file_folder_option_'+selected_object).hide();
            if(bpm_selected_folder==0) return;
            jQuery('#bpm_file_folder_option_' + selected_object).hide();
            var querystring = 'domain=' + bpm_current_domain + "&action=delete_folder&pageid=" + bpm_pageid + "&sectionid=" + selected_object + '&folder_id='+bpm_selected_folder;
            jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result){
                //update folder list using result
                if(result['content']){
                    jQuery('#bpm_main_loading_alert').show();
                    bpm_load_page(bpm_get_string + '&action=bpmcontext', 1);

                }
            });
            break;
        case 11:
            //show file options if items are checked
            var open_status = jQuery("#bpm_section_top_bar_bpm_acc_" + selected_object).css('display');
            if(open_status=='none') jQuery("#bpm_top_bar_" + selected_object).click();

            var n = jQuery("input[name='bpm_file_select_"+selected_object+"']:checked").length;
            if(n==0){
                jQuery('#bpm_file_options_'+selected_object).hide();
            }else{
                jQuery('#bpm_file_options_'+selected_object).show();
            }


            break;
        case 12:
            var open_status = jQuery("#bpm_section_top_bar_bpm_acc_" + selected_object).css('display');
            if(open_status=='none') jQuery("#bpm_top_bar_" + selected_object).click();

            var n = jQuery("#bpm_check_all_"+selected_object+":checked").length;
            if(n==0){
                //uncheck all

                jQuery('#bpm_file_options_'+selected_object).hide();
                jQuery("input[name='bpm_file_select_"+selected_object+"']").prop('checked', false);

            }else{
                //check all
                jQuery("input[name='bpm_file_select_"+selected_object+"']").prop('checked', true);
                jQuery('#bpm_file_options_'+selected_object).show();
            }
            break;
        case 13:
            //move all checked files to the selected folder
            jQuery('#bpm_file_options_'+selected_object).hide();
            var file_list = '';
            var files = 0;
            jQuery('input[name="bpm_file_select_'+selected_object +'"]:checked').each(function(){
                if(files > 0) file_list = file_list.concat(',');
                files++;
                file_list = file_list.concat(jQuery(this).prop('value').substr(9));
            });

            var querystring = 'domain=' + bpm_current_domain + "&action=move_files&pageid=" + bpm_pageid + "&sectionid=" + selected_object + '&folder_id='+file_info + '&files=' + file_list;

            jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result){
                //update file list using result
                if(result){

                    //update file list
                    jQuery('#bpm_file_list_'+ selected_object).html(bpm_create_file_list(result.FILEINFO['FILELIST'], selected_object));

                    //update change log
                    bpm_create_change_log(result.FILEINFO);

                }
                bpm_file_load_files(selected_object, file_info);
                jQuery("#bpm_check_all_"+selected_object).prop('checked', false);
            });
            break;
        case 14:
            //delete files
            jQuery('#bpm_file_options_'+selected_object).hide();
            bpm_delete_from = selected_object;
            jQuery('#bpm_confirm_admin_file_delete').foundation('reveal', 'open');
            break;

        case 15:
            //show or hide admin delete button on reveal
            var any_checked = 0;
            bpm_delete_from = selected_object;
            jQuery('#bpm_confirm_version_delete').hide();
            jQuery('input[name="bpm_file_version_select"]:checked').each(function(){
                any_checked++;
            });
            if(any_checked) jQuery('#bpm_confirm_version_delete').show();
            break;


    }

}

function bpm_delete_files(){

    var file_list = '';
    var files = 0;
    if(bpm_delete_from_source=='versions'){
        jQuery('input[name="bpm_file_version_select"]:checked').each(function () {
            if (files > 0) file_list = file_list.concat(',');
            files++;
            file_list = file_list.concat(jQuery(this).prop('value').substr(9));
        });
    }else {
        jQuery('input[name="bpm_file_select_' + bpm_delete_from + '"]:checked').each(function () {
            if (files > 0) file_list = file_list.concat(',');
            files++;
            file_list = file_list.concat(jQuery(this).prop('value').substr(9));
        });
    }

    if(file_list) {
        var querystring = 'domain=' + bpm_current_domain + "&action=delete_files&pageid=" + bpm_pageid + "&sectionid=" + bpm_delete_from + '&files=' + file_list;
        jQuery.getJSON('https://' + server + '/api/bpmcontext_wordpress.php?callback=?', querystring, function (result) {
            //update file list using result
            if (result) {
                jQuery('#bpm_confirm_admin_file_delete').foundation('reveal', 'close');

                //update file list
                jQuery('#bpm_file_list_' + bpm_delete_from).html(bpm_create_file_list(result.FILEINFO['FILELIST'], bpm_delete_from));

                //update change log
                bpm_create_change_log(result.FILEINFO);

            }
            jQuery("#bpm_check_all_" + bpm_delete_from).prop('checked', false);
        });
    }else{
        jQuery("#bpm_check_all_" + bpm_delete_from).prop('checked', false);
    }

}

function bpm_guid() {
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

function bpm_create_tagged_page_links(this_id, this_content, page_name, page_count){

    var links_list = '';
    var display;
    var links_object = jQuery('#bpm_tagged_page_section').html();
    links_object = links_object.replace(/TAGGEDINDEX/g,this_id);
    links_object = links_object.replace(/TAGGEDNAME/g,page_name);

    if(this_content) {

        var links_array = [];
        var bpm_link_string = '';
        var bpm_wfm_status = '';

        jQuery.each(this_content[0],function(index, value) {
            display = 1;
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
                    if(display ==1) {
                        bpm_link_string = '<a class="url_links bpm_links" href="?pageid=' + value['page_id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['page_title'] + '">' + value['page_title'] + '</a>';
                        links_array.push({
                            col_1: bpm_link_string,
                            col_2: value['page_touched'].substr(0, 10),
                            col_3: bpm_wfm_status,
                            col_4: value['real_name']
                        });
                    }
                }

        });

        links_list = bpm_create_page('bpm_section_page', this_id, 1, links_array, true, page_count, 1);
    }

    links_object = links_object.replace(/TAGGEDDATA/g,links_list);

    return links_object;
}

function bpm_create_child_links(this_id, this_content, this_sections, link_count, bpm_links_ids){

    var html_info = '';
    var set_title = 0;
    var main_content = '';

    var tab_list = '';
    var tab_content = '';
    var t = 0;
    var added_tab = 0;
    var active = 'active';
    var links_object = jQuery('#bpm_child_links_section').html();

    if(this_content){

        jQuery.each(this_sections,function(index, value) {
            //add tab
            var links_array = [];
            var bpm_link_string = '';
            var bpm_wfm_status = '';
            var links_list = '';
            if(added_tab==1) active = '';
            var tab_items = 0;
            var display;
            var total_items = link_count[t];


            if(this_content[t]) {

                jQuery.each(this_content[t], function (index, value) {
                    //add tab content
                    tab_items++;
                    display = 1;

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
                        if(display ==1) {
                            bpm_link_string = '<a class="url_links bpm_links " href="?pageid=' + value['page_id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext"  title="' + value['page_title'] + '">' + value['page_title'] + '</a>';
                            links_array.push({
                                col_1: bpm_link_string,
                                col_2: value['page_touched'].substr(0, 10),
                                col_3: bpm_wfm_status,
                                col_4: value['real_name']
                            });
                        }
                    }

                });
            }

            if(tab_items > 0) {
                bpm_page_has_children++;
                if(tab_list.length == 0){
                    bpm_child_link_create_id = bpm_links_ids[t];
                    bpm_child_link_create_name = value;
                }else {
                    active = '';
                }
                tab_list = tab_list.concat('<li class="bpm_file_bottom_border"><a id="bpm_load_child_links_menu_item_'+bpm_links_ids[t]+'" class="bpm_nodecoration bpm_no_wrap" onclick="bpm_load_child_links('+bpm_links_ids[t]+')" >' + value + '&nbsp;('+total_items+')</a></li>');

                links_list = bpm_create_page('bpm_section_page', bpm_links_ids[t], 1, links_array, true, total_items, 2);
                tab_content = '';
                tab_content = tab_content.concat('<div id="bpm_tagged_links_999999" style="width:100%;overflow-y: auto;overflow-x:hidden">'+links_list+'</div>');
                tab_content = tab_content.concat('</div>');
                tab_content = tab_content.concat('<div id="bpm_tagged_search_results_999999" style="margin-top:3px;max-height: 250px;overflow-x: hidden;display:none;"></div>');
                bpm_child_links_data[bpm_links_ids[t]] = tab_content;
                added_tab++;
                if(set_title==0){
                    main_content = tab_content;
                    bpm_page_links_title = '&nbsp;'+bpm_trans_array['bpm_lng_page_links']+ ' - ' + value + '&nbsp;('+total_items+')<div style="float:right;display: inline;" class="fi-pencil"></div>';
                }
                set_title++;
            }
            t++;
        });

    }


    html_info = html_info.concat('<div id="bpm_child_links_top" style="overflow-y: auto;overflow-x: hidden">');

    html_info = html_info.concat('<div class="bpm-row">');
    html_info = html_info.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns">');
    html_info = html_info.concat('<div id="bpm_child_links_target">'+main_content+'</div>'); //content
    html_info = html_info.concat('</div>'); //end of child links
    html_info = html_info.concat('</div>'); //end of bpm-row
    html_info = html_info.concat('<div class="bpm-row">');
    html_info = html_info.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns hide" id="bpm_child_links_search_target">');
    html_info = html_info.concat('<div ></div>'); //content
    html_info = html_info.concat('</div>'); //end of child links
    html_info = html_info.concat('</div>'); //end of bpm-row
    html_info = html_info.concat('</div>'); //end of section

    html_info = html_info.concat('<ul id="bpm_page_type_list" data-options="align:right" class="f-dropdown" data-dropdown-content ">');
    html_info = html_info.concat(tab_list);
    html_info = html_info.concat('</ul>');

    links_object = links_object.replace(/LINKSDATA/g,html_info);

    return links_object;
}

function bpm_load_child_links(selected_object){


    bpm_clear_search_grid('999999');
    bpm_child_link_create_name = jQuery('#bpm_load_child_links_menu_item_' + selected_object).text().split('(');
    bpm_child_link_create_name =jQuery.trim(bpm_child_link_create_name[0]);
    bpm_child_link_create_id = selected_object;

    if(bpm_child_link_create_name==jQuery('#bpm_template_name_Employee').text()){
        jQuery('#bpm_add_page_child_links').hide();
    }else{
        jQuery('#bpm_add_page_child_links').show();
    }

    jQuery('#bpm_top_bar_999999').html('&nbsp;'+bpm_trans_array['bpm_lng_page_links']+ ' - ' + jQuery('#bpm_load_child_links_menu_item_' + selected_object).text() + '<div style="float:right;display: inline;" class="fi-pencil"></div>');

    jQuery('#bpm_child_links_title').text(jQuery('#bpm_load_child_links_menu_item_' + selected_object).text());
    jQuery('#bpm_child_links_target').html(bpm_child_links_data[selected_object]);
    bpm_set_url_links();
}

function bpm_make_links_grid(this_content, cols, row_count){

    var bpm_grid_data = '';
    var grid_count = 0;
    var column_count = 3;
    if(cols) column_count = cols;

    if(this_content){
        jQuery.each(this_content, function (index, value) {
            bpm_grid_data = bpm_grid_data.concat('<div class="bpm-row">');
            switch(column_count){
                case 1:
                    bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns grid_links text-left">' + value['col_1'] + '</div>');
                    break;
                case 2:
                    bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-9 bpm-large-9 bpm-columns grid_links text-left">' + value['col_1'] + '</div>');
                    bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns grid_links text-left">' + value['col_2'] + '</div>');
                    break;
                case 3:
                    bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-8 bpm-large-6 bpm-columns bpm_grid_section_links text-left">' + value['col_1'] + '</div>');
                    bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-1 bpm-large-3 bpm-columns bpm_grid_section_links text-left">' + value['col_2'] + '</div>');
                    bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns bpm_grid_section_links text-left">' + value['col_3'] + '</div>');
                    break;
                case 4:
                    bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns bpm_grid_section_links text-left">' + value['col_1'] + '</div>');
                    bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-4 bpm-large-4 bpm-columns bpm_grid_section_links text-left">' + value['col_2'] + '</div>');
                    bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns bpm_grid_section_links text-left">' + value['col_3'] + '</div>');
                    bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-2 bpm-large-2 bpm-columns bpm_grid_section_links text-left">' + value['col_4'] + '</div>');
                    break;
                case 5:
                    bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-4 bpm-large-4 bpm-columns grid_links text-left">' + value['col_1'] + '</div>');
                    bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-3 bpm-large-3 bpm-columns grid_links text-left">' + value['col_2'] + '</div>');
                    bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-2 bpm-large-2 bpm-columns grid_links text-left">' + value['col_3'] + '</div>');
                    bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-2 bpm-large-2 bpm-columns grid_links text-left">' + value['col_4'] + '</div>');
                    bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-1 bpm-large-1 bpm-columns grid_links text-left">' + value['col_5'] + '</div>');
                    break;
            }
            bpm_grid_data = bpm_grid_data.concat('</div>');
            grid_count++;
            if (grid_count > 300 && cols!=4) return false;
        });
        if(grid_count < row_count && row_count){
            for(grid_count = grid_count; grid_count < row_count; grid_count++){
                bpm_grid_data = bpm_grid_data.concat('<div class="bpm-row">');
                bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns bpm_grid_section_links">&nbsp;</div>');
                bpm_grid_data = bpm_grid_data.concat('</div>');
            }
        }


    }

return bpm_grid_data;

}

function bpm_make_section_links_grid(this_content){

    var bpm_grid_data = '';

    if(this_content){
        jQuery.each(this_content, function (index, value) {
            var real_name = ' ';
            if(value['col_4']) real_name = bpm_trans_array['bpm_lng_updated_by'] + ' ' +  value['col_4'];
            bpm_grid_data = bpm_grid_data.concat('<div class="bpm-row full-width ">');
            bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns text-left">');
            bpm_grid_data = bpm_grid_data.concat('<div class="bpm-row">');
            bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-12 bpm-large-12 bpm-columns bpm_grid_section_links  text-left">' + value['col_1'] + '</div>');
            bpm_grid_data = bpm_grid_data.concat('</div>'); //end of first row
            bpm_grid_data = bpm_grid_data.concat('<div class="bpm-row">');
            bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-7 bpm-large-7 bpm-columns bpm_grid_section_links bpm_sub_line  text-left">' +  bpm_trans_array['bpm_lng_last_updated'] + ' ' + value['col_2'] + '</div>');
            bpm_grid_data = bpm_grid_data.concat('<div class="bpm-small-5 bpm-large-5 bpm-columns bpm_grid_section_links bpm_sub_line  text-left">'+bpm_trans_array['bpm_lng_status']+ ': ' + value['col_3'] + '</div>');
            bpm_grid_data = bpm_grid_data.concat('</div>'); //end of second row
            bpm_grid_data = bpm_grid_data.concat('</div>');  //end of column wrapper
            bpm_grid_data = bpm_grid_data.concat('</div>');  //end of rwo wrapper
            bpm_grid_data = bpm_grid_data.concat('<hr class="bpm_hr_gray">');
        });
    }

    return bpm_grid_data;

}

function bpm_create_page(section_tag, section_id, page_number, links_array, return_val, page_count, section_type){

    if(section_type==1) section_tag = 'bpm_section_page';
    if(section_type==2) section_tag = 'bpm_tagged_links_999999';

    if(jQuery('#'+section_tag+'_'+section_id+'_'+page_number).length){
        jQuery('.'+section_tag+'_'+section_id).hide();
        jQuery('#'+section_tag+'_'+section_id+'_'+page_number).show();
    }else {

        if(links_array){
            return bpm_make_page_content(section_tag, section_id, page_number, links_array, return_val, page_count, section_type);
        }else{

        }
        //get page info from server
        var querystring = 'domain=' + bpm_current_domain + "&action=get_page_section_data&pageid=" + bpm_pageid + "&sectionid=" + section_id + '&page_number=' + page_number;

        jQuery.getJSON('https://'+server+'/api/bpmcontext_wordpress.php?callback=?', querystring, function(result) {

            if(result.PAGEDATA) {

                var links_array = [];
                var bpm_link_string = '';
                var bpm_wfm_status = '';

                jQuery.each(result.PAGEDATA,function(index, value) {
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
                        bpm_link_string = '<a class="url_links bpm_links" href="?pageid=' + value['page_id'] + '&domain=' + bpm_current_domain + '&action=bpmcontext" title="' + value['page_title'] + '">' + value['page_title'] + '</a>';
                        links_array.push({
                            col_1: bpm_link_string,
                            col_2: value['page_touched'].substr(0, 10),
                            col_3: bpm_wfm_status,
                            col_4: value['real_name']
                        });
                    }

                });
                bpm_make_page_content(section_tag, section_id, page_number, links_array, return_val, page_count, section_type);
            }
        });
    }
}

function bpm_make_page_content(section_tag, section_id, page_number, links_array, return_val, page_count, section_type){

    var page_count_push = page_count;
    page_count = Math.ceil(page_count / 8);

    var pages = '';
    var cur_page = 1;
    var page_group_start ;
    var left_start = page_number;
    var right_start = page_count - 2;
    var has_right = 0

    if(page_count > 6) has_right = 1;

    if(page_count < 7) {
        page_group_start = page_count + 1;
        left_start = 1;
    }else{
        page_group_start = page_number + 3;
        left_start = page_number;
    }

    if (page_count > 1) {

        //has  pages
        pages = pages.concat('<ul class="pagination">');

        //show left arrow
        if (page_number == 1) {
            pages = pages.concat('<li class="arrow unavailable bpm_nodecoration"><a>&laquo;</a></li>');
        } else {
                var prev_page = page_number - 1;
                pages = pages.concat('<li class="arrow"><a onclick="bpm_create_page(0' + ',' + section_id + ',' + 1 + ',0,0,' + page_count_push + ','+section_type+')">&laquo;</a></li>');
        }

        for (cur_page = 1; cur_page < page_count + 1; cur_page++) {
            var display_page = 0;

            if(page_count < 7){
                display_page = 1;
            }else{
                if(cur_page <= page_number + 2 && cur_page > page_number - 1) display_page = 1;
                if(cur_page >= page_count - 2 ) display_page = 1;
                if(page_number >= page_count - 6 && cur_page >= page_count - 6) display_page = 1;
            }

            if(display_page) {
                if (page_number == cur_page) {
                    pages = pages.concat('<li class="current"><a onclick="bpm_create_page(0' + ',' + section_id + ',' + cur_page + ',0,0,' + page_count_push + ','+section_type+')">' + cur_page + '</a></li>');
                } else {
                    pages = pages.concat('<li><a onclick="bpm_create_page(0' + ',' + section_id + ',' + cur_page + ',0,0,' + page_count_push + ','+section_type+')">' + cur_page + '</a></li>');
                }
            }
            if(page_count > 7 && cur_page == page_number + 3) {
                pages = pages.concat('<li class="unavailable bpm_nodecoration"><a >&hellip;</a></li>');
            }

        }

        //show right arrow
        if (page_count == page_number) {
            pages = pages.concat('<li class="arrow unavailable bpm_nodecoration"><a>&raquo;</a></li>');
        } else {
            var next_page = page_number + 1;
            pages = pages.concat('<li class="arrow"><a onclick="bpm_create_page(0'+','+section_id+','+page_count+',0,0,'+page_count_push+','+section_type+')">&raquo;</a></li>');
        }
        pages = pages.concat('</ul>');

    }
    var html_line = '<div class="' + section_tag + '_' + section_id + '" id="' + section_tag + '_' + section_id + '_' + page_number + '">';
    html_line = html_line.concat(bpm_make_section_links_grid(links_array)  + '<div class="bpm_page_footer">'+ pages+'</div></div>');

    if (return_val) {
        return html_line;
    } else {
        if(section_type==1) {
            jQuery('#bpm_text_' + section_id).prepend(html_line);
        }else{
            jQuery('#bpm_tagged_links_999999').prepend(html_line);
        }
        jQuery('.' + section_tag + '_' + section_id).hide();
        jQuery('#' + section_tag + '_' + section_id + '_' + page_number).show();
    }
}
function bpm_create_spreadsheet(this_id, this_content){


    return 'nada';

}