import {Promise} from 'es6-promise';
import {html2canvas} from 'html2canvas';

(function (window, document) {

  var HTML_2_CANVAS_URL = '//cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js';

  var loggedIn = false;

  /**
   * Script injection.
   */
  var importScript = (function (headElement) {
    return function (src) {
      return new Promise(function (resolve, reject) {
        var scriptElement = document.createElement('script');
        scriptElement.type = 'text\/javascript';
        scriptElement.onerror = function (event) {
          reject('The script ' + event.target.src + ' is not accessible.');
        };
        scriptElement.onload = function () {
          resolve();
        };
        headElement.appendChild(scriptElement);
        scriptElement.src = src;
      });
    };

  })(document.head || document.getElementsByTagName('head')[0]);

  var html2CanvasLoaded = false;
  /**
   * Load Html2Canvas and them perform given callback once loaded.
   */
  function loadHtml2Canvas() {
    if (html2CanvasLoaded) {
      return Promise.resolve();

    } else {
      return importScript(HTML_2_CANVAS_URL).then(function () {
        html2CanvasLoaded = true;
      });
    }
  }

  /**
   * Prepare data and report.
   */
  function reportIssue() {
    isLoggedIn().then(
      performReport,
      function () {
        return login().then(
          performReport
        );
      }
    ).then(function (id) {
      var newWindow = window.open(resolveRakrUrl('/issues/new/5?snippet=' + id));
      if (!newWindow) {
        prompt('請允許開啟彈跳式視窗。');
      }
    });
  }

  /**
   * Collect data and report issue.
   *
   * @returns Promise which resolves with pushed snippet id.
   */
  function collectDataAndReport() {
    return new Promise(function (resolve, reject) {
      html2canvas(window.document.body, {
        onrendered: function (canvas) {
          var imageDataUrl = canvas.toDataURL();

          var xhr = new XMLHttpRequest();
          xhr.open('POST', resolveRakrUrl('/api/snippets'), true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          xhr.withCredentials = true;
          xhr.onreadystatechange = function (event) {
            if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 200) {
                resolve(xhr.responseText);

              } else {
                reject(xhr.statusText);
              }
            }
          };

          var snippet = {
            imageDataUrls: [imageDataUrl]
          };
          xhr.send(JSON.stringify(snippet));
        }
      });
    });
  }

  /**
   * Try to load related libraries and report.
   */
  function performReport() {
    return loadHtml2Canvas().then(
      collectDataAndReport
    );
  }

  function isLoggedIn() {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));

          } else {
            reject(xhr.statusText);
          }
        }
      };

      xhr.open('GET', resolveRakrUrl('/api/login/success'));
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.withCredentials = true;

      xhr.send();
    });
  }

  /**
   * Create report button.
   */
  function createButton() {
    var reportButton = document.createElement('div');
    reportButton.innerHTML = '回報問題';
    reportButton.style.position = 'fixed';
    reportButton.style.right = 0;
    reportButton.style.bottom = 0;
    reportButton.style.backgroundColor = 'thistle';
    reportButton.style.padding = '0.5rem';
    reportButton.style.zIndex = 10000;

    reportButton.onclick = reportIssue;

    document.body.appendChild(reportButton);
  }

  function performLogin() {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          // FIXME: I don't know why we can got the correct xhr.status here.
          // So just request server one more time to check if login is success.
          isLoggedIn().then(
            function () {
              resolve();
            },
            function () {
              reject();
            }
          );
        }
      };

      xhr.open('POST', resolveRakrUrl('/login'));
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.withCredentials = true;

      var parameter = {
        'username': document.getElementById('rakr-username').value,
        'password': document.getElementById('rakr-password').value
      };

      xhr.send(JSON.stringify(parameter));
    });
  }

  /**
   * Popup login panel for performing login.
   */
  function login() {
    return new Promise(function (resolve, reject) {
      var loginForm = document.createElement('form');
      loginForm.innerHTML = '<div><label>帳號</label><input id="rakr-username" autofocus="true"></div>' +
        '<div><label>密碼</label><input id="rakr-password" type="password"></div>' +
        '<div><button type="submit">登入</button><button type="button" id="rakr-login-close">關閉</button></div>';
      loginForm.style.display = 'inline-block';

      var loginPanel = document.createElement('div');
      loginPanel.appendChild(loginForm);
      loginPanel.style.zIndex = 10000;
      loginPanel.style.textAlign = 'center';
      loginPanel.style.position = 'absolute';
      loginPanel.style.top = '50%';
      loginPanel.style.left = '50%';
      loginPanel.style.marginTop = '-50px';
      loginPanel.style.marginLeft = '-50px';
      loginPanel.style.padding = '10px';
      loginPanel.style.width = '250px';
      loginPanel.style.height = '100px';
      loginPanel.style.backgroundColor = 'gray';

      loginForm.onsubmit = function (event) {
        event.preventDefault();

        performLogin().then(
          function () {
            document.body.removeChild(loginPanel);
            resolve();
          },
          function (message) {
            prompt(!message ? '登入失敗' : '登入失敗' + message);
          }
        );
      };

      document.body.appendChild(loginPanel);

      document.getElementById('rakr-login-close').onclick = function () {
        document.body.removeChild(loginPanel);
        reject();
      };
    });
  }

  function prompt(message) {
    alert(message);
  }

  var rakrUrl;
  var rakrClientId;

  function isRakrInitialized() {
    return new Promise(
      function (resolve, reject) {
        if (window.RakrWidgetObject && window[window.RakrWidgetObject].q && window[window.RakrWidgetObject].q[0]) {
          var argumentsQueue = window[window.RakrWidgetObject].q;
          var url = argumentsQueue[0][0];
          if (url && (url.indexOf('http://') === 0 || url.indexOf('https://') === 0 || url.indexOf('//') === 0)) {
            rakrUrl = url;
          }
          var id = argumentsQueue[0][1];
          if (id.indexOf('RAKR-') === 0) {
            rakrClientId = id;
          }
        }
        if (rakrUrl && rakrClientId) {
          resolve();
        } else {
          reject('Rakr Widget not initialized.');
        }
      }
    );
  }

  function resolveRakrUrl(path) {
    return rakrUrl + path;
  }

  setTimeout(function () {
    isRakrInitialized().then(
      function () {
        createButton();
      },
      function (message) {
        prompt(message);
      }

    );

  },
  100);

})(window, document);
