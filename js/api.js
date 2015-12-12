window.api = {
    call(url, callback, data) {
        data = data || {};
        
        data.token = localStorage.getItem('gh-oauth-token');

        $.post(url, data, function(res) {
            if(res.err) {
                console.log(res.data);
                alert('(' + res.mode + ') ' + res.url + ': ' + res.err.json.message);

            } else if(callback) {
                callback(res);
            
            }
        });
    },

    repos: function(callback) {
        api.call('/api/' + req.params.user + '/repos/', callback);
    },

    compare: function(base, head, callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/compare/' + base + '/' + head, callback);
    },

    merge: function(base, head, callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/merge', callback, { base: base, head: head });
    },
    
    file: {
        fetch: function(path, callback) {
            api.call('/api/' + req.params.user + '/' + req.params.repo + '/fetch/file/' + path, callback);
        },
        
        update: function(data, path, callback) {
            api.call('/api/' + req.params.user + '/' + req.params.repo + '/update/file/' + path, callback, data);
        },
    
        create: function(data, path, callback) {
            api.call('/api/' + req.params.user + '/' + req.params.repo + '/create/file/' + path, callback, data);
        }
    },

    issues: {
        fetch: function(callback) {
            api.call('/api/' + req.params.user + '/' + req.params.repo + '/fetch/issues', callback);
        },
        
        create: function(data, callback) {
            api.call('/api/' + req.params.user + '/' + req.params.repo + '/create/issues', callback, data);
        },
        
        update: function(data, callback) {
            api.call('/api/' + req.params.user + '/' + req.params.repo + '/update/issues', callback, data);
        }
    },
    
    labels: {
        fetch: function(callback) {
            api.call('/api/' + req.params.user + '/' + req.params.repo + '/fetch/labels', callback);
        },

        create: function(data, callback) {
            api.call('/api/' + req.params.user + '/' + req.params.repo + '/create/labels', callback, data);
        }
    },
    
    issueColumns: function(callback) {
        env.get(function(json) {
            var columns = json.putaitu.issues.columns;

            columns.unshift('backlog');
            columns.push('done');
                
            callback(columns);
        });
    },

    milestones: function(callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/milestones', callback);
    },

    collaborators: function(callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/collaborators', callback);
    },

    repo: function(callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo, callback);
    },

    branches: function(callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/branches/', function(branches) {
            branches.sort(function(a, b) {
                if (a.name < b.name) {
                    return -1;
                } else if (a.name > b.name) {
                    return 1;
                } else {
                    return 0;   
                }
            });

            callback(branches);
        });
    }
};
