// JavaScript Document

$("gridpic").hover(
  function () {
    $(this).children('.gridtitle').stop(true,true).slideDown('fast');
  },
  function () {
    $(this).children('.gridtitle').stop(true,true).slideUp('fast');
  }
);
