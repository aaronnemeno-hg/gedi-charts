$(document).ready(()=> {

    /** declare variables with default values for the charts */
    // default category
    var category = 'gender';

    // default year
    var year = "2021";

    // default roles
    var roles = 'us_overall;intl_overall;us_bca;us_bds;us_bgs';
    var rolesArr = roles.split(";");
    console.log(rolesArr);

    // initialize with injected custom plugin service to chart
    initChartPluginService();

    // load with default category, year, and roles values
    loadCharts(category, year, rolesArr);

    // initialize tabs
    initTabs();

    // initialize roleLinks
    initRoleLinks('.gender-role-links');
    initRoleLinks('.re-role-links');

});

function initChartPluginService() {
    console.log("initialize chart plugin service");
    Chart.pluginService.register({
        beforeDraw: function(chart) {
            if (chart.config.options.elements.center) {
            // Get ctx from string
            var ctx = chart.chart.ctx;

            // Get options from the center object in options
            var centerConfig = chart.config.options.elements.center;
            var fontStyle = centerConfig.fontStyle || 'Arial';
            var headline = centerConfig.headline || '';
            var txt = centerConfig.text || '';
            var color = centerConfig.color || '#000';
            var maxFontSize = centerConfig.maxFontSize || 24;
            var sidePadding = centerConfig.sidePadding || 20;
            var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
            // Start with a base font of 30px
            if(headline !== ''){
                ctx.font = "48px " + fontStyle;
            } else {
                ctx.font = "24px " + fontStyle;
            }
            // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
            var stringWidth = ctx.measureText(txt).width;
            var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

            // Find out how much the font can grow in width.
            var widthRatio = elementWidth / stringWidth;
            var newFontSize = Math.floor(24 * widthRatio);
            var elementHeight = (chart.innerRadius * 2);

            // Pick a new font size so it will not be larger than the height of label.
            var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
            //var fontSizeToUse = 24;
            var minFontSize = centerConfig.minFontSize;
            var lineHeight = centerConfig.lineHeight || 25;
            var wrapText = false;
            if (minFontSize === undefined) {
                minFontSize = 20;
            }

            if (minFontSize && fontSizeToUse < minFontSize) {
                fontSizeToUse = minFontSize;
                wrapText = true;
            }

            // Set font settings to draw it correctly.
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
            var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
            ctx.font = fontSizeToUse + "px " + fontStyle;
            //ctx.font = "48px " + fontStyle;
            ctx.fillStyle = color;
            /*if (!wrapText) {
                ctx.fillText(headline, centerX, centerY);
                return;
            }*/
            var words;
            var line = '';
            var lines = [headline];
            if(txt.indexOf('||') !== -1){
                words = txt.split('||');
                lines = lines.concat(words);
            } else{
                words = txt.split(' ');
            
                // Break words up into multiple lines if necessary
                for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = ctx.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > elementWidth && n > 0) {
                    lines.push(line);
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
                }
            }
            // Move the center up depending on line height and number of lines
            centerY -= ((lines.length - 1) / 2) * lineHeight;
            for (var n = 0; n < lines.length; n++) {
                if(n===0){
                ctx.font = "48px " + fontStyle;
                ctx.fillText(lines[0], centerX, centerY);
                centerY += 36;
                }else{
                ctx.font = fontSizeToUse + "px " + fontStyle;
                ctx.fillText(lines[n], centerX, centerY);
                centerY += lineHeight;
                }
                
            }
            //Draw text in center
            ctx.fillText(line, centerX, centerY);
            }
        }
        });
}

