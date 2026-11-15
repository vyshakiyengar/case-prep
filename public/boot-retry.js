// Right after a deploy, a page can briefly ask for a new script or stylesheet before every
// server has it. If one of the site's own files fails to load, reload the page a moment later
// (at most 3 times in 5 minutes), so nobody is left on an unstyled or blank page.
(function () {
  var scheduled = false
  window.addEventListener('error', function (e) {
    var t = e.target, url = t && (t.src || t.href)
    if (scheduled || !url || url.indexOf(location.origin + '/assets/') !== 0) return
    var k = 'pfc-boot-retry', now = Date.now(), log = []
    try { log = JSON.parse(sessionStorage.getItem(k) || '[]').filter(function (x) { return now - x < 300000 }) } catch (_) {}
    if (log.length >= 3) return
    log.push(now); scheduled = true
    try { sessionStorage.setItem(k, JSON.stringify(log)) } catch (_) {}
    setTimeout(function () { location.reload() }, 1500 * log.length)
  }, true)
})()
