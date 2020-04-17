import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { request } from "graphql-request";

const url = `http://localhost:4000/`;

const ArticlesQuery = `
      query ($published: Boolean){ 
        articles(search: {published: $published}) { 
          id
          title 
          isPublished
        } 
      }
    `;

const UsersQuery = `
  query($limit: Int) {
    users(limit: $limit) {
      id
      name
    }
  }
`;

const PublishArticleMutation = `
  mutation PublishArticle($articleId: ID!) {
    publishArticle(id: $articleId) {
      id
    }
  }
`;

function App() {
    const [articles, setArticles] = useState([]);
    const [users, setUsers] = useState([]);
    const [limit, setLimit] = useState(3);

    const fetchArticles = async () => {
        const { articles } = await request(url, ArticlesQuery);
        setArticles(articles);

        // articles.forEach((art) => {
        //     console.log('article.isPublished', art.isPublished)
        // })
    };

    const fetchUsers = async () => {
        const { users } = await request(url, UsersQuery, { limit });
        setUsers(users);
    };

    const publishArticle = async articleId => {
        await request(url, PublishArticleMutation, { articleId });
        fetchArticles();
    };

    useEffect(() => {
        fetchArticles();
        fetchUsers();
    }, []);




    return (
        <div className="App">
            <h1>Large</h1>
            <h3>The best alternative to Medium</h3>

            <br />
            <div>
                <input
                    onChange={e => setLimit(parseInt(e.target.value))}
                    value={limit}
                    placeholder="limit"
                    type="number"
                />
                <button onClick={fetchUsers}> fetch users </button>
            </div>

            <h3> Users </h3>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>

            <div className="flex-h">
                <h3> Articles </h3>
                <button onClick={fetchArticles}> fetch articles </button>
            </div>

            {articles.map(article => (
                <div className="article" key={article.id}>
                    <div style={{ opacity: article.isPublished ? 1 : 0.3 }}>
                        {article.title}
                    </div>
                    {!article.isPublished && (
                        <button onClick={() => publishArticle(article.id)}>publish</button>
                    )}
                </div>
            ))}
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