function initTabs() {
    $(document).on('shown.bs.tab', '.gedi-charts-section-2022 a[data-toggle="tab"]', function(e) {
        console.log("SHOWN BS TAB");
        var tabLevel = $(this).data('chart-level');
        if (tabLevel == "category") {
            // default year if at category level (level 1 tab)
            // assign to year variable
            category = $(this).data('chart-category');
            year = "2021";
            roles = 'us_overall;intl_overall;us_bca;us_bds;us_bgs';
            rolesArr = roles.split(";");

            var activeTabPaneID = $(this).attr('href');
            console.log("ACTIVE TAB PANE ID")
            console.log(activeTabPaneID);

            if (category === "gender" || category === "race-ethnicity" || category === "veterans") {
                const targetTabPane = document.getElementById(category).querySelector('.tab-pane.active');
                console.log("TAB PANE FOUND");
                console.log(targetTabPane);
                // targetTabPane.querySelector('.role-overall-charts').style.display = "flex";
                targetTabPane.querySelector('.role-other-charts').style.display = "none";

                // reset tabs level 2 to category-2021.tab-pane
                // get first .sub-tabs > li
                const roleYearTabs = document.getElementById(category).querySelector('.sub-tabs');
                var defaultYearTabID = roleYearTabs.getAttribute('data-tab-year-default');

                console.log("DEFAULT YEAR TAB ID: " + defaultYearTabID + " TAB SHOW BEGIN");
                $('a[href="' + defaultYearTabID + '"]').tab('show');
                console.log("DEFAULT YEAR TAB ID: " + defaultYearTabID + " TAB SHOW END");
            }

            if (category === "race-ethnicity") {
                const legendHLAX = document.querySelector(activeTabPaneID).querySelector('.role-legend.legend-hlax');

                console.log("LEGEND HLAX FOUND");
                console.log(legendHLAX);
                // reset legend textContent
                legendHLAX.nextElementSibling.textContent = "Hispanic/Latino/a/x";
            }

            // reset active role links on category tab click
            if (category === "gender" || category === "race-ethnicity") {

                const roleLinksContainer = document.querySelector(activeTabPaneID).querySelector('.role-links-container');
                console.log("ROLE LINKS CONTAINER");
                console.log(roleLinksContainer);

                const roleLinks = roleLinksContainer.querySelectorAll('.role-links');
                for (var i = 0; i < roleLinks.length; i++) {
                    if (i == 0) {
                        roleLinks[i].classList.add("active");
                    } else {
                        roleLinks[i].classList.remove("active");
                    }
                }
            }
            console.log(`category-in-use: ${category} year-in-use: ${year} roles-in-use: ${roles}`);

            loadCharts(category, year, rolesArr);

        } else if (tabLevel == "year") {
            // level 2 tab clicked (year). get category (level 1 tab)
            const tabListLevel1 = document.getElementById('tabListLevel1');
            var activeTabLevel1 = tabListLevel1.querySelector('li.active a');
            console.log("ACTIVE TAB")
            console.log(activeTabLevel1);

            category =  activeTabLevel1.getAttribute('data-chart-category');

            const activeCategoryTabPane = document.getElementById(category);
            if (category === "gender" || category === "race-ethnicity") {
                const roleLinksContainer = activeCategoryTabPane.querySelector('.role-links-container');
                console.log("ROLE LINKS CONTAINER");
                console.log(roleLinksContainer);

                // reset active role links on category tab click
                const roleLinks = roleLinksContainer.querySelectorAll('.role-links');
                console.log("ROLE LINKS LIST");
                console.log(roleLinks);
                for (var i = 0; i < roleLinks.length; i++) {
                    if (i == 0) {
                        roleLinks[i].classList.add("active");
                    } else {
                        roleLinks[i].classList.remove("active");
                    }
                }
            }

            year = $(this).data('chart-year');

            roles = 'us_overall;intl_overall;us_bca;us_bds;us_bgs';
            rolesArr = roles.split(";");

            // TODO: add to json file next time instead of this
            if (category == "gender") {
                var genderWOCOverallPercent = document.getElementById('genderWOCOverallPercent');
                var genderWOCExecutivePercent = document.getElementById('genderWOCExecutivePercent');

                if (year == "2021") {
                    genderWOCOverallPercent.textContent = "9.1%";
                    genderWOCExecutivePercent.textContent = "8.4%";
                }

                if (year == "2020") {
                    genderWOCOverallPercent.textContent = "8.6%";
                    genderWOCExecutivePercent.textContent = "7.8%";
                }
            }

            // TODO: add to json file next time instead of this
            // display disclaimer below the role links
            const reDisclaimer = document.getElementById('reDisclaimer');
            if (category == "race-ethnicity" && year == "2020") {
                // show reOverallDisclaimer20
                reDisclaimer.textContent = "** In our 2021 Global Equity, Diversity & Inclusion Report, we aggregated Native American, Pacific Islander, and two or more races as “Additional Races.” Based on team member feedback, we’re reporting each group in this year’s report.";
            } else {
                // show reOverallDisclaimer21
                reDisclaimer.textContent = "";
            }

            var activeTabPaneID = $(this).attr('href');
            const targetTabPane = document.querySelector(activeTabPaneID);
            console.log("TAB PANE FOUND");
            console.log(targetTabPane);

            if (category === "race-ethnicity") {
                const legendHLAX = targetTabPane.querySelector('.role-legend.legend-hlax');

                console.log("LEGEND HLAX FOUND");
                console.log(legendHLAX);
                // reset legend textContent
                legendHLAX.nextElementSibling.textContent = "Hispanic/Latino/a/x";
            }

            // targetTabPane.querySelector('.role-overall-charts').style.display = "flex";
            targetTabPane.querySelector('.role-other-charts').style.display = "none";
            console.log(`category-in-use: ${category} year-in-use: ${year} roles-in-use: ${roles}`);
            loadCharts(category, year, rolesArr);
        }

    });
}

function initRoleLinks(roleLinksClass) {
    console.log('roleLinksClass :' + roleLinksClass);

    const roleLinks = document.querySelectorAll('a.role-links' + roleLinksClass);
    console.log("RoleLinks");
    console.log(roleLinks);

    // get current active
    for (var i = 0; i < roleLinks.length; i++) {

        roleLinks[i].addEventListener('click', function(e) {
            e.preventDefault();

            // remove active class 
            for (var i = 0; i < roleLinks.length; i++) {
                if (roleLinks[i].classList.contains("active")) {
                    roleLinks[i].classList.remove("active");
                }
            }

            //console.log(roleLinks[i]);
            this.classList.add("active");
            
            var targetTabListLevel2 = e.target.getAttribute('data-target-tablistlv2');
            console.log(targetTabListLevel2);

            const tabListLevel1 = document.getElementById('tabListLevel1');
            var activeTabLevel1 = tabListLevel1.querySelector('li.active a');
            console.log("ACTIVE TAB LEVEL 1")
            console.log(activeTabLevel1);

            const tabListLevel2 = document.getElementById(targetTabListLevel2);
            var activeTabLevel2 = tabListLevel2.querySelector('li.active a');
            console.log("ACTIVE TAB LEVEL 2")
            console.log(activeTabLevel2);
            
            category = activeTabLevel1.getAttribute('data-chart-category');
            year = activeTabLevel2.getAttribute('data-chart-year');
            roles = e.target.getAttribute('data-chart-roles');
            rolesArr = roles.split(";");
            console.log(`category-in-use: ${category} year-in-use: ${year} roles-in-use: ${roles}`);

            var activeTabPaneID = activeTabLevel2.getAttribute('href');
            console.log(activeTabPaneID);
            const targetTabPane = document.querySelector(activeTabPaneID);
            console.log("TAB PANE FOUND");
            console.log(targetTabPane);

            const reDisclaimer = document.getElementById('reDisclaimer');
            if (category == "race-ethnicity") {
                const legendHLAX = targetTabPane.querySelector('.role-legend.legend-hlax');
                console.log("LEGEND HLAX FOUND");
                console.log(legendHLAX);
                // reset legend textContent
                legendHLAX.nextElementSibling.textContent = "Hispanic/Latino/a/x";
                
                if (roles === "executive_council") {
                    legendHLAX.nextElementSibling.textContent = "Hispanic/Latino/a/x*";
                } 

                if (year === "2020"  && roles != "executive_council") {
                    // show reOverallDisclaimer20
                    reDisclaimer.innerHTML = "** In our 2021 Global Equity, Diversity & Inclusion Report, we aggregated Native American, Pacific Islander, and two or more races as “Additional Races.” Based on team member feedback, we’re reporting each group in this year’s report.";
                } else if (roles === "executive_council") {
                    var disclaimerExecutiveCouncil = '<span style="display: block;">* Executive Council race and ethnicity data reflects U.S. leaders only. Susan Doniz, chief information officer and senior vice president of Information Technology & Data Analytics, based in Canada, identifies as Hispanic.</span>';
                    if (year === "2020") {
                        disclaimerExecutiveCouncil += '<span style="display: block;">** In our 2021 Global Equity, Diversity & Inclusion Report, we aggregated Native American, Pacific Islander, and two or more races as “Additional Races.” Based on team member feedback, we’re reporting each group in this year’s report.</span>';
                    }
                    reDisclaimer.innerHTML = disclaimerExecutiveCouncil;
                } else {
                    reDisclaimer.innerHTML = "";
                }
            } else {
                reDisclaimer.innerHTML = "";
            }

            if (roles === "us_overall;intl_overall;us_bca;us_bds;us_bgs") {
                targetTabPane.querySelector('.role-overall-charts').style.display = "flex";
                targetTabPane.querySelector('.role-other-charts').style.display = "none";
            } else {
                targetTabPane.querySelector('.role-overall-charts').style.display = "none";
                targetTabPane.querySelector('.role-other-charts').style.display = "flex";
            }

            loadCharts(category, year, rolesArr);
        });

    }
}


