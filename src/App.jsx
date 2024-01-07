import "./App.css";
import { useQuery, useMutation, useQueryClient } from "react-query";

const POSTS = [
  { id: 1, title: "Post 1" },
  { id: 2, title: "Post 2" },
];

function App() {
  const queryClient = useQueryClient();
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => wait(1000).then(() => [...POSTS]),
  });

  const newPostMutation = useMutation({
    mutationFn: (title) =>
      wait(1000).then(() => POSTS.push({ id: Date.now(), title })),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  if (postsQuery.isLoading) return <h1>Loading...</h1>;
  if (postsQuery.isError) {
    return <pre>{JSON.stringify(postsQuery.error)}</pre>;
  }
  return (
    <>
      <div className="app">
        {postsQuery.data.map((post) => (
          <h1 key={post.id}>{post.title}</h1>
        ))}
      </div>

      <button onClick={() => newPostMutation.mutate("New Post")}>
        Add New Post
      </button>
    </>
  );
}

function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export default App;
