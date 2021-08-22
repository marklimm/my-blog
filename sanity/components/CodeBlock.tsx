import React, { FunctionComponent } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
//  I did not have luck trying to specify different code styles - https://www.npmjs.com/package/react-syntax-highlighter
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
// import { nord } from 'react-syntax-highlighter/src/styles/prism'

interface CodeBlockProps {
  node: {
    code: string
    language: string
  }
}

const CodeBlock: FunctionComponent<CodeBlockProps> = ({
  node,
}: CodeBlockProps) => {
  if (!node || !node.code) {
    return null
  }

  const { language, code } = node

  return (
    <div style={{ width: '1100px' }}>
      <SyntaxHighlighter
        language={language || 'javascript'}
        customStyle={{ backgroundColor: '#e3e8e4' }}
        // style={docco}
        // style={nord}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default CodeBlock
