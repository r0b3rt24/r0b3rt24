(function () {
  var titleEl = document.querySelector("[data-post-title]");
  var metaEl = document.querySelector("[data-post-meta]");
  var contentEl = document.querySelector("[data-post-content]");
  var params = new URLSearchParams(window.location.search);
  var slug = params.get("slug");

  if (!slug) {
    titleEl.textContent = "Post not found";
    contentEl.innerHTML = "<p>Pick a post from the <a href=\"index.html\">blog list</a>.</p>";
    return;
  }

  function formatDate(dateString) {
    var date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  fetch("../posts/index.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load posts index");
      }
      return response.json();
    })
    .then(function (posts) {
      var post = posts.find(function (entry) {
        return entry.slug === slug;
      });

      if (!post) {
        titleEl.textContent = "Post not found";
        contentEl.innerHTML = "<p>Pick a post from the <a href=\"index.html\">blog list</a>.</p>";
        return;
      }

      titleEl.textContent = post.title;
      metaEl.textContent = formatDate(post.date);
      document.title = post.title + " - Han Cao";

      return fetch("../posts/" + post.slug + ".md");
    })
    .then(function (response) {
      if (!response || !response.ok) {
        throw new Error("Failed to load post");
      }
      return response.text();
    })
    .then(function (markdown) {
      contentEl.innerHTML = window.simpleMarkdown.render(markdown);
    })
    .catch(function () {
      titleEl.textContent = "Post unavailable";
      contentEl.innerHTML = "<p>Unable to load this post.</p>";
    });
})();
