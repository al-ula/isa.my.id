import type { Plugin } from 'unified';
import type { Root } from 'hast';
import { visit } from 'unist-util-visit';

export interface ModifyIdOptions {
  /** How to apply the value to the ID. */
  method?: 'prepend' | 'append' | 'replace';
  /** The value to use. For 'replace', you can use {tagName} and {id} placeholders. */
  value: string;
  /** An array of heading IDs to ignore. */
  excludeIds?: string[];
}

const rehypeModifyHeadingId: Plugin<[ModifyIdOptions], Root> = (options) => {
  if (!options?.value) {
    throw new Error('rehypeModifyHeadingId: `value` option is required.');
  }

  const { method = 'prepend', value, excludeIds = [] } = options;

  return (tree) => {
    visit(tree, 'element', (node) => {
      // Target only heading elements
      if (!node.tagName.match(/^h[1-6]$/)) {
        return;
      }

      const id = node.properties?.id as string;

      // Guard clauses: skip if there's no ID or if it's in the exclude list.
      if (!id || excludeIds.includes(id)) {
        return;
      }
      
      let newId: string;

      switch (method) {
        case 'append':
          newId = `${id}${value}`;
          break;
        
        case 'replace':
          // Replace placeholders with dynamic values from the node
          newId = value
            .replace('{tagName}', node.tagName)
            .replace('{id}', id);
          break;
        
        case 'prepend':
        default:
          newId = `${value}${id}`;
          break;
      }
      
      node.properties.id = newId;
    });
  };
};

export default rehypeModifyHeadingId;