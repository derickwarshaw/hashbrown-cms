/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 279);
/******/ })
/************************************************************************/
/******/ ({

/***/ 279:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Demo API
 *
 * @memberof HashBrown.Client
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DemoApi = function () {
    function DemoApi() {
        _classCallCheck(this, DemoApi);
    }

    /**
     * Clears the cache
     */
    DemoApi.reset = function reset() {
        localStorage.setItem('demo', null);

        location.hash = '/content/';
        location.reload();
    };

    /**
     * Gets the fake API cache
     */


    DemoApi.getCache = function getCache(resource, id) {
        var cache = this.cache;

        if (!cache) {
            try {
                cache = localStorage.getItem('demo') || '{}';
                cache = JSON.parse(cache);
            } catch (e) {
                cache = {};
            }

            cache = cache || {};
        }

        this.cache = cache;

        if (!resource) {
            return cache;
        }

        if (!cache[resource] || !Array.isArray(cache[resource])) {
            cache[resource] = DemoApi.getNativeResource(resource) || [];
        }

        if (!id) {
            return cache[resource];
        }

        for (var i in cache[resource]) {
            if (cache[resource][i].id === id || cache[resource][i].name === id) {
                return cache[resource][i];
            }
        }

        return null;
    };

    /**
     * Sets the fake API
     */


    DemoApi.setCache = function setCache(resource, id, data) {
        var cache = DemoApi.getCache();

        if (!cache[resource] || !Array.isArray(cache[resource])) {
            cache[resource] = DemoApi.getNativeResource(resource) || [];
        }

        var foundExisting = false;

        for (var i in cache[resource]) {
            if (cache[resource][i].id == id) {
                // Update data
                if (data) {
                    cache[resource][i] = data;

                    // Delete data
                } else {
                    cache[resource].splice(i, 1);
                }

                foundExisting = true;

                break;
            }
        }

        if (!foundExisting && data) {
            cache[resource].push(data);
        }

        localStorage.setItem('demo', JSON.stringify(cache));

        return data;
    };

    /**
     * Request
     */


    DemoApi.request = function request(method, url, data) {
        url = url.replace('/api/demo/live/', '');
        method = method.toUpperCase();

        debug.log(method + ' ' + url, DemoApi);

        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(DemoApi.requestSync(method, url, data));
            }, 100);
        });
    };

    DemoApi.requestSync = function requestSync(method, url, data) {
        url = url.replace('/api/demo/live/', '');
        method = method.toUpperCase();

        debug.log(method + ' ' + url, DemoApi);

        switch (method) {
            case 'GET':
                return DemoApi.get(url);

            case 'POST':
                return DemoApi.post(url, data);

            case 'DELETE':
                return DemoApi.delete(url);
        }

        return data;
    };

    /**
     * Parses a resource url
     */


    DemoApi.parseUrl = function parseUrl(url) {
        url = url.replace('templates/partial', 'templates');
        url = url.replace('templates/page', 'templates');

        var query = {};
        var split = url.split('/');

        query.resource = split[0];
        query.params = url.split('?')[1];

        if (split.length > 1) {
            query.id = split[1].replace('?' + query.params, '');
        }

        return query;
    };

    /**
     * Delete
     */


    DemoApi.delete = function _delete(url) {
        var query = DemoApi.parseUrl(url);

        return DemoApi.setCache(query.resource, query.id, null);
    };

    /**
     * Get
     */


    DemoApi.get = function get(url) {
        var query = DemoApi.parseUrl(url);

        return DemoApi.getCache(query.resource, query.id);
    };

    /**
     * Post
     */


    DemoApi.post = function post(url, data) {
        var query = DemoApi.parseUrl(url);

        // Publish
        if (url == 'content/publish' || url == 'content/unpublish' || url == 'content/preview') {
            return Promise.resolve();
        }

        // Create new
        if (url.indexOf('content/new') > -1) {
            var schemaId = url.match(/content\/new\/([a-zA-Z0-9]+)/);

            if (!schemaId) {
                throw new Error('No Schema id specified');
            }

            schemaId = schemaId[1];

            var sort = url.match(/\?sort=([0-9]*)/);

            if (sort) {
                sort = sort[2];
            }

            var parentId = url.match(/\&parent=([0-9a-z]*)/);

            if (parentId) {
                parentId = parentId[1];
            }

            data = HashBrown.Models.Content.create(schemaId);

            data.parentId = parentId;
            data.sort = sort;

            query = {
                resource: 'content',
                id: data.id
            };
        }

        console.log('--- POST data:', data);

        return DemoApi.setCache(query.resource, query.id, data);
    };

    /**
     * Gets a native resource
     */


    DemoApi.getNativeResource = function getNativeResource(type) {
        switch (type) {
            case 'users':
                return [{
                    id: '4173f094621d4a882f912ccaf1cc6613a386519e',
                    isAdmin: true,
                    isCurrent: true,
                    username: 'demouser',
                    fullName: 'Demo User',
                    email: 'demo@user.com',
                    scopes: {}
                }];

            case 'settings':
                return [{
                    id: 'providers',
                    media: '8c75aa0739cf66bcac269f01ab9007e666bd941b',
                    template: '8c75aa0739cf66bcac269f01ab9007e666bd941b'
                }];

            case 'media':
                return [{ "id": "50d05eee9088c589bfd5a5a3a3043c0ebcc4972b", "remote": true, "icon": "file-image-o", "name": "banner.jpg", "url": "media/50d05eee9088c589bfd5a5a3a3043c0ebcc4972b/banner-flat-pink.jpg", "folder": "banners" }];

            case 'connections':
                return [{
                    id: '8c75aa0739cf66bcac269f01ab9007e666bd941b',
                    title: 'My website',
                    url: 'example.com',
                    locked: true
                }];

            case 'templates':
                return [{
                    'id': 'sectionPage',
                    'parentId': '',
                    'remote': true,
                    'icon': 'code',
                    'name': 'sectionPage.html',
                    'type': 'page',
                    'remotePath': '_layouts/sectionPage.html',
                    'folder': '',
                    'markup': '' + '<!DOCTYPE html>\n' + '<html>\n' + '    {% include main/head.html %}\n' + '\n' + '    <body>\n' + '        {% for section in page.sections %}\n' + '            {% include hashbrown/render_section section = section %}\n' + '        {% endfor %}\n' + '\n' + '        {% include main/scripts.html %}\n' + '    </body>\n' + '</html>'
                }, {
                    'id': 'heroSection',
                    'parentId': '',
                    'remote': true,
                    'icon': 'code',
                    'name': 'heroSection.html',
                    'type': 'partial',
                    'remotePath': '_includes/partials/heroSection.html',
                    'folder': '',
                    'markup': '' + '<section class="section--hero" style="background-image: url({% include hashbrown/get_media_url_by_id id=include.section.text %})">\n' + '    <div class="container">\n' + '        {{ include.section.text }}\n' + '    </div>\n' + '</section>\n'
                }, {
                    'id': 'richTextSection',
                    'parentId': '',
                    'remote': true,
                    'icon': 'code',
                    'name': 'richTextSection.html',
                    'type': 'partial',
                    'remotePath': '_includes/partials/richTextSection.html',
                    'folder': '',
                    'markup': '' + '<section class="section--rich-text">\n' + '    <div class="container">\n' + '        {% if include.section.text %}\n' + '            {{ include.section.text }}\n' + '        {% endif %}\n' + '    </div>\n' + '</section>'
                }];

            case 'content':
                return [{
                    "locked": false,
                    "local": false,
                    "remote": false,
                    "id": "91f1ec2b984f291377c2dc488be2ebbefb46dd9a",
                    "parentId": "",
                    "createdBy": "4173f094621d4a882f912ccaf1cc6613a386519e",
                    "updatedBy": "4173f094621d4a882f912ccaf1cc6613a386519e",
                    "createDate": "2016-09-05T06:52:17.646Z",
                    "updateDate": "2017-08-03T15:55:10.590Z",
                    "publishOn": null,
                    "unpublishOn": null,
                    "schemaId": "591a897ad572cadae5115ef05726d9ead2725dc5",
                    "isPublished": true,
                    "hasPreview": false,
                    "sort": -1,
                    "properties": {
                        "title": "HashBrown CMS",
                        "url": "/",
                        "template": "sectionPage",
                        "sections": [{
                            "value": {
                                "template": "heroSection",
                                "image": "50d05eee9088c589bfd5a5a3a3043c0ebcc4972b",
                                "text": "## HashBrown CMS\n\nCreate once. Publish anywhere."
                            },
                            "schemaId": "f5c4cf4dffb088a2753760ad1da9cd64ff781003"
                        }, {
                            "value": {
                                "template": "richTextSection",
                                "text": "## Why HashBrown?\n\n### Remote management\n\nSeparate your concerns with a truly modern approach to content management. Your websites won't know what hit them.\n\n### Multiple projects at once\n\nWhy worry about several CMS'es, when you only need one?\n\n### Several environments for each project\n\nWe get it. You need to test your content before you go live.\n\n### Multilingual\n\nRemember the last time you used a truly elegant localisation solution in a CMS? We don't either.\n\n### Plugin support\n\nIf your needs aren't met at the core level, you can add anything you can imagine.\n\n### Content format consistency\n\nWhen you are passing complex, format-agnostic data around, document databases are the way to go. HashBrown knows what's up.\n\n### Painless backups\n\nHashBrown has your back in seconds.\n\n### Small footprint\n\nYou could probably run HashBrown on your toaster at home."
                            },
                            "schemaId": "904e8e7570ddb37ea1f31d210db47cd15f92ff92"
                        }],
                        "description": "Create once. Publish anywhere."
                    },
                    "settings": {
                        "publishing": {
                            "connectionId": "8c75aa0739cf66bcac269f01ab9007e666bd941b",
                            "applyToChildren": true
                        }
                    }
                }];

            case 'schemas':
                var schemas = {
                    'contentBase': __webpack_require__(280),
                    'page': __webpack_require__(281),
                    'array': __webpack_require__(282),
                    'boolean': __webpack_require__(283),
                    'contentReference': __webpack_require__(284),
                    'contentSchemaReference': __webpack_require__(285),
                    'date': __webpack_require__(286),
                    'dropdown': __webpack_require__(287),
                    'fieldBase': __webpack_require__(288),
                    'language': __webpack_require__(289),
                    'mediaReference': __webpack_require__(290),
                    'number': __webpack_require__(291),
                    'resourceReference': __webpack_require__(292),
                    'richText': __webpack_require__(293),
                    'string': __webpack_require__(294),
                    'struct': __webpack_require__(295),
                    'tags': __webpack_require__(296),
                    'templateReference': __webpack_require__(297),
                    'url': __webpack_require__(298)
                };

                var result = [];

                for (var k in schemas) {
                    schemas[k].id = k;

                    if (k === 'contentBase' || k === 'page' || schemas[k].type == 'content') {
                        schemas[k].type = 'content';
                    } else {
                        schemas[k].type = 'field';
                    }

                    if (schemas[k].isLocked !== false) {
                        schemas[k].isLocked = true;
                    }

                    result.push(HashBrown.Helpers.SchemaHelper.getModel(schemas[k]));
                }

                // Section page
                result.push(new HashBrown.Models.ContentSchema({
                    "isLocked": false,
                    "sync": {
                        "hasRemote": false,
                        "isRemote": false
                    },
                    "id": "591a897ad572cadae5115ef05726d9ead2725dc5",
                    "name": "Section Page",
                    "icon": "file",
                    "parentSchemaId": "page",
                    "hiddenProperties": [],
                    "defaultTabId": "content",
                    "tabs": {},
                    "fields": {
                        "properties": {
                            "template": {
                                "label": "Template",
                                "schemaId": "templateReference",
                                "config": {
                                    "allowedTemplates": ["sectionPage"],
                                    "type": "page"
                                }
                            },
                            "sections": {
                                "label": "Sections",
                                "tabId": "content",
                                "schemaId": "array",
                                "config": {
                                    "allowedSchemas": ["904e8e7570ddb37ea1f31d210db47cd15f92ff92", "f5c4cf4dffb088a2753760ad1da9cd64ff781003"]
                                }
                            }
                        }
                    },
                    "allowedChildSchemas": ["591a897ad572cadae5115ef05726d9ead2725dc5"],
                    "type": "content"
                }));

                // Section
                result.push(new HashBrown.Models.FieldSchema({
                    "isLocked": false,
                    "sync": {
                        "hasRemote": false,
                        "isRemote": false
                    },
                    "local": false,
                    "remote": false,
                    "id": "7ccbf2d613a4da3e5543abdde33b9eb0e5fbb8f3",
                    "name": "Section",
                    "icon": "file",
                    "parentSchemaId": "struct",
                    "hiddenProperties": [],
                    "editorId": "struct",
                    "config": {
                        "template": {
                            "label": "Template",
                            "schemaId": "templateReference",
                            "config": {
                                "type": "partial"
                            }
                        }
                    },
                    "type": "field"
                }));

                // Rich text section
                result.push(new HashBrown.Models.FieldSchema({
                    "isLocked": false,
                    "sync": {
                        "hasRemote": false,
                        "isRemote": false
                    },
                    "id": "904e8e7570ddb37ea1f31d210db47cd15f92ff92",
                    "name": "Rich Text Section",
                    "icon": "file-text-o",
                    "parentSchemaId": "7ccbf2d613a4da3e5543abdde33b9eb0e5fbb8f3",
                    "hiddenProperties": [],
                    "editorId": "struct",
                    "config": {
                        "struct": {
                            "template": {
                                "label": "Template",
                                "schemaId": "templateReference",
                                "config": {
                                    "allowedTemplates": ["richTextSection"],
                                    "type": "partial"
                                }
                            },
                            "text": {
                                "label": "Text",
                                "tabId": "content",
                                "schemaId": "richText"
                            }
                        }
                    },
                    "type": "field"
                }));

                // Hero
                result.push(new HashBrown.Models.FieldSchema({
                    "isLocked": false,
                    "sync": {
                        "hasRemote": false,
                        "isRemote": false
                    },
                    "id": "f5c4cf4dffb088a2753760ad1da9cd64ff781003",
                    "name": "Hero Section",
                    "icon": "image",
                    "parentSchemaId": "7ccbf2d613a4da3e5543abdde33b9eb0e5fbb8f3",
                    "hiddenProperties": [],
                    "editorId": "struct",
                    "config": {
                        "struct": {
                            "template": {
                                "label": "Template",
                                "schemaId": "templateReference",
                                "config": {
                                    "allowedTemplates": ["heroSection"],
                                    "type": "partial"
                                }
                            },
                            "image": {
                                "label": "Image",
                                "schemaId": "mediaReference"
                            },
                            "text": {
                                "label": "Text",
                                "schemaId": "richText"
                            }
                        }
                    },
                    "type": "field"
                }));

                return result;

            default:
                return [];
        }
    };

    return DemoApi;
}();

