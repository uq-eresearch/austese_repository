// helpers for comparing values in templates
Handlebars.registerHelper('gt', function(value, compare, options) {
    if (value > compare) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
});
Handlebars.registerHelper('neq', function(value, compare, options) {
    if (value && value != compare) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
});
Handlebars.registerHelper('eq', function(value, compare, options) {
    if (value == compare) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
});
Handlebars.registerHelper('match', function(value, compare, options) {
    if (value && value.match(compare)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
});
Handlebars.registerHelper('upper', function(value, len, options) {
    if(value && value.length > len){
        result = value.substr(0,len) + "...";
    } else {
        result = value;
    }
    if (result){
        result = result.toUpperCase();
    }
    if (!result){
        result = "";
    }
    return new Handlebars.SafeString(result);
});
Handlebars.registerHelper('ellipsis', function(value, len, options) {
    if(value && value.length > len){
        result = jQuery("<div>" + value + "</div>").text().substr(0,len) + "...";
    } else {
        result = value;
    }
    if (!result) {
        result="";
    }
    return new Handlebars.SafeString(result);
});
Handlebars.registerHelper('encode', function(value, options) {
    if (!value){
        return;
    }
    return new Handlebars.SafeString(encodeURIComponent(value));
}); 
Handlebars.registerHelper('filesize', function(len, options) {
    var sizes = [" B", " KB", " MB", " GB" ];
    var s = 1;
    while (len >= 1024 && (s++ < sizes.length)) {
        len /= 1024.0;
    }
    return new Handlebars.SafeString(len.toFixed(2) + sizes[s-1]);
});
var templateCache = {};

/**
 * Retrieve a compiled Handlebars template
 *
 * Keeps a cache of compiled templates, if a template isn't in the cache
 * requests the template from the server and compiles it first.
 *
 * Individual templates are stored in files on the server.
 */
function getTemplate(tName) {
    if (!templateCache[tName]) {
        try {
            var template_dir = '/sites/all/modules/austese_repository/ui/templates';
            var template_url = template_dir + '/' + tName + '.html';
            var template_string;

            jQuery.ajax({
                url: template_url,
                method: 'GET',
                async: false,
                success: function(data) {
                    template_string = data;
                }
            });

            templateCache[tName] = Handlebars.compile(template_string);
        } catch (e){
            console.log("Error compiling template",e);
        }
    }
    return templateCache[tName];
}