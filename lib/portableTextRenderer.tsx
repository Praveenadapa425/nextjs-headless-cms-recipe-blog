import { PortableText } from '@portabletext/react'

const portableTextComponents = {
  block: {
    normal: ({ children }: any) => <p className="mb-4">{children}</p>,
    h1: ({ children }: any) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    underline: ({ children }: any) => <u>{children}</u>,
    link: ({ value, children }: any) => (
      <a 
        href={value?.href} 
        className="text-blue-600 hover:underline" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
}

export function renderPortableText(content: any) {
  if (!content) return null
  return <PortableText value={content} components={portableTextComponents} />
}