document.addEventListener('DOMContentLoaded', function () {
  document.body.addEventListener('click', function (e) {
    if (e.target.classList.contains('close-all')) {
      let windowId = parseInt(e.target.getAttribute('data-window'));
      chrome.runtime.sendMessage({ action: "closeTabs", windowId: windowId });
    }
  });
});

chrome.storage.local.get("tabData", (data) => {
  if(data.tabData) {
    // let decodedData = decodeURIComponent(data.tabData).replace(/\n/g, '<br>');
    // document.getElementById("tabList").innerHTML = decodedData;
    document.getElementById("tabList").innerHTML = decodeURIComponent(data.tabData).replace(/\n/g, '<br><br>');
  }
});



