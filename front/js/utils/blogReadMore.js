// 移除高度限制样式将所有内容显示出来
var article_content=document.getElementById("article_content");
article_content.removeAttribute("style");

// 删除关注博主即可阅读全文

// var follow_text=document.getElementsByClassName('follow-text')[0];
// follow_text.parentElement.parentElement.removeChild(follow_text.parentElement);
 
var  hide_article_box=document.getElementsByClassName(' hide-article-box')[0];
hide_article_box.parentElement.removeChild(hide_article_box);