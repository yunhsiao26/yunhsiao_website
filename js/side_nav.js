/*
 * Side Section Navigation
 * Shared by all project pages. Requires jQuery (loaded before this file).
 *
 * To use on a page, add a <nav id="side_nav"> containing one link per section,
 * where each href points to a section's id, e.g.:
 *   <nav id="side_nav" aria-label="Section navigation">
 *     <ul>
 *       <li><a href="#project_body_first_section">Vision</a></li>
 *       <li><a href="#final_design">Final Design</a></li>
 *     </ul>
 *   </nav>
 * Pages without #side_nav are unaffected.
 */
(function () {
  var nav = document.getElementById('side_nav');
  if (!nav) return;

  var links = [];
  var sections = [];
  Array.prototype.forEach.call(nav.querySelectorAll('a[href^="#"]'), function (a) {
    var sec = document.getElementById(a.getAttribute('href').slice(1));
    if (sec) { links.push(a); sections.push(sec); }
  });
  if (!sections.length) return;

  var footer = document.getElementById('footer');
  var menu = document.getElementById('menu');

  function navOffset() { return (menu ? menu.offsetHeight : 0) + 10; }

  function update() {
    var y = window.pageYOffset;
    var vh = window.innerHeight;

    // Show after the header, hide when the footer comes into view
    var start = sections[0].getBoundingClientRect().top + y - vh * 0.5;
    var footerTop = footer ? footer.getBoundingClientRect().top : Infinity;
    nav.classList.toggle('visible', y > start && footerTop > vh * 0.6);

    // Highlight the section nearest the top of the screen
    var marker = vh * 0.35;
    var current = 0;
    sections.forEach(function (sec, i) {
      if (sec.getBoundingClientRect().top <= marker) current = i;
    });
    links.forEach(function (a, i) { a.classList.toggle('active', i === current); });
  }

  // Smooth-scroll on click, stopping below the fixed top navigation bar
  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var top = sections[i].getBoundingClientRect().top + window.pageYOffset - navOffset();
      $('html, body').stop().animate({ scrollTop: top }, 700);
    });
  });

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
