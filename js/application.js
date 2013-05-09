var Application = {
   initApplication: function() {
      $(document).on(
         'pageinit',
         '#files-list-page',
         function()
         {
            Application.initFilesListPage();
         }
      );
      $(document).on(
         'pageinit',
         '#aurelio-page',
         function()
         {
            Application.openLinksInApp();
         }
      );
      $(document).on(
         'pagechange',
         function(event, properties)
         {
            if (properties.absUrl === $.mobile.path.makeUrlAbsolute('player.html'))
            {
               Application.initPlayerPage(
                  JSON.parse(properties.options.data.file)
               );
            }
         }
      );
   },
   initFilesListPage: function() {
      $('#update-button').click(
         function()
         {
            $('#waiting-popup').popup('open');
            setTimeout(function(){
               Application.updateMediaList();
            }, 150);
         }
      );
      $(document).on('endupdate', function(){
         Application.createFilesList('files-list', AppFile.getAppFiles());
         $('#waiting-popup').popup('close');
      });
      Application.createFilesList('files-list', AppFile.getAppFiles());
   },
   initPlayerPage: function(file) {
      Player.stop();
      $('#media-name').text(file.name);
      $('#media-path').text(file.fullPath);
      $('#player-play').click(function() {
         Player.playPause(file.fullPath);
      });
      $('#player-stop').click(Player.stop);
      $('#time-slider').on('slidestop', function(event) {
         Player.seekPosition(event.target.value);
      });
   },
   updateIcons: function()
   {
      if ($(window).width() > 480)
      {
         $('a[data-icon], button[data-icon]').each(function() {
            $(this).removeAttr('data-iconpos');
         });
      }
      else
      {
         $('a[data-icon], button[data-icon]').each(function() {
            $(this).attr('data-iconpos', 'notext');
         });
      }
   },
   openLinksInApp: function()
   {
      $("a[target=\"_blank\"]").on('click', function(event) {
         event.preventDefault();
         window.open($(this).attr('href'), '_target');
      });
   },
   updateMediaList: function() {
      window.requestFileSystem(
         LocalFileSystem.PERSISTENT,
         0,
         function(fileSystem){
            var root = fileSystem.root;
            AppFile.deleteFiles();
            Application.collectMedia(root.fullPath, true);
         },
         function(error){
            console.log('File System Error: ' + error.code);
         }
      );
   },
   collectMedia: function(path, recursive, level) {
      if (level === undefined)
         level = 0;
      var directoryEntry = new DirectoryEntry('', path);
      if(!directoryEntry.isDirectory) {
         console.log('The provided path is not a directory');
         return;
      }
      var directoryReader = directoryEntry.createReader();
      directoryReader.readEntries(
         function (entries) {
            var appFile;
            var extension;
            for (var i = 0; i < entries.length; i++) {
               if (entries[i].name === '.')
                  continue;

               extension = entries[i].name.substr(entries[i].name.lastIndexOf('.'));
               if (entries[i].isDirectory === true && recursive === true)
                  Application.collectMedia(entries[i].fullPath, recursive, level + 1);
               else if (entries[i].isFile === true && $.inArray(extension, AppFile.EXTENSIONS) >= 0)
               {
                  appFile = new AppFile(entries[i].name, entries[i].fullPath);
                  appFile.addFile();
                  console.log('File saved: ' + entries[i].fullPath);
               }
            }
         },
         function(error) {
            console.log('Unable to read the directory. Errore: ' + error.code);
         }
      );

      if (level === 0)
         $(document).trigger('endupdate');
      console.log('Current path analized is: ' + path);
   },
   createFilesList: function(idElement, files)
   {
      $('#' + idElement).empty();

      if (files == null || files.length == 0)
      {
         $('#' + idElement).append('<p>No files to show. Would you consider a files update (top right button)?</p>');
         return;
      }

      function getPlayHandler(file) {
         return function playHandler() {
            $.mobile.changePage(
               'player.html',
               {
                  data: {
                     file: JSON.stringify(file)
                  }
               }
            );
         };
      }

      function getDeleteHandler(file) {
         return function deleteHandler() {
            var oldLenght = AppFile.getAppFiles().length;
            var $parentUl = $(this).closest('ul');

            file = new AppFile('', file.fullPath);
            file.deleteFile();
            if (oldLenght === AppFile.getAppFiles().length + 1)
            {
               $(this).closest('li').remove();
               $parentUl.listview('refresh');
            }
            else
            {
               console.log('Media not deleted. Something gone wrong.');
               navigator.notification.alert(
                  'Media not deleted. Something gone wrong so please try again.',
                  function(){},
                  'Error'
               );
            }
         };
      }

      var $listElement, $linkElement;
      files.sort(AppFile.compareIgnoreCase);
      for(var i = 0; i < files.length; i++)
      {
         $listElement = $('<li>');
         $linkElement = $('<a>');
         $linkElement
         .attr('href', '#')
         .text(files[i].name)
         .click(getPlayHandler(files[i]));

         // Append the link to the <li> element
         $listElement.append($linkElement);

         $linkElement = $('<a>');
         $linkElement
         .attr('href', '#')
         .text('Delete')
         .click(getDeleteHandler(files[i]));

         // Append the link to the <li> element
         $listElement.append($linkElement);

         // Append the <li> element to the <ul> element
         $('#' + idElement).append($listElement);
      }
      $('#' + idElement).listview('refresh');
   }
};