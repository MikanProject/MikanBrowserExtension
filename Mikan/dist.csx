using System.Collections.Generic;
using System.IO;
using System.Linq;

public static void RecursiveCopyFiles(string sourceDirName, string destDirName, IList<string> filter)
{
    var sourcedir = new DirectoryInfo(sourceDirName);
    var destDir = new DirectoryInfo(Path.Combine(destDirName, sourcedir.Name));
    if (!destDir.Exists) destDir.Create();
    foreach (var file in sourcedir.EnumerateFiles())
    {
        if (filter.Any(t => file.Extension == t))
            file.CopyTo(Path.Combine(destDir.FullName, file.Name));
    }
    foreach (var directory in sourcedir.EnumerateDirectories())
    {
        RecursiveCopyFiles(directory.FullName, destDir.FullName, filter);
    }
}

public static void DirectoryCopy(string sourceDirName, string destDirName, bool copySubDirs)
{
    // Get the subdirectories for the specified directory.
    var dir = new DirectoryInfo(sourceDirName);

    if (!dir.Exists)
    {
        throw new DirectoryNotFoundException(
            "Source directory does not exist or could not be found: "
            + sourceDirName);
    }

    var dirs = dir.GetDirectories();
    // If the destination directory doesn't exist, create it.
    if (!Directory.Exists(destDirName))
    {
        Directory.CreateDirectory(destDirName);
    }

    // Get the files in the directory and copy them to the new location.
    var files = dir.GetFiles();
    foreach (var file in files)
    {
        var temppath = Path.Combine(destDirName, file.Name);
        file.CopyTo(temppath, false);
    }

    // If copying subdirectories, copy them and their contents to new location.
    if (copySubDirs)
    {
        foreach (var subdir in dirs)
        {
            var temppath = Path.Combine(destDirName, subdir.Name);
            DirectoryCopy(subdir.FullName, temppath, true);
        }
    }
}

var distDir = new DirectoryInfo("dist");
if (distDir.Exists) distDir.Delete(true);
distDir.Create();
DirectoryCopy("_locales", Path.Combine("dist", "_locales"), true);
DirectoryCopy("lib", Path.Combine("dist", "lib"), true);
DirectoryCopy("icons", Path.Combine("dist", "icons"), true);
RecursiveCopyFiles("src", "dist", new List<string> {".html", ".js", ".css", ".woff"});
