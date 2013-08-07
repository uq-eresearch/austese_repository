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
Handlebars.registerHelper('ellipsis', function(value, len, options) {
    if(value && value.length > len){
        result = value.substr(0,len) + "...";
    } else {
        result = value;
    }
    return new Handlebars.SafeString(result);
});
Handlebars.registerHelper('encode', function(value, options) {
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
    if (!compiledTemplates[tName]) {
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
        {{#gt resources.length 0}}<br/>({{resources.length}} associated resource{{#neq resources.length 1}}s{{/neq}}){{/gt}}\
        {{#if hasEditPermission}}<p><a href="/{{modulePrefix}}/collections/edit/{{id}}{{projParam}}" style="font-size:smaller">EDIT</a></p>{{/if}}\
    </div>'
;
templates.collectionDetail = 
    '<div class="obj">\
        <h4><a href="/{{modulePrefix}}/collections/{{id}}{{projParam}}">{{name}}</a></h4>\
        {{#gt resources.length 0}}\
          <p>{{resources.length}} Resource{{#neq resources.length 1}}s{{/neq}} associated with this ResourceCollection:</p></tpl>\
          <ul>\
           {{#each resources}}<li class="resource" data-resourceid="{{.}}" data-template="summary"></li>{{/each}}\
          </ul>\
        {{\gt}}\
        {{#if hasEditPermission}}<p><a href="/{{modulePrefix}}/collections/edit/{{id}}{{projParam}}" style="font-size:smaller">EDIT</a></p>{{/if}}\
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
        <p>\
        {{#if hasEditPermission}}\
        <a href="/{{modulePrefix}}/mvds/edit/{{id}}{{projParam}}" style="font-size:smaller">DELETE</a>&nbsp;&nbsp;\
        <a href="/collationtools/sendtomvd/{{#each resources}}{{#if id}}{{id}}{{else}}{{.}}{{/if}};{{/each}}?docpath={{name}}" style="font-size:smaller">REFRESH</a>&nbsp;&nbsp;\
        {{/if}}\
        <a href="/collationtools/compare#{{encode name}}" style="font-size:smaller">COMPARE</a>&nbsp;&nbsp;\
        <a href="/collationtools/apparatus#{{encode name}}" style="font-size:smaller">TABLE</a>\
        </p>\
    </div>'
;
templates.versionSummary = 
    '<div class="obj">\
        <h4><a href="/{{modulePrefix}}/versions/{{id}}{{projParam}}">{{versionTitle}} {{#if name}}({{name}}){{/if}}</a></h4>\
        {{date}} {{publisher}}\
        {{#if description}}<br/>{{{ellipsis description 80}}}{{/if}}\
        {{#if firstLine}}<br/><em>{{firstLine}}</em>{{/if}}\
        {{#gt artefacts.length 0}}<br/>({{artefacts.length}} associated artefact{{#neq artefacts.length 1}}s{{/neq}}){{/gt}}\
        {{#gt versions.length 0}}<tpl if="xindex == 1"><br/>({{versions.length}} associated part{{#neq versions.length 1}}s{{/neq}}){{/gt}}\
        {{#gt transcriptions.length 0}}<tpl if="xindex == 1"><br/>({{transcriptions.length}} associated transcription{{#neq transcriptions.length 1}}s{{/neq}}){{/gt}}\
        {{#if hasEditPermission}}<p><a href="/{{modulePrefix}}/versions/edit/{{id}}{{projParam}}" style="font-size:smaller">EDIT</a></p>{{/if}}\
    </div>'
;
templates.versionDetail = 
    '<div>\
        <table class="table">\
        {{#if versionTitle}}<tr><td class="metadatalabel muted">Title</td><td>{{versionTitle}}</td></tr>{{/if}}\
        {{#if name}}<tr><td class="metadatalabel muted">Name</td><td>{{name}}</td></tr>{{/if}}\
        {{#if date}}<tr><td class="metadatalabel muted">Date</td><td>{{date}}</td></tr>{{/if}}\
        {{#if publisher}}<tr><td class="metadatalabel muted">Publisher</td><td>{{publisher}}</td></tr>{{/if}}\
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
           <h3 class="muted">Transcriptions</h3><p>{{transcriptions.length}} transcription{{#neq transcriptions.length 1}}s{{/neq}} associated with this version:</p>\
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
    </div>'
;
templates.agentSummary =
    '<div class="obj">\
    <h4><a title="{{lastName}}, {{firstName}}" data-content="{{biography}}" href="/{{modulePrefix}}/agents/{{id}}{{projParam}}">{{lastName}}, {{firstName}}</a></h4>\
    {{#if birthDate}} b. {{birthDate}}, {{/if}}\
    {{#if deathDate}} d. {{deathDate}}, {{/if}}\
    {{{ellipsis biography 80}}}\
    {{#if hasEditPermission}}\
        <p><a href="/{{modulePrefix}}/agents/edit/{{id}}{{projParam}}" style="font-size:smaller">EDIT</a></p>\
    {{/if}}\
    </div>'
;
// Array access notation is obj.[index] (with a dot)
templates.agentDetail = 
    '<div>\
    {{#if images}}{{#gt images.length 0}}<div class="span2"><div class="resource" data-resourceid="{{images.[0]}}" data-template="image">Image</div></div>{{/gt}}{{/if}}\
    <div {{#if images}}{{#gt images.length 0}}class="span10"{{/gt}}{{/if}}><table class="table">\
    {{#if lastName}}<tr><td class="metadatalabel muted">Last Name</td><td>{{lastName}}</td></tr>{{/if}}\
    {{#if firstName}}<tr><td class="metadatalabel muted">Given Name(s)</td><td>{{firstName}}</td></tr>{{/if}}\
    {{#if birthDate}}<tr><td class="metadatalabel muted">Born</td><td>{{birthDate}}</td></tr>{{/if}}\
    {{#if deathDate}}<tr><td class="metadatalabel muted">Died</td><td>{{deathDate}}</td></tr>{{/if}}\
    {{#if biography}}<tr><td class="metadatalabel muted">Biography</td><td>{{{biography}}}</td></tr>{{/if}}\
    </table></div>\
    </div>'
;
templates.eventSummary = 
    '<div class="obj">\
    <h4><a href="/{{modulePrefix}}/events/{{id}}{{projParam}}">\
      {{#if name}}{{name}}{{else}}Untitled Event{{/if}}{{#if eventType}} ({{eventType}}){{/if}}</a></h4>\
        {{#if startDate}}{{startDate}} &ndash; {{/if}}\
        {{#if endDate}}{{endDate}}{{/if}}\
        {{#if description}}<br/>{{ellipsis description 80}}{{/if}}\
        {{#gt artefacts.length 0}}<br/>(Produced {{artefacts.length}} artefact{{#neq artefacts.length 1}}s{{/neq}}){{/gt}}\
        {{#gt events.length 0}}<br/>({{events.length}} sub-event{{#neq events.length 1}}s{{/neq}}){{/gt}}\
        {{#if hasEditPermission}}\
        <p><a href="/{{modulePrefix}}/events/edit/{{id}}{{projParam}}" style="font-size:smaller">EDIT</a></p>\
        {{/if}}\
    </div>'
;
templates.eventTimelineSummary = 
    '<div class="obj">\
        {{#gt artefacts.length 0}}<br/>(Produced {{artefacts.length}} artefact{{#neq artefacts.length 1}}s{{/neq}}){{/gt}}\
        {{#gt events.length 0}}<br/>({{events.length}} sub-event{{#neq events.length 1}}s{{/neq}}){{/gt}}\
        {{#if description}}<br/>{{ellipsis description 80}}{{/if}}\
        <p><a style="font-size:smaller" href="/{{modulePrefix}}/events/{{id}}{{projParam}}">VIEW</a> \
        {{#if hasEditPermission}}\
        <a href="/{{modulePrefix}}/events/edit/{{id}}{{projParam}}" style="font-size:smaller">EDIT</a>\
        {{/if}}\
        <p>\
    </div>'
;
//{{#gt agents.length 0}}<br/>({{agents.length}} participant{{#neq agents.length 1}}s{{/neq}}){{/gt}}\
templates.eventDetail = 
    '<div class="obj">\
    <h4><a href="/{{modulePrefix}}/events/{{id}}{{projParam}}">{{#if name}}{{name}}{{else}}Untitled Event{{/if}}\
    {{#if eventType}} ({{eventType}}){{/if}}</a></h4>\
    {{#if startDate}}{{startDate}} &ndash; {{/if}}\
    {{#if endDate}}{{endDate}}{{/if}}\
    {{{description}}}\
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
    {{#if agents}}{{#gt agents.length 0}}\
    <p>{{agents.length}} agent{{#neq agents.length 1}}s{{/neq}} participated in this event (no role specified):</p>\
    <ul>\
    {{#each agents}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if authors}}{{#gt authors.length 0}}\
    <p>{{authors.length}} author{{#neq authors.length 1}}s{{/neq}} participated in this event:</p>\
    <ul>\
    {{#each authors}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if amanuenses}}{{#gt amanuenses.length 0}}\
    <p>{{amanuenses.length}} amanuens{{#eq amanuenses.length 1}}i{{/eq}}{{#neq amanuenses.length 1}}e{{/neq}}s participated in this event:</p>\
    <ul>\
    {{#each amanuenses}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if influencers}}{{#gt influencers.length 0}}\
    <p>{{influencers.length}} influencer{{#neq influencers.length 1}}s{{/neq}} participated in this event:</p>\
    <ul>\
    {{#each influencers}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if editors}}{{#gt editors.length 0}}\
    <p>{{editors.length}} editor{{#neq editors.length 1}}s{{/neq}} participated in this event:</p>\
    <ul>\
    {{#each editors}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if publishers}}{{#gt publishers.length 0}}\
    <p>{{publishers.length}} publisher{{#neq publishers.length 1}}s{{/neq}} participated in this event:</p>\
    <ul>\
    {{#each publishers}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if printers}}{{#gt printers.length 0}}\
    <p>{{printers.length}} printer{{#neq printers.length 1}}s{{/neq}} participated in this event:</p>\
    <ul>\
    {{#each printers}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if compositors}}{{#gt compositors.length 0}}\
    <p>{{compositors.length}} compositor{{#neq compositors.length 1}}s{{/neq}} participated in this event:</p>\
    <ul>\
    {{#each compositors}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if illustrators}}{{#gt illustrators.length 0}}\
    <p>{{illustrators.length}} illustrator{{#neq illustrators.length 1}}s{{/neq}} participated in this event:</p>\
    <ul>\
    {{#each illustrators}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if binders}}{{#gt binders.length 0}}\
    <p>{{binders.length}} binder{{#neq binders.length 1}}s{{/neq}} participated in this event:</p>\
    <ul>\
    {{#each binders}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if readers}}{{#gt readers.length 0}}\
    <p>{{readers.length}} reader{{#neq readers.length 1}}s{{/neq}} participated in this event:</p>\
    <ul>\
    {{#each readers}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if translators}}{{#gt translators.length 0}}\
    <p>{{translators.length}} translator{{#neq translators.length 1}}s{{/neq}} participated in this event:</p>\
    <ul>\
    {{#each translators}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if booksellers}}{{#gt booksellers.length 0}}\
    <p>{{booksellers.length}} bookseller{{#neq booksellers.length 1}}s{{/neq}} participated in this event:</p>\
    <ul>\
    {{#each booksellers}}<li><div class="agent" data-agentid="{{.}}" data-template="summary"></div></li>{{/each}}\
    </ul>\
    {{/gt}}{{/if}}\
    {{#if events}}{{#gt events.length 0}}\
        <h3 class="muted">Sub-Events</h3><p>{{events.length}} sub-event{{#neq events.length 1}}s{{/neq}} associated with this event:</p>\
        <ul>\
        {{#each events}}<li><div class="event" data-eventid="{{.}}" data-template="summary"></div></li>{{/each}}\
        </ul>\
    {{/gt}}{{/if}}\
    </div>'
;
templates.artefactSummary = 
    '<div class="obj">\
    <h4><a href="/{{modulePrefix}}/artefacts/{{id}}{{projParam}}">{{source}}</a></h4>\
    {{#if date}}{{date}}, {{/if}}{{ellipsis bibDetails 80}}\
    {{#gt artefacts.length 0}}<br/>({{artefacts.length}} associated part{{#neq artefacts.length 1}}s{{/neq}}){{/gt}}\
    {{#gt facsimiles.length 0}}<br/>({{facsimiles.length}} associated facsimile{{#neq facsimiles.length 1}}s{{/neq}}){{/gt}}\
    {{#if hasEditPermission}}\
        <p><a href="/{{modulePrefix}}/artefacts/edit/{{id}}{{projParam}}" style="font-size:smaller">EDIT</a></p>\
    {{/if}}\
    </div>';
templates.artefactDetail = 
    '<div>\
    <table class="table">\
    {{#if source}}<tr><td class="metadatalabel muted">Source</td><td>{{source}}</td></tr>{{/if}}\
    {{#if date}}<tr><td class="metadatalabel muted">Date</td><td>{{date}}</td></tr>{{/if}}\
    {{#if bibDetails}}<tr><td class="metadatalabel muted">Bibliographic Details</td><td>{{bibDetails}}</td></tr>{{/if}}\
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
    {{#gt facsimiles.length 0}}\
        <h3 class="muted">Facsimiles</h3><p>{{facsimiles.length}} facsimile{{#neq facsimiles.length 1}}s{{/neq}} associated with this artefact:</p>\
        <ul>\
        {{#each facsimiles}}<li class="resource" data-resourceid="{{.}}" data-template="summary"></li>{{/each}}\
        </ul>\
    {{/gt}}\
    </div>'
;
templates.workSummary = 
    '<div class="obj">\
    <h4><a href="/{{modulePrefix}}/works/{{id}}{{projParam}}">{{workTitle}}{{#if name}} ({{name}}){{/if}}</a></h4>\
    {{#if description}}{{{ellipsis description 80}}}<br/>{{/if}}\
    {{#gt versions.length 0}}({{versions.length}} associated version{{#neq versions.length 1}}s{{/neq}}){{/gt}}\
    {{#if hasEditPermission}}\
        <p><a href="/{{modulePrefix}}/works/edit/{{id}}{{projParam}}" style="font-size:smaller">EDIT</a></p>\
    {{/if}}\
    </div>'
;
templates.workDetail = 
    '<div>\
    <table class="table">\
    {{#if workTitle}}<tr><td class="metadatalabel muted">Title</td><td>{{workTitle}}</td></tr>{{/if}}\
    {{#if name}}<tr><td class="metadatalabel muted">Name</td><td>{{name}}</td></tr>{{/if}}\
    {{#if description}}<tr><td class="metadatalabel muted">Description</td><td>{{{description}}}</td></tr>{{/if}}\
    </table>\
    <h3>Versions</h3><ul>\
    {{#each versions}}<li class="version" data-versionid="{{.}}" data-template="summary"></li>{{/each}}\
    </ul>\
    </div>'
;
templates.placeCompact = 
    '<div>\
    <h4><a href="/{{modulePrefix}}/places/{{id}}{{projParam}}">{{name}}, {{state}}</a></h4>\
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
templates.imageEmbed = 
    '<img class="thumbnail" src="{{uri}}/content"/><br/><a style="font-size:smaller" href="/{{modulePrefix}}/resources/{{id}}{{projParam}}">Image details</a>'
;
templates.resourceSummary = 
    '<div>\
    <h4><a href="/{{modulePrefix}}/resources/{{id}}{{projParam}}">{{#if metadata.title}}{{metadata.title}}, {{/if}}{{filename}}</a></h4>\
    {{metadata.format}}\
    </div>'
;
templates.resourceDetail = 
    '<div>\
    <h3>Metadata</h3>\
    <table class="table">\
        {{#if metadata.title}}<tr><td class="metadatalabel muted">Title</td><td>{{metadata.title}}</td></tr>{{/if}}\
        {{#if metadata.description}}<tr><td class="muted">Description</td><td>{{{metadata.description}}}</td></tr>{{/if}}\
        {{#if metadata.coverage}}<tr><td class="muted">Coverage</td><td>{{metadata.coverage}}</td></tr>{{/if}}\
        {{#if metadata.format}}<tr><td class="muted">Format</td><td>{{metadata.format}}</td></tr>{{/if}}\
        {{#if metadata.language}}<tr><td class="muted">Language</td><td>{{metadata.language}}</td></tr>{{/if}}\
        {{#if metadata.publisher}}<tr><td class="muted">Publisher</td><td>{{metadata.publisher}}</td></tr>{{/if}}\
    </table>\
    <h3>File information</h3>\
    <table class="table">\
    <tr><td class="metadatalabel muted">File name</td><td>{{filename}} </td></td></td></tr>\
    <tr><td class="muted">File type</td><td>{{metadata.filetype}}</td></tr>\
    <tr><td class="muted">File size</td><td>{{filesize length}}</td></tr>\
    <tr><td class="muted">MD5 checksum</td><td>{{md5}}</td></tr>\
    </table>\
    <p><a href="./{{id}}/content{{projParam}}"><i class="icon-eye-open"></i> View resource content</a></p>\
    <p><a href="{{uri}}"><i class="icon-download"></i> Download resource</a></p>\
    {{#match metadata.filetype "image"}}\
        <h3>Image Preview</h3>\
        <div data-id="http://{{serverName}}/repository/resources/{{id}}/content"><img class="thumbnail" src="{{uri}}?scale=true&height=480" alt="Image preview"/></div>\
    {{/match}}\
    </div>'
;
//<tr><td class="muted">Uploaded</td><td>{{[Ext.util.Format.date(new Date(values.uploadDate.sec*1000),"d/m/Y g:i a")]}}</td></tr>\
    //Ext 4.1.2 only
    //'<tpl foreach="metadata">\
    //    '<tr><td class="muted">{{$}}</td><td>{{.}}</td></tr>\
    //'</tpl>\