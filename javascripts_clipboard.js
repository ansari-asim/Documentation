window.addEventListener('load', function() {
  const clipboard = new ClipboardJS('.md-clipboard', {
    text: function(trigger) {
      const codeCopy = Array.from(trigger.nextElementSibling.childNodes).filter(n => n.nodeName === 'PRE')[0].innerText;
      return codeCopy;
    }
  });

  clipboard.on('success', function(e) {
    const inlineContainer = e.trigger.nextElementSibling;
    const inlineContent = inlineContainer.querySelector('code');
    inlineContent.textContent = 'Copied to clipboard!';

    setTimeout(function() {
      inlineContent.textContent = e.text;
    }, 2000);

    e.clearSelection();
  });
});