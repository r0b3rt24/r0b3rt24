(function () {
  var listEl = document.querySelector("[data-post-list]");
  if (!listEl) {
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
      if (!Array.isArray(posts) || posts.length === 0) {
        listEl.innerHTML = "<li class=\"post-card\">No posts yet.</li>";
        return;
      }

      posts.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });

      listEl.innerHTML = "";

      posts.forEach(function (post) {
        var item = document.createElement("li");
        item.className = "post-card";
        item.innerHTML =
          "<h2><a href=\"post.html?slug=" +
          encodeURIComponent(post.slug) +
          "\">" +
          post.title +
          "</a></h2>" +
          "<p class=\"post-meta\">" +
          formatDate(post.date) +
          "</p>" +
          (post.description ? "<p>" + post.description + "</p>" : "");
        listEl.appendChild(item);
      });
    })
    .catch(function () {
      listEl.innerHTML = "<li class=\"post-card\">Unable to load posts.</li>";
    });
})();
