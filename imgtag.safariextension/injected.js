var currentlyOver;

document.addEventListener('contextmenu', _handleContextMenu);
function _handleContextMenu(event) {
  currentlyOver = (event.target.nodeName === 'IMG') ? event.target : null;
  var isCurrentlyOverImg = (currentlyOver) ? true : false;
  safari.self.tab.setContextMenuEventUserInfo(event, isCurrentlyOverImg);  
}

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
    document.getElementById('lcd_imgtag_panel').addEventListener('webkitTransitionEnd', function( event ) {
      this.parentNode.removeChild(this);
    });
    document.getElementById('lcd_imgtag_panel').className += " remove";
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

function createImgTag(tagType) {
  if (window !== window.top) return;
  var img_string = "";
      
  if (currentlyOver) {
    if (tagType == undefined || tagType == 'html') {
      img_string = '<img src="' + currentlyOver.src + '" ';
      img_string += 'width="' + currentlyOver.width + '" ';
      img_string += 'height="' + currentlyOver.height + '" ';
      img_string += 'alt="' + currentlyOver.alt + '" ';
      img_string += '/>';      
    } else if (tagType == 'html_linked') {
      img_string = '<a href="' + window.location + '" ';
	    if(document.getElementsByTagName('title')[0] != undefined) img_string += 'title="' + document.getElementsByTagName('title')[0].innerHTML + '" ';
	    img_string += '>';
      img_string += '<img src="' + currentlyOver.src + '" ';
      img_string += 'width="' + currentlyOver.width + '" ';
      img_string += 'height="' + currentlyOver.height + '" ';
      img_string += 'alt="' + currentlyOver.alt + '" ';
      img_string += '/></a>';      
    } else if (tagType == 'bbcode') {
      img_string = '[img]' + currentlyOver.src + '[/img]';
    } else if (tagType == 'markdown') {
      img_string = '![' + currentlyOver.alt + ']';
      img_string += '(' + currentlyOver.src + ')';
    } else if (tagType == 'textile') {
      img_string = '!' + currentlyOver.src;
      img_string += '(' + currentlyOver.alt + ')!';
    }
  } 

  return img_string;
}

function addTextAreaPanel(tagType) {
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
  setTimeout(function(){
    document.getElementById('lcd_imgtag_panel').className += " active";
	}, 0);
  document.getElementById('lcd_imgtag_textarea').innerText = createImgTag(tagType);
  document.getElementById('lcd_imgtag_textarea').select();
}

function messageHandler(event) {
  if (window !== window.top) return;
  if (event.name === "open_textarea_box") {
    addTextAreaPanel(event.message);
  }
}
safari.self.addEventListener("message", messageHandler, false);

