var currentlyOver;
document.oncontextmenu = function(event) {
  currentlyOver = (event.target.nodeName === 'IMG') ? event.target : null;
  var isCurrentlyOverImg = (currentlyOver) ? true : false;
  safari.self.tab.setContextMenuEventUserInfo(event, isCurrentlyOverImg);
};

function _onCopyCut(event) {
	setTimeout(function(){
	  _removePanel();
	}, 0);
}
function _onClick(event) {
  if (event.target && event.target.className != "lcd_panel_element") {
    _removePanel();
  } else {
    document.getElementById('lcd_imgtag_textarea').focus();
    document.getElementById('lcd_imgtag_textarea').select();
  }
}
function _onKeyDown(event) {
  // If the escape key was pressed.
  if(event.keyCode == 27) {
    _removePanel();
  }
}

function _removePanel() {
  if (document.getElementById('lcd_imgtag_panel')) {
    var panel = document.getElementById('lcd_imgtag_panel');
    var panel_parent = panel.parentNode;
    removeListeners();
    panel_parent.removeChild(panel);
  } 
}

function addListeners() {
  document.addEventListener('click', _onClick);
  document.addEventListener('copy', _onCopyCut);
  document.addEventListener('cut', _onCopyCut);
  document.addEventListener('keydown', _onKeyDown);
}

function removeListeners() {
  document.removeEventListener('click', _onClick);
  document.removeEventListener('copy', _onCopyCut);
  document.removeEventListener('cut', _onCopyCut);
  document.removeEventListener('keydown', _onKeyDown);
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
  var panel, textArea, cloverleaf_c;

  if (!document.getElementById('lcd_imgtag_textarea')) {
    textArea = document.createElement('textarea');
    textArea.setAttribute('id','lcd_imgtag_textarea');
    textArea.setAttribute('class', 'lcd_panel_element');

    cloverleaf_c = document.createElement('img');
    cloverleaf_c.src = safari.extension.baseURI + "cloverleaf_c.png";
    cloverleaf_c.setAttribute('height', '38');
    cloverleaf_c.setAttribute('width', '113');
    cloverleaf_c.setAttribute('alt', '⌘+C');
    cloverleaf_c.setAttribute('class', 'lcd_panel_element');

    panel = document.createElement('div');
    panel.setAttribute('id','lcd_imgtag_panel');
    panel.setAttribute('class', 'lcd_panel_element');
    panel.appendChild(cloverleaf_c);
    panel.appendChild(textArea);

    document.body.appendChild(panel);
    addListeners();
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