HashBrown.DemoApi = DemoApi;

// Add reset button
_.append(document.body, _.button({ class: 'widget widget--button condensed page--environment__demo__reset' }, 'Reset demo').click(function () {
    DemoApi.reset();
}));

// Override normal api call
HashBrown.Helpers.RequestHelper.request = DemoApi.request;
HashBrown.Helpers.RequestHelper.customRequest = DemoApi.request;

// ----------
// Debug socket
// ----------
debug.startSocket = function () {};

// ----------
// SchemaHelper
// ----------
HashBrown.Helpers.SchemaHelper.getSchemaWithParentFields = function (id) {
    var schema = DemoApi.requestSync('get', 'schemas/' + id);

    if (schema.parentSchemaId) {
        return HashBrown.Helpers.SchemaHelper.getSchemaWithParentFields(schema.parentSchemaId).then(function (parentSchema) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    var mergedSchema = HashBrown.Helpers.SchemaHelper.mergeSchemas(schema, parentSchema);

                    resolve(mergedSchema);
                }, 100);
            });
        });
    }

    schema = HashBrown.Helpers.SchemaHelper.getModel(schema);

    return Promise.resolve(schema);
};

// ----------
// Crisp UI
// ----------
Crisp.View.prototype.fetch = function fetch() {
    var view = this;

    function getModel() {
        // Get model from URL
        if (!view.model && typeof view.modelUrl === 'string') {
            view.model = DemoApi.requestSync('get', view.modelUrl);
            view._init();

            // Get model with function
        } else if (!view.model && typeof view.modelFunction === 'function') {
            view.modelFunction(function (data) {
                view.model = data;

                view._init();
            });

            // Just perform the initialisation
        } else {
            view._init();
        }
    }

    // Get the model
    getModel();
};

