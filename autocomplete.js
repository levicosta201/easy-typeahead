var randomId = "";

/**
 * Initialize the inpunt and all rules from autocomplete select input
 * this is use typeahead Library from twitter
 * see more in https://github.com/twitter/typeahead.js
 * @param {object} config 
 */
function autoComplete(config) {

    randomId = generateRandomId(getRandomNumber());
    addInput(config.rootInputId, config.hiddenInputIdName, config.inputConfig);

    var input = $("#" + randomId);
    var urlCall = config.urlCall;

    var autoComplete = input.typeahead({
        minLength: typeof config.minLength != "undefined" ? config.minLength : true,
        autoSelect: typeof config.autoSelect != "undefined" ? config.autoSelect : true,
        hint: typeof config.hint != "undefined" ? config.hint : true,
        highlight: typeof config.highlight != "undefined" ? config.highlight : true,
        limit: typeof config.maxShow != "undefined" ? config.maxShow : 600,
        items: typeof config.maxItens != "undefined" ? config.maxItens : 600,
        showHintOnFocus: "all",
        updater: typeof config.onUpdate != "undefined" ? config.onUpdate : (item) => {
            $("#" + config.hiddenInputIdName).val(item[config.call.defaultId]);
            return item[config.call.defaultText];
        },
        afterSelect: config.afterSelect,
        source: (query, syncResults, asyncResults) => {
            call(config.call, query, syncResults);
        },
        displayText: config.displayText,
    });

    getFocusBlur(input, config.inputConfig.arrowIcons);
    autoAdjustDropDown(input, randomId);
    setArrowClick(input);
}

/**
 * fire the event to get json from url
 * @param {object} call 
 * @param {string} query 
 * @param {function} syncResults 
 */
function call(call, query, syncResults) {
    let responseSucces = call.success;
    $.ajax({
        url: call.urlCall,
        method: typeof call.method != "undefined" ? call.method : "GET",
        dataType: typeof call.dataType != "undefined" ? call.dataType : "json",
        timeout: DashboardConfig.getTimeout(),
        async: typeof call.async != "undefined" ? call.async : true,
        data: typeof call.data != "undefined" ? call.data : {
            "busca": query,
            "limit": call.limit,
        },
        success: typeof call.success != "undefined" ? call.success : (response) => {
            let arrayInterno = [];
            let dataResponse = response.response;
            dataResponse = typeof call.defaultIndex != "undefined" ? dataResponse[call.defaultIndex] : dataResponse;
            $.each(dataResponse, function (index, value) {
                var responseObject = new Object();

                for (const [key, valueObj] of Object.entries(value)) {
                    let keyLower = key.toString().toLowerCase();
                    let valueLower = valueObj.toString();

                    responseObject[keyLower] = valueLower;
                }
                arrayInterno[index] = responseObject;
            });
            syncResults(arrayInterno);
        },

    });
}

/**
 * get the focus and blur to change arrow in view
 * @param {object} input 
 * @param {string} arrowIcons 
 */
function getFocusBlur(input, arrowIcons) {
    var iconUp = typeof arrowIcons.up != "undefined" ? arrowIcons.up : "glyphicon.glyphicon-chevron-up";
    var iconDown = typeof arrowIcons.down != "undefined" ? arrowIcons.down : "glyphicon.glyphicon-chevron-down";

    input.blur(function () {
        $(".button-autocomplete-du." + iconUp).removeClass('hide');
        $(".button-autocomplete-du." + iconDown).addClass('hide');
    }).focus(function () {
        $(".button-autocomplete-du.glyphicon." + iconDown).removeClass('hide');
        $(".button-autocomplete-du.glyphicon." + iconUp).addClass('hide');
    });
}

/**
 * auto adjust dropdown in screen for any resolution
 * @param {object} input 
 * @param {string} inputId 
 */
function autoAdjustDropDown(input, inputId) {
    $("#" + inputId + ".dropdown-menu").css("min-width: " + input.width() + " !important");
    $("#" + inputId + ".dropdown-menu").css("max-width: " + input.width() + " !important");
}

/**
 * enable click in arrow icon
 * @param {object} input 
 */
function setArrowClick(input) {
    $(".button-autocomplete-du").click(function () {
        input.focus();
    });
}

/**
 * auto add input in view eliminate the need rewrite inputs in html
 * @param {string} rootInputId 
 * @param {string} hiddenInputIdName 
 */
function addInput(rootInputId, hiddenInputIdName, inputConfig) {
    
    let defaultPlaceHolder = typeof inputConfig.placeholder != 'undefined' ? inputConfig.placeholder : "Comece a digitar para pesquisar...";
    let isRequired = typeof inputConfig.required != "undefined" ? inputConfig.required : "required";

    if(inputConfig.required === true) {
        isRequired = "required";
    } else {
        isRequired = "required";
    }

    let inputAutoComplete = '<input type="hidden" id="' + hiddenInputIdName + '" name="' + hiddenInputIdName + '"/>'
                            + '<div id="type-head-cnae">'
                                + '<div class="form-input">'
                                    + '<span class="button-autocomplete-du glyphicon glyphicon-chevron-up"></span>'
                                    + '<span class="button-autocomplete-du glyphicon glyphicon-chevron-down hide"></span>'
                                    + '<input class="form-control typeahead twitter-typeahead" id="' + randomId + '" data-provide="typeahead" placeholder="'+ defaultPlaceHolder +'" type="text" '+ isRequired +'>'
                                + '</div>'
                            + '</div>';
    $(inputAutoComplete).insertAfter($("#" + rootInputId));
}

/**
 * generate random id to set in input autocomplet for fix conflicts
 * @param {integer} length 
 */
function generateRandomId(length) {
    var result = "";
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Generate radom number to set in lenght for generate id
 */
function getRandomNumber() {
    return Math.floor(Math.random() * 15)
}