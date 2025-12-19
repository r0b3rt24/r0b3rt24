(function () {
  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatInline(text) {
    var escaped = escapeHtml(text);
    escaped = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
    escaped = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    escaped = escaped.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return escaped;
  }

  function renderMarkdown(markdown) {
    var lines = markdown.replace(/\r\n/g, "\n").split("\n");
    var html = [];
    var inCode = false;
    var listOpen = false;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      if (line.trim().startsWith("```")) {
        if (!inCode) {
          html.push("<pre><code>");
          inCode = true;
        } else {
          html.push("</code></pre>");
          inCode = false;
        }
        continue;
      }

      if (inCode) {
        html.push(escapeHtml(line));
        continue;
      }

      if (/^#{1,6}\s+/.test(line)) {
        var level = line.match(/^#{1,6}/)[0].length;
        var heading = line.replace(/^#{1,6}\s+/, "");
        html.push("<h" + level + ">" + formatInline(heading) + "</h" + level + ">");
        continue;
      }

      if (/^\s*[-*+]\s+/.test(line)) {
        if (!listOpen) {
          html.push("<ul>");
          listOpen = true;
        }
        var item = line.replace(/^\s*[-*+]\s+/, "");
        html.push("<li>" + formatInline(item) + "</li>");
        continue;
      }

      if (line.trim() === "") {
        if (listOpen) {
          html.push("</ul>");
          listOpen = false;
        }
        continue;
      }

      html.push("<p>" + formatInline(line) + "</p>");
    }

    if (listOpen) {
      html.push("</ul>");
    }

    if (inCode) {
      html.push("</code></pre>");
    }

    return html.join("\n");
  }

  window.simpleMarkdown = {
    render: renderMarkdown
  };
})();
