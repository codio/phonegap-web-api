/**
 * Copyright Suchkov Dmitrii
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var q = require('q');
var fs = require('fs');
var utils = require('./utils');
var child_process = require('child_process');

var exists = q.denodeify(fs.exists);
var exec = q.denodeify(child_process.exec);

function init(path) {
    var res = __dirname + '/../resources/phonegap.tar';
    var cmd = 'tar xfk ' + res;
    return exec(cmd, { cwd: path}).then(function () {
        return q.resolve('done');
    });
}

exports.init = function (user, project) {
    var path = utils.projectPath(user, project);
    return exists(path).then(function () {
        return q.reject('Project not found');
    }, function () {
        return init(path);
    });
};