// ----------
// Resource loading
// ----------
HashBrown.Helpers.RequestHelper.reloadResource = function reloadResource(name) {
    var model = null;
    var result = HashBrown.DemoApi.requestSync('get', name);

    switch (name) {
        case 'content':
            model = HashBrown.Models.Content;
            break;

        case 'templates':
            model = HashBrown.Models.Template;
            break;

        case 'users':
            model = HashBrown.Models.User;
            break;

        case 'media':
            model = HashBrown.Models.Media;
            break;

        case 'connections':
            model = HashBrown.Models.Connection;
            break;

        case 'schemas':
            break;
    }

    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            window.resources[name] = result;

            // If a model is specified, use it to initialise every resource
            if (model) {
                for (var i in window.resources[name]) {
                    window.resources[name][i] = new model(window.resources[name][i]);
                }
            }

            resolve(result);
        }, 100);
    });
};

/***/ }),

/***/ 280:
/***/ (function(module, exports) {

module.exports = {
	"defaultTabId": "meta",
	"icon": "cogs",
	"name": "Content Base",
	"fields": {
		"createDate": {
			"disabled": "true",
			"label": "Created at",
			"schemaId": "date"
		},
		"updateDate": {
			"disabled": "true",
			"label": "Updated at",
			"schemaId": "date"
		},
		"createdBy": {
			"disabled": "true",
			"label": "Created by",
			"schemaId": "resourceReference",
			"config": {
				"resource": "users",
				"resourceKeys": [
					"fullName",
					"username"
				]
			}
		},
		"updatedBy": {
			"disabled": "true",
			"label": "Updated by",
			"schemaId": "resourceReference",
			"config": {
				"resource": "users",
				"resourceKeys": [
					"fullName",
					"username"
				]
			}
		},
		"publishOn": {
			"label": "Publish on",
			"schemaId": "date"
		},
		"unpublishOn": {
			"label": "Unpublish on",
			"schemaId": "date"
		},
		"schemaId": {
			"label": "Schema",
			"schemaId": "contentSchemaReference",
			"config": {
				"allowedSchemas": "fromParent"
			}
		},
		"properties": {
			"title": {
				"label": "Title",
				"schemaId": "string"
			}
		}
	}
};

/***/ }),