function loadCharts(category, year, roles) {
    console.log(`${category} - ${year} - ${roles}`);

    // TODO: remove/update condition below if there will be
    // charts for categories other than gender, race and ethnicity,
    // and veterans
    if (category === "disability" || category === "lgbtqia"){
        // skipping reamaining categories disability and lgbtqia
        // since they dont have charts
        return;
    }

    $.ajax({
        type: 'GET',
        async: false,
        dataType: 'json',
        url: '/assets/js/gedi-report/gedi-data.json',
        success: function(data) {
            console.log("Init chart data");
            //console.log(data);
            //console.log(data['gender']['2020']);
            // use key category and key role to get target chart json    
            for (var i = 0; i < roles.length; i++) {

                // Add conditions here to skip rendering charts by category and role
                if ((category === "race-ethnicity" || category === "veterans") && roles[i] === "intl_overall") {
                    // skip since there is no doughnut chart for international overall
                    // under race and ethnicity
                    continue;
                }

                console.log("ROLES");
                console.log(roles[i]);
                console.log("CATEGORY YEAR")
                console.log(data[category][year][roles[i]]);
                console.log("CATEGORY YEAR CANVAS ID")
                console.log(data[category][year][roles[i]]['canvas_id']);
                console.log("CATEGORY YEAR CHART OBJ")
                console.log(data[category][year][roles[i]]['chart']);
                
                const canvasID = data[category][year][roles[i]]['canvas_id'];
                var chartObj = data[category][year][roles[i]]['chart'];
                
            
                addtlConfig = {}
                if (data[category][year][roles[i]].hasOwnProperty('tooltip_id')) {
                   // for custom tooltip I added on each objects to generate charts
                   addtlConfig['tooltip_id'] = data[category][year][roles[i][['tooltip_id']]];
                }

                console.log(`Chart type: ${chartObj.type}`);
                chartObj = injectCallbacksByChart(chartObj);
                console.log(chartObj);

                // call chart canvas by id
                const chartCanvas = document.getElementById(canvasID);
                console.log(chartCanvas);

                const chartCanvasParent = chartCanvas.parentElement;
                console.log("CHART CANVAS PARENT");
                console.log(chartCanvasParent);

                disclaimerContainerID = data[category][year]['disclaimer_container_id'];
                const chartsDisclaimer = document.getElementById(disclaimerContainerID);

                if ('disclaimer' in data[category][year][roles[i]]) {
                    // e.g., genderChartsDisclaimer
                    chartsDisclaimer.textContent = data[category][year][roles[i]]['disclaimer'];
                } else {
                    chartsDisclaimer.textContent = "";
                }

                // assumes all bar graphs shares one canvas only
                if (chartObj.type === "bar") {

                    // chart canvas container (bar graph container) was already set to display block
                    // we set it to none again if there is no data
                    if (chartObj.data.datasets[0].data.length == 0) {
                        chartCanvas.previousElementSibling.style.display = "initial";
                    } else {
                        chartCanvas.previousElementSibling.style.display = "none";
                    }

                    console.log("BAR GRAPH DETECTED");
                    var tmpCanvasWidth = chartCanvas.getAttribute('width');
                    var tmpCanvasHeight = chartCanvas.getAttribute('height');
                    console.log("DESTROYING CURRENT CANVAS");
                    chartCanvas.remove();
                    console.log("CANVAS BAR GRAPH DESTROYED");
                    
                    console.log("CREATING CANVAS")
                    var newChartCanvas = document.createElement('canvas');
                    newChartCanvas.setAttribute('id', canvasID);
                    newChartCanvas.setAttribute('width', tmpCanvasWidth);
                    newChartCanvas.setAttribute('height', tmpCanvasHeight);
                    chartCanvasParent.appendChild(newChartCanvas);
                    console.log("CANVAS SUCCESSFULLY CREATED")
                    
                    chart = new Chart(newChartCanvas, chartObj);

                } else {
                    // initialize chart
                    console.log("CHART OBJECT DATA");
                    console.log(chartObj);
                    chart = new Chart(chartCanvas, chartObj);
                } 
            }

        }
    });

}

