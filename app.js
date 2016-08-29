(function() {
  /********************************
   * General tools
   ********************************/
  function http (props, cb) {
    var method = props.method || 'GET';
    var url = props.url;

    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', cb);
    xhr.open(method, url);
    xhr.send();
  }

  /********************************
   * DOM tools
   ********************************/
  var setAttributes = function(container, attrs) {
    Object.keys(attrs).map(function (key) {
      container.setAttribute(key, attrs[key]);
    });

    return container;
  };

  var createElementWithAttrs = function (tag, attrs) {
    var node = document.createElement(tag);
    setAttributes(node, attrs);
    return node;
  };

  var appendChildren = function (container) {
    return function appendToContainer(arr) {
      return Array.prototype.map.call(arr, function (elem) {
        container.appendChild(elem);
      });
    }
  };

  /********************************
   * App specific helper functions
   ********************************/

  // Decode base64 unicode
  function b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  // Add date and title fields to the object
  function parseDataFromGitHub (response) {
    return JSON.parse(response)
      .reduce(function(res, elem) {
        var parsed = elem.name.split('.')[0].split('-');
        var title = parsed.splice(3).join(' ');
        var date = {
          year: parsed[0],
          month: parsed[1],
          day: parsed[2]
        };

        elem.title = title;
        elem.date = date;

        res.push(elem);
        return res;
      }, [])
    .filter(function (elem) {
      return elem.title.length > 0;
    })
    .reverse();
  }

  // Build nodes with articles
  function buildArticleNodes (elem) {
    var article = createElementWithAttrs('article', {
      'class': 'each'
    });

    var h1 = createElementWithAttrs('h1', {
      'name': elem.name
    });
    h1.innerText = elem.title[0].toUpperCase() + elem.title.slice(1);
    h1.onclick = handleTitleOnClick;

    var bottomBorder = createElementWithAttrs('div', {'class': 'bottom-border'});
    var expanded = createElementWithAttrs('div', {'class': 'expanded'});

    var container = appendChildren(article);
    container([h1, bottomBorder, expanded]);
    return article;
  }

  /********************************
   * App
   ********************************/
  // Bring posts list from GitHub (only the titles here)
  var url = 'https://api.github.com/repos/keyserfaty/keyserfaty.github.io/contents/_posts/';

  http({
    url: url
  }, onInitialRequestReady);

  var parsedResponse;
  function onInitialRequestReady (e) {
    var doc = document;

    /*
     * Append articles to the DOM
     */
    parsedResponse = parseDataFromGitHub(e.target.response);
    var articleNodes = parsedResponse.map(buildArticleNodes);
    var containerDom = doc.querySelector('.container');
    appendChildren(containerDom)(articleNodes);
  }

  function handleTitleOnClick(e) {
    http({
      url: url + e.target.attributes[0].value
    }, function (e) {
      var content = b64DecodeUnicode(JSON.parse(e.target.response).content)
      console.log(content)
    });
  }


} ());