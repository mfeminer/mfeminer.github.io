angular.module('mfeminerBlog', ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: "home.html",
                controller: "HomePageController"
            })
            .when('/post/:postId', {
                templateUrl: "post.html",
                controller: "PostController"
            })
            .otherwise({
                templateUrl: "404.html"
            });
    })
    .controller('HomePageController', ['$scope', '$location', 'webRequest', function ($scope, $location, webRequest) {
        var self = $scope;

        self.baseContentsUrl = "https://api.github.com/repos/mfeminer/mfeminer.github.io/contents/posts";
        self.baseCommitsUrl = "https://api.github.com/repos/mfeminer/mfeminer.github.io/commits/master?path=";

        self.categories = [];
        self.blogPosts = [];

        self.getCategories = function () {
            webRequest.getAsync(self.baseContentsUrl, self.parseCategories);
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
                    var commitUrl = self.baseCommitsUrl + blogPost.path;
                    webRequest.getAsync(commitUrl, function(commit) {
                        commit = commit.commit;
                        self.blogPosts.push({
                            id: blogPost.sha,
                            name: blogPost.name,
                            url: blogPost.url,
                            date: commit.author.date,
                            description: commit.message,
                            postedBy: commit.committer.name
                        });
                    });
                }
            });
        }

        self.goToPost = function (post) {
            $location.path('/post/' + post.id);
        }

        self.getCategories();
    }])
    .controller('PostController', ['$scope', '$location', '$routeParams', 'webRequest', function ($scope, $location, $routeParams, webRequest) {
        //ali eren
        var self = $scope;

        if(!$routeParams || !$routeParams.postId) {
            $location.path('/404');
        }
        self.postId = $routeParams.postId;
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
                        console.log(response.status + " " + response.statusText, response);
                    });
            }
        }
    });