function injectCallbacksByChart(chartObj) {

    console.log("Begin injecting callbacks");
    console.log(chartObj);
    if (chartObj.type === "doughnut") {
        //chartObj.options.tooltips.callbacks.label 
        
        console.log(chartObj.options.tooltips.callbacks);
        chartObj.options.tooltips.callbacks.label = overallDoughnutLabel;
    } else if (chartObj.type === "bar") { // vertical
        chartObj.plugins = [ChartDataLabels];
        console.log("CHART DATA LABELS");
        console.log(chartObj.data.datasets[0].datalabels);
        // formatter
        chartObj.data.datasets[0].datalabels.formatter = roleBarChartDataLabelsFormatter;
        
        chartObj.options.scales.yAxes[0].ticks.callback = roleBarChartTickFormat;
        // label callback
        console.log("CHART DATA TOOLTIPS");
        console.log(chartObj.options.tooltips);
        chartObj.options.tooltips.callbacks.label = roleBarChartLabel;
        chartObj.options.scales.yAxes[0].callback = roleBarChartYAxes;
    } else if (chartObj.type === "horizontalBar") {
        if (chartObj.options.tooltips.hasOwnProperty('customTooltipConfig')) {
            console.log("HAS CUSTOM TOOLTIP Config");
            console.log(chartObj.options.tooltips.customTooltipConfig);
            var customTooltipConfig = chartObj.options.tooltips.customTooltipConfig;
            initCustomTooltips(chartObj, customTooltipConfig);
            //chartObj.options.tooltips.custom = genderUSBCA21Tooltip;
        }
    }
    return chartObj;
}

function parseTooltipMessage(msg) {
    var arrMsg = msg.split(': ');
    console.log(arrMsg);
    return arrMsg;
}

function initCustomTooltips(chartObj, customTooltipConfig) {
    // determine which tooltip callback to use
    var adjustments = customTooltipConfig.adjustments;

    for (var i = 0; i < adjustments.length; i++) {
        var targetTooltip = document.getElementById(adjustments[i].id);
        if (targetTooltip) {
            if (adjustments[i].hasOwnProperty("left")) {
                targetTooltip.style.left = adjustments[i].left;
            }
        }
    }

    // determine which tooltip callback function to use
    var callbackName  = customTooltipConfig.callbackName;
    if (callbackName == "genderUSBCA21Tooltip") {
        chartObj.options.tooltips.custom = genderUSBCA21Tooltip;
    } else if (callbackName == "genderUSBDS21Tooltip") {
        chartObj.options.tooltips.custom = genderUSBDS21Tooltip;
    } else if (callbackName == "genderUSBGS21Tooltip") {
        chartObj.options.tooltips.custom = genderUSBGS21Tooltip;
    } else if (callbackName == "genderUSBCA20Tooltip") {
        chartObj.options.tooltips.custom = genderUSBCA20Tooltip;
    } else if (callbackName == "genderUSBDS20Tooltip") {
        chartObj.options.tooltips.custom = genderUSBDS20Tooltip;
    } else if (callbackName == "genderUSBGS20Tooltip") {
        chartObj.options.tooltips.custom = genderUSBGS20Tooltip;
    } else if (callbackName == "reUSBCA21Tooltip") {
        chartObj.options.tooltips.custom = reUSBCA21Tooltip;
    } else if (callbackName == "reUSBDS21Tooltip") {
        chartObj.options.tooltips.custom = reUSBDS21Tooltip;
    } else if (callbackName == "reUSBGS21Tooltip") {
        chartObj.options.tooltips.custom = reUSBGS21Tooltip;
    } else if (callbackName == "reUSBCA20Tooltip") {
        chartObj.options.tooltips.custom = reUSBCA20Tooltip;
    } else if (callbackName == "reUSBDS20Tooltip") {
        chartObj.options.tooltips.custom = reUSBDS20Tooltip;
    } else if (callbackName == "reUSBGS20Tooltip") {
        chartObj.options.tooltips.custom = reUSBGS20Tooltip;
    } else if (callbackName == "veUSBCA21Tooltip") {
        chartObj.options.tooltips.custom = veUSBCA21Tooltip;
    } else if (callbackName == "veUSBDS21Tooltip") {
        chartObj.options.tooltips.custom = veUSBDS21Tooltip;
    } else if (callbackName == "veUSBGS21Tooltip") {
        chartObj.options.tooltips.custom = veUSBGS21Tooltip;
    } else if (callbackName == "veUSBCA20Tooltip") {
        chartObj.options.tooltips.custom = veUSBCA20Tooltip;
    } else if (callbackName == "veUSBDS20Tooltip") {
        chartObj.options.tooltips.custom = veUSBDS20Tooltip;
    } else if (callbackName == "veUSBGS20Tooltip") {
        chartObj.options.tooltips.custom = veUSBGS20Tooltip;
    }
}

/**
 * Chart callbacks as values for injecting to option keys
 */

function overallDoughnutLabel(tooltipItem, data) {
    var label = data.labels[tooltipItem.index] || '';
    if (label) {
        label = ' ' + label + ' ';
    }

    if (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] !== null) {
        label += data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%';
        return label;
    }
}

function roleBarChartDataLabelsFormatter(value) {
    // s represents 'space'. the width of the bar
    // will be the with of the space
    if (value == "s"){
        return '';
    }

    if (value == "-1") {
        return 'N/A';
    }

    return value + '%';
}

function roleBarChartLabel(context) {
    var label = context.label || '';

    if (label) {
        label = ' ' + label + ' ';
    }

    if (context.value !== null) {
        label = ' ' + context.value + '%';
    }

    return label;
}

