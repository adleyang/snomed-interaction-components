/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function searchPanel(divElement, options) {
    var thread = null;
    var panel = this;
    this.subscribers = [];
    var lastT = "";
    var xhr = null;
    if (typeof componentsRegistry == "undefined") {
        componentsRegistry = [];
    }

    this.markerColor = 'black';
    this.type = "search";
    this.divElement = divElement;
    this.options = jQuery.extend(true, {}, options);
    var componentLoaded = false;
    $.each(componentsRegistry, function (i, field) {
        if (field.divElement.id == panel.divElement.id) {
            componentLoaded = true;
        }
    });
    if (componentLoaded == false) {
        componentsRegistry.push(panel);
    }

    this.history = [];
    this.setupCanvas = function () {
        searchHtml = "<div style='margin: 5px; height:95%;overflow:auto;' class='panel panel-default'>";
        searchHtml = searchHtml + "<div class='panel-heading'>";
        searchHtml = searchHtml + "<button id='" + panel.divElement.id + "-subscribersMarker' class='btn btn-link btn-lg' style='padding: 2px; position: absolute;top: 1px;left: 0px;'><i class='glyphicon glyphicon-bookmark'></i></button>"
        searchHtml = searchHtml + "<div class='row'>";
        searchHtml = searchHtml + "<div class='col-md-8' id='" + panel.divElement.id + "-panelTitle'>&nbsp&nbsp&nbsp<strong><span class='i18n' data-i18n-id='i18n_search'>Search</span></span></strong></div>";
        searchHtml = searchHtml + "<div class='col-md-4 text-right'>";
        searchHtml = searchHtml + "<button id='" + panel.divElement.id + "-linkerButton' class='btn btn-link jqui-draggable linker-button' data-panel='" + panel.divElement.id + "' style='padding:2px'><i class='glyphicon glyphicon-link'></i></button>"
        searchHtml = searchHtml + "<button id='" + panel.divElement.id + "-historyButton' class='btn btn-link history-button' style='padding:2px'><i class='glyphicon glyphicon-time'></i></button>"
        searchHtml = searchHtml + "<button id='" + panel.divElement.id + "-configButton' class='btn btn-link' style='padding:2px' data-target='#" + panel.divElement.id + "-configModal'><i class='glyphicon glyphicon-cog'></i></button>"
        searchHtml = searchHtml + "<button id='" + panel.divElement.id + "-collapseButton' class='btn btn-link' style='padding:2px'><i class='glyphicon glyphicon-resize-small'></i></button>"
        searchHtml = searchHtml + "<button id='" + panel.divElement.id + "-expandButton' class='btn btn-link' style='padding:2px'><i class='glyphicon glyphicon-resize-full'></i></button>"
        searchHtml = searchHtml + "<button id='" + panel.divElement.id + "-closeButton' class='btn btn-link' style='padding:2px'><i class='glyphicon glyphicon-remove'></i></button>"
        searchHtml = searchHtml + "</div>";
        searchHtml = searchHtml + "</div>";
        searchHtml = searchHtml + "</div>";
        searchHtml = searchHtml + "<div class='panel-body' style='height:86%' id='" + panel.divElement.id + "-panelBody'>";
        searchHtml = searchHtml + '<form>';
        searchHtml = searchHtml + '<div class="form-group" style="margin-bottom: 2px;">';
        searchHtml = searchHtml + '<label for="' + panel.divElement.id + '-searchBox">';
        searchHtml = searchHtml + '<span class="i18n" data-i18n-id="i18n_type_3_chars">Type at least 3 characters</span> <i class="glyphicon glyphicon-remove text-danger" id="' + panel.divElement.id + '-typeIcon"></i> <span id="' + panel.divElement.id + '-searchExample"></span></label>';
        if (typeof i18n_search_placeholder == "undefined") {
            i18n_search_placeholder = "Search...";
        }
        searchHtml = searchHtml + '<input type="search" class="form-control" id="' + panel.divElement.id + '-searchBox" placeholder="' + i18n_search_placeholder + '" autocomplete="off">';
        searchHtml = searchHtml + '</div>';
        searchHtml = searchHtml + '</form>';
        searchHtml = searchHtml + "<div id='" + panel.divElement.id + "-searchConfigBar' style='margin-bottom: 10px;'><nav class='navbar navbar-default' role='navigation' style='min-height: 28px;border-radius: 0px;border-bottom: 1px lightgray solid;'>";
        searchHtml = searchHtml + " <ul class='nav navbar-nav navbar-left'>";
        searchHtml = searchHtml + "     <li class='dropdown' style='margin-bottom: 2px; margin-top: 2px;'>";
        searchHtml = searchHtml + "         <a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown' style='padding-top: 2px; padding-bottom: 2px;'><span id='" + panel.divElement.id + "-navSearchModeLabel'></span> <b class='caret'></b></a>";
        searchHtml = searchHtml + "         <ul class='dropdown-menu' role='menu' style='float: none;'>";
        searchHtml = searchHtml + "             <li><button class='btn btn-link' id='" + panel.divElement.id + "-fullTextButton'><span class='i18n' data-i18n-id='i18n_full_text_search_mode'>Full text search mode</span></button></li>";
        searchHtml = searchHtml + "             <li><button class='btn btn-link' id='" + panel.divElement.id + "-partialMatchingButton'><span class='i18n' data-i18n-id='i18n_partial_match_search_mode'>Partial matching search mode</span></button></li>";
        searchHtml = searchHtml + "             <li><button class='btn btn-link' id='" + panel.divElement.id + "-regexButton'><span class='i18n' data-i18n-id='i18n_regex_search_mode'>Regular Expressions search mode</span></button></li>";
        searchHtml = searchHtml + "         </ul>";
        searchHtml = searchHtml + "     </li>";
        searchHtml = searchHtml + "     <li class='dropdown' style='margin-bottom: 2px; margin-top: 2px;'>";
        searchHtml = searchHtml + "         <a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown' style='padding-top: 2px; padding-bottom: 2px;'><span id='" + panel.divElement.id + "-navLanguageLabel'></span> <b class='caret'></b></a>";
        searchHtml = searchHtml + "         <ul class='dropdown-menu' role='menu' style='float: none;'>";
        searchHtml = searchHtml + "             <li><button class='btn btn-link' id='" + panel.divElement.id + "-danishLangButton'><span class='i18n' data-i18n-id='i18n_danish_stemmer'>Danish language stemmer</span></button></li>";
        searchHtml = searchHtml + "             <li><button class='btn btn-link' id='" + panel.divElement.id + "-englishLangButton'><span class='i18n' data-i18n-id='i18n_english_stemmer'>English language stemmer</span></button></li>";
        searchHtml = searchHtml + "             <li><button class='btn btn-link' id='" + panel.divElement.id + "-spanishLangButton'><span class='i18n' data-i18n-id='i18n_spanish_stemmer'>Spanish language stemmer</span></button></li>";
        searchHtml = searchHtml + "         </ul>";
        searchHtml = searchHtml + "     </li>";
        /*searchHtml = searchHtml + "     <li class='dropdown' style='margin-bottom: 2px; margin-top: 2px;'>";
        searchHtml = searchHtml + "         <a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown' style='padding-top: 2px; padding-bottom: 2px;'><span class='i18n' data-i18n-id='i18n_filters'>Filters</span>: <span id='" + panel.divElement.id + "-navFiltersLabel'></span> <b class='caret'></b></a>";
        searchHtml = searchHtml + "         <ul class='dropdown-menu' role='menu' style='float: none;'>";
        searchHtml = searchHtml + "             <li class='dropdown-submenu'> <a tabindex='-1' href='#'><span class='i18n' data-i18n-id='i18n_filter_semtag'>Filter by Semantic Tag</span></a>";
        searchHtml = searchHtml + "                 <ul class='dropdown-menu' role='menu' style='float: none;'>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>attribute</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>body structure</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>environment / location</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>event</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>finding</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>linkage concept</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>metadata</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>observable entity</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>organism</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>physical force</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>physical object</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>procedure</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>product</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>qualifier value</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>record artifact</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>situation</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>social concept</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>special concept</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>specimen</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>staging scale</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>substance</button></li>";
        searchHtml = searchHtml + "                     <li><button class='btn btn-link semtag-button' style='padding-top: 1px;padding-bottom: 1px;'>tumor staging</button></li>";
        searchHtml = searchHtml + "                 </ul>";
        searchHtml = searchHtml + "             </li>";
        searchHtml = searchHtml + "         </ul>";
        searchHtml = searchHtml + "     </li>";*/
        searchHtml = searchHtml + " </ul>";
        searchHtml = searchHtml + "</nav></div>";
        searchHtml = searchHtml + "<div class='panel panel-default' style='height:70%;overflow:auto;margin-bottom: 15px;min-height: 300px;'>";
        searchHtml = searchHtml + '<div id="' + panel.divElement.id + '-searchBar"></div>';
        searchHtml = searchHtml + "<table id='" + panel.divElement.id + "-resultsTable' class='table table-bordered'>";
        searchHtml = searchHtml + "</table>";
        searchHtml = searchHtml + "</div>";
        searchHtml = searchHtml + "</div>";
        searchHtml = searchHtml + "</div>";
        // modal semtags panel
        searchHtml = searchHtml + "<div class='modal fade' id='" + panel.divElement.id + "-configModal'>";
        searchHtml = searchHtml + "<div class='modal-dialog'>";
        searchHtml = searchHtml + "<div class='modal-content'>";
        searchHtml = searchHtml + "<div class='modal-header'>";
        searchHtml = searchHtml + "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>";
        searchHtml = searchHtml + "<h4 class='modal-title'><span class='i18n' data-i18n-id='i18n_options'>Filter by Semantic Tags</span></h4>";
        searchHtml = searchHtml + "</div>";
        searchHtml = searchHtml + "<div class='modal-body' id='" + panel.divElement.id + "-modal-body'>";
        searchHtml = searchHtml + "<div class='col-md-4'>";
        searchHtml = searchHtml + '   <div class="form-group">';
        searchHtml = searchHtml + '       <div class="checkbox"><label>';
        searchHtml = searchHtml + '           <input type="checkbox" id="' + panel.divElement.id + '-childrenOption"> <span class="i18n" data-i18n-id="i18n_display_children">attribute</span>';
        searchHtml = searchHtml + '       </label></div>';
        searchHtml = searchHtml + '       <div class="checkbox"><label>';
        searchHtml = searchHtml + '           <input type="checkbox" id="' + panel.divElement.id + '-childrenOption"> <span class="i18n" data-i18n-id="i18n_display_children">attribute</span>';
        searchHtml = searchHtml + '       </label></div>';
        searchHtml = searchHtml + '       <div class="checkbox"><label>';
        searchHtml = searchHtml + '           <input type="checkbox" id="' + panel.divElement.id + '-childrenOption"> <span class="i18n" data-i18n-id="i18n_display_children">attribute</span>';
        searchHtml = searchHtml + '       </label></div>';
        searchHtml = searchHtml + '       <div class="checkbox"><label>';
        searchHtml = searchHtml + '           <input type="checkbox" id="' + panel.divElement.id + '-childrenOption"> <span class="i18n" data-i18n-id="i18n_display_children">attribute</span>';
        searchHtml = searchHtml + '       </label></div>';
        searchHtml = searchHtml + '       <div class="checkbox"><label>';
        searchHtml = searchHtml + '           <input type="checkbox" id="' + panel.divElement.id + '-childrenOption"> <span class="i18n" data-i18n-id="i18n_display_children">attribute</span>';
        searchHtml = searchHtml + '       </label></div>';
        searchHtml = searchHtml + '       <div class="checkbox"><label>';
        searchHtml = searchHtml + '           <input type="checkbox" id="' + panel.divElement.id + '-childrenOption"> <span class="i18n" data-i18n-id="i18n_display_children">attribute</span>';
        searchHtml = searchHtml + '       </label></div>';
        searchHtml = searchHtml + '       <div class="checkbox"><label>';
        searchHtml = searchHtml + '           <input type="checkbox" id="' + panel.divElement.id + '-childrenOption"> <span class="i18n" data-i18n-id="i18n_display_children">attribute</span>';
        searchHtml = searchHtml + '       </label></div>';
        searchHtml = searchHtml + '       <div class="checkbox"><label>';
        searchHtml = searchHtml + '           <input type="checkbox" id="' + panel.divElement.id + '-childrenOption"> <span class="i18n" data-i18n-id="i18n_display_children">attribute</span>';
        searchHtml = searchHtml + '       </label></div>';
        searchHtml = searchHtml + '       <div class="checkbox"><label>';
        searchHtml = searchHtml + '           <input type="checkbox" id="' + panel.divElement.id + '-childrenOption"> <span class="i18n" data-i18n-id="i18n_display_children">attribute</span>';
        searchHtml = searchHtml + '       </label></div>';
        searchHtml = searchHtml + '   </div>';
        searchHtml = searchHtml + "</div>";
        searchHtml = searchHtml + "<div class='col-md-4'>";
        searchHtml = searchHtml + "</div>";
        searchHtml = searchHtml + "<div class='col-md-4'>";
        searchHtml = searchHtml + "</div>";
        searchHtml = searchHtml + "</div>";
        searchHtml = searchHtml + "<div class='modal-footer'>";
        searchHtml = searchHtml + "<button type='button' class='btn btn-danger' data-dismiss='modal'><span class='i18n' data-i18n-id='i18n_cancel'>Cancel</span></button>";
        searchHtml = searchHtml + "<button id='" + panel.divElement.id + "-apply-button' type='button' class='btn btn-success' data-dismiss='modal'><span class='i18n' data-i18n-id='i18n_apply_changes'>Apply changes</span></button>";
        searchHtml = searchHtml + "</div>";
        searchHtml = searchHtml + "</div><!-- /.modal-content -->";
        searchHtml = searchHtml + "</div><!-- /.modal-dialog -->";
        searchHtml = searchHtml + "</div><!-- /.modal -->";
        $(divElement).html(searchHtml);
        $('#' + panel.divElement.id + '-searchBox').keyup(function () {
            clearTimeout(thread);
            var $this = $(this);
            thread = setTimeout(function () {
                panel.search($this.val())
            }, 500);
        });
        $("#" + panel.divElement.id + "-linkerButton").disableTextSelect();
        $("#" + panel.divElement.id + "-subscribersMarker").disableTextSelect();
        $("#" + panel.divElement.id + "-configButton").disableTextSelect();
        $("#" + panel.divElement.id + "-historyButton").disableTextSelect();
        $("#" + panel.divElement.id + "-collapseButton").disableTextSelect();
        $("#" + panel.divElement.id + "-expandButton").disableTextSelect();
        $("#" + panel.divElement.id + "-closeButton").disableTextSelect();
        $("#" + panel.divElement.id + "-expandButton").hide();
        $("#" + panel.divElement.id + "-subscribersMarker").hide();

        $("#" + panel.divElement.id).find('.semtag-button').click(function (event) {
            console.log("Semtag click: " + $(this).html());
        });

        //$("#" + panel.divElement.id + "-searchConfigBar").slideUp('fast');
        if (options.searchMode != "fullText") {
            $("#" + panel.divElement.id + '-navLanguageLabel').closest('a').hide();
        }

        $("#" + panel.divElement.id + "-configButton").click(function (event) {
            $("#" + panel.divElement.id + "-searchConfigBar").slideToggle('slow');
            });

        if (typeof panel.options.closeButton != "undefined" && panel.options.closeButton == false) {
            $("#" + panel.divElement.id + "-closeButton").hide();
        }

        if (typeof panel.options.linkerButton != "undefined" && panel.options.linkerButton == false) {
            $("#" + panel.divElement.id + "-linkerButton").hide();
        }

        if (typeof panel.options.collapseButton != "undefined" && panel.options.collapseButton == false) {
            $("#" + panel.divElement.id + "-expandButton").hide();
            $("#" + panel.divElement.id + "-collapseButton").hide();
        }

        $("#" + panel.divElement.id + "-expandButton").click(function (event) {
            $("#" + panel.divElement.id + "-panelBody").slideDown("fast");
            $("#" + panel.divElement.id + "-expandButton").hide();
            $("#" + panel.divElement.id + "-collapseButton").show();
        });
        $("#" + panel.divElement.id + "-collapseButton").click(function (event) {
            $("#" + panel.divElement.id + "-panelBody").slideUp("fast");
            $("#" + panel.divElement.id + "-expandButton").show();
            $("#" + panel.divElement.id + "-collapseButton").hide();
        });

        if (typeof i18n_panel_options == "undefined") {
            i18n_panel_options = "Panel options";
        }
        $("#" + panel.divElement.id + "-configButton").tooltip({
            placement : 'left',
            trigger: 'hover',
            title: i18n_panel_options,
            animation: true,
            delay: 1000
        });
        if (typeof i18n_history == "undefined") {
            i18n_history = 'History';
        }
        $("#" + panel.divElement.id + "-historyButton").tooltip({
            placement : 'left',
            trigger: 'hover',
            title: i18n_history,
            animation: true,
            delay: 1000
        });
        if (typeof i18n_panel_links == "undefined") {
            i18n_panel_links = 'Panel links';
        }
        $("#" + panel.divElement.id + "-linkerButton").tooltip({
            placement : 'left',
            trigger: 'hover',
            title: i18n_panel_links,
            animation: true,
            delay: 1000
        });

        $("#" + panel.divElement.id + "-linkerButton").draggable({
            cancel: false,
            appendTo: 'body',
            helper: 'clone',
            delay: 500
        });
        $("#" + panel.divElement.id + "-linkerButton").droppable({
            drop: panel.handlePanelDropEvent,
            hoverClass: "bg-info"
        });
        $("#" + panel.divElement.id + "-apply-button").click(function () {
            panel.readOptionsPanel();
            var searchTerm = $('#' + panel.divElement.id + '-searchBox').val();
            console.log("searchTerm: " + searchTerm);
            if (searchTerm.length > 0) {
                panel.search(searchTerm + " ");
            }
        });
        $("#" + panel.divElement.id + "-historyButton").click(function (event) {
            $("#" + panel.divElement.id + "-historyButton").popover({
                trigger: 'manual',
                placement: 'bottomRight',
                html: true,
                content: function () {
                    historyHtml = '<div style="height:100px;overflow:auto;">';
                    if (panel.history.length == 0) {
                        historyHtml = historyHtml + '<div class="text-center text-muted" style="width:100%"><em><span class="i18n" data-i18n-id="i18n_no_search_terms">No search terms yet...</span></em></div>';
                    }
                    historyHtml = historyHtml + '<table>';
                    var reversedHistory = panel.history.slice(0);
                    reversedHistory.reverse();
                    //console.log(JSON.stringify(reversedHistory));
                    $.each(reversedHistory, function (i, field) {
                        var d = new Date();
                        var curTime = d.getTime();
                        var ago = curTime - field.time;
                        var agoString = "";
                        if (ago < (1000 * 60)) {
                            if (Math.round((ago / 1000)) == 1) {
                                agoString = Math.round((ago / 1000)) + ' second ago';
                            } else {
                                agoString = Math.round((ago / 1000)) + ' seconds ago';
                            }
                        } else if (ago < (1000 * 60 * 60)) {
                            if (Math.round((ago / 1000) / 60) == 1) {
                                agoString = Math.round((ago / 1000) / 60) + ' minute ago';
                            } else {
                                agoString = Math.round((ago / 1000) / 60) + ' minutes ago';
                            }
                        } else if (ago < (1000 * 60 * 60 * 60)) {
                            if (Math.round(((ago / 1000) / 60) / 60) == 1) {
                                agoString = Math.round(((ago / 1000) / 60) / 60) + ' hour ago';
                            } else {
                                agoString = Math.round(((ago / 1000) / 60) / 60) + ' hours ago';
                            }
                        }
                        historyHtml = historyHtml + '<tr><td><a href="javascript:void(0);" onclick="searchInPanel(\'' + panel.divElement.id + '\',\'' + field.searchTerm + '\');">' + field.searchTerm + '</a>';
                        historyHtml = historyHtml + ' <span class="text-muted" style="font-size: 80%"><em>' + agoString + '<em></span>';
                        historyHtml = historyHtml + '</td></tr>';
                    });
                    historyHtml = historyHtml + '</table>';
                    historyHtml = historyHtml + '</div>';
                    return historyHtml;
                }
            });
            $("#" + panel.divElement.id + "-historyButton").popover('toggle');
        });
        $("#" + panel.divElement.id + "-linkerButton").click(function (event) {
            $("#" + panel.divElement.id + "-linkerButton").popover({
                trigger: 'manual',
                placement: 'bottomRight',
                html: true,
                content: function () {
                    linkerHtml = '<div class="text-center text-muted"><em><span class="i18n" data-i18n-id="i18n_drag_to_link">Drag to link with other panels</span><br>';
                    if (panel.subscribers.length == 1) {
                        linkerHtml = linkerHtml + panel.subscribers.length + ' link established</em></div>';
                    } else {
                        linkerHtml = linkerHtml + panel.subscribers.length + ' links established</em></div>';
                    }
                    linkerHtml = linkerHtml + '<div class="text-center"><a href="javascript:void(0);" onclick="clearSearchPanelSubscriptions(\'' + panel.divElement.id + '\');"><span class="i18n" data-i18n-id="i18n_clear_links">Clear links</span></a></div>';
                    return linkerHtml;
                }
            });
            $("#" + panel.divElement.id + "-linkerButton").popover('toggle');
        });

        $("#" + panel.divElement.id + "-fullTextButton").click(function (event) {
            panel.options.searchMode = 'fullText';
            panel.updateSearchLabel();
            var searchTerm = $('#' + panel.divElement.id + '-searchBox').val();
            $("#" + panel.divElement.id + '-navLanguageLabel').closest('a').show();
            if (searchTerm.charAt(0) == "^") {
                $("#" + panel.divElement.id + '-searchBox').val(searchTerm.slice(1));
            }
            if (searchTerm.length > 0) {
                panel.search(searchTerm, true);
            }
        });
        $("#" + panel.divElement.id + "-partialMatchingButton").click(function (event) {
            panel.options.searchMode = 'partialMatching';
            panel.updateSearchLabel();
            var searchTerm = $('#' + panel.divElement.id + '-searchBox').val();
            $("#" + panel.divElement.id + '-navLanguageLabel').closest('a').hide();
            if (searchTerm.charAt(0) == "^") {
                $("#" + panel.divElement.id + '-searchBox').val(searchTerm.slice(1));
            }
            if (searchTerm.length > 0) {
                panel.search(searchTerm, true);
            }
        });
        $("#" + panel.divElement.id + "-regexButton").click(function (event) {
            panel.options.searchMode = 'regex';
            panel.updateSearchLabel();
            var searchTerm = $('#' + panel.divElement.id + '-searchBox').val();
            $("#" + panel.divElement.id + '-navLanguageLabel').closest('a').hide();
            if (searchTerm.charAt(0) != "^") {
                $("#" + panel.divElement.id + '-searchBox').val("^" + searchTerm);
            }
            if (searchTerm.length > 0) {
                panel.search(searchTerm, true);
            }
        });

        $("#" + panel.divElement.id + "-danishLangButton").click(function (event) {
            panel.options.searchLang = 'danish';
            $("#" + panel.divElement.id + '-navLanguageLabel').html("<span class='i18n' data-i18n-id='i18n_danish_stemmer'>Danish language stemmer</span>");
            var searchTerm = $('#' + panel.divElement.id + '-searchBox').val();
            if (searchTerm.length > 0) {
                panel.search(searchTerm, true);
            }
        });
        $("#" + panel.divElement.id + "-englishLangButton").click(function (event) {
            panel.options.searchLang = 'english';
            $("#" + panel.divElement.id + '-navLanguageLabel').html("<span class='i18n' data-i18n-id='i18n_english_stemmer'>English language stemmer</span>");
            var searchTerm = $('#' + panel.divElement.id + '-searchBox').val();
            if (searchTerm.length > 0) {
                panel.search(searchTerm, true);
            }
        });
        $("#" + panel.divElement.id + "-spanishLangButton").click(function (event) {
            panel.options.searchLang = 'spanish';
            $("#" + panel.divElement.id + '-navLanguageLabel').html("<span class='i18n' data-i18n-id='i18n_spanish_stemmer'>Spanish language stemmer</span>");
            var searchTerm = $('#' + panel.divElement.id + '-searchBox').val();
            if (searchTerm.length > 0) {
                panel.search(searchTerm, true);
            }
        });
    }

    this.handlePanelDropEvent = function (event, ui) {
        var draggable = ui.draggable;
        if (!draggable.attr('data-panel')) {
//console.log("ignore");
        } else {
//console.log("OK : " + draggable.attr('data-panel'));
            $.each(componentsRegistry, function (i, field) {
                if (field.divElement.id == draggable.attr('data-panel')) {
                    if (field.type == "concept-details") {
                        panel.subscribe(field);
                    }
                }
            });
        }
    }

    this.search = function (t, forceSearch) {
        if (typeof panel.options.searchMode == "undefined") {
            panel.options.searchMode = "regex";
        }

        if (typeof forceSearch == "undefined") {
            forceSearch = false;
        }
        // panel.divElement.id + '-typeIcon
        if (t != "" && (t != lastT || forceSearch)) {
            if (t.length < 3) {
                $('#' + panel.divElement.id + '-typeIcon').removeClass('glyphicon-ok');
                $('#' + panel.divElement.id + '-typeIcon').removeClass('text-success');
                $('#' + panel.divElement.id + '-typeIcon').addClass('glyphicon-remove');
                $('#' + panel.divElement.id + '-typeIcon').addClass('text-danger');
            } else {
                $('#' + panel.divElement.id + '-typeIcon').removeClass('glyphicon-remove');
                $('#' + panel.divElement.id + '-typeIcon').removeClass('text-danger');
                $('#' + panel.divElement.id + '-typeIcon').addClass('glyphicon-ok');
                $('#' + panel.divElement.id + '-typeIcon').addClass('text-success');
                lastT = t;
                //console.log(t);
                var d = new Date();
                var time = d.getTime();
                panel.history.push({searchTerm: t, time: time});
                //t = t.charAt(0).toUpperCase() + t.slice(1);
                //console.log("Capitalized t: " + t);
                $('#' + panel.divElement.id + '-resultsTable').html("<i class='glyphicon glyphicon-refresh icon-spin'></i>");
                resultsHtml = "";
                if (xhr != null) {
                    xhr.abort();
                    console.log("aborting call...");
                }
                $('#' + panel.divElement.id + '-searchBar').html("<span class='text-muted'>Searching..</span>");
                //console.log("panel.options.searchMode " + panel.options.searchMode);
                t = t.trim();
                if (isNumber(t)) {
                    if (t.substr(-2, 1) == "0") {
                        // Search conceptId
                        xhr = $.getJSON(options.serverUrl + "/" + options.edition + "/" + options.release + "/concepts/" + t,function (result) {

                        }).done(function (result) {
                                $.each(result.descriptions, function (i, field) {
                                    console.log(i);
                                    resultsHtml = resultsHtml + "<tr class='resultRow selectable-row'><td class='col-md-7'><div class='jqui-draggable result-item' data-concept-id='" + field.conceptId + "' data-term='" + field.term + "'>" + field.term + "</div></td><td class='text-muted small-text col-md-5 result-item'  data-concept-id='" + field.conceptId + "' data-term='" + field.term + "'>" + result.defaultTerm + "</td></tr>";
                                });
                                $('#' + panel.divElement.id + '-resultsTable').html(resultsHtml);
                                $('#' + panel.divElement.id + '-searchBar').html("<span class='text-muted'></span>");
                                $('#' + panel.divElement.id + '-resultsTable').find(".jqui-draggable").draggable({
                                    appendTo: 'body',
                                    helper: 'clone',
                                    delay: 500
                                });
                                $('#' + panel.divElement.id + '-resultsTable').find(".result-item").click(function (event) {
                                    $.each(panel.subscribers, function (i, field) {
//console.log("Notify to " + field.divElement.id + " selected " + $(event.target).attr('data-concept-id'));
                                        field.conceptId = $(event.target).attr('data-concept-id');
                                        field.updateCanvas();
                                    });
                                });
                            });
                    } else if (t.substr(-2, 1) == "1") {
                        xhr = $.getJSON(options.serverUrl + "/" + options.edition + "/" + options.release + "/descriptions/" + t,function (result) {

                        }).done(function (result) {
                                $.each(result, function (i, field) {
                                    console.log(i);
                                    resultsHtml = resultsHtml + "<tr class='resultRow selectable-row'><td class='col-md-7'><div class='jqui-draggable result-item' data-concept-id='" + field.conceptId + "' data-term='" + field.term + "'>" + field.term + "</div></td><td class='text-muted small-text col-md-5 result-item'  data-concept-id='" + field.conceptId + "' data-term='" + field.term + "'>" + field.fsn + "</td></tr>";
                                });
                                $('#' + panel.divElement.id + '-resultsTable').html(resultsHtml);
                                $('#' + panel.divElement.id + '-searchBar').html("<span class='text-muted'></span>");
                                $('#' + panel.divElement.id + '-resultsTable').find(".jqui-draggable").draggable({
                                    appendTo: 'body',
                                    helper: 'clone',
                                    delay: 500
                                });
                                $('#' + panel.divElement.id + '-resultsTable').find(".result-item").click(function (event) {
                                    $.each(panel.subscribers, function (i, field) {
//console.log("Notify to " + field.divElement.id + " selected " + $(event.target).attr('data-concept-id'));
                                        field.conceptId = $(event.target).attr('data-concept-id');
                                        field.updateCanvas();
                                    });
                                });
                            });
                    } else {
                        resultsHtml = resultsHtml + "<tr><td class='text-muted'>No results</td></tr>";
                        $('#' + panel.divElement.id + '-resultsTable').html(resultsHtml);
                        $('#' + panel.divElement.id + '-searchBar').html("<span class='text-muted'></span>");
                    }
                } else {
                    if (panel.options.searchMode == "partialMatching") {
                        t = t.toLowerCase();
                    }
                    var startTime = Date.now();
                    xhr = $.getJSON(options.serverUrl + "/" + options.edition + "/" + options.release + "/descriptions?query=" + t + "&limit=50&searchMode=" + panel.options.searchMode + "&lang=" + panel.options.searchLang,function (result) {

                    }).done(function (result) {
                            var endTime = Date.now();
                            var elapsed = (endTime - startTime)/1000;
                            var countResults = result.length;
                            var searchComment = "";
                            if (countResults == 100) {
                                searchComment = "<span class='text-muted'>More than 100 matches found in " + elapsed + " seconds. Searches are truncated at 100 results ordered by length.</span>";
                            } else {
                                searchComment = "<span class='text-muted'>Found " + countResults + " in " + elapsed + " seconds...</span>";
                            }
                            $('#' + panel.divElement.id + '-searchBar').html(searchComment);
                            xhr = null;
                            var matchedDescriptions = result;
                            //console.log(JSON.stringify(result));

                            if (matchedDescriptions.length <= 0) {
                                resultsHtml = resultsHtml + "<tr><td class='text-muted'>No results</td></tr>";
                                $('#' + panel.divElement.id + '-resultsTable').html(resultsHtml);
                            } else {
                                if (panel.options.searchMode == "regex") {
                                    matchedDescriptions.sort(function (a, b) {
                                        if (a.term.length < b.term.length)
                                            return -1;
                                        if (a.term.length > b.term.length)
                                            return 1;
                                        return 0;
                                    });
                                }
                                $.each(matchedDescriptions, function (i, field) {
                                    resultsHtml = resultsHtml + "<tr class='resultRow selectable-row'><td class='col-md-6'><div class='jqui-draggable result-item' data-concept-id='" + field.conceptId + "' data-term='" + field.term + "'>" + field.term + "</div></td><td class='text-muted small-text col-md-6 result-item'  data-concept-id='" + field.conceptId + "' data-term='" + field.term + "'>" + field.fsn + "</td></tr>";
                                });
                                if (matchedDescriptions.length == 0) {
                                    resultsHtml = resultsHtml + "<tr><td><em>No results</em></td></tr>";
                                }
                                $('#' + panel.divElement.id + '-resultsTable').html(resultsHtml);
                                $('#' + panel.divElement.id + '-resultsTable').find(".jqui-draggable").draggable({
                                    appendTo: 'body',
                                    helper: 'clone',
                                    delay: 500
                                });
                                $('#' + panel.divElement.id + '-resultsTable').find(".result-item").click(function (event) {
                                    $.each(panel.subscribers, function (i, field) {
//console.log("Notify to " + field.divElement.id + " selected " + $(event.target).attr('data-concept-id'));
                                        field.conceptId = $(event.target).attr('data-concept-id');
                                        field.updateCanvas();
                                    });
                                });
                            }
                        }).fail(function () {
                            resultsHtml = resultsHtml + "<tr><td class='text-muted'>No results</td></tr>";
                            $('#' + panel.divElement.id + '-resultsTable').html(resultsHtml);
//$('#resultsTable').html("<div class='alert alert-danger'><strong>Error</strong> while retrieving data from server...</div>");
                        });
                }
            }
        }
    }

    this.subscribe = function (subscriber) {
        var alreadySubscribed = false;
        $.each(panel.subscribers, function (i, field) {
            if (subscriber.divElement.id == field.divElement.id) {
                alreadySubscribed = true;
            }
        });
        if (!alreadySubscribed) {
            if (panel.subscribers.length == 0) {
                if (typeof globalMarkerColor == "undefined") {
                    globalMarkerColor = 'black';
                }
                panel.markerColor = panel.getNextMarkerColor(globalMarkerColor);
                //console.log(panel.markerColor);
                $("#" + panel.divElement.id + "-subscribersMarker").css('color', panel.markerColor);
                $("#" + panel.divElement.id + "-subscribersMarker").show();
            }
            panel.subscribers.push(subscriber);
            subscriber.setSubscription(panel);
        }
    }

    this.unsubscribe = function (subscriber) {
        var indexToRemove = -1;
        var i = 0;
        $.each(panel.subscribers, function (i, field) {
            if (subscriber.divElement.id == field.divElement.id) {
                indexToRemove = i;
            }
            i = i + 1;
        });
        if (indexToRemove > -1) {
            panel.subscribers.splice(indexToRemove, 1);
        }
        if (panel.subscribers.length == 0) {
            $("#" + panel.divElement.id + "-subscribersMarker").hide();
        }
        subscriber.clearSubscription();
    }

    this.unsubscribeAll = function () {
        var subscribersClone = panel.subscribers.slice(0);
        $.each(subscribersClone, function (i, field) {
            panel.unsubscribe(field);
        });
    }

    this.getNextMarkerColor = function (color) {
//console.log(color);
        var returnColor = 'black';
        if (color == 'black') {
            returnColor = 'green';
        } else if (color == 'green') {
            returnColor = 'purple';
        } else if (color == 'purple') {
            returnColor = 'red';
        } else if (color == 'red') {
            returnColor = 'blue';
        } else if (color == 'blue') {
            returnColor = 'green';
        }
//console.log(returnColor);
        globalMarkerColor = returnColor;
        return returnColor;
    }

    this.updateSearchLabel = function () {
        if (typeof panel.options.searchMode == "undefined") {
            panel.options.searchMode = "partialMatching";
        }
        if (panel.options.searchMode == "regex") {
            $("#" + panel.divElement.id + '-searchExample').html("<span class='i18n text-muted' data-i18n-id='i18n_search_examp_1'>" + i18n_search_examp_1  +  "</span> ");
            $("#" + panel.divElement.id + '-navSearchModeLabel').html("<span class='i18n' data-i18n-id='i18n_regex_search_mode'>" + i18n_regex_search_mode  +  "</span>");
        } else if (panel.options.searchMode == "fullText") {
            $("#" + panel.divElement.id + '-searchExample').html("<span class='i18n text-muted' data-i18n-id='i18n_search_examp_2'>" + i18n_search_examp_2  +  "</em></span> ");
            $("#" + panel.divElement.id + '-navSearchModeLabel').html("<span class='i18n' data-i18n-id='i18n_full_text_search_mode'>" + i18n_full_text_search_mode  +  "</span>");
        } else if (panel.options.searchMode == "partialMatching") {
            $("#" + panel.divElement.id + '-searchExample').html("<span class='i18n text-muted' data-i18n-id='i18n_search_examp_3'>" + i18n_search_examp_3  +  "</span> ");
            $("#" + panel.divElement.id + '-navSearchModeLabel').html("<span class='i18n' data-i18n-id='i18n_partial_match_search_mode'>" + i18n_partial_match_search_mode  +  "</span>");
        }

        if (typeof panel.options.searchLang == "undefined") {
            panel.options.searchLang = "english";
        }
        if (panel.options.searchLang == "danish") {
            $("#" + panel.divElement.id + '-navLanguageLabel').html("<span class='i18n' data-i18n-id='i18n_danish_stemmer'>" + i18n_danish_stemmer  +  "</span>");
        } else if (panel.options.searchLang == "english") {
            $("#" + panel.divElement.id + '-navLanguageLabel').html("<span class='i18n' data-i18n-id='i18n_english_stemmer'>" + i18n_english_stemmer  +  "</span>");
        } else if (panel.options.searchLang == "spanish") {
            $("#" + panel.divElement.id + '-navLanguageLabel').html("<span class='i18n' data-i18n-id='i18n_spanish_stemmer'>" + i18n_spanish_stemmer  +  "</span>");
        }

    }

    this.setupCanvas();
    this.updateSearchLabel();

}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function clearSearchPanelSubscriptions(divElementId1) {
    var d1;
    $.each(componentsRegistry, function(i, field) {
        if (field.divElement.id == divElementId1) {
            d1 = field;
        }
    });
    d1.unsubscribeAll();
    $("#" + divElementId1).find('.linker-button').popover('toggle');
}

function searchInPanel(divElementId, searchTerm) {
    $.each(componentsRegistry, function (i, field) {
//console.log(field.divElement.id + ' == ' + divElementId);
        if (field.divElement.id == divElementId) {
            $('#' + divElementId + '-searchBox').val(searchTerm);
            field.search(searchTerm);
        }
    });
    $('.history-button').popover('hide');
}

$(document).keypress(function (event) {
    if (event.which == '13') {
        event.preventDefault();
    }
});