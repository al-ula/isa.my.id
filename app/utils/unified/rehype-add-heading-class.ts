import type { Plugin } from 'unified';
import type { Root } from 'hast';
import { visit } from 'unist-util-visit';

export interface AddClassOptions {
  /** Whether to add to existing classes or replace them. */
  method?: 'add' | 'replace';
  /** The class name or names to apply. */
  value: string | string[];
  /** An array of heading IDs to ignore. */
  excludeIds?: string[];
  /** An array of class names. If a heading has any of these classes, it will be ignored. */
  excludeClass?: string | string[];
  /** How to evaluate multiple exclude classes. 'or' (default) excludes if any class matches. 'and' excludes if all classes match. */
  excludeClassMethod?: 'and' | 'or';
}

const rehypeAddHeadingClass: Plugin<[AddClassOptions], Root> = (options) => {
  if (!options?.value) {
    throw new Error('rehypeAddHeadingClass: `value` option is required.');
  }

  const { method = 'add', value, excludeIds = [], excludeClass = [], excludeClassMethod = 'or' } = options;

  const classesToExclude = Array.isArray(excludeClass) ? excludeClass : excludeClass.split(' ').filter(Boolean);

  return (tree) => {
    visit(tree, 'element', (node) => {
      // Target only heading elements
      if (!node.tagName.match(/^h[1-6]$/)) {
        return;
      }

      const id = node.properties?.id as string;
      const existingClasses = (node.properties.className || []) as string[];

      // 1. Skip if the ID is in the exclude list.
      if (id && excludeIds.includes(id)) {
        return;
      }

      // --- UPDATED LOGIC ---
      // 2. Determine if the element should be skipped based on its classes.
      if (classesToExclude.length > 0) {
        let shouldExclude = false;
        if (excludeClassMethod === 'and') {
          // 'AND' logic: Exclude only if ALL specified classes are present.
          shouldExclude = classesToExclude.every(cls => existingClasses.includes(cls));
        } else {
          // 'OR' logic: Exclude if ANY specified class is present.
          shouldExclude = existingClasses.some(cls => classesToExclude.includes(cls));
        }
        
        if (shouldExclude) {
          return;
        }
      }
      
      // --- ORIGINAL LOGIC ---
      const newClasses = Array.isArray(value) ? value : value.split(' ').filter(Boolean);

      if (method === 'replace') {
        node.properties.className = newClasses;
      } else { // 'add' method
        // Use a Set to easily combine and deduplicate classes
        const combined = new Set([...existingClasses, ...newClasses]);
        node.properties.className = Array.from(combined);
      }
    });
  };
};

export default rehypeAddHeadingClass;