function roleBarChartYAxes(value, index, ticks) {
    return value + '%';
}

function roleBarChartTickFormat(value, index, values) {
    return value + '%';
}

/**
 * 
 *  BEGIN CUSTOM TOOLTIP CALLBACKS
 * 
 */
// custom tooltip for gender, race ethnicity, and veterans
function genderUSBCA21Tooltip(tooltipModel) {
    console.log(tooltipModel);
    console.log(tooltipModel.body);
    const customTooltipWomen = document.getElementById('genderUSBCA21Women');
    const customTooltipMen = document.getElementById('genderUSBCA21Men');

    if (!customTooltipWomen) {
        return;
    }

    if (!customTooltipMen) {
        return;
    }

    if (!tooltipModel.body) {
        customTooltipWomen.textContent = "";
        customTooltipMen.textContent = "";
        return;
    }

    var arrMsg = parseTooltipMessage(tooltipModel.body[0]['lines'][0]);
    var label = arrMsg[0];
    var percent = arrMsg[1];

    if (label == "Women") {
        customTooltipWomen.textContent = percent + '% ' + label;
        customTooltipMen.textContent = "";
    } else {
        customTooltipWomen.textContent = "";
        customTooltipMen.textContent = percent + '% ' + label;
    }
}

function genderUSBDS21Tooltip(tooltipModel) {
    console.log(tooltipModel);
    console.log(tooltipModel.body);
    const customTooltipWomen = document.getElementById('genderUSBDS21Women');
    const customTooltipMen = document.getElementById('genderUSBDS21Men');

    if (!customTooltipWomen) {
        return;
    }

    if (!customTooltipMen) {
        return;
    }

    if (!tooltipModel.body) {
        customTooltipWomen.textContent = "";
        customTooltipMen.textContent = "";
        return;
    }

    var arrMsg = parseTooltipMessage(tooltipModel.body[0]['lines'][0]);
    var label = arrMsg[0];
    var percent = arrMsg[1];

    if (label == "Women") {
        customTooltipWomen.textContent = percent + '% ' + label;
        customTooltipMen.textContent = "";
    } else {
        customTooltipWomen.textContent = "";
        customTooltipMen.textContent = percent + '% ' + label;
    }
}

function genderUSBGS21Tooltip(tooltipModel) {
    console.log(tooltipModel);
    console.log(tooltipModel.body);
    const customTooltipWomen = document.getElementById('genderUSBGS21Women');
    const customTooltipMen = document.getElementById('genderUSBGS21Men');

    if (!customTooltipWomen) {
        return;
    }

    if (!customTooltipMen) {
        return;
    }

    if (!tooltipModel.body) {
        customTooltipWomen.textContent = "";
        customTooltipMen.textContent = "";
        return;
    }

    var arrMsg = parseTooltipMessage(tooltipModel.body[0]['lines'][0]);
    var label = arrMsg[0];
    var percent = arrMsg[1];

    if (label == "Women") {
        customTooltipWomen.textContent = percent + '% ' + label;
        customTooltipMen.textContent = "";
    } else {
        customTooltipWomen.textContent = "";
        customTooltipMen.textContent = percent + '% ' + label;
    }
}

function genderUSBCA20Tooltip(tooltipModel) {
    console.log(tooltipModel);
    console.log(tooltipModel.body);
    const customTooltipWomen = document.getElementById('genderUSBCA20Women');
    const customTooltipMen = document.getElementById('genderUSBCA20Men');

    if (!customTooltipWomen) {
        return;
    }

    if (!customTooltipMen) {
        return;
    }

    if (!tooltipModel.body) {
        customTooltipWomen.textContent = "";
        customTooltipMen.textContent = "";
        return;
    }

    var arrMsg = parseTooltipMessage(tooltipModel.body[0]['lines'][0]);
    var label = arrMsg[0];
    var percent = arrMsg[1];

    if (label == "Women") {
        customTooltipWomen.textContent = percent + '% ' + label;
        customTooltipMen.textContent = "";
    } else {
        customTooltipWomen.textContent = "";
        customTooltipMen.textContent = percent + '% ' + label;
    }
}

function genderUSBDS20Tooltip(tooltipModel) {
    console.log(tooltipModel);
    console.log(tooltipModel.body);
    const customTooltipWomen = document.getElementById('genderUSBDS20Women');
    const customTooltipMen = document.getElementById('genderUSBDS20Men');

    if (!customTooltipWomen) {
        return;
    }

    if (!customTooltipMen) {
        return;
    }

    if (!tooltipModel.body) {
        customTooltipWomen.textContent = "";
        customTooltipMen.textContent = "";
        return;
    }

    var arrMsg = parseTooltipMessage(tooltipModel.body[0]['lines'][0]);
    var label = arrMsg[0];
    var percent = arrMsg[1];

    if (label == "Women") {
        customTooltipWomen.textContent = percent + '% ' + label;
        customTooltipMen.textContent = "";
    } else {
        customTooltipWomen.textContent = "";
        customTooltipMen.textContent = percent + '% ' + label;
    }
}

function genderUSBGS20Tooltip(tooltipModel) {
    console.log(tooltipModel);
    console.log(tooltipModel.body);
    const customTooltipWomen = document.getElementById('genderUSBGS20Women');
    const customTooltipMen = document.getElementById('genderUSBGS20Men');

    if (!customTooltipWomen) {
        return;
    }

    if (!customTooltipMen) {
        return;
    }

    if (!tooltipModel.body) {
        customTooltipWomen.textContent = "";
        customTooltipMen.textContent = "";
        return;
    }

    var arrMsg = parseTooltipMessage(tooltipModel.body[0]['lines'][0]);
    var label = arrMsg[0];
    var percent = arrMsg[1];

    if (label == "Women") {
        customTooltipWomen.textContent = percent + '% ' + label;
        customTooltipMen.textContent = "";
    } else {
        customTooltipWomen.textContent = "";
        customTooltipMen.textContent = percent + '% ' + label;
    }
}

