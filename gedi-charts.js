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
    initRoleLinks();

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
            const targetTabPane = document.querySelector(activeTabPaneID).querySelector('.tab-pane.active');
            console.log("TAB PANE FOUND");
            console.log(targetTabPane);
            targetTabPane.querySelector('.role-overall-charts').style.display = "flex";
            targetTabPane.querySelector('.role-other-charts').style.display = "none";

            console.log(`category-in-use: ${category} year-in-use: ${year} roles-in-use: ${roles}`);

            loadCharts(category, year, rolesArr);

        } else if (tabLevel == "year") {
            // level 2 tab clicked (year). get category (level 1 tab)
            const tabListLevel1 = document.getElementById('tabListLevel1');
            var activeTabLevel1 = tabListLevel1.querySelector('li.active a');
            console.log("ACTIVE TAB")
            console.log(activeTabLevel1);

            category =  activeTabLevel1.getAttribute('data-chart-category');
            year = $(this).data('chart-year');
            roles = 'us_overall;intl_overall;us_bca;us_bds;us_bgs';
            rolesArr = roles.split(";");

            var activeTabPaneID = $(this).attr('href');
            const targetTabPane = document.querySelector(activeTabPaneID);
            console.log("TAB PANE FOUND");
            console.log(targetTabPane);

            targetTabPane.querySelector('.role-overall-charts').style.display = "flex";
            targetTabPane.querySelector('.role-other-charts').style.display = "none";
            console.log(`category-in-use: ${category} year-in-use: ${year} roles-in-use: ${roles}`);
            loadCharts(category, year, rolesArr);
        }

    });
}

function initRoleLinks() {
    const roleLinks = document.querySelectorAll('a.role-links');
    console.log("RoleLinks");
    console.log(roleLinks);

    for (var i = 0; i < roleLinks.length; i++) {
        //console.log(roleLinks[i]);
        roleLinks[i].addEventListener('click', function(e) {
            e.preventDefault();
            
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

            if (roles === "us_overall;intl_overall;us_bca;us_bds;us_bgs") {
                console.log("HAHAHAH");
                targetTabPane.querySelector('.role-overall-charts').style.display = "flex";
                targetTabPane.querySelector('.role-other-charts').style.display = "none";
            } else {
                console.log("HEHEHHE")
                targetTabPane.querySelector('.role-overall-charts').style.display = "none";
                targetTabPane.querySelector('.role-other-charts').style.display = "flex";

            }
            loadCharts(category, year, rolesArr);

        });
    }
}

function loadCharts(category, year, roles) {
    console.log(`${category} - ${year} - ${roles}`);
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
                
                console.log(`Chart type: ${chartObj.type}`);
                chartObj = injectCallbacksByChart(chartObj);
                console.log(chartObj);
                // call chart canvas by id
                const chartCanvas = document.getElementById(canvasID);
                console.log(chartCanvas);

                const chartCanvasParent = chartCanvas.parentElement;

                // assumes all bar graphs shares one canvas only

                if (chartObj.type === "bar") {
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
        //chartObj.plugins = [self.ChartDataLabels];
        console.log("CHART DATA LABELS");
        console.log(chartObj.data.datasets[0].datalabels);
        // formatter
        chartObj.data.datasets[0].datalabels.formatter = roleBarChartDataLabelsFormatter;
        
        // label callback
        console.log("CHART DATA TOOLTIPS");
        console.log(chartObj.options.tooltips);
        chartObj.options.tooltips.callbacks.label = roleBarChartLabel;
        chartObj.options.scales.yAxes[0].callback = roleBarChartYAxes;
    }
    return chartObj;
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