/***/ 281:
/***/ (function(module, exports) {

module.exports = {
	"icon": "file",
	"name": "Page",
	"parentSchemaId": "contentBase",
	"tabs": {
		"content": "Content"
	},
	"defaultTabId": "content",
	"fields": {
		"properties": {
			"title": {
				"label": "Title",
				"schemaId": "string",
				"tabId": "content"
			},
			"description": {
				"label": "Description",
				"schemaId": "string",
				"tabId": "content"
			},
			"url": {
				"label": "URL",
				"schemaId": "url",
				"tabId": "content"
			},
			"template": {
				"label": "Template",
				"schemaId": "templateReference",
				"tabId": "content",
				"config": {
					"allowedTemplates": []
				}
			}
		}
	}
};

/***/ }),

/***/ 282:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "ArrayEditor",
	"icon": "list-ol",
	"name": "Array"
};

/***/ }),

/***/ 283:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "BooleanEditor",
	"icon": "toggle-on",
	"name": "Boolean"
};

/***/ }),

/***/ 284:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "ContentReferenceEditor",
	"icon": "file",
	"name": "Content Reference"
};

/***/ }),

/***/ 285:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "ContentSchemaReferenceEditor",
	"icon": "gears",
	"name": "Content Schema Reference"
};

/***/ }),