function reUSBCA21Tooltip(tooltipModel) {
    console.log(tooltipModel);
    console.log(tooltipModel.body);
    const customTooltipPacificIslander = document.getElementById('reUSBCA21PacificIslander');
    const customTooltipNativeAmerican = document.getElementById('reUSBCA21NativeAmerican');
    const customTooltipTwoOrMore = document.getElementById('reUSBCA21TwoOrMore');
    const customTooltipBlack = document.getElementById('reUSBCA21Black');
    const customTooltipHLAX = document.getElementById('reUSBCA21HLAX');
    const customTooltipAsian = document.getElementById('reUSBCA21Asian');
    const customTooltipWhite = document.getElementById('reUSBCA21White');

    if (!customTooltipPacificIslander) {
        return;
    }

    if (!customTooltipNativeAmerican) {
        return;
    }

    if (!customTooltipTwoOrMore) {
        return;
    }

    if (!customTooltipBlack) {
        return;
    }

    if (!customTooltipHLAX) {
        return;
    }

    if (!customTooltipAsian) {
        return;
    }

    if (!customTooltipWhite) {
        return;
    }

    if (!tooltipModel.body) {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
        return;
    }

    var arrMsg = parseTooltipMessage(tooltipModel.body[0]['lines'][0]);
    var label = arrMsg[0];
    var percent = arrMsg[1];

    if (label == "Pacific Islander") {
        customTooltipPacificIslander.textContent = percent + '% ' + label;
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Native American"){
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = percent + '% ' + label;;
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "2 or more races") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = percent + '% ' + label;
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Black") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = percent + '% ' + label;
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Hispanic/Latino/a/x") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = percent + '% ' + label;
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Asian") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = percent + '% ' + label;
        customTooltipWhite.textContent = "";
    } else if (label == "White") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = percent + '% ' + label;
    }
}

function reUSBDS21Tooltip(tooltipModel) {
    console.log(tooltipModel);
    console.log(tooltipModel.body);
    const customTooltipPacificIslander = document.getElementById('reUSBDS21PacificIslander');
    const customTooltipNativeAmerican = document.getElementById('reUSBDS21NativeAmerican');
    const customTooltipTwoOrMore = document.getElementById('reUSBDS21TwoOrMore');
    const customTooltipBlack = document.getElementById('reUSBDS21Black');
    const customTooltipHLAX = document.getElementById('reUSBDS21HLAX');
    const customTooltipAsian = document.getElementById('reUSBDS21Asian');
    const customTooltipWhite = document.getElementById('reUSBDS21White');

    if (!customTooltipPacificIslander) {
        return;
    }

    if (!customTooltipNativeAmerican) {
        return;
    }

    if (!customTooltipTwoOrMore) {
        return;
    }

    if (!customTooltipBlack) {
        return;
    }

    if (!customTooltipHLAX) {
        return;
    }

    if (!customTooltipAsian) {
        return;
    }

    if (!customTooltipWhite) {
        return;
    }

    if (!tooltipModel.body) {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
        return;
    }

    var arrMsg = parseTooltipMessage(tooltipModel.body[0]['lines'][0]);
    var label = arrMsg[0];
    var percent = arrMsg[1];

    if (label == "Pacific Islander") {
        customTooltipPacificIslander.textContent = percent + '% ' + label;
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Native American"){
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = percent + '% ' + label;;
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "2 or more races") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = percent + '% ' + label;
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Black") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = percent + '% ' + label;
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Hispanic/Latino/a/x") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = percent + '% ' + label;
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Asian") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = percent + '% ' + label;
        customTooltipWhite.textContent = "";
    } else if (label == "White") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = percent + '% ' + label;
    }
}

function reUSBGS21Tooltip(tooltipModel) {
    console.log(tooltipModel);
    console.log(tooltipModel.body);
    const customTooltipPacificIslander = document.getElementById('reUSBGS21PacificIslander');
    const customTooltipNativeAmerican = document.getElementById('reUSBGS21NativeAmerican');
    const customTooltipTwoOrMore = document.getElementById('reUSBGS21TwoOrMore');
    const customTooltipBlack = document.getElementById('reUSBGS21Black');
    const customTooltipHLAX = document.getElementById('reUSBGS21HLAX');
    const customTooltipAsian = document.getElementById('reUSBGS21Asian');
    const customTooltipWhite = document.getElementById('reUSBGS21White');

    if (!customTooltipPacificIslander) {
        return;
    }

    if (!customTooltipNativeAmerican) {
        return;
    }

    if (!customTooltipTwoOrMore) {
        return;
    }

    if (!customTooltipBlack) {
        return;
    }

    if (!customTooltipHLAX) {
        return;
    }

    if (!customTooltipAsian) {
        return;
    }

    if (!customTooltipWhite) {
        return;
    }

    if (!tooltipModel.body) {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
        return;
    }

    var arrMsg = parseTooltipMessage(tooltipModel.body[0]['lines'][0]);
    var label = arrMsg[0];
    var percent = arrMsg[1];

    if (label == "Pacific Islander") {
        customTooltipPacificIslander.textContent = percent + '% ' + label;
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Native American"){
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = percent + '% ' + label;;
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "2 or more races") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = percent + '% ' + label;
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Black") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = percent + '% ' + label;
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Hispanic/Latino/a/x") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = percent + '% ' + label;
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Asian") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = percent + '% ' + label;
        customTooltipWhite.textContent = "";
    } else if (label == "White") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = percent + '% ' + label;
    }
}

