(function() {
  /**
   * DOM tools
   */
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
    return function appendToContainer() {
      return Array.prototype.map.call(arguments, function (elem) {
        container.appendChild(elem);
      });
    }
  };

  // Decode base64 unicode
  function b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  // Add date and title fields to the object
  function parseDataFromGitHub (response) {
    return JSON.parse(response).reduce(function(res, elem) {
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
    }, []);
  }

  /**
   * Bring posts list from github (only the titles here)
   */
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.github.com/repos/keyserfaty/keyserfaty.github.io/contents/_posts');
  xhr.addEventListener('load', function(e) {
    var response = parseDataFromGitHub(e.target.response);
    var titleNodes = response.map(function(elem) {
      var article = createElementWithAttrs('article', {
        'class': 'each'
      });

      var h1 = createElementWithAttrs('h1', {});
      h1.innerText = elem.title;

      var bottomBorder = createElementWithAttrs('div', {
        'class': 'bottom-border'
      });
      var expanded = createElementWithAttrs('div', {
        'class': 'expanded'
      });

      var container = appendChildren(article);
      var containerAppended = container(h1, bottomBorder, expanded);
      console.log(containerAppended)
    });

    console.log(titleNodes)
  });

  xhr.send();

  // <article class="each">
  //   <h1>I’ve been organizing my React files the wrong way, and you probably have too.</h1>
  // <div class="bottom-border"></div>
  //   <div class="expanded">
  //   <!--<p>Repellendus, cras proident aute exercitation tempore potenti nisl ullam ab corrupti fugiat, lacinia aliquet aut anim metus fusce taciti sagittis incididunt perferendis ut imperdiet molestias nascetur exercitation iure possimus potenti, nullam sapiente ducimus, sint enim morbi. Maxime cursus cupiditate vero, rhoncus dictum! Provident aliquet! Irure. Augue netus tortor magna metus, varius lobortis non magnis vero. Irure justo officiis iaculis cupiditate. Arcu omnis consequatur ullamcorper. Quidem, volutpat, morbi aspernatur! Taciti in.</p>-->
  // <!--<button />-->
  // </div>
  // </article>

  // when ready create dom elements for index
} ());