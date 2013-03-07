;(function(exports) { 
   exports.Templates = exports.Templates || {}; 
   var Templates = exports.Templates; 
   Templates["message"] = function(data){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
__p+='<p class="chat-message-date">Today, 10:30AM</p>\n<li class="chat-message '+
((__t=( (data.mine ? 'chat-message-mine' : '') ))==null?'':__t)+
'" >\n  <h3 class="chat-message-user" >'+
((__t=( data.user ))==null?'':__t)+
'</h3>\n  <p class="chat-message-text">'+
((__t=( data.message ))==null?'':__t)+
'</p>\n</li>';
return __p;
}
Templates["messages-list"] = function(data){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
__p+='';
 if(!data.has_messages) { 
__p+='\n  <h2 class="chat-messages-empty">No Messages</h2>\n';
 } else { 
__p+='\n  <ul id="chat-messages">'+
((__t=( data.messages ))==null?'':__t)+
'</ul>\n';
 } 
__p+='\n<div id="new-message">\n  <form id="new-message-form">\n  \t<input type="text" id="new-message-text" placeholder="Message" /><!--\n  \t--><button class="btn btn-send-message" id="new-message-button" type="submit" disabled>Send</button>\n  </form>\n</div>';
return __p;
}
Templates["navigation"] = function(data){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
__p+='<div class="navigation-title">\n  <h1 class="navigation-title-text">Navigation Title</h1>\n  <div class="barButtons left"></div>\n  <div class="barButtons right"></div>\n</div>\n<div class="navigation-content"></div>';
return __p;
}
Templates["settings"] = function(data){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
__p+='<form>\n  <label for="settings-username">Username</label>\n  <input type="text" id="settings-username" class="full" placeholder="Required" required />\n  <p class="note">This will be used to identify you in chat messages</p>\n</form>';
return __p;
}

   })(this);