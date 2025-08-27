import Handlebars from 'handlebars';

Handlebars.registerHelper('substring', function(str, start, length) {
  if (typeof str !== 'string') return '';
  return str.substring(start, start + length);
});

Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});


Handlebars.registerHelper('initialsArray', function(name) {
  if (!name || typeof name !== 'string') return [];
  
  // Split name by spaces and get first letter of each word as array
  return name.split(' ')
             .map(word => word.trim())
             .filter(word => word.length > 0)
             .map(word => word.charAt(0).toUpperCase());
});

Handlebars.registerHelper('initialsCount', function(name) {
  if (!name || typeof name !== 'string') return 0;
  
  // Count number of initials
  return name.split(' ')
             .map(word => word.trim())
             .filter(word => word.length > 0)
             .length;
});

Handlebars.registerHelper('safeHtml', function(text) {
  if (!text) return '';
  
  // Convert all double quotes in HTML attributes to single quotes
  let processed = text.replace(/(\w+)="([^"]*)"/g, "$1='$2'");
  
  return new Handlebars.SafeString(processed);
});

export function registerHandlebarsHelpers() {
  Handlebars.registerHelper('richText', function (text: string) {
    if (!text) return '';
    let processed = text
      // Convert double quotes in attributes to single quotes
      .replace(/(\w+)="([^"]*)"/g, "$1='$2'")
      // Headers
      .replace(/^######\s+(.*$)/gm, '<h6>$1</h6>')
      .replace(/^#####\s+(.*$)/gm, '<h5>$1</h5>')
      .replace(/^####\s+(.*$)/gm, '<h4>$1</h4>')
      // Text formatting
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__([^_]+)__/g, '<u>$1</u>')
      .replace(/~~(.*?)~~/g, '<strike>$1</strike>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' target='_blank'>$1</a>")
      // Quote blocks
      .replace(/^>\s+(.*$)/gm, '<blockquote>$1</blockquote>')
      // Simple lists
      .replace(/^[-*]\s+(.*$)/gm, '<li>$1</li>')
      .replace(/^\d+\.\s+(.*$)/gm, '<li>$1</li>')
      // Line breaks
      .replace(/\n/g, '<br>');
    return new Handlebars.SafeString(processed);
  });
}



// Register all helpers immediately
registerHandlebarsHelpers();