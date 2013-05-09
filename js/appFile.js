function AppFile(name, fullPath)
{
   var _db = window.localStorage;
   var _tableName = 'files';

   this.name = name;
   this.fullPath = fullPath;

   this.save = function(files)
   {
      _db.setItem(_tableName, JSON.stringify(files));
   }

   this.load = function()
   {
      return JSON.parse(_db.getItem(_tableName));
   }
}

AppFile.prototype.addFile = function()
{
   var index = AppFile.getIndex(this.fullPath);
   var files = AppFile.getAppFiles();

   if (index === false)
      files.push(this);
   else
      files[index] = this;

   this.save(files);
};

AppFile.prototype.deleteFile = function()
{
   var index = AppFile.getIndex(this.fullPath);
   var files = AppFile.getAppFiles();
   if (index !== false)
   {
      files.splice(index, 1);
      this.save(files);
   }

   return files;
};

AppFile.prototype.compareTo = function(other)
{
   return AppFile.compare(this, other);
};

AppFile.prototype.compareToIgnoreCase = function(other)
{
   return AppFile.compareIgnoreCase(this, other);
};

AppFile.EXTENSIONS = ['.mp3', '.wav', '.m4a'];

AppFile.compare = function(appFile, other)
{
   if (other == null)
      return 1;
   else if (appFile == null)
      return -1;

   return appFile.name.localeCompare(other.name);
};

AppFile.compareIgnoreCase = function(appFile, other)
{
   if (other == null)
      return 1;
   else if (appFile == null)
      return -1;

   return appFile.name.toUpperCase().localeCompare(other.name.toUpperCase());
};

AppFile.getAppFiles = function()
{
   var files = new AppFile().load();
   return (files === null) ? [] : files;
};

AppFile.getAppFile = function(path)
{
   var index = AppFile.getIndex(path);
   if (index === false)
      return null;
   else
   {
      var file = AppFile.getAppFiles()[index];
      return new AppFile(file.name, file.fullPath);
   }
};

AppFile.getIndex = function(path)
{
   var files = AppFile.getAppFiles();
   for(var i = 0; i < files.length; i++)
   {
      if (files[i].fullPath.toUpperCase() === path.toUpperCase())
         return i;
   }

   return false;
};

AppFile.deleteFiles = function()
{
   new AppFile().save([]);
};