/***/ 286:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "DateEditor",
	"icon": "calendar",
	"name": "Date"
};

/***/ }),

/***/ 287:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "DropdownEditor",
	"icon": "list-alt",
	"name": "Dropdown"
};

/***/ }),

/***/ 288:
/***/ (function(module, exports) {

module.exports = {
	"name": "Field Base",
	"icon": "cogs"
};

/***/ }),

/***/ 289:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "LanguageEditor",
	"icon": "globe",
	"name": "Language"
};

/***/ }),

/***/ 290:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "MediaReferenceEditor",
	"icon": "file-image-o",
	"name": "Media Reference"
};

/***/ }),

/***/ 291:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "NumberEditor",
	"icon": "sort-numeric-asc",
	"name": "Number"
};

/***/ }),

/***/ 292:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "ResourceReferenceEditor",
	"icon": "book",
	"name": "Resource Reference"
};

/***/ }),

/***/ 293:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "RichTextEditor",
	"icon": "font",
	"name": "Rich Text"
};

/***/ }),

/***/ 294:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "StringEditor",
	"icon": "font",
	"name": "String"
};

/***/ }),

/***/ 295:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "StructEditor",
	"icon": "cubes",
	"name": "Struct"
};

/***/ }),

/***/ 296:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "TagsEditor",
	"icon": "tag",
	"name": "Tags"
};

/***/ }),

/***/ 297:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "TemplateReferenceEditor",
	"icon": "code",
	"name": "Template Reference"
};

/***/ }),

/***/ 298:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "UrlEditor",
	"icon": "link",
	"name": "Url"
};

/***/ })

/******/ });