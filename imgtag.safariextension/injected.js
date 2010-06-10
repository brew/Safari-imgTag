var currentlyOver;
document.oncontextmenu = function(event) {
  currentlyOver = (event.target.nodeName === 'IMG') ? event.target : null;
  var isCurrentlyOverImg = (currentlyOver) ? true : false;
  safari.self.tab.setContextMenuEventUserInfo(event, isCurrentlyOverImg);
};

function _removePanel(event) {
  if (event.target.className != "lcd_panel_element") {
    if (document.getElementById('lcd_imgtag_panel')) {
      var panel = document.getElementById('lcd_imgtag_panel');
      var panel_parent = panel.parentNode;
      panel_parent.removeChild(panel);
      document.removeEventListener('click', _removePanel);
    }
  }
}

function createImgTag() {
  if (window !== window.top) return;
  var img_string = "";
    
  if (currentlyOver) {
    img_string = '<img src="' + currentlyOver.src + '" ';
    img_string += 'width="' + currentlyOver.width + '" ';
    img_string += 'height="' + currentlyOver.height + '" ';
    img_string += 'alt="' + currentlyOver.alt + '" ';
    img_string += '/>';
  } 

  return img_string;
}

function addTextAreaPanel() {
  if (window !== window.top) return;
  var objPanel, objTextArea, objContainer;

  if (!document.getElementById('lcd_imgtag_textarea')) {
    objTextArea = document.createElement('textarea');
    objTextArea.setAttribute('id','lcd_imgtag_textarea');
    objTextArea.setAttribute('class', 'lcd_panel_element');

    objContainer = document.createElement('div');
    objContainer.appendChild(objTextArea);
    objContainer.setAttribute('class', 'lcd_panel_element');

    objPanel = document.createElement('div');
    objPanel.setAttribute('id','lcd_imgtag_panel');
    objPanel.setAttribute('class', 'lcd_panel_element');
    objPanel.appendChild(objContainer);

    document.body.appendChild(objPanel);
    document.addEventListener('click', _removePanel);
  } 
  document.getElementById('lcd_imgtag_textarea').innerText = createImgTag();
  document.getElementById('lcd_imgtag_textarea').select();

}

function messageHandler(event) {
  if (window !== window.top) return;
  if (event.name === "open_textarea_box") {
    addTextAreaPanel();
  }
}
safari.self.addEventListener("message", messageHandler, false);

