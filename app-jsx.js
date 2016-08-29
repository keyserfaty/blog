// test of building the article node with jsx (nativejsx)
// another choice would be strings but i would need es6
const Lib = {
  setState: () => {},
  http: (props, cb) => {
    const method = props.method || 'GET';
    const url = props.url;

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', cb);
    xhr.open(method, url);
    xhr.send();
  }
};

const Component = () => {
  this.events = function() {};
};

const Document = new Component;
Document.state = {
  articles: []
};

Document.events.onLoad = () => {
  const { http, setState } = Lib;
  const URL = 'https://api.github.com/repos/keyserfaty/keyserfaty.github.io/contents/_posts/';

  http(URL, (e) => {
    setState({
      articles: e.value.articles
    });
  });
};

Document.render = () => {
  const { articles } = this.state;
  return (
    <section class="container">
      { articles.map(elem => <Article elem={elem} /> )}
    </section>
  );
};

const Article = new Component;
const ArticleTitle = new Component;
ArticleTitle.events.onClick = (e) => () => {};

ArticleTitle.render = (elem) => (
  <h1>{elem.title}</h1>
);
Article.render = (elem) => (
  <article className="each" name={elem.name}>
    <ArticleTitle elem={elem} />
    <div className="bottom-border"></div>
    <div className="expanded"></div>
  </article>
);

