"use strict";

var nodeGit = require("nodegit");

function checkoutTag(repo, tagName) {
  var sig = repo.defaultSignature();
  var commit;
  return repo.getReferenceCommit(tagName)
    .then(function(_commit) {
        commit = _commit;
        return repo.setHeadDetached(commit.id(), sig, "");
      })
    .then(function() {
        return nodeGit.Reset.reset(
          repo, commit.id(), nodeGit.Reset.TYPE.HARD, {}, sig, ""
        );
      });
}

function checkout(repo, tagName) {
  var noop = function() {};
  return checkoutTag(repo, tagName)
    .then(null, function(err) {
        console.log("Tag '" + tagName + "' not found. Fetching from origin.");
        return nodeGit.Remote.lookup(repo, "origin")
          .then(function(remote) {
              return remote.fetch(null, repo.defaultSignature(), noop);
            })
          .then(function() {
              return checkoutTag(repo, tagName);
            });
      });
}

module.exports = function(refDir, repoUrl, prevRelease) {
  return nodeGit.Repository.open(refDir)
    .then(null, function(err) {
        console.log("Benchmark repository not found. Cloning from " + repoUrl);
        return nodeGit.Clone(repoUrl, refDir);
      })
    .then(function(repo) {
        console.log("Checking out previous release (" + prevRelease + ")");
        return checkout(repo, prevRelease);
      });
};
