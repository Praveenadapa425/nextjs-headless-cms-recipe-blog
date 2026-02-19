import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';

// Custom options for rendering rich text
const richTextOptions = {
  renderMark: {
    [MARKS.BOLD]: (text: any) => <strong className="font-semibold">{text}</strong>,
    [MARKS.ITALIC]: (text: any) => <em className="italic">{text}</em>,
    [MARKS.UNDERLINE]: (text: any) => <u>{text}</u>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, next: any) => <p className="mb-4">{next(node.content)}</p>,
    [BLOCKS.HEADING_1]: (node: any, next: any) => <h1 className="text-3xl font-bold mb-4">{next(node.content)}</h1>,
    [BLOCKS.HEADING_2]: (node: any, next: any) => <h2 className="text-2xl font-bold mb-3">{next(node.content)}</h2>,
    [BLOCKS.HEADING_3]: (node: any, next: any) => <h3 className="text-xl font-bold mb-2">{next(node.content)}</h3>,
    [BLOCKS.UL_LIST]: (node: any, next: any) => <ul className="list-disc list-inside mb-4 space-y-1">{next(node.content)}</ul>,
    [BLOCKS.OL_LIST]: (node: any, next: any) => <ol className="list-decimal list-inside mb-4 space-y-1">{next(node.content)}</ol>,
    [BLOCKS.LIST_ITEM]: (node: any, next: any) => <li>{next(node.content)}</li>,
    [BLOCKS.QUOTE]: (node: any, next: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
        {next(node.content)}
      </blockquote>
    ),
    [INLINES.HYPERLINK]: (node: any, next: any) => (
      <a href={node.data.uri} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
        {next(node.content)}
      </a>
    ),
  },
};

// Function to render Contentful rich text
export function renderRichText(document: any) {
  if (!document) return null;
  
  return documentToReactComponents(document, richTextOptions);
}

export default renderRichText;