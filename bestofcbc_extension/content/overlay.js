/* ***** BEGIN LICENSE BLOCK *****
 *   Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Best Of CBC.
 *
 * The Initial Developer of the Original Code is
 * Nathan Stehr.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 * 
 * ***** END LICENSE BLOCK ***** */

var bestofcbc = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
    this.strings = document.getElementById("bestofcbc-strings");
  },
  onMenuItemCommand: function(e) {
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                  .getService(Components.interfaces.nsIPromptService);
    
    var currentURL = getBrowser().currentURI.spec;
    if(currentURL.indexOf("cbc") > 0){
	
        promptService.alert(window,'Instructions','Click a comment to submit to BestOfCBC');
        var even = bestofcbc.getElementsByClassName(window.content.document.getElementById('cmt-wrapper'),'div','comment  clearfix');
        var odd = bestofcbc.getElementsByClassName(window.content.document.getElementById('cmt-wrapper'),'div','comment odd clearfix');
        var combined = even.concat(odd); 
        
        for(var i=0; i<combined.length; i++){
        
	    combined[i].addEventListener("click",bestofcbc.handleMouseClickEvent,true);
	    }
        
        
        
        
    }
  },
  onToolbarButtonCommand: function(e) {
    // just reuse the function above.  you can change this, obviously!
    bestofcbc.onMenuItemCommand(e);
    },
  handleMouseClickEvent: function(e){
        var myDiv;
        var comment;
        var author;
        var authorLink;
        if(e.originalTarget.type == 'div')
            myDiv = e.originalTarget;
        else
            myDiv = e.originalTarget.parentNode;
        var spans = myDiv.childNodes;
        for(var i = 0; i< spans.length; i++){
            var span = spans[i];
            if(span.className == 'r')
               comment = span.innerHTML;
            else
                authorLink = span.getElementsByTagName('a')[0]; 
                author = authorLink.innerHTML;       
        }
        
        //send to site
        var url = "http://labs.laserdeathstehr.com/bestofcbc/submit";
        var http = new XMLHttpRequest();
        var current_url = getBrowser().currentURI.spec;
	
        var params = "comment="+comment+"&url="+current_url+"&author="+author+"&authorLink="+authorLink;
        http.open("POST", url, true);
	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.setRequestHeader("Content-length", params.length);
	http.setRequestHeader("Connection", "close");

	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4 && http.status == 200) {
	        var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
		.getService(Components.interfaces.nsIPromptService);
		promptService.alert(window,"Best of CBC",http.responseText);
	    }
	}
	http.send(params);

    },
    //from: http://codesnippets.joyent.com/posts/show/686
    getElementsByClassName: function(oElm, strTagName, strClassName){
    
    var arrElements = (strTagName == "*" && document.all)? document.all : oElm.getElementsByTagName(strTagName);
	    var arrReturnElements = new Array();
	    strClassName = strClassName.replace(/\-/g, "\\-");
	    var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
	    var oElement;
	    for(var i=0; i<arrElements.length; i++){
	        oElement = arrElements[i];
	        if(oRegExp.test(oElement.className)){
	            arrReturnElements.push(oElement);
	        }
	    }
	    return (arrReturnElements)
	}


};
window.addEventListener("load", function(e) { bestofcbc.onLoad(e); }, false);
