;(function(exports) { 
   exports.Templates = exports.Templates || {}; 
   var Templates = exports.Templates; 
   Templates["message"] = function(data){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
__p+='<li class="chat-message" >\n  <p class="chat-message-text">'+
((__t=( data.message ))==null?'':__t)+
'</p>\n  <h3 class="chat-message-user" >'+
((__t=( data.user ))==null?'':__t)+
'</h3>\n</li>';
return __p;
}
Templates["messages-list"] = function(data){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
__p+='';
 if(!data.has_messages) { 
__p+='\n  <h2 class="chat-messages-empty">No Messages</h2>\n';
 } else { 
__p+='\n  <ul class="chat-messages">'+
((__t=( data.messages ))==null?'':__t)+
'</ul>\n';
 } 
__p+='';
return __p;
}
Templates["navigation"] = function(data){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
__p+='<div class="navigation-title">\n  <h1 class="navigation-title-text">Navigation Title</h1>\n  <div class="barButtons left"></div>\n  <div class="barButtons right"></div>\n</div>\n<div class="navigation-content"></div>';
return __p;
}

   })(this);