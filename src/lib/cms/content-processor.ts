// Node.js specific modules should only run on the server side
// This file should only be imported on the server side

// Node.js modules
import fs from "fs";
import path from "path";

// Import site configuration
import siteConfig from "$lib/site.config.js";

// This error check is to provide an early warning when this module is attempted to be used in the browser
  // const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
  // if (isBrowser) {
  //   console.error("content-processor.js should only be used on the server side!");
  //   throw new Error("Content processor cannot run on the client side!");
  // }

// Scans all markdown files and folders in the content directory
const scanContentDirectory = () => {
  const contentFiles = import.meta.glob('/content/**/*.{md,svx}', {
    eager: true,
    import: 'default'
  });

  const contentEntries = [];

  Object.entries(contentFiles).forEach(([path, module]) => {
    // Extract info from path
    const relativePath = path.replace('/content/', '').replace(/\.(md|svx)$/, '');
    const parts = relativePath.split('/');
    const slug = parts[parts.length - 1];
    const directory = parts.slice(0, -1).join('/') || 'root';
    const mainDirectory = parts[0] || 'root';
    const url = `/${relativePath}`;

    // Get metadata from the module
    const metadata = module.metadata || {};

    contentEntries.push({
      slug,
      path: relativePath,
      url,
      directory,
      mainDirectory,
      depth: directory === 'root' ? 0 : parts.length - 1,
      rawContent: module.rawContent || '',
      metadata: {
        title: metadata.title || formatTitle(slug),
        description: metadata.description || '',
        date: metadata.date || null,
        author: metadata.author || null,
        ...metadata
      }
    });
  });

  return contentEntries;
};

// Function that detects folders in the content directory
// const getContentDirectories = () => {
//   const contentPath = path.resolve("content");
//   const directories = [];

//   if (!fs.existsSync(contentPath)) {
//     console.warn("Content folder not found!");
//     return directories;
//   }

//   const entries = fs.readdirSync(contentPath);

//   for (const entry of entries) {
//     const fullPath = path.join(contentPath, entry);
//     if (fs.statSync(fullPath).isDirectory()) {
//       directories.push({
//         name: entry,
//         path: `content/${entry}`,
//         title: formatTitle(entry),
//         url: `/${entry}`,
//       });
//     }
//   }

//   return directories;
// };

// Function that shortens markdown content up to a specific length
const truncateContent = (content, maxLength = 200) => {
  if (content.length <= maxLength) return content;

  return content.substring(0, maxLength) + "...";
};

// Function to create a title from a slug
const formatTitle = (slug) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// To scan all content once and cache it
let cachedContent = null;

// Get all content (using cache)
const getAllContent = () => {
  // Check for development mode to skip caching
  const isDev =
    process.env.NODE_ENV === "development" ||
    (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV);

  if (!isDev && cachedContent) return cachedContent;

  // In development, we want to scan every time to pick up changes
  if (isDev) {
    // Clear cache to be safe
    cachedContent = null;
  }

  const content = scanContentDirectory();

  // Only cache in production
  if (!isDev) {
    cachedContent = content;
  }

  return content;
};

// Get content for a specific URL
// const getContentByUrl = (url) => {
//   const allContent = getAllContent();

//   // Remove trailing slash (/) from URL
//   const normalizedUrl = url.endsWith("/") ? url.slice(0, -1) : url;

//   console.log("Normalized URL for lookup:", normalizedUrl);

//   // Check content URLs and find matching content
//   const result = allContent.find((entry) => {
//     // Remove trailing slash from content URL as well
//     const entryUrl = entry.url.endsWith("/") ? entry.url.slice(0, -1) : entry.url;
//     console.log(`Comparing: "${entryUrl}" vs "${normalizedUrl}"`);
//     return entryUrl === normalizedUrl;
//   });

//   console.log("Match result:", result ? `Found: ${result.url}` : "Not found");
//   return result;
// };

// Get content from a specific directory
// const getContentByDirectory = (directory) => {
//   const allContent = getAllContent();

//   // Direct matching for main directories
//   if (directory === "root") {
//     return allContent.filter((entry) => entry.directory === "root");
//   }

//   // Get all content that starts with the specified directory, including subdirectories
//   return allContent.filter((entry) => {
//     // 1. Exact match case (e.g., 'blog' directory for 'blog')
//     // 2. Subdirectory match (e.g., 'blog/category' directory for 'blog')
//     return entry.directory === directory || entry.directory.startsWith(directory + "/");
//   });
// };

// Clear cache (might be necessary in development mode)
// const clearContentCache = () => {
//   cachedContent = null;
// };

