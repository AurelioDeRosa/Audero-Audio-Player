$(document).on(
   'mobileinit',
   function()
   {
      // Page Loader Widget
      $.mobile.loader.prototype.options.text = 'Loading...';
      $.mobile.loader.prototype.options.textVisible = true;

      // Theme
      $.mobile.page.prototype.options.theme  = 'a';
      $.mobile.page.prototype.options.headerTheme = 'a';
      $.mobile.page.prototype.options.contentTheme = 'a';
      $.mobile.page.prototype.options.footerTheme = 'a';
      $.mobile.page.prototype.options.backBtnTheme = 'a';
   }
);