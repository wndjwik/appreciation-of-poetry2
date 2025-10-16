
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from './styles/theme'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Search from './pages/Search'
import PoemDetail from './pages/PoemDetail'
import AuthorDetail from './pages/AuthorDetail'
import ClassicalPoems from './pages/ClassicalPoems'
import Authors from './pages/Authors'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<Search />} />
              <Route path="/poem/:id" element={<PoemDetail />} />
              <Route path="/author/:id" element={<AuthorDetail />} />
              <Route path="/classical-poems" element={<ClassicalPoems />} />
              <Route path="/authors" element={<Authors />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App