// Function to find subdirectories - returns subdirectories for a specific directory
export const getSubDirectories = (directory) => {
  const allContent = getAllContent();
  const subdirs = new Set();

  // If not the main directory, filter relevant content
  const contents = allContent.filter(
    (entry) =>
      entry.directory !== "root" &&
      (entry.directory === directory || entry.directory.startsWith(directory + "/")),
  );

  // Extract subdirectories from contents
  contents.forEach((entry) => {
    // Get only subdirectories by skipping the main directory
    const relativePath = entry.directory.replace(directory + "/", "");
    if (relativePath && relativePath.includes("/")) {
      // Get the first subdirectory level (e.g., 'blog/category/js' -> 'category')
      const firstLevel = relativePath.split("/")[0];
      subdirs.add(firstLevel);
    }
  });

  return Array.from(subdirs).map((subdir) => ({
    name: subdir,
    path: `${directory}/${subdir}`,
    title: formatTitle(subdir),
    url: `/${directory}/${subdir}`,
  }));
};

// Function to process template variables
const processTemplateVariables = (content) => {
  // Get variables from configuration
  const variables = {
    // Site information
    "site.name": siteConfig.site.name,
    "site.description": siteConfig.site.description,
    "site.url": siteConfig.site.url,
    "site.author": siteConfig.site.author,

    // Contact information
    "contact.email": siteConfig.contact.email,
    "contact.privacyEmail": siteConfig.contact.privacyEmail,
    "contact.supportEmail": siteConfig.contact.supportEmail,
    "contact.phone": siteConfig.contact.phone,
    "contact.address.street": siteConfig.contact.address.street,
    "contact.address.city": siteConfig.contact.address.city,
    "contact.address.state": siteConfig.contact.address.state,
    "contact.address.zipCode": siteConfig.contact.address.zipCode,
    "contact.address.country": siteConfig.contact.address.country,
    "contact.address.full": `${siteConfig.contact.address.street}, ${siteConfig.contact.address.city}, ${siteConfig.contact.address.state} ${siteConfig.contact.address.zipCode}`,

    // Social media
    "social.twitter": siteConfig.social.twitter,
    "social.github": siteConfig.social.github,
    "social.linkedin": siteConfig.social.linkedin,
    "social.facebook": siteConfig.social.facebook,
    "social.instagram": siteConfig.social.instagram,
    "social.youtube": siteConfig.social.youtube,
    "social.discord": siteConfig.social.discord,
    "social.reddit": siteConfig.social.reddit,

    // Legal information
    "legal.privacyPolicyLastUpdated": siteConfig.legal.privacyPolicyLastUpdated,
    "legal.termsLastUpdated": siteConfig.legal.termsLastUpdated,
    "legal.doNotSell.processingTime": siteConfig.legal.doNotSell.processingTime,

    // Dynamic date functions
    "date.now": new Date().toLocaleDateString("en-US"),
    "date.year": new Date().getFullYear().toString(),
    "date.month": new Date().toLocaleDateString("en-US", { month: "long" }),
    "date.day": new Date().getDate().toString(),
  };

  // Replace template variables
  // Support {{variable.name}} format variables
  let processedContent = content;

  // Process {{variable}} format variables
  processedContent = processedContent.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
    const trimmedName = variableName.trim();
    if (variables.hasOwnProperty(trimmedName)) {
      return variables[trimmedName];
    }
    console.warn(`Template variable not found: ${trimmedName}`);
    return match; // Leave unfound variables as they are
  });

  return processedContent;
};

// Function to build sidebar navigation tree for a directory
export const getSidebarTree = (directory) => {
  const allContent = getAllContent();

  // Filter content for this directory
  const directoryContent = allContent.filter(
    (entry) => entry.directory === directory || entry.directory.startsWith(directory + "/"),
  );

  // Group by subdirectory
  const groups = {};

  directoryContent.forEach((entry) => {
    // Get relative path from the main directory
    const relativePath =
      entry.directory === directory ? "" : entry.directory.replace(directory + "/", "");

    const parts = relativePath.split("/").filter(Boolean);
    const groupKey = parts[0] || "_root";

    if (!groups[groupKey]) {
      groups[groupKey] = {
        title: groupKey === "_root" ? formatTitle(directory) : formatTitle(groupKey),
        items: [],
      };
    }

    groups[groupKey].items.push({
      title: entry.metadata.title,
      url: entry.url,
      order: entry.metadata.order || 999,
    });
  });

  // Sort items within each group
  Object.values(groups).forEach((group) => {
    group.items.sort((a, b) => a.order - b.order);
  });

  // Convert to sidebar format
  const result = [];

  // Add root items first
  if (groups._root) {
    groups._root.items.forEach((item) => {
      result.push(item);
    });
    delete groups._root;
  }

  // Add grouped items
  Object.entries(groups).forEach(([key, group]) => {
    result.push({
      title: group.title,
      children: group.items,
    });
  });

  return result;
};

