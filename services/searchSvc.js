'use strict';

// Executes a solr search and returns
// a set of solr documents
angular.module('o19s.splainer-search')
  .service('searchSvc', [
    'SolrSearcherFactory',
    'EsSearcherFactory',
    'OsSearcherFactory',
    'activeQueries',
    'defaultSolrConfig',
    function searchSvc(
      SolrSearcherFactory,
      EsSearcherFactory,
      OsSearcherFactory,
      activeQueries,
      defaultSolrConfig
    ) {
      var svc = this;

      // PRE and POST strings, can't just use HTML
      // because Solr doesn't appear to support escaping
      // XML/HTML tags in the content. So we do this stupid thing
      svc.HIGHLIGHTING_PRE    = 'aouaoeuCRAZY_STRING!8_______';
      svc.HIGHLIGHTING_POST   = '62362iueaiCRAZY_POST_STRING!_______';

      this.configFromDefault = function() {
        return angular.copy(defaultSolrConfig);
      };

      this.createSearcher = function (fieldSpec, url, args, queryText, config, searchEngine) {
        if ( searchEngine === undefined ) {
          searchEngine = 'solr';
        }

        var options = {
          fieldList:      fieldSpec.fieldList(),
          hlFieldList:    fieldSpec.highlightFieldList(),
          url:            url,
          args:           args,
          queryText:      queryText,
          config:         config,
          type:           searchEngine
        };

        var searcher;

        if ( searchEngine === 'solr') {
          options.HIGHLIGHTING_PRE  = svc.HIGHLIGHTING_PRE;
          options.HIGHLIGHTING_POST = svc.HIGHLIGHTING_POST;

          searcher = new SolrSearcherFactory(options);
        } else if ( searchEngine === 'es') {
          searcher = new EsSearcherFactory(options);
        } else if ( searchEngine === 'opensearch') {
          console.log("I AM HERE");
          console.log(options);
          searcher = new OsSearcherFactory(options);
        }

        return searcher;
      };

      this.activeQueries = function() {
        return activeQueries.count;
      };
    }
  ]);
