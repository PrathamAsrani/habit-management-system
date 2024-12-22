import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Helmet } from 'react-helmet';

const Layout = ({
    children,
    title = `Habit Management System`,
    description = `SDE Intern assignment by Thrivify`,
    keywords = `habit management, habit tracking, habits growth`,
    author = `Pratham Asrani`
}) => {
    return (
        <div>
            <Helmet>
                <meta charSet='utf-8' />
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content={author} />
            </Helmet>
            <Header></Header>
            { children }
            <Footer></Footer>
        </div>
    )
}

export default Layout
