import React from "react"
import { Link } from "gatsby"

import { rhythm, scale } from "../utils/typography"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  let header

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          ...scale(1),
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h1>
    )
  } else {
    header = (
      <h3
        style={{
          fontFamily: `Montserrat, sans-serif`,
          marginTop: 0,
          opacity: 0.7
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            color: `#007acc`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h3>
    )
  }
  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <header>{header}</header>
      <main>{children}</main>
      <footer>
          <a href="https://mobile.twitter.com/akhlesh_tiwari" target="_blank" rel="noopener noreferrer">twitter</a>
          •
          <a href="https://github.com/akhlesh" target="_blank" rel="noopener noreferrer">github</a>
          •
          <a href="https://stackoverflow.com/users/1568856/akhlesh" target="_blank" rel="noopener noreferrer">stack overflow</a>
      </footer>
    </div>
  )
}

export default Layout
