// helpers for comparing values in templates
Handlebars.registerHelper('gt', function(value, compare, options) {
    if (value > compare) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
});
Handlebars.registerHelper('neq', function(value, compare, options) {
    if (value != compare) {
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
var templates = {};
var compiledTemplates = {};
function getTemplate(tName) {
    if (!compiledTemplates[tName] && templates[tName]) {
        try {
            compiledTemplates[tName] = Handlebars.compile(templates[tName]);
        } catch (e){
            console.log("Error compiling template",e);
        }
    }
    return compiledTemplates[tName];
}
templates.collectionSummary = '\
    <div class="obj">\
        <h4><a href="/{{modulePrefix}}/collections/{{id}}{{projParam}}">{{name}}</a></h4>\
        {{#gt resources.length 0}}<i class="fa fa-asterisk"></i> {{resources.length}} associated resource{{#neq resources.length 1}}s{{/neq}}{{/gt}}\
        {{#if hasEditPermission}}<p><a href="/{{modulePrefix}}/collections/edit/{{id}}{{projParam}}" style="font-size:smaller">EDIT METADATA</a></p>{{/if}}\
    </div>'
;
templates.collectionCompact = '\
    <div class="obj">\
        <h4><a {{#if newTab}}target="_blank"{{/if}} href="/{{modulePrefix}}/collections/{{id}}{{projParam}}">{{name}}</a></h4>\
        Item {{resourceIndex}} of {{collectionLength}} \
        {{#if prev}}<a href="{{prev}}{{projParam}}">Previous</a> {{/if}}\
        {{#if next}}<a href="{{next}}{{projParam}}">Next</a>{{/if}}\
    </div>'
;
templates.collectionDetail = 
    '<div class="obj">\
        <h4><a href="/{{modulePrefix}}/collections/{{id}}{{projParam}}">{{upper name 80}}</a></h4>\
        {{#gt resources.length 0}}\
          <p>{{resources.length}} Resource{{#neq resources.length 1}}s{{/neq}} associated with this ResourceCollection:</p>\
          <ul>\
           {{#each resources}}<li class="resource" data-resourceid="{{.}}" data-template="summary"></li>{{/each}}\
          </ul>\
        {{/gt}}\
        {{#if hasEditPermission}}\
        <p><a href="/{{modulePrefix}}/collections/edit/{{id}}{{projParam}}" style="font-size:smaller">EDIT METADATA</a></p>\
        {{/if}}\
    </div>'
;
templates.mvdSummary = 
    '<div class="obj">\
        <h4>{{name}}</h4>\
        {{#gt resources.length 0}}<p>{{resources.length}} Resource{{#neq resources.length 1}}s{{/neq}} associated with this MVD:</p>\
          <ul>\
            {{#each resources}}<li class="resource" data-resourceid="{{#if id}}{{id}}{{else}}{{.}}{{/if}}" data-template="summary"></li>{{/each}}\
          </ul>\
        {{/gt}}\
        {{#if filter}}<p>({{filter}} Filter)</p>{{/if}}\
        <p>\
        {{#if hasEditPermission}}\
        <a href="/{{modulePrefix}}/mvds/edit/{{id}}{{projParam}}" style="font-size:smaller">DELETE</a>&nbsp;&nbsp;\
        <a href="/collationtools/sendtomvd/{{#each resources}}{{#if id}}{{id}}{{else}}{{.}}{{/if}};{{/each}}?docpath={{name}}{{#if filter}}&filter={{filter}}{{/if}}{{projAndParam}}" style="font-size:smaller">REFRESH</a>&nbsp;&nbsp;\
        {{/if}}\
        <a href="/collationtools/compare{{projParam}}#{{encode name}}" style="font-size:smaller">COMPARE</a>&nbsp;&nbsp;\
        <a href="/collationtools/apparatus{{projParam}}#{{encode name}}" style="font-size:smaller">TABLE</a>\
        </p>\
    </div>'
;
templates.versionToken = '<li>{{versionTitle}}{{#if name}}, {{name}}{{/if}}{{#if date}}, {{date}}{{/if}}</li>';
templates.versionTokenResult = '{{#if id}}<li><b>{{versionTitle}}</b>{{#if name}}, {{name}}{{/if}}{{#if date}}, {{date}}{{/if}}</li>{{/if}}';
templates.versionSummary = 
    '<div class="obj">\
        <h4><a href="/{{modulePrefix}}/versions/{{id}}{{projParam}}">{{versionTitle}} {{#if name}}({{name}}){{/if}}</a></h4>\
        {{#if date}}{{date}} {{/if}}{{publisher}}{{#if date}}<br/>{{else}}{{#if publisher}}<br/>{{/if}}{{/if}}\
        {{#if description}}{{{ellipsis description 80}}}<br/>{{/if}}\
        {{#if firstLine}}<em>{{firstLine}}</em><br/>{{/if}}\
        {{#gt artefacts.length 0}}<i class="fa fa-asterisk"></i> {{artefacts.length}} associated artefact{{#neq artefacts.length 1}}s{{/neq}}<br/>{{/gt}}\
        {{#gt versions.length 0}}<i class="fa fa-asterisk"></i> {{versions.length}} associated part{{#neq versions.length 1}}s{{/neq}}<br/>{{/gt}}\
        {{#gt transcriptions.length 0}}<i class="fa fa-file-text-o"></i> {{transcriptions.length}} version transcription{{#neq transcriptions.length 1}}s{{/neq}}{{/gt}}\
        {{#if hasEditPermission}}<p>{{#if locked}}<i class="fa fa-lock"></i> {{/if}}<a href="/{{modulePrefix}}/versions/edit/{{id}}{{projParam}}" style="font-size:smaller">EDIT METADATA</a></p>{{/if}}\
    </div>'
;
templates.versionCompact = 
    '<div class="obj">\
      <h5><a {{#if newTab}}target="_blank"{{/if}} data-content="{{#if firstLine}}<p>{{firstLine}}</p>{{/if}}{{{description}}}" href="/{{modulePrefix}}/versions/{{id}}{{projParam}}">{{ellipsis versionTitle 50}} {{#if name}}({{ellipsis name 20}}){{/if}}</a></h5>\
      {{date}} {{publisher}}\
    </div>'
;
templates.versionDetail = 
    '<div>\
        <h1>{{#if versionTitle}}{{upper versionTitle 80}}{{else}}UNTITLED VERSION{{/if}}</h1>\
        <table class="table">\
        {{#if versionTitle}}<tr><td class="metadatalabel muted">Title</td><td>{{versionTitle}}</td></tr>{{/if}}\
        {{#if name}}<tr><td class="metadatalabel muted">Name</td><td>{{name}}</td></tr>{{/if}}\
        {{#if date}}<tr><td class="metadatalabel muted">Date</td><td>{{date}}</td></tr>{{/if}}\
        {{#if publisher}}<tr><td class="metadatalabel muted">Publisher</td><td>{{publisher}}</td></tr>{{/if}}\
        {{#if lines}}<tr><td class="metadatalabel muted">Lines</td><td>{{lines}}</td></tr>{{/if}}\
        {{#if description}}<tr><td class="metadatalabel muted">Description</td><td>{{{description}}}</td></tr>{{/if}}\
        {{#if illust}}<tr><td class="metadatalabel muted">Illustrations</td><td>{{illust}}</td></tr>{{/if}}\
        {{#if firstLine}}<tr><td class="metadatalabel muted">First Line</td><td>{{firstLine}}</td></tr>{{/if}}\
        </table>\
        {{#gt artefacts.length 0}}\
            <h3 class="muted">Artefacts</h3><p>{{artefacts.length}} artefact{{#neq artefacts.length 1}}s{{/neq}} associated with this version:</p>\
            <ul>\
            {{#each artefacts}}<li><div class="artefact" data-artefactid="{{.}}" data-template="summary"></div></li>{{/each}}\
            </ul>\
        {{/gt}}\
        {{#gt versions.length 0}}\
            <h3 class="muted">Parts</h3><p>{{versions.length}} part{{#neq versions.length 1}}s{{/neq}} associated with this version:</p>\
            <ul>\
                {{#each versions}}<li><div class="version" data-versionid="{{.}}" data-template="summary"></div></li>{{/each}}\
            </ul>\
        {{/gt}}\
        {{#gt transcriptions.length 0}}\
           <h3 class="muted"><i class="fa fa-file-text-o"></i> Version Transcriptions</h3><p>{{transcriptions.length}} transcription{{#neq transcriptions.length 1}}s{{/neq}} associated with this version:</p>\
            <ul>\
            {{#each transcriptions}}<li class="resource" data-resourceid="{{.}}" data-template="summary"></li>{{/each}}\
            </ul>\
        {{/gt}}\
        {{#gt places.length 0}}\
            <h3 class="muted">Places</h3><p>{{places.length}} place{{#neq places.length 1}}s{{/neq}} associated with this version:</p>\
            <ul>\
            {{#each places}}<li class="place" data-placeid="{{.}}" data-template="compact"></li>{{/each}}\
            </ul>\
        {{/gt}}\
        {{#if locked}}<i class="fa fa-lock"></i> {{/if}}\
    </div>'
;
templates.agentToken = '<li title="{{lastName}}, {{firstName}}" data-content="{{biography}}">{{lastName}}{{if firstName}}, {{firstName}}{{/if}}</li>';
templates.agentTokenResult = '{{#if id}}<li>{{lastName}}{{#if firstName}}, {{firstName}}{{/if}} {{ellipsis biography 30}}</li>{{/if}}';
templates.agentSummary =
    '<div class="obj">\
    <h4>{{#eq agentType "Person"}}<i class="fa fa-user"></i> {{/eq}}{{#eq agentType "Organisation"}}<i class="fa fa-building-o"></i> {{/eq}}{{#eq agentType "Group"}}<i class="fa fa-users"></i> {{/eq}}<a title="{{lastName}}{{#if firstName}}, {{firstName}}{{/if}}"\
    data-content="{{biography}}" href="/{{modulePrefix}}/agents/{{id}}{{projParam}}">{{lastName}}{{#if firstName}}, {{firstName}}{{/if}}</a></h4>\
    {{#if birthDate}} b. {{birthDate}}, {{/if}}\
    {{#if deathDate}} d. {{deathDate}}, {{/if}}\
    {{{ellipsis biography 80}}}\
    {{#if hasEditPermission}}\
        <p>{{#if locked}}<i class="fa fa-lock"></i> {{/if}}<a href="/{{modulePrefix}}/agents/edit/{{id}}{{projParam}}" style="font-size:smaller">EDIT METADATA</a></p>\
    {{/if}}\
    </div>'
;
// Array access notation is obj.[index] (with a dot)
templates.agentDetail = 
    '<div>\
    <h1>{{#if lastName}}{{upper lastName 300}}{{/if}}{{#if firstName}}, {{upper firstName 300}}{{/if}}</h1>\
    {{#if images}}{{#gt images.length 0}}<div class="span2"><div class="resource" data-resourceid="{{images.[0]}}" data-template="image">Image</div></div>{{/gt}}{{/if}}\
    <div {{#if images}}{{#gt images.length 0}}class="span10"{{/gt}}{{/if}}><table class="table">\
    {{#if birthDate}}<tr><td class="metadatalabel muted">Born</td><td>{{birthDate}}</td></tr>{{/if}}\
    {{#if deathDate}}<tr><td class="metadatalabel muted">Died</td><td>{{deathDate}}</td></tr>{{/if}}\
    {{#if biography}}<tr><td class="metadatalabel muted">Biography</td><td>{{{biography}}}</td></tr>{{/if}}\
    {{#if agentType}}<tr><td class="metadatalabel muted">Agent Type</td><td>{{agentType}}</td></tr>{{/if}}\
    </table></div>\
    {{#if locked}}<i class="fa fa-lock"></i> {{/if}}\
    </div>'
;
templates.agentCompact = 
    '<div class="obj">\
    <h5><a {{#if newTab}}target="_blank"{{/if}} title="{{lastName}}, {{firstName}}" data-content="{{biography}}" href="/{{modulePrefix}}/agents/{{id}}{{projParam}}">{{lastName}}, {{firstName}}</a></h5>\
    {{#if birthDate}} b. {{birthDate}}, {{/if}}\
    {{#if deathDate}} d. {{deathDate}}, {{/if}}\
    </div>'
;
templates.eventToken = 
    '<li title="{{#if name}}{{name}}{{else}}Untitled{{/if}}{{#if eventType}} ({{eventType}}){{/if}}" \
    data-content="{{{description}}}">\
    {{name}}{{#if eventType}} ({{eventType}}){{/if}} \
    {{ellipsis description 20}}\
    </li>'
;
templates.eventTokenResult = '{{#if id}}<li>\
    {{name}}{{#if eventType}} ({{eventType}}){{/if}} \
    {{startDate}} \
    {{ellipsis description 40}}\
    </li>{{/if}}'
;
templates.eventSummary = 
    '<div class="obj">\
    <h4><a href="/{{modulePrefix}}/events/{{id}}{{projParam}}">\
      {{#if name}}{{name}}{{else}}Untitled Event{{/if}}{{#if eventType}} ({{eventType}}){{/if}}</a></h4>\
        {{#if startDate}}{{startDate}} &ndash; {{/if}}\
        {{#if endDate}}{{endDate}}{{/if}}\
        {{#if description}}<br/>{{ellipsis description 80}}{{/if}}\
        {{#gt artefacts.length 0}}<br/>Produced {{artefacts.length}} artefact{{#neq artefacts.length 1}}s{{/neq}}{{/gt}}\
        {{#gt events.length 0}}<br/>{{events.length}} sub-event{{#neq events.length 1}}s{{/neq}}{{/gt}}\
        {{#if hasEditPermission}}\
        <p>{{#if locked}}<i class="fa fa-lock"></i> {{/if}}<a href="/{{modulePrefix}}/events/edit/{{id}}{{projParam}}" style="font-size:smaller">EDIT METADATA</a></p>\
        {{/if}}\
    </div>'
;
templates.eventCompact = 
    '<div class="obj">\
    <h5><a {{#if newTab}}target="_blank"{{/if}} data-content="{{#if startDate}}{{startDate}} &ndash; {{/if}}\
    {{#if endDate}}{{endDate}}{{/if}}<br/>{{{description}}}" href="/{{modulePrefix}}/events/{{id}}{{projParam}}">\
    {{#if name}}{{name}}{{else}}Untitled Event{{/if}}{{#if eventType}} ({{eventType}}){{/if}}</a></h5>\
    </div>'
;
templates.eventTimelineSummary = 
    '<div class="obj">\
        {{#gt artefacts.length 0}}<br/>(Produced {{artefacts.length}} artefact{{#neq artefacts.length 1}}s{{/neq}}){{/gt}}\
        {{#gt events.length 0}}<br/>({{events.length}} sub-event{{#neq events.length 1}}s{{/neq}}){{/gt}}\
        {{#if description}}<br/>{{ellipsis description 80}}{{/if}}\
        <p><a target="_blank" style="font-size:smaller" href="/{{modulePrefix}}/events/{{id}}{{projParam}}">VIEW</a> \
        {{#if hasEditPermission}}\
          {{#if locked}}<i class="fa fa-lock"></i> {{/if}}\
          <a target="_blank" href="/{{modulePrefix}}/events/edit/{{id}}{{projParam}}" style="font-size:smaller">EDIT METADATA</a>\
        {{/if}}\
        <p>\
    </div>'
;
templates.eventChronologyDetail = '<div class="obj chronologyItem">\
    <div class="row-fluid"><div class="span3">\
    <a href="/{{modulePrefix}}/events/{{id}}{{projParam}}">{{#if startDate}}{{startDate}} &ndash; {{else}}Unspecified Date &ndash; {{/if}}\
    {{#if endDate}}{{endDate}}{{/if}}\
    </a></div><div class="span9">\
    {{#if name}}<b>{{name}}</b><br/>{{/if}}\
    {{{description}}}\
    {{#if hasEditPermission}}\
    {{#if locked}}<i class="fa fa-lock"></i> {{/if}}\
     <a target="_blank" href="/{{modulePrefix}}/events/edit/{{id}}{{projParam}}" style="font-size:smaller">EDIT METADATA</a>\
    {{/if}}\
    </div></div>'
;
//{{#gt agents.length 0}}<br/>({{agents.length}} participant{{#neq agents.length 1}}s{{/neq}}){{/gt}}\
templates.eventDetail = 
    '<div class="obj">\
    <h1>{{#if name}}{{upper name 80}}{{else}}UNTITLED EVENT{{/if}}</h4>\
    <table class="table">\
    {{#if name}}<tr><td class="metadatalabel muted">Name</td><td>{{name}}</td></tr>{{/if}}\
    {{#if eventType}}<tr><td class="metadatalabel muted">Event Type</td><td>{{eventType}}</td></tr>{{/if}}\
    {{#if startDate}}<tr><td class="metadatalabel muted">Start Date</td><td>{{startDate}}</td></tr>{{/if}}\
    {{#if endDate}}<tr><td class="metadatalabel muted">End Date</td><td>{{endDate}}</td></tr>{{/if}}\
    {{#if description}}<tr><td class="metadatalabel muted">Description</td><td>{{{description}}}</td></tr>{{/if}}\
    {{#if references}}<tr><td class="metadatalabel muted">References</td><td>{{{references}}}</td></tr>{{/if}}\
    </table>\
    {{#if artefacts}}{{#gt artefacts.length 0}}\
    <h3 class="muted">Artefacts</h3><p>{{artefacts.length}} artefact{{#neq artefacts.length 1}}s{{/neq}} produced by this event:</p>\
    <ul>\
    {{#each artefacts}}<li><div class="artefact" data-artefactid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if places}}{{#gt places.length 0}}\
    <h3 class="muted">Places</h3><p>{{places.length}} place{{#neq places.length 1}}s{{/neq}} associated with this event:</p>\
    <ul>\
    {{#each places}}<li class="place" data-placeid="{{.}}" data-template="compact"></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    <h3 class="muted">Agent Roles</h3>\
    {{#if authors}}{{#gt authors.length 0}}\
    <p class="eventAgentLabel">Author{{#neq authors.length 1}}s{{/neq}}:</p>\
    <ul>\
    {{#each authors}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if amanuenses}}{{#gt amanuenses.length 0}}\
    <p class="eventAgentLabel">Amanuens{{#eq amanuenses.length 1}}i{{/eq}}{{#neq amanuenses.length 1}}e{{/neq}}s:</p>\
    <ul>\
    {{#each amanuenses}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if influencers}}{{#gt influencers.length 0}}\
    <p class="eventAgentLabel">Influencer{{#neq influencers.length 1}}s{{/neq}}:</p>\
    <ul>\
    {{#each influencers}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if editors}}{{#gt editors.length 0}}\
    <p class="eventAgentLabel">Editor{{#neq editors.length 1}}s{{/neq}}:</p>\
    <ul>\
    {{#each editors}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if publishers}}{{#gt publishers.length 0}}\
    <p class="eventAgentLabel">Publisher{{#neq publishers.length 1}}s{{/neq}}:</p>\
    <ul>\
    {{#each publishers}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if printers}}{{#gt printers.length 0}}\
    <p class="eventAgentLabel">Printer{{#neq printers.length 1}}s{{/neq}}:</p>\
    <ul>\
    {{#each printers}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if compositors}}{{#gt compositors.length 0}}\
    <p class="eventAgentLabel">Compositor{{#neq compositors.length 1}}s{{/neq}}:</p>\
    <ul>\
    {{#each compositors}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if illustrators}}{{#gt illustrators.length 0}}\
    <p class="eventAgentLabel">Illustrator{{#neq illustrators.length 1}}s{{/neq}}:</p>\
    <ul>\
    {{#each illustrators}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if binders}}{{#gt binders.length 0}}\
    <p class="eventAgentLabel">Binder{{#neq binders.length 1}}s{{/neq}}:</p>\
    <ul>\
    {{#each binders}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if readers}}{{#gt readers.length 0}}\
    <p class="eventAgentLabel">Reader{{#neq readers.length 1}}s{{/neq}}:</p>\
    <ul>\
    {{#each readers}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if translators}}{{#gt translators.length 0}}\
    <p class="eventAgentLabel">Translator{{#neq translators.length 1}}s{{/neq}}:</p>\
    <ul>\
    {{#each translators}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if booksellers}}{{#gt booksellers.length 0}}\
    <p class="eventAgentLabel">Bookseller{{#neq booksellers.length 1}}s{{/neq}}:</p>\
    <ul>\
    {{#each booksellers}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if agents}}{{#gt agents.length 0}}\
    <p class="eventAgentLabel">Agent{{#neq agents.length 1}}s{{/neq}} (no role specified):</p>\
    <ul>\
    {{#each agents}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if events}}{{#gt events.length 0}}\
        <h3 class="muted">Sub-Events</h3><p>{{events.length}} sub-event{{#neq events.length 1}}s{{/neq}} associated with this event:</p>\
        <ul>\
        {{#each events}}<li><div class="event" data-eventid="{{.}}" data-template="summary"></div></li>{{/each}}\
        </ul>\
    {{/gt}}{{/if}}\
    {{#if locked}}<i class="fa fa-lock"></i> {{/if}}\
    </div>'
;
templates.artefactToken = '<li title="{{source}}, {{date}}" data-content="{{#if bibDetails}}{{ellipsis bibDetails}}{{/if}}">{{source}}, {{date}}</li>';
templates.artefactTokenResult = '{{#if id}}<li><b>{{source}}</b>, {{date}}</li>{{/if}}';
templates.artefactSummary = 
    '<div class="obj">\
    <h4><a href="/{{modulePrefix}}/artefacts/{{id}}{{projParam}}">{{source}}</a></h4>\
    {{#if date}}{{date}}<br/>{{/if}}{{#if bibDetails}}{{ellipsis bibDetails 80}}<br/>{{/if}}\
    {{#if description}}{{{ellipsis description 80}}}<br/>{{/if}}\
    {{#gt artefacts.length 0}}<i class="sidebaricon fa fa-asterisk"></i> {{artefacts.length}} associated part{{#neq artefacts.length 1}}s{{/neq}}<br/>{{/gt}}\
    {{#gt facsimiles.length 0}}<i class="sidebaricon fa fa-camera"></i> {{facsimiles.length}} facsimile{{#neq facsimiles.length 1}}s{{/neq}}<br/>{{/gt}}\
    {{#gt transcriptions.length 0}}<i class="sidebaricon fa fa-file-text-o"></i> {{transcriptions.length}} diplomatic transcription{{#neq transcriptions.length 1}}s{{/neq}}{{/gt}}\
    {{#if coverImage}}\
        <div class="resource facsimilePreview" data-resourceid="{{coverImage}}" data-template="facsimilePreview"></div>\
    {{else}}\
        {{#if facsimiles}}\
            <div class="resource facsimilePreview" data-resourceid="{{facsimiles.[0]}}" data-template="facsimilePreview"></div>\
        {{/if}}\
    {{/if}}\
    {{#if hasEditPermission}}\
        <p>{{#if locked}}<i class="fa fa-lock"></i> {{/if}}<a href="/{{modulePrefix}}/artefacts/edit/{{id}}{{projParam}}" style="font-size:smaller">EDIT METADATA</a></p>\
    {{/if}}\
    </div>';

templates.artefactDetail = 
    '<div>\
    <h1>{{#if source}}{{upper source 80}}{{else}}UNTITLED ARTEFACT{{/if}}</h1>\
    <table class="table">\
    {{#if source}}<tr><td class="metadatalabel muted">Title</td><td>{{source}}</td></tr>{{/if}}\
    {{#if pageNumbers}}<tr><td class="metadatalabel muted">Page Number(s)</td><td>{{pageNumbers}}</td></tr>{{/if}}\
    {{#if date}}<tr><td class="metadatalabel muted">Date</td><td>{{date}}</td></tr>{{/if}}\
    {{#if description}}<tr><td class="metadatalabel muted">Description</td><td>{{{description}}}</td></tr>{{/if}}\
    {{#if bibDetails}}<tr><td class="metadatalabel muted">Bibliographic Details</td><td>{{bibDetails}}</td></tr>{{/if}}\
    {{#if series}}<tr><td class="metadatalabel muted">Series</td><td>{{series}}</td></tr>{{/if}}\
    {{#if publisher}}<tr><td class="metadatalabel muted">Publisher</td><td>{{publisher}}</td></tr>{{/if}}\
    {{#if printer}}<tr><td class="metadatalabel muted">Printer</td><td>{{printer}}</td></tr>{{/if}}\
    {{#if format}}<tr><td class="metadatalabel muted">Format</td><td>{{format}}</td></tr>{{/if}}\
    {{#if paperType}}<tr><td class="metadatalabel muted">Paper Type</td><td>{{paperType}}</td></tr>{{/if}}\
    {{#if artefactSize}}<tr><td class="metadatalabel muted">Size</td><td>{{artefactSize}}</td></tr>{{/if}}\
    </table>\
    {{#gt artefacts.length 0}}\
        <h3 class="muted">Parts</h3><p>{{artefacts.length}} part{{#neq artefacts.length 1}}s{{/neq}} associated with this artefact:</p>\
        <ul>\
        {{#each artefacts}}<li><div class="artefact" data-artefactid="{{.}}" data-template="summary"></div></li>{{/each}}\
        </ul>\
    {{/gt}}\
    {{#gt transcriptions.length 0}}\
        <h3 class="muted"><i class="fa fa-file-text-o"></i> Diplomatic Transcriptions</h3><p>{{transcriptions.length}} transcription{{#neq transcriptions.length 1}}s{{/neq}} associated with this artefact:</p>\
        <ul>\
        {{#each transcriptions}}<li class="resource" data-resourceid="{{.}}" data-template="summary"></li>{{/each}}\
        </ul>\
    {{/gt}}\
    {{#gt facsimiles.length 0}}\
        <h3 class="muted"><i class="fa fa-camera"></i>  Facsimiles</h3><p>{{facsimiles.length}} facsimile{{#neq facsimiles.length 1}}s{{/neq}} associated with this artefact:</p>\
        <div class="row-fluid">\
        {{#each facsimiles}}<div class="span2 resource facsimilePreview" data-resourceid="{{.}}" data-template="facsimilePreview"></div>{{/each}}\
        </div>\
    {{/gt}}\
    {{#if locked}}<i class="fa fa-lock"></i> {{/if}}\
    </div>'
;
templates.artefactCompact =
    '<div class="obj">\
        <h5><a {{#if newTab}}target="_blank"{{/if}} data-content="{{bibDetails}}" href="/{{modulePrefix}}/artefacts/{{id}}{{projParam}}">{{source}}</a></h5>\
        {{#if date}}{{date}}<br/>{{/if}}\
        Item {{resourceIndex}} of {{collectionLength}} \
        {{#if prev}}<a href="{{prev}}{{projParam}}">Previous</a> {{/if}}\
        {{#if next}}<a href="{{next}}{{projParam}}">Next</a>{{/if}}\
    </div>'
;
templates.workSummary = 
    '<div class="obj">\
    <h4><a href="/{{modulePrefix}}/works/{{id}}{{projParam}}">{{workTitle}}{{#if name}} ({{name}}){{/if}}</a></h4>\
    {{#if description}}{{{ellipsis description 80}}}<br/>{{/if}}\
    {{#gt versions.length 0}}<i class="fa fa-asterisk"></i> {{versions.length}} associated version{{#neq versions.length 1}}s{{/neq}}{{/gt}}\
    <p>\
    {{#if hasEditPermission}}\
    {{#if locked}}<i class="fa fa-lock"></i> {{/if}}\
    <a href="/{{modulePrefix}}/works/edit/{{id}}{{projParam}}" style="font-size:smaller">EDIT METADATA</a>&nbsp;&nbsp;\
    {{/if}}\
    <a href="/reading/{{id}}{{projParam}}" style="font-size:smaller">READ</a>\
    </p>\
    </div>'
;
templates.workDetail = 
    '<div>\
    <h1>{{#if workTitle}}{{upper workTitle 80}}{{else}}UNTITLED WORK{{/if}}</h1>\
    <table class="table">\
    {{#if workTitle}}<tr><td class="metadatalabel muted">Title</td><td>{{workTitle}}</td></tr>{{/if}}\
    {{#if name}}<tr><td class="metadatalabel muted">Name</td><td>{{name}}</td></tr>{{/if}}\
    {{#if description}}<tr><td class="metadatalabel muted">Description</td><td>{{{description}}}</td></tr>{{/if}}\
    </table>\
    {{#if authors}}{{#gt authors.length 0}}<h3 class="muted">Author{{#neq authors.length 1}}s{{/neq}}</h3><ul>\
    {{#each authors}}<li class="agent" data-agentid="{{.}}" data-template="summary"></li>{{/each}}{{/gt}}{{/if}}</ul>\
    <h3 class="muted">Versions</h3><ul>\
    {{#each versions}}<li class="version" data-versionid="{{.}}" data-template="summary"></li>{{/each}}\
    </ul>\
    {{#if locked}}<i class="fa fa-lock"></i> {{/if}}\
    </div>'
;
templates.workCompact =
    '<div class="obj">\
    <h5><a {{#if newTab}}target="_blank"{{/if}} data-content="{{{description}}}" href="/{{modulePrefix}}/works/{{id}}{{projParam}}">{{ellipsis workTitle 50}}{{#if name}} ({{name}}){{/if}}</a></h5>\
    </div>'
;
templates.placeToken = '<li>{{name}}, {{state}}</li>';
templates.placeTokenResult = '{{#if id}}<li><b>{{name}}, </b>{{state}}</li>{{/if}}';
templates.placeCompact = 
    '<div>\
    <h4><a {{#if newTab}}target="_blank"{{/if}} href="/{{modulePrefix}}/places/{{id}}{{projParam}}">{{name}}, {{state}}</a></h4>\
    <p>Feature Type: <span class="featureCode">{{featureCode }}</span></p>\
    </div>'
;
templates.placeSummary = 
    '<div class="span3 obj">\
        <div class="placedesc">\
        <h4><a href="/{{modulePrefix}}/places/{{id}}{{projParam}}">{{name}}, {{state}}</a></h4>\
        <p>Feature Type: <span class="featureCode" data-truncate="true">{{featureCode }}</span></p>\
        </div>\
        <div class="minimap" data-lat="{{latitude}}" data-long="{{longitude}}"></div>\
    </div>'
;
templates.placeDetail = 
    '<div class="span6">\
    <h1>{{#if name}}{{upper name 80}}{{else}}UNNAMED PLACE{{/if}}{{#if state}}, {{state}}{{/if}}</h1>\
        <table class="table">\
        <tr><td class="metadatalabel muted">Name</td><td>{{name}}</td></tr>\
        <tr><td class="muted">State</td><td>{{state}}</td></tr>\
        <tr><td class="muted">Longitude</td><td>{{longitude}}</td></tr>\
        <tr><td class="muted">Latitude</td><td>{{latitude}}</td></tr>\
        <tr><td class="muted">Feature Type</td><td><span class="featureCode">{{featureCode }}</span></td></tr>\
        </table>\
    </div>\
    <div class="span6 minimap" data-lat="{{latitude}}" data-long="{{longitude}}"></div>'
;
templates.facsimilePreview = 
   '<a style="font-size:smaller" href="/{{modulePrefix}}/resources/{{id}}{{projParam}}">\
    <img class="thumbnail" src="{{uri}}/content?scale=true"/>\
    {{filename}}{{#if title}}<br/>{{title}}{{/if}}</a>'
;

templates.imageEmbed = 
    '<img class="thumbnail" src="{{uri}}/content"/><a style="font-size:smaller" href="/{{modulePrefix}}/resources/{{id}}{{projParam}}">Image details</a>'
;
templates.imageScaleEmbed = 
    '<img class="thumbnail" src="{{uri}}/content?scale=true"/><br/><a style="font-size:smaller" href="/{{modulePrefix}}/resources/{{id}}{{projParam}}">Image details</a>'
;
templates.resourceToken = 
    '<li>\
    {{#if metadata.title}}{{ellipsis metadata.title 25}}, {{/if}}{{#if filename}}{{ellipsis filename 25}}{{/if}}\
    </li>'
;
templates.resourceTokenResult = '{{#if id}}<li><b>{{#if metadata.title}}{{metadata.title}}</b>, {{/if}}{{filename}}</li>{{/if}}';
templates.resourceSummary = 
    '<div>\
    <h4><a href="/{{modulePrefix}}/resources/{{id}}{{projParam}}">{{#if metadata.title}}{{metadata.title}}, {{/if}}{{filename}}</a></h4>\
    {{metadata.format}}\
    {{#if hasEditPermission}}<a href="/{{modulePrefix}}/resources/edit/{{id}}{{projParam}}" style="font-size:smaller">EDIT CONTENT</a>&nbsp;&nbsp;{{/if}}\
    <a style="font-size:smaller" href="/{{modulePrefix}}/resources/{{id}}/content{{projParam}}">VIEW</a>\
    </div>'
;
templates.resourceBareDetail = '<span>\
    <b>{{#if metadata.title}}{{metadata.title}}, {{/if}}{{filename}}</b> ({{metadata.filetype}})\
    </span>'
;
templates.resourceCompact = 
    '<span>\
    <b><a {{#if newTab}}target="_blank"{{/if}} data-content="{{{metadata.description}}}" href="/{{modulePrefix}}/resources/{{id}}{{projParam}}">{{#if metadata.title}}{{metadata.title}}, {{/if}}{{filename}}{{#if metadata.shortname}} ({{metadata.shortname}}){{/if}}</a></b> ({{metadata.filetype}})\
    </span>'
;
templates.resourceDetail = 
    '<div>\
    <h1>{{#if metadata.title}}{{upper metadata.title 80}}{{else}}{{upper filename 100}}{{/if}}</h1>\
    <h3>Metadata</h3>\
    <table class="table">\
        {{#if metadata.title}}<tr><td class="metadatalabel muted">Title</td><td>{{metadata.title}}</td></tr>{{/if}}\
        {{#if metadata.description}}<tr><td class="muted">Description</td><td>{{{metadata.description}}}</td></tr>{{/if}}\
        {{#if metadata.coverage}}<tr><td class="muted">Coverage</td><td>{{metadata.coverage}}</td></tr>{{/if}}\
        {{#if metadata.format}}<tr><td class="muted">Format</td><td>{{metadata.format}}</td></tr>{{/if}}\
        {{#if metadata.language}}<tr><td class="muted">Language</td><td>{{metadata.language}}</td></tr>{{/if}}\
        {{#if metadata.license}}<tr><td class="muted">License</td><td>{{metadata.license}}</td></tr>{{/if}}\
        {{#if metadata.publisher}}<tr><td class="muted">Publisher</td><td>{{metadata.publisher}}</td></tr>{{/if}}\
        {{#if metadata.rights}}<tr><td class="muted">Rights</td><td>{{metadata.rights}}</td></tr>{{/if}}\
        {{#if metadata.source}}<tr><td class="muted">Source</td><td>{{metadata.source}}</td></tr>{{/if}}\
    </table>\
    <h3>File information</h3>\
    <table class="table">\
    <tr><td class="metadatalabel muted">File name</td><td>{{filename}} </td></td></td></tr>\
    <tr><td class="muted">File type</td><td>{{metadata.filetype}}</td></tr>\
    <tr><td class="muted">File size</td><td>{{filesize length}}</td></tr>\
    <tr><td class="muted">MD5 checksum</td><td>{{md5}}</td></tr>\
    </table>\
    {{#match metadata.filetype "image"}}\
        <h3>Image Preview</h3>\
        <div data-id="http://{{serverName}}/repository/resources/{{id}}/content"><a href="http://{{serverName}}/repository/resources/{{id}}/content{{projParam}}">\
        <img class="thumbnail" src="{{uri}}?scale=true&height=480" alt="Image preview"/></a></div>\
    {{/match}}\
    {{#if locked}}<i class="fa fa-lock"></i> {{/if}}\
    </div>'
;
//<tr><td class="muted">Uploaded</td><td>{{[Ext.util.Format.date(new Date(values.uploadDate.sec*1000),"d/m/Y g:i a")]}}</td></tr>\
    //Ext 4.1.2 only
    //'<tpl foreach="metadata">\
    //    '<tr><td class="muted">{{$}}</td><td>{{.}}</td></tr>\
    //'</tpl>\
