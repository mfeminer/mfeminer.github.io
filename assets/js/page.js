angular.module('mfeminerBlog', ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: "home.html",
                controller: "HomePageController"
            })
            .when('/post/:category/:name', {
                templateUrl: "post.html",
                controller: "PostController"
            })
            .otherwise({
                templateUrl: "404.html"
            });

            if(window.history && window.history.pushState){
                $locationProvider.hashPrefix('!');
            }
        })
    .controller('HomePageController', ['$scope', '$location', 'webRequest', 'globalVariablesService', function ($scope, $location, webRequest, globalVariablesService) {
        var self = $scope;

        self.categories = [];
        self.blogPosts = [];

        self.getCategories = function () {
            webRequest.getAsync(globalVariablesService.getContentsUrl(), self.parseCategories);
        }

        self.parseCategories = function (categories) {
            if (!categories) {
                return;
            }

            self.categories = [];

            categories.forEach(function (category) {
                if (category.type === "dir") {
                    self.categories.push({
                        id: category.sha,
                        name: category.name,
                        url: category.url,
                        path: category.path
                    });
                }
            });

            if (self.categories.length > 0) {
                self.selectCategory(self.categories[0]);
            }
        }

        self.selectCategory = function (category) {
            if (!!category) {
                self.blogPosts = self.getBlogPosts(category.url);
                self.categories.forEach(function (c){
                    if (c.name === category.name)
                        c.selected = true;
                    else
                        c.selected = false;
                });
            }
        }

        self.getBlogPosts = function(url) {
            webRequest.getAsync(url, self.parseBlogPosts);
        }

        self.parseBlogPosts = function(blogPosts) {
            if (!blogPosts){
                return;
            }
            self.blogPosts = [];

            blogPosts.forEach(function(blogPost) {
                if (blogPost.type === "file") {
                    var commitUrl = globalVariablesService.getCommitsUrl() + blogPost.path;
                    webRequest.getAsync(commitUrl, function(commit) {
                        commit = commit.commit;
                        self.blogPosts.push({
                            id: blogPost.sha,
                            name: blogPost.name,
                            url: blogPost.url,
                            date: commit.author.date,
                            description: commit.message,
                            postedBy: commit.committer.name,
                            path: blogPost.path,
                            raw: blogPost.download_url
                        });
                    });
                }
            });
        }

        self.goToPost = function (post) {
            globalVariablesService.setData(post);
            $location.path('/post/' + post.path);
        }

        self.getCategories();
    }])
    .controller('PostController', ['$scope', '$location', '$routeParams', 'webRequest', 'globalVariablesService', function ($scope, $location, $routeParams, webRequest, globalVariablesService) {
        //ali eren
        var self = $scope;

        self.getBlogPostContent = function (rawUrl) {
            webRequest.getAsync(rawUrl, function (result) {
                self.post.content = self.convertMDToHtml(result);
            });
        }

        self.convertMDToHtml = function (markdownText) {
            // TODO: Add a library and implement content
            return markdownText;
        }

        if (!!globalVariablesService.getData()) {
            self.post = globalVariablesService.getData();

            self.getBlogPostContent(self.post.raw);
        }
        else {
            if(!$routeParams || !$routeParams.category || !$routeParams.name) {
                $location.path('/404');
            }

            var postPath = $routeParams.category + "/" + $routeParams.name;

            webRequest.getAsync(globalVariablesService.getContentsUrl() + postPath, function (blogPost) {

                var commitUrl = globalVariablesService.getCommitsUrl() + blogPost.path;
                webRequest.getAsync(commitUrl, function(commit) {

                    commit = commit.commit;
                    self.post = {
                        id: blogPost.sha,
                        name: blogPost.name,
                        url: blogPost.url,
                        date: commit.author.date,
                        description: commit.message,
                        postedBy: commit.committer.name,
                        path: blogPost.path,
                        raw: blogPost.download_url
                    };
                });

                self.getBlogPostContent(blogPost.download_url);
            });
        }

    }])
    .controller('HeaderController', ['$scope', '$location', function ($scope, $location){
        var self = $scope;

        self.$on('$routeChangeSuccess', function () {
            if ($location.path() === "/"){
                self.headerClass = "wide-header";
                self.hideDescription = false;
            }
            else {
                self.headerClass = "default-header";
                self.hideDescription = true;
            }
        });
    }])
    .factory('webRequest', function($http){
        return {
            getAsync: function(url, callback) {
                $http.get(url).then(
                    function(response){
                        callback(response.data);
                    },
                    function (response){
                        console.log(url + " " + response.status + " " + response.statusText, response);
                    });
            }
        }
    })
    .service('globalVariablesService', function() {
        var _dataObj = null;
        var _baseContentsUrl = "https://api.github.com/repos/mfeminer/mfeminer.github.io/contents/posts";
        var _baseCommitsUrl = "https://api.github.com/repos/mfeminer/mfeminer.github.io/commits/master?path=";

        return {
            getData: function () {
                return _dataObj;
            },
            setData: function (value) {
                _dataObj = value;
            },
            getContentsUrl: function () {
                return _baseContentsUrl;
            },
            getCommitsUrl: function () {
                return _baseCommitsUrl;
            }
        };
    });