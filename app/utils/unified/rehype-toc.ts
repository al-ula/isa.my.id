import { visit } from 'unist-util-visit';
import type { Root, Element, ElementContent, Text } from 'hast';
import type { Plugin } from 'unified';

interface TocOptions {
  /** The ID of the h2 element where TOC should be inserted */
  id: string;
  /** Class name for the TOC nav element (default: 'toc') */
  className?: string;
  /** Class name for list elements (default: 'toc-list') */
  listClassName?: string;
  /** Class name for list item elements (default: 'toc-item') */
  itemClassName?: string;
  /** Class name for link elements (default: 'toc-link') */
  linkClassName?: string;
}

interface Heading {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  id: string;
  text: string;
  element: Element;
  index: number;
}

interface TocNode {
  heading: Heading;
  children: TocNode[];
}

/**
 * Rehype plugin to generate a table of contents
 */
const rehypeToc: Plugin<[TocOptions?], Root> = (options = {} as TocOptions) => {
  const {
    id,
    className = 'toc',
    listClassName = 'toc-list',
    itemClassName = 'toc-item',
    linkClassName = 'toc-link',
  } = options;

  if (!id) {
    throw new Error('rehypeToc: "id" option is required');
  }

  return (tree: Root) => {
    // Single pass: collect all headings
    const allHeadings: Heading[] = [];
    let tocH2: Element | null = null;
    let tocH2Index = -1;

    visit(tree, 'element', (node: Element) => {
      if (/^h[1-6]$/.test(node.tagName)) {
        const level = parseInt(node.tagName[1]) as 1 | 2 | 3 | 4 | 5 | 6;
        const heading: Heading = {
          level,
          id: node.properties?.id ? String(node.properties.id) : '',
          text: extractText(node),
          element: node,
          index: allHeadings.length,
        };
        
        allHeadings.push(heading);

        // Find the target h2
        if (level === 2 && node.properties?.id === id) {
          tocH2 = node;
          tocH2Index = heading.index;
        }
      }
    });

    // Early exit if target not found or no headings
    if (!tocH2 || tocH2Index === -1 || allHeadings.length === 0) {
      return;
    }

    // Find parent h1 (backwards search from TOC position)
    let parentH1Index = -1;
    for (let i = tocH2Index - 1; i >= 0; i--) {
      if (allHeadings[i].level === 1) {
        parentH1Index = i;
        break;
      }
    }

    if (parentH1Index === -1) {
      return;
    }

    // Find boundary (next h1 after parent)
    let boundaryIndex = allHeadings.length;
    for (let i = parentH1Index + 1; i < allHeadings.length; i++) {
      if (allHeadings[i].level === 1) {
        boundaryIndex = i;
        break;
      }
    }

    // Build TOC tree in a single pass
    const tocTree = buildTocTreeOptimized(allHeadings, parentH1Index, boundaryIndex);

    if (!tocTree) {
      return;
    }

    // Create the TOC HTML structure
    const tocList = createTocHtml([tocTree], listClassName, itemClassName, linkClassName);
    const tocNav: Element = {
      type: 'element',
      tagName: 'nav',
      properties: {
        className: [className],
      },
      children: [tocList],
    };

    // Insert TOC after the target h2 (single pass)
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node === tocH2 && parent && typeof index === 'number') {
        parent.children.splice(index + 1, 0, tocNav);
        return false; // Stop visiting early
      }
    });
  };
};

/**
 * Build TOC tree in a single optimized pass
 */
function buildTocTreeOptimized(
  headings: Heading[],
  startIndex: number,
  endIndex: number
): TocNode | null {
  if (startIndex >= endIndex) {
    return null;
  }

  const root = headings[startIndex];
  const rootNode: TocNode = {
    heading: root,
    children: [],
  };

  // Stack-based tree building (avoids repeated scans)
  const stack: TocNode[] = [rootNode];
  
  for (let i = startIndex + 1; i < endIndex; i++) {
    const heading = headings[i];
    
    // Skip headings without IDs
    if (!heading.id) {
      continue;
    }

    const node: TocNode = {
      heading,
      children: [],
    };

    // Pop stack until we find the appropriate parent
    // Parent must have level = current level - 1
    while (stack.length > 0) {
      const top = stack[stack.length - 1];
      
      // If top level is less than current, it could be a parent
      if (top.heading.level < heading.level) {
        // Check if it's the immediate parent (level = current - 1)
        if (top.heading.level === heading.level - 1) {
          top.children.push(node);
          stack.push(node);
          break;
        } else {
          // Skip this heading - it's too deeply nested without proper parent
          break;
        }
      } else {
        // Pop if same level or higher
        stack.pop();
      }
    }

    // If stack is empty, we've gone back to root level
    if (stack.length === 0) {
      break;
    }
  }

  return rootNode;
}

/**
 * Create HTML from TOC tree
 */
function createTocHtml(
  tree: TocNode[],
  listClassName: string,
  itemClassName: string,
  linkClassName: string
): Element {
  const list: Element = {
    type: 'element',
    tagName: 'ul',
    properties: {
      className: [listClassName],
    },
    children: [],
  };

  for (const node of tree) {
    const { heading, children } = node;
    
    const link: Element = {
      type: 'element',
      tagName: 'a',
      properties: {
        href: `#${heading.id}`,
        className: [linkClassName, `${linkClassName}-level-${heading.level}`],
      },
      children: [
        {
          type: 'text',
          value: heading.text,
        },
      ],
    };

    const listItem: Element = {
      type: 'element',
      tagName: 'li',
      properties: {
        className: [itemClassName, `${itemClassName}-level-${heading.level}`],
      },
      children: [link],
    };

    // Add nested children if they exist
    if (children.length > 0) {
      const nestedList = createTocHtml(children, listClassName, itemClassName, linkClassName);
      nestedList.properties!.className = [
        listClassName,
        `${listClassName}-level-${heading.level + 1}`,
      ];
      listItem.children.push(nestedList);
    }

    list.children.push(listItem);
  }

  return list;
}

/**
 * Extract text content from a node, excluding anchor elements
 */
function extractText(node: Element | Text | ElementContent): string {
  if (node.type === 'text') {
    return node.value;
  }
  if ('children' in node && node.children) {
    // Skip anchor elements, only get direct text or text from non-anchor children
    if (node.type === 'element' && node.tagName === 'a') {
      return '';
    }
    return node.children.map(extractText).join('');
  }
  return '';
}

export default rehypeToc;