function reUSBCA20Tooltip(tooltipModel) {
    console.log(tooltipModel);
    console.log(tooltipModel.body);
    const customTooltipPacificIslander = document.getElementById('reUSBCA20PacificIslander');
    const customTooltipNativeAmerican = document.getElementById('reUSBCA20NativeAmerican');
    const customTooltipTwoOrMore = document.getElementById('reUSBCA20TwoOrMore');
    const customTooltipBlack = document.getElementById('reUSBCA20Black');
    const customTooltipHLAX = document.getElementById('reUSBCA20HLAX');
    const customTooltipAsian = document.getElementById('reUSBCA20Asian');
    const customTooltipWhite = document.getElementById('reUSBCA20White');

    if (!customTooltipPacificIslander) {
        return;
    }
    //console.log("PI")

    if (!customTooltipNativeAmerican) {
        return;
    }
    //console.log("NA")

    if (!customTooltipTwoOrMore) {
        return;
    }
    //console.log("TwoOrMore")

    if (!customTooltipBlack) {
        return;
    }
    //console.log("Black")

    if (!customTooltipHLAX) {
        return;
    }
    //console.log("HLAX")

    if (!customTooltipAsian) {
        return;
    }
    //console.log("Asian")

    if (!customTooltipWhite) {
        return;
    }
    //console.log("White")

    if (!tooltipModel.body) {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
        return;
    }

    var arrMsg = parseTooltipMessage(tooltipModel.body[0]['lines'][0]);
    var label = arrMsg[0];
    var percent = arrMsg[1];

    if (label == "Pacific Islander") {
        customTooltipPacificIslander.textContent = percent + '% ' + label;
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Native American"){
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = percent + '% ' + label;;
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "2 or more races") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = percent + '% ' + label;
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Black") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = percent + '% ' + label;
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Hispanic/Latino/a/x") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = percent + '% ' + label;
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Asian") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = percent + '% ' + label;
        customTooltipWhite.textContent = "";
    } else if (label == "White") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = percent + '% ' + label;
    }
}

function reUSBDS20Tooltip(tooltipModel) {
    console.log(tooltipModel);
    console.log(tooltipModel.body);
    const customTooltipPacificIslander = document.getElementById('reUSBDS20PacificIslander');
    const customTooltipNativeAmerican = document.getElementById('reUSBDS20NativeAmerican');
    const customTooltipTwoOrMore = document.getElementById('reUSBDS20TwoOrMore');
    const customTooltipBlack = document.getElementById('reUSBDS20Black');
    const customTooltipHLAX = document.getElementById('reUSBDS20HLAX');
    const customTooltipAsian = document.getElementById('reUSBDS20Asian');
    const customTooltipWhite = document.getElementById('reUSBDS20White');

    if (!customTooltipPacificIslander) {
        return;
    }

    if (!customTooltipNativeAmerican) {
        return;
    }

    if (!customTooltipTwoOrMore) {
        return;
    }

    if (!customTooltipBlack) {
        return;
    }

    if (!customTooltipHLAX) {
        return;
    }

    if (!customTooltipAsian) {
        return;
    }

    if (!customTooltipWhite) {
        return;
    }

    if (!tooltipModel.body) {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
        return;
    }

    var arrMsg = parseTooltipMessage(tooltipModel.body[0]['lines'][0]);
    var label = arrMsg[0];
    var percent = arrMsg[1];

    if (label == "Pacific Islander") {
        customTooltipPacificIslander.textContent = percent + '% ' + label;
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Native American"){
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = percent + '% ' + label;;
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "2 or more races") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = percent + '% ' + label;
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Black") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = percent + '% ' + label;
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Hispanic/Latino/a/x") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = percent + '% ' + label;
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Asian") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = percent + '% ' + label;
        customTooltipWhite.textContent = "";
    } else if (label == "White") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = percent + '% ' + label;
    }
}

function reUSBGS20Tooltip(tooltipModel) {
    console.log(tooltipModel);
    console.log(tooltipModel.body);
    const customTooltipPacificIslander = document.getElementById('reUSBGS20PacificIslander');
    const customTooltipNativeAmerican = document.getElementById('reUSBGS20NativeAmerican');
    const customTooltipTwoOrMore = document.getElementById('reUSBGS20TwoOrMore');
    const customTooltipBlack = document.getElementById('reUSBGS20Black');
    const customTooltipHLAX = document.getElementById('reUSBGS20HLAX');
    const customTooltipAsian = document.getElementById('reUSBGS20Asian');
    const customTooltipWhite = document.getElementById('reUSBGS20White');

    if (!customTooltipPacificIslander) {
        return;
    }

    if (!customTooltipNativeAmerican) {
        return;
    }

    if (!customTooltipTwoOrMore) {
        return;
    }

    if (!customTooltipBlack) {
        return;
    }

    if (!customTooltipHLAX) {
        return;
    }

    if (!customTooltipAsian) {
        return;
    }

    if (!customTooltipWhite) {
        return;
    }

    if (!tooltipModel.body) {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
        return;
    }

    var arrMsg = parseTooltipMessage(tooltipModel.body[0]['lines'][0]);
    var label = arrMsg[0];
    var percent = arrMsg[1];

    if (label == "Pacific Islander") {
        customTooltipPacificIslander.textContent = percent + '% ' + label;
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Native American"){
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = percent + '% ' + label;;
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "2 or more races") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = percent + '% ' + label;
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Black") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = percent + '% ' + label;
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Hispanic/Latino/a/x") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = percent + '% ' + label;
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = "";
    } else if (label == "Asian") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = percent + '% ' + label;
        customTooltipWhite.textContent = "";
    } else if (label == "White") {
        customTooltipPacificIslander.textContent = "";
        customTooltipNativeAmerican.textContent = "";
        customTooltipTwoOrMore.textContent = "";
        customTooltipBlack.textContent = "";
        customTooltipHLAX.textContent = "";
        customTooltipAsian.textContent = "";
        customTooltipWhite.textContent = percent + '% ' + label;
    }
}

// veterans
function veUSBCA21Tooltip(tooltipModel) {
    console.log(tooltipModel);
    console.log(tooltipModel.body);
    const customTooltipVeterans = document.getElementById('veUSBCA21Veterans');
    const customTooltipOthers = document.getElementById('veUSBCA21Others');

    if (!customTooltipVeterans) {
        return;
    }

    if (!customTooltipOthers) {
        return;
    }

    if (!tooltipModel.body) {
        customTooltipVeterans.textContent = "";
        customTooltipOthers.textContent = "";
        return;
    }

    var arrMsg = parseTooltipMessage(tooltipModel.body[0]['lines'][0]);
    var label = arrMsg[0];
    var percent = arrMsg[1];

    if (label == "Veterans") {
        customTooltipVeterans.textContent = percent + '% ' + label;
        customTooltipOthers.textContent = "";
    } else {
        customTooltipVeterans.textContent = "";
        customTooltipOthers.textContent = percent + '% ' + label;
    }
}

function veUSBDS21Tooltip(tooltipModel) {
    console.log(tooltipModel);
    console.log(tooltipModel.body);
    const customTooltipVeterans = document.getElementById('veUSBDS21Veterans');
    const customTooltipOthers = document.getElementById('veUSBDS21Others');

    if (!customTooltipVeterans) {
        return;
    }

    if (!customTooltipOthers) {
        return;
    }

    if (!tooltipModel.body) {
        customTooltipVeterans.textContent = "";
        customTooltipOthers.textContent = "";
        return;
    }

    var arrMsg = parseTooltipMessage(tooltipModel.body[0]['lines'][0]);
    var label = arrMsg[0];
    var percent = arrMsg[1];

    if (label == "Veterans") {
        customTooltipVeterans.textContent = percent + '% ' + label;
        customTooltipOthers.textContent = "";
    } else {
        customTooltipVeterans.textContent = "";
        customTooltipOthers.textContent = percent + '% ' + label;
    }
}

function veUSBGS21Tooltip(tooltipModel) {
    console.log(tooltipModel);
    console.log(tooltipModel.body);
    const customTooltipVeterans = document.getElementById('veUSBGS21Veterans');
    const customTooltipOthers = document.getElementById('veUSBGS21Others');

    if (!customTooltipVeterans) {
        return;
    }

    if (!customTooltipOthers) {
        return;
    }

    if (!tooltipModel.body) {
        customTooltipVeterans.textContent = "";
        customTooltipOthers.textContent = "";
        return;
    }

    var arrMsg = parseTooltipMessage(tooltipModel.body[0]['lines'][0]);
    var label = arrMsg[0];
    var percent = arrMsg[1];

    if (label == "Veterans") {
        customTooltipVeterans.textContent = percent + '% ' + label;
        customTooltipOthers.textContent = "";
    } else {
        customTooltipVeterans.textContent = "";
        customTooltipOthers.textContent = percent + '% ' + label;
    }
}

function veUSBCA20Tooltip(tooltipModel) {
    console.log(tooltipModel);
    console.log(tooltipModel.body);
    const customTooltipVeterans = document.getElementById('veUSBCA20Veterans');
    const customTooltipOthers = document.getElementById('veUSBCA20Others');

    if (!customTooltipVeterans) {
        return;
    }

    if (!customTooltipOthers) {
        return;
    }

    if (!tooltipModel.body) {
        customTooltipVeterans.textContent = "";
        customTooltipOthers.textContent = "";
        return;
    }

    var arrMsg = parseTooltipMessage(tooltipModel.body[0]['lines'][0]);
    var label = arrMsg[0];
    var percent = arrMsg[1];

    if (label == "Veterans") {
        customTooltipVeterans.textContent = percent + '% ' + label;
        customTooltipOthers.textContent = "";
    } else {
        customTooltipVeterans.textContent = "";
        customTooltipOthers.textContent = percent + '% ' + label;
    }
}

function veUSBDS20Tooltip(tooltipModel) {
    console.log(tooltipModel);
    console.log(tooltipModel.body);
    const customTooltipVeterans = document.getElementById('veUSBDS20Veterans');
    const customTooltipOthers = document.getElementById('veUSBDS20Others');

    if (!customTooltipVeterans) {
        return;
    }

    if (!customTooltipOthers) {
        return;
    }

    if (!tooltipModel.body) {
        customTooltipVeterans.textContent = "";
        customTooltipOthers.textContent = "";
        return;
    }

    var arrMsg = parseTooltipMessage(tooltipModel.body[0]['lines'][0]);
    var label = arrMsg[0];
    var percent = arrMsg[1];

    if (label == "Veterans") {
        customTooltipVeterans.textContent = percent + '% ' + label;
        customTooltipOthers.textContent = "";
    } else {
        customTooltipVeterans.textContent = "";
        customTooltipOthers.textContent = percent + '% ' + label;
    }
}

function veUSBGS20Tooltip(tooltipModel) {
    console.log(tooltipModel);
    console.log(tooltipModel.body);
    const customTooltipVeterans = document.getElementById('veUSBGS20Veterans');
    const customTooltipOthers = document.getElementById('veUSBGS20Others');

    if (!customTooltipVeterans) {
        return;
    }

    if (!customTooltipOthers) {
        return;
    }

    if (!tooltipModel.body) {
        customTooltipVeterans.textContent = "";
        customTooltipOthers.textContent = "";
        return;
    }

    var arrMsg = parseTooltipMessage(tooltipModel.body[0]['lines'][0]);
    var label = arrMsg[0];
    var percent = arrMsg[1];

    if (label == "Veterans") {
        customTooltipVeterans.textContent = percent + '% ' + label;
        customTooltipOthers.textContent = "";
    } else {
        customTooltipVeterans.textContent = "";
        customTooltipOthers.textContent = percent + '% ' + label;
    }
}