// Function to get all directories as sidebar navigation
const getAllDirectoriesSidebar = () => {
  const directories = getContentDirectories();
  const result = [];

  directories.forEach((dir) => {
    const dirContent = getSidebarTree(dir.name);
    if (dirContent.length > 0) {
      result.push({
        title: dir.title,
        url: dir.url,
        children: dirContent,
      });
    }
  });

  return result;
};

// no need as we can access it using $lib import
// export {
//   scanContentDirectory,
//   getContentDirectories,
//   truncateContent,
//   formatTitle,
//   getAllContent,
//   getContentByUrl,
//   getContentByDirectory,
//   clearContentCache,
//   getSubDirectories,
//   processTemplateVariables,
//   getSidebarTree,
//   getAllDirectoriesSidebar,
// };



// -------------------------------------------------

/**
 * Get all top-level directories in the content folder
 */
export function getContentDirectories() {
  const contentFiles = import.meta.glob('/content/**/*.{md,svx}', { eager: true });
  const directories = new Set();

  Object.keys(contentFiles).forEach((path) => {
    // Extract first directory after /content/
    // e.g., "/content/blog/post.md" -> "blog"
    const match = path.match(/^\/content\/([^/]+)\//);
    if (match) {
      directories.add(match[1]);
    }
  });

  return Array.from(directories).map((name) => ({
    name,
    title: formatTitle(name),
    url: `/${name}`
  }));
}

/**
 * Get all content entries from a specific directory
 */
export function getContentByDirectory(directory:string) {
  const contentFiles = import.meta.glob('/content/**/*.{md,svx}', { eager: true });
  const entries = [];

  Object.entries(contentFiles).forEach(([path, module]) => {
    // Check if file is in the specified directory
    const dirPattern = new RegExp(`^/content/${directory}/`);
    if (!dirPattern.test(path)) return;

    // Extract slug and relative path
    const relativePath = path.replace('/content/', '').replace(/\.(md|svx)$/, '');
    const slug = relativePath.split('/').pop();
    const url = `/${relativePath}`;

    entries.push({
      slug,
      path: relativePath,
      url,
      metadata: module.metadata || {}
    });
  });

  return entries;
}

/**
 * Returns hierarchical sidebar data for a directory
 * Groups content by folders, sorts by order
 */
 export function getSidebarData(directory) {
   const contentFiles = import.meta.glob('/content/**/*.{md,svx}', {
     eager: true
   });

   const groups = {};

   Object.entries(contentFiles).forEach(([path, module]) => {
     // Only files from this directory
     if (!path.startsWith(`/content/${directory}/`)) return;

     // Remove prefix and extension
     // "/content/docs/group-folder/new-site-checklist.svx"
     // -> "group-folder/new-site-checklist"
     const relativePath = path
       .replace(`/content/${directory}/`, '')
       .replace(/\.(md|svx)$/, '');

     const parts = relativePath.split('/');
     const fileName = parts[parts.length - 1];
     const metadata = module.metadata || {};

     // Determine group
     let groupTitle;
     if (parts.length === 1) {
       // Root level file
       groupTitle = 'Root';
     } else {
       // File inside folder - use FOLDER NAME as title
       const folderName = parts[0];
       // Convert "group-folder" -> "Group Folder"
       groupTitle = folderName
         .split('-')
         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
         .join(' ');
     }

     // Initialize group if needed
     if (!groups[groupTitle]) {
       groups[groupTitle] = [];
     }

     // Add file to group
     groups[groupTitle].push({
       title: metadata.title || fileName,
       url: `/${directory}/${relativePath}`,
       order: metadata.order || 999
     });
   });

   // Sort files within each group by order
   Object.keys(groups).forEach(groupTitle => {
     groups[groupTitle].sort((a, b) => a.order - b.order);
   });

   return groups;
 }

/**
 * Returns the URL of the first page in a directory
 * (first item of first group)
 */
 export function getFirstPageUrl(directory) {
   const sidebar = getSidebarData(directory);

   if (!sidebar || typeof sidebar !== 'object') return null;

   // Convert object to array of groups
   const groups = Object.entries(sidebar);

   if (groups.length === 0) return null;

   // Find first group that has items
   for (const [groupName, items] of groups) {
     if (items && items.length > 0) {
       return items[0].url;
     }
   }

   return null;
 }

/**
 * Returns content and metadata for a specific page
 */
 export function getPageContent(fullPath) {
   const contentFiles = import.meta.glob('/content/**/*.{md,svx}', {
     eager: true
   });

   // REMOVE TRAILING SLASH
   const cleanPath = fullPath.endsWith('/')
     ? fullPath.slice(0, -1)
     : fullPath;

   // Try both .md and .svx
   const possiblePaths = [
     `/content${cleanPath}.md`,
     `/content${cleanPath}.svx`
   ];

   for (const path of possiblePaths) {
     if (contentFiles[path]) {
       const module = contentFiles[path];

       return {
         metadata: module.metadata || {},
         content: module.default,
       };
     }
   }

   return null;
 }
