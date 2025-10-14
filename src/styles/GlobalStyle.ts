import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Noto Serif SC', serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f5f0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: color 0.3s ease;
  }

  button {
    font-family: inherit;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  input, textarea {
    font-family: inherit;
    border: none;
    outline: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    html {
      font-size: 12px;